/** Rough per-session data-usage estimate (#174) — client-only heuristic. */

const KEY = 'hallaqi-session-bytes-v1';
const SESSION_ID_KEY = 'hallaqi-session-id-v1';

function sessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_ID_KEY);
    if (!id) {
      id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem(SESSION_ID_KEY, id);
    }
    return id;
  } catch {
    return 'anon';
  }
}

type Bucket = { id: string; bytes: number; startedAt: string };

function read(): Bucket {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Bucket;
  } catch { /* ignore */ }
  return { id: sessionId(), bytes: 0, startedAt: new Date().toISOString() };
}

function write(b: Bucket) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(b));
  } catch { /* ignore */ }
}

/** Add an estimated transfer (images, maps, AI payloads). */
export function addSessionBytes(approx: number) {
  if (!Number.isFinite(approx) || approx <= 0) return;
  const b = read();
  b.bytes += Math.round(approx);
  write(b);
}

export function getSessionBytes(): number {
  return read().bytes;
}

export function formatSessionData(bytes: number, lang: 'ar' | 'fr' | 'en' = 'ar'): string {
  const mb = bytes / (1024 * 1024);
  if (mb < 0.1) {
    const kb = Math.max(1, Math.round(bytes / 1024));
    return lang === 'en' ? `~${kb} KB this session` : lang === 'fr' ? `~${kb} Ko cette session` : `~${kb} كيلوبايت هذه الجلسة`;
  }
  const v = mb.toFixed(1);
  return lang === 'en' ? `~${v} MB this session` : lang === 'fr' ? `~${v} Mo cette session` : `~${v} ميغابايت هذه الجلسة`;
}
