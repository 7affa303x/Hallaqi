/**
 * Safe external URL helpers for marketplace Visit Store links.
 * Only https URLs on non-localhost hosts are allowed.
 */

export function sanitizeExternalHttpsUrl(raw?: string | null): string | null {
  if (!raw?.trim()) return null;
  let parsed: URL;
  try {
    parsed = new URL(raw.trim());
  } catch {
    return null;
  }
  if (parsed.protocol !== 'https:') return null;
  const host = parsed.hostname.toLowerCase();
  if (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local')) return null;
  // Block javascript: etc already covered by protocol check
  return parsed.toString();
}

export function canOpenExternalStore(url?: string | null): boolean {
  return Boolean(sanitizeExternalHttpsUrl(url));
}
