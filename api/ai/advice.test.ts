import { afterEach, vi } from 'vitest';
import { POST } from './advice';

describe('AI advice endpoint', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.AI_GENERATION_ENABLED;
    delete process.env.VITE_SUPABASE_URL;
    delete process.env.VITE_SUPABASE_ANON_KEY;
  });

  it('returns a typed external blocker after authenticating the user', async () => {
    process.env.AI_GENERATION_ENABLED = 'false';
    process.env.VITE_SUPABASE_URL = 'https://example.supabase.co';
    process.env.VITE_SUPABASE_ANON_KEY = 'public-key';
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(
      Response.json({ id: 'user-1', email: 'user@example.com' })
    ));

    const response = await POST(new Request('https://hallaqi.app/api/ai/advice', {
      method: 'POST',
      headers: { authorization: 'Bearer valid-token', 'content-type': 'application/json' },
      body: JSON.stringify({ question: 'ما الخدمة المناسبة لشعر مجعد؟' }),
    }));

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual(expect.objectContaining({
      code: 'AI_NOT_CONFIGURED',
    }));
  });
});
