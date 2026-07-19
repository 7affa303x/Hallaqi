/** Device price-watch for marketplace products (#117). */

const KEY = 'hallaqi-price-watch-v1';

export type PriceWatchEntry = {
  productId: string;
  title: string;
  lastSeenDzd: number;
  watchedAt: string;
};

function read(): PriceWatchEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) as PriceWatchEntry[] : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(entries: PriceWatchEntry[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries.slice(0, 40)));
  } catch { /* ignore */ }
}

export function getPriceWatches(): PriceWatchEntry[] {
  return read();
}

export function isPriceWatched(productId: string): boolean {
  return read().some(e => e.productId === productId);
}

export function togglePriceWatch(input: {
  productId: string;
  title: string;
  priceDzd: number;
}): boolean {
  const list = read();
  const idx = list.findIndex(e => e.productId === input.productId);
  if (idx >= 0) {
    list.splice(idx, 1);
    write(list);
    return false;
  }
  list.unshift({
    productId: input.productId,
    title: input.title,
    lastSeenDzd: input.priceDzd,
    watchedAt: new Date().toISOString(),
  });
  write(list);
  return true;
}

/** Returns watches where current price differs from lastSeen. */
export function detectPriceChanges(
  current: Array<{ id: string; priceDzd: number }>
): Array<PriceWatchEntry & { currentDzd: number; delta: number }> {
  const map = new Map(current.map(p => [p.id, p.priceDzd]));
  const out: Array<PriceWatchEntry & { currentDzd: number; delta: number }> = [];
  const next = read().map(w => {
    const cur = map.get(w.productId);
    if (cur == null) return w;
    if (cur !== w.lastSeenDzd) {
      out.push({ ...w, currentDzd: cur, delta: cur - w.lastSeenDzd });
    }
    return { ...w, lastSeenDzd: cur };
  });
  write(next);
  return out;
}
