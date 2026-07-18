import { APICallError } from 'ai';
import { z } from 'zod';
import { authenticateSupabaseRequest, consumeAiQuota } from '../_lib/auth.js';
import {
  aiUnavailableMessage,
  getTextModel,
  isAiGenerationEnabled,
} from '../_lib/ai-provider.js';
import { generateStructuredObject } from '../_lib/ai-structured.js';

const requestSchema = z.object({
  question: z.string().trim().min(5).max(500),
  hairType: z.string().trim().max(80).optional(),
  desiredStyle: z.string().trim().max(120).optional(),
});

const responseSchema = z.object({
  answer: z.string().trim().min(1).max(1400),
  suggestedServices: z.array(z.string().trim().max(80)).max(4).default([]),
  cautions: z.array(z.string().trim().max(160)).max(4).default([]),
});

export async function POST(request: Request) {
  const user = await authenticateSupabaseRequest(request);
  if (!user) return Response.json({ code: 'UNAUTHORIZED' }, { status: 401 });

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ code: 'INVALID_INPUT' }, { status: 400 });
  }

  const textModel = getTextModel();
  if (!isAiGenerationEnabled() || !textModel) {
    return Response.json({
      code: 'AI_NOT_CONFIGURED',
      message: aiUnavailableMessage(),
    }, { status: 503 });
  }
  if (!await consumeAiQuota(user, 'advice')) {
    return Response.json({ code: 'AI_RATE_LIMITED' }, { status: 429 });
  }

  try {
    const { object, usage } = await generateStructuredObject({
      model: textModel,
      schema: responseSchema,
      schemaName: 'hallaqi_grooming_advice',
      schemaDescription: '{"answer":"string","suggestedServices":["string"],"cautions":["string"]}',
      instructions: [
        'You are Hallaqi, a concise Algerian barbering and grooming advisor.',
        'Answer in Arabic (Algerian dialect welcome when natural). Give practical, conservative advice.',
        'Do not diagnose medical conditions. Recommend a clinician for scalp disease, injury, or unexplained hair loss.',
        'Never claim certainty about a style without an in-person consultation.',
        'suggestedServices: up to 4 short salon service names in Arabic.',
        'cautions: up to 4 short safety notes in Arabic.',
      ].join(' '),
      prompt: JSON.stringify(parsed.data),
      maxOutputTokens: 600,
      plainTextFallback: text => ({
        answer: text.slice(0, 1200),
        suggestedServices: [],
        cautions: ['هذه نصيحة عامة — راجع حلاقاً أو مختصاً عند الحاجة.'],
      }),
    });

    return Response.json({ advice: object, usage });
  } catch (error) {
    console.error('AI advice generation failed', {
      userId: user.id,
      statusCode: APICallError.isInstance(error) ? error.statusCode : undefined,
      message: error instanceof Error ? error.message : String(error),
    });
    if (APICallError.isInstance(error) && error.statusCode === 429) {
      return Response.json({ code: 'AI_RATE_LIMITED' }, { status: 429 });
    }
    return Response.json({ code: 'AI_UNAVAILABLE' }, { status: 503 });
  }
}
