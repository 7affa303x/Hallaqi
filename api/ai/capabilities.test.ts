import { GET } from './capabilities';

describe('AI capabilities endpoint', () => {
  it('keeps deterministic intelligence available when generation is disabled', async () => {
    process.env.AI_GENERATION_ENABLED = 'false';
    const response = GET();
    const body = await response.json();
    expect(body).toEqual(expect.objectContaining({
      deterministicRecommendations: true,
      optimizedScheduling: true,
      generativeAdvice: false,
      hairstyleImageGeneration: false,
    }));
  });
});
