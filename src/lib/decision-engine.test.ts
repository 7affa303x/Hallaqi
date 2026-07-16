import type { Barber } from '@/types';
import { rankBarberRecommendations } from './recommendations';
import { preferredBookingHour, rankAvailableSlots } from './scheduling';

const barber = (overrides: Partial<Barber>): Barber => ({
  id: 'barber',
  name: 'Barber',
  avatar: '',
  coverImage: '',
  rating: 4,
  reviewCount: 10,
  location: '',
  wilaya: 'الجزائر',
  distance: 'N/A',
  isActive: true,
  isVerified: false,
  tags: [],
  services: [{ id: 'service', name: 'Haircut', price: 600, duration: 30, category: 'haircut' }],
  priceRange: '600 DZD',
  workingHours: {},
  isMobile: false,
  usesScissors: false,
  yearsOfExperience: 2,
  bio: '',
  portfolio: [],
  hasIdCard: false,
  idCardVerified: false,
  isSubscribed: false,
  followers: 0,
  following: 0,
  likes: 0,
  ...overrides,
});

describe('decision engine', () => {
  it('ranks category, location, budget, and trust deterministically', () => {
    const ranked = rankBarberRecommendations([
      barber({ id: 'generic', rating: 4.8, wilaya: 'وهران' }),
      barber({ id: 'match', rating: 4.6, isVerified: true }),
    ], {
      city: 'الجزائر',
      category: 'haircut',
      maxPrice: 700,
    });

    expect(ranked[0]?.barber.id).toBe('match');
    expect(ranked[0]?.reasons).toContain('في منطقتك');
    expect(ranked[0]?.score).toBeGreaterThan(ranked[1]?.score || 0);
  });

  it('ranks slots near the user preferred hour first', () => {
    const ranked = rankAvailableSlots(
      ['09:00', '14:00', '18:00'],
      '2030-01-01',
      [],
      14
    );
    expect(ranked[0]?.time).toBe('14:00');
    expect(ranked[0]?.reasons).toContain('يشبه مواعيدك السابقة');
  });

  it('derives preferred booking hour from history', () => {
    expect(preferredBookingHour(['13:30', '14:00', '15:00'])).toBe(14);
    expect(preferredBookingHour([])).toBeUndefined();
  });
});
