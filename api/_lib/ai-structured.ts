import { APICallError, generateText, Output } from 'ai';
import type { LanguageModel } from 'ai';
import type { ZodType } from 'zod';
import { getActiveTextProviderName } from './ai-provider.js';

/** Light repair before JSON.parse — trailing commas, smart quotes. */
export function repairJsonText(text: string): string {
  return text
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/,\s*([\]}])/g, '$1');
}

/** Extract the first JSON object from a model response. */
export function extractJsonObject(text: string): unknown | null {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced?.[1]?.trim() || trimmed).trim();
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start < 0 || end <= start) return null;

  const slice = candidate.slice(start, end + 1);
  for (const attempt of [slice, repairJsonText(slice)]) {
    try {
      return JSON.parse(attempt);
    } catch {
      // continue
    }
  }
  return null;
}

/**
 * When the model wraps a valid object but Zod rejected a field (length/count),
 * or JSON.parse failed, pull a usable string answer without dumping raw JSON.
 */
export function extractAnswerFromMessyText(text: string): string | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const fromParsed = extractJsonObject(trimmed);
  if (fromParsed && typeof fromParsed === 'object' && fromParsed !== null && 'answer' in fromParsed) {
    const answer = (fromParsed as { answer: unknown }).answer;
    if (typeof answer === 'string' && answer.trim()) return answer.trim();
  }

  // Regex fallback when JSON is slightly invalid but answer field is present
  const match = trimmed.match(/"answer"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  if (match?.[1]) {
    try {
      return JSON.parse(`"${match[1]}"`) as string;
    } catch {
      return match[1].replace(/\\"/g, '"').replace(/\\n/g, '\n');
    }
  }

  if (trimmed.startsWith('{') || trimmed.startsWith('```')) return null;
  return trimmed;
}

function asStringArray(value: unknown, maxItems: number, maxLen: number): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map(item => {
      if (typeof item === 'string') return item.trim();
      if (item && typeof item === 'object' && 'name' in item && typeof (item as { name: unknown }).name === 'string') {
        return (item as { name: string }).name.trim();
      }
      return String(item ?? '').trim();
    })
    .filter(Boolean)
    .map(item => item.slice(0, maxLen))
    .slice(0, maxItems);
}

/**
 * Coerce a loosely-shaped model object into something the schema can accept.
 * Truncates overlong strings/arrays instead of failing the whole response.
 */
export function coerceStructuredCandidate(raw: unknown): unknown {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return raw;
  const obj = raw as Record<string, unknown>;
  const next: Record<string, unknown> = { ...obj };

  if (typeof next.answer === 'string') {
    next.answer = next.answer.trim().slice(0, 1400);
  } else if (next.answer != null) {
    next.answer = String(next.answer).trim().slice(0, 1400);
  }

  if ('suggestedServices' in next) {
    next.suggestedServices = asStringArray(next.suggestedServices, 4, 80);
  }
  if ('cautions' in next) {
    next.cautions = asStringArray(next.cautions, 4, 160);
  }
  if ('suggestedActions' in next) {
    next.suggestedActions = asStringArray(next.suggestedActions, 4, 100);
  }
  if (typeof next.messageDraft === 'string') {
    next.messageDraft = next.messageDraft.trim().slice(0, 500) || undefined;
  }

  return next;
}

/**
 * Structured generation that works on Groq free models (no json_schema)
 * and still uses native structured output when the provider supports it (Gemini).
 */
export async function generateStructuredObject<T>(options: {
  model: LanguageModel;
  schema: ZodType<T>;
  schemaName: string;
  schemaDescription: string;
  instructions: string;
  prompt: string;
  maxOutputTokens?: number;
  /** Fallback when JSON parse fails — wrap plain text into a valid object. */
  plainTextFallback?: (text: string) => T;
}): Promise<{ object: T; usage?: unknown }> {
  const provider = getActiveTextProviderName();
  const maxOutputTokens = options.maxOutputTokens ?? 600;

  // Native structured outputs — Gemini / models that support json_schema
  if (provider === 'gemini') {
    try {
      const { output, usage } = await generateText({
        model: options.model,
        instructions: options.instructions,
        prompt: options.prompt,
        output: Output.object({
          name: options.schemaName,
          description: options.schemaDescription,
          schema: options.schema,
        }),
        maxOutputTokens,
      });
      return { object: output as T, usage };
    } catch (error) {
      // Fall through to JSON-prompt path if structured mode fails
      if (!(APICallError.isInstance(error) && error.statusCode === 400)) {
        throw error;
      }
    }
  }

  const { text, usage } = await generateText({
    model: options.model,
    instructions: [
      options.instructions,
      'Respond with ONLY one valid JSON object. No markdown fences, no commentary before or after.',
      `JSON shape description: ${options.schemaDescription}`,
      'Keep arrays to at most 4 short items. Keep answer under 800 characters.',
    ].join(' '),
    prompt: options.prompt,
    maxOutputTokens,
  });

  const raw = extractJsonObject(text);
  const coerced = coerceStructuredCandidate(raw);
  const parsed = options.schema.safeParse(coerced);
  if (parsed.success) {
    return { object: parsed.data, usage };
  }

  // Second chance: pull answer from messy JSON / invalid JSON text
  if (options.plainTextFallback) {
    const recovered = extractAnswerFromMessyText(text);
    if (recovered) {
      return { object: options.plainTextFallback(recovered), usage };
    }
    if (text.trim() && !text.trim().startsWith('{') && !text.trim().startsWith('```')) {
      return { object: options.plainTextFallback(text.trim()), usage };
    }
  }

  throw new Error('AI_JSON_PARSE_FAILED');
}
