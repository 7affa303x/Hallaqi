import { APICallError, generateText, Output } from 'ai';
import type { LanguageModel } from 'ai';
import type { ZodType } from 'zod';
import { getActiveTextProviderName } from './ai-provider.js';

/** Extract the first JSON object from a model response. */
export function extractJsonObject(text: string): unknown | null {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1]?.trim() || trimmed;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(candidate.slice(start, end + 1));
  } catch {
    return null;
  }
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
    ].join(' '),
    prompt: options.prompt,
    maxOutputTokens,
  });

  const raw = extractJsonObject(text);
  const parsed = options.schema.safeParse(raw);
  if (parsed.success) {
    return { object: parsed.data, usage };
  }

  if (options.plainTextFallback && text.trim()) {
    return { object: options.plainTextFallback(text.trim()), usage };
  }

  throw new Error('AI_JSON_PARSE_FAILED');
}
