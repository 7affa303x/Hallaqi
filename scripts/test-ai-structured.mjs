import { z } from 'zod';
import { getTextModel } from '../api/_lib/ai-provider';
import { generateStructuredObject } from '../api/_lib/ai-structured';

async function main() {
  if (!process.env.GROQ_API_KEY && !process.env.GEMINI_API_KEY) {
    throw new Error('Set GROQ_API_KEY (or GEMINI_API_KEY) before running this smoke test');
  }
  process.env.AI_GENERATION_ENABLED = 'true';
  const schema = z.object({
    answer: z.string().min(1).max(1200),
    suggestedServices: z.array(z.string().max(80)).max(4),
    cautions: z.array(z.string().max(160)).max(4),
  });
  const model = getTextModel();
  if (!model) throw new Error('no model');
  const { object } = await generateStructuredObject({
    model,
    schema,
    schemaName: 'advice',
    schemaDescription: '{"answer":"string","suggestedServices":["string"],"cautions":["string"]}',
    instructions: 'You are Hallaqi. Arabic advice. JSON only.',
    prompt: JSON.stringify({ question: 'ما الخدمة المناسبة لشعر جاف ومجعد؟' }),
    plainTextFallback: text => ({ answer: text, suggestedServices: [], cautions: [] }),
  });
  console.log(JSON.stringify(object, null, 2));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
