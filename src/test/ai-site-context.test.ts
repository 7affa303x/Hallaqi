import { describe, expect, it } from 'vitest';
import { buildClientSiteContext } from '@/lib/ai/siteContext';
import type { Barber } from '@/types';

const sampleBarber = (id: string, name: string, wilaya: string, rating: number): Barber => ({
  id,
  name,
  wilaya,
  avatar: '',
  coverImage: '',
  rating,
  reviewCount: 10,
  location: wilaya,
  distance: '1 كم',
  isActive: true,
  isVerified: true,
  tags: ['verified'],
  services: [{ id: 's1', name: 'قص شعر', price: 300, duration: 30, category: 'haircut' }],
  priceRange: 'متوسط',
  workingHours: {},
  isMobile: false,
  usesScissors: true,
  yearsOfExperience: 5,
  bio: '',
  portfolio: [],
  hasIdCard: true,
  idCardVerified: true,
  isSubscribed: false,
  followers: 0,
  following: 0,
  likes: 0,
});

describe('buildClientSiteContext', () => {
  it('ranks barbers for wilaya and includes reasons', () => {
    const ctx = buildClientSiteContext({
      barbers: [
        sampleBarber('1', 'عمر', 'الجزائر العاصمة', 4.9),
        sampleBarber('2', 'كريم', 'وهران', 4.5),
      ],
      discoveryWilaya: 'الجزائر العاصمة',
    });
    expect(ctx.wilaya).toBe('الجزائر العاصمة');
    expect(ctx.topBarbers?.[0]?.name).toBe('عمر');
    expect(ctx.topBarbers?.[0]?.reasons?.length).toBeGreaterThan(0);
  });
});
