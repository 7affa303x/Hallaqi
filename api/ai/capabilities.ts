import {
  getActiveTextProviderName,
  hasImageGeneration,
  isAiGenerationEnabled,
} from '../_lib/ai-provider.js';

export function GET() {
  const generationEnabled = isAiGenerationEnabled();
  const provider = getActiveTextProviderName();
  const hasTextProvider = Boolean(provider);

  return Response.json({
    deterministicRecommendations: true,
    optimizedScheduling: true,
    generativeAdvice: generationEnabled && hasTextProvider,
    hairstyleImageGeneration: hasImageGeneration(),
    barberAssist: generationEnabled && hasTextProvider,
    provider,
    externalBlocker: generationEnabled && hasTextProvider
      ? null
      : 'Set GROQ_API_KEY (free) or GEMINI_API_KEY on the server to enable generative AI.',
  }, {
    headers: { 'Cache-Control': 'public, max-age=60' },
  });
}
