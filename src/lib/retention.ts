/** Local weekly retention heuristic from device booking history (#197). */

import type { Booking } from '@/types';

function weekKey(d: Date): string {
  const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((tmp.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${tmp.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

export function weeklyRetentionSummary(bookings: Booking[]): {
  thisWeek: number;
  lastWeek: number;
  retainedHint: boolean;
  labelAr: string;
} {
  const now = new Date();
  const last = new Date(now);
  last.setDate(last.getDate() - 7);
  const thisKey = weekKey(now);
  const lastKey = weekKey(last);

  let thisWeek = 0;
  let lastWeek = 0;
  for (const b of bookings) {
    const d = new Date(b.date);
    if (Number.isNaN(d.getTime())) continue;
    const k = weekKey(d);
    if (k === thisKey) thisWeek += 1;
    if (k === lastKey) lastWeek += 1;
  }

  const retainedHint = lastWeek > 0 && thisWeek > 0;
  return {
    thisWeek,
    lastWeek,
    retainedHint,
    labelAr: retainedHint
      ? `نشاط مستمر: ${thisWeek} حجز هذا الأسبوع بعد ${lastWeek} الأسبوع الماضي`
      : `هذا الأسبوع ${thisWeek} · الأسبوع الماضي ${lastWeek}`,
  };
}
