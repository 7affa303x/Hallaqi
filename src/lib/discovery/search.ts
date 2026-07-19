/** Discovery search helpers — normalize query, score matches, popular chips. */

import type { Barber } from '@/types';
import { wilayaLabelsMatch } from '@/lib/locale/algeriaWilayas';

export function normalizeSearchText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u065F]/g, '')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/أ|إ|آ/g, 'ا')
    .replace(/\s+/g, ' ');
}

/** Soft score: higher = better match for ranking within filtered results. */
export function scoreBarberSearch(barber: Barber, rawQuery: string): number {
  const q = normalizeSearchText(rawQuery);
  if (!q) return 0;
  let score = 0;
  const name = normalizeSearchText(barber.name);
  const loc = normalizeSearchText(`${barber.location} ${barber.wilaya}`);
  if (name === q) score += 100;
  else if (name.startsWith(q)) score += 70;
  else if (name.includes(q)) score += 40;
  if (loc.includes(q)) score += 25;
  for (const service of barber.services) {
    const sn = normalizeSearchText(service.name);
    if (sn === q) score += 50;
    else if (sn.includes(q)) score += 20;
  }
  for (const tag of barber.tags) {
    if (normalizeSearchText(tag).includes(q)) score += 10;
  }
  return score;
}

export function barberMatchesQuery(barber: Barber, rawQuery: string): boolean {
  if (!rawQuery.trim()) return true;
  return scoreBarberSearch(barber, rawQuery) > 0;
}

export function barberMatchesWilaya(barber: Barber, wilaya: string): boolean {
  if (!wilaya) return true;
  return wilayaLabelsMatch(barber.wilaya, wilaya) || wilayaLabelsMatch(barber.location, wilaya);
}

export function buildSearchSuggestions(barbers: Barber[], query: string, limit = 6): string[] {
  const q = normalizeSearchText(query);
  if (q.length < 1) return [];
  const bag = new Set<string>();
  for (const b of barbers) {
    if (normalizeSearchText(b.name).includes(q)) bag.add(b.name);
    if (normalizeSearchText(b.wilaya).includes(q)) bag.add(b.wilaya);
    for (const s of b.services) {
      if (normalizeSearchText(s.name).includes(q)) bag.add(s.name);
    }
    if (bag.size >= limit * 3) break;
  }
  return [...bag].slice(0, limit);
}

export const QUICK_FILTER_CHIPS = [
  { id: 'openNow', labelAr: 'مفتوح الآن', labelFr: 'Ouvert maintenant', labelEn: 'Open now' },
  { id: 'nearby', labelAr: 'بالقرب مني', labelFr: 'Près de moi', labelEn: 'Near me' },
  { id: 'mobile', labelAr: 'متنقل', labelFr: 'Mobile', labelEn: 'Mobile' },
  { id: 'verified', labelAr: 'موثّق', labelFr: 'Vérifié', labelEn: 'Verified' },
  { id: 'topRated', labelAr: 'تقييم عالٍ', labelFr: 'Bien noté', labelEn: 'Top rated' },
  { id: 'budget', labelAr: 'أقل من 800 دج', labelFr: '< 800 DA', labelEn: 'Under 800 DZD' },
  { id: 'quick', labelAr: 'أقل من 30 د', labelFr: '< 30 min', labelEn: 'Under 30 min' },
] as const;

export type QuickFilterId = (typeof QUICK_FILTER_CHIPS)[number]['id'];
