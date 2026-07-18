import type { Barber, Booking, ServiceCategory } from '@/types';

export interface RecommendationContext {
  city?: string;
  category?: ServiceCategory | null;
  maxPrice?: number;
  preferMobile?: boolean;
  bookings?: Booking[];
}

export interface BarberRecommendation {
  barber: Barber;
  score: number;
  reasons: string[];
}

function minPrice(barber: Barber): number | null {
  const prices = barber.services.map(service => service.price).filter(price => price > 0);
  return prices.length ? Math.min(...prices) : null;
}

export function rankBarberRecommendations(
  barbers: Barber[],
  context: RecommendationContext = {}
): BarberRecommendation[] {
  const previousBarberIds = new Set((context.bookings || []).map(booking => booking.barberId));

  return barbers
    .filter(barber => barber.isActive && barber.services.length > 0)
    .map(barber => {
      let score = Math.max(0, Math.min(40, (barber.rating / 5) * 40));
      const reasons: string[] = [];

      if (barber.rating >= 4.5) reasons.push('تقييم مرتفع');

      if (context.category && barber.services.some(service => service.category === context.category)) {
        score += 20;
        reasons.push('يوفر خدمتك المطلوبة');
      }

      if (context.city && barber.wilaya === context.city) {
        score += 12;
        reasons.push('في منطقتك');
      }

      const price = minPrice(barber);
      if (context.maxPrice && price !== null && price <= context.maxPrice) {
        score += 10;
        reasons.push('ضمن ميزانيتك');
      }

      if (context.preferMobile && barber.isMobile) {
        score += 8;
        reasons.push('خدمة متنقلة');
      }

      if (barber.isVerified) {
        score += 5;
        reasons.push('حساب موثق');
      }

      // Monetization visibility: subscribed / premium barbers rank higher (not unlimited quantity).
      if (barber.isSubscribed) {
        const planBoost =
          barber.subscriptionPlan === 'premium' || barber.subscriptionPlan === 'business' ? 12
            : barber.subscriptionPlan === 'pro' || barber.subscriptionPlan === 'professional' ? 8
              : barber.subscriptionPlan === 'basic' ? 4
                : 2;
        score += planBoost;
        reasons.push('ظهور اشتراك مميز');
      }

      if (barber.tags.includes('premium') || barber.tags.includes('trending')) {
        score += 3;
      }

      if (barber.isFollowing) {
        score += 3;
        reasons.push('من المفضلة');
      }

      if (previousBarberIds.has(barber.id)) {
        score += 2;
        reasons.push('حجزت معه سابقاً');
      }

      return {
        barber,
        score: Math.round(Math.min(100, score)),
        reasons: reasons.slice(0, 3),
      };
    })
    .sort((a, b) => b.score - a.score
      || b.barber.rating - a.barber.rating
      || a.barber.id.localeCompare(b.barber.id));
}
