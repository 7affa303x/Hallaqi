/**
 * Lightweight health probe for uptime monitors.
 * Does not touch Supabase secrets — process/liveness only.
 */
export async function GET() {
  return Response.json(
    {
      ok: true,
      service: 'hallaqi',
      version: '12.1.0',
      ts: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  );
}
