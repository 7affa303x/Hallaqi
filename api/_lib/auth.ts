interface AuthenticatedUser {
  id: string;
  email?: string;
}

export async function authenticateSupabaseRequest(
  request: Request
): Promise<AuthenticatedUser | null> {
  const authorization = request.headers.get('authorization');
  const token = authorization?.replace(/^Bearer\s+/i, '');
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const apiKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (!token || !supabaseUrl || !apiKey) return null;

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      authorization: `Bearer ${token}`,
      apikey: apiKey,
    },
  });
  if (!response.ok) return null;
  const user = await response.json() as { id?: unknown; email?: unknown };
  return typeof user.id === 'string'
    ? { id: user.id, email: typeof user.email === 'string' ? user.email : undefined }
    : null;
}
