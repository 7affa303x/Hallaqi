/** Curate testimonials from loaded barber reviews (#194). */

import type { Barber } from '@/types';

export type Testimonial = {
  id: string;
  authorName: string;
  comment: string;
  rating: number;
  barberName: string;
  barberId: string;
  date?: string;
};

export function collectTestimonials(barbers: Barber[], limit = 8): Testimonial[] {
  const rows: Testimonial[] = [];
  for (const b of barbers) {
    for (const r of b.reviews || []) {
      if (!r.comment || r.comment.trim().length < 12) continue;
      if ((r.rating || 0) < 4) continue;
      rows.push({
        id: `${b.id}-${r.id}`,
        authorName: r.authorName || 'عميل',
        comment: r.comment.trim(),
        rating: r.rating,
        barberName: b.name,
        barberId: b.id,
        date: r.date,
      });
    }
  }
  return rows
    .sort((a, b) => b.rating - a.rating || (b.comment.length - a.comment.length))
    .slice(0, limit);
}
