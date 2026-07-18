import type { Barber, Booking, ServiceCategory } from '@/types';
import { rankBarberRecommendations } from '@/lib/recommendations';

export interface ClientBarberHint {
  id: string;
  name: string;
  city?: string;
  rating?: number;
  services?: string[];
  reasons?: string[];
}

export interface ClientSiteContext {
  wilaya?: string;
  preferredCategory?: string;
  topBarbers?: ClientBarberHint[];
  recentBarberNames?: string[];
}

/** Build compact site context from loaded app state for the AI advisor API. */
export function buildClientSiteContext(input: {
  barbers: Barber[];
  bookings?: Booking[];
  userWilaya?: string;
  discoveryWilaya?: string;
  preferredCategory?: ServiceCategory | null;
  limit?: number;
}): ClientSiteContext {
  const wilaya = input.discoveryWilaya?.trim()
    || input.userWilaya?.trim()
    || undefined;

  const recommendations = rankBarberRecommendations(input.barbers, {
    city: wilaya,
    category: input.preferredCategory,
    bookings: input.bookings,
  }).slice(0, input.limit ?? 5);

  const recentBarberNames = [...new Set(
    (input.bookings || [])
      .map(b => input.barbers.find(barber => barber.id === b.barberId)?.name)
      .filter((name): name is string => Boolean(name)),
  )].slice(0, 4);

  return {
    wilaya,
    preferredCategory: input.preferredCategory || undefined,
    topBarbers: recommendations.map(rec => ({
      id: rec.barber.id,
      name: rec.barber.name,
      city: rec.barber.wilaya,
      rating: rec.barber.rating,
      services: rec.barber.services.slice(0, 4).map(s => s.name),
      reasons: rec.reasons,
    })),
    recentBarberNames,
  };
}

/** True when there is meaningful context beyond an empty object. */
export function hasClientSiteContext(ctx?: ClientSiteContext): boolean {
  if (!ctx) return false;
  return Boolean(
    ctx.wilaya
    || ctx.preferredCategory
    || (ctx.topBarbers && ctx.topBarbers.length > 0)
    || (ctx.recentBarberNames && ctx.recentBarberNames.length > 0),
  );
}
