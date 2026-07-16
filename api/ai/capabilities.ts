export function GET() {
  const generationEnabled = process.env.AI_GENERATION_ENABLED === 'true';
  return Response.json({
    deterministicRecommendations: true,
    optimizedScheduling: true,
    generativeAdvice: generationEnabled,
    hairstyleImageGeneration: generationEnabled
      && Boolean(process.env.AI_IMAGE_MODEL),
    externalBlocker: generationEnabled
      ? null
      : 'AI Gateway must be enabled with budgets and model access.',
  }, {
    headers: { 'Cache-Control': 'public, max-age=60' },
  });
}
