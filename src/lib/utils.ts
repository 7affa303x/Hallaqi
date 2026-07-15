import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import type { Barber, WorkingHours, BarberTag, Service } from '@/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformToBarber(professional: any): Barber {
  const profile = professional.profiles;
  const rawServices = professional.services || [];
  const portfolio = professional.portfolio_items || [];

  // Map raw DB services to app Service type
  const services: Service[] = rawServices.map((s: any) => ({
    id: s.id || '',
    name: s.name || '',
    price: s.price || 0,
    duration: s.duration_minutes || s.duration || 30,
    description: s.description || undefined,
    category: s.category || 'haircut',
    image: s.image || undefined,
  }));

  // Default working hours
  const defaultWorkingHours: WorkingHours = {
    sunday: { open: '09:00', close: '17:00', isOpen: true },
    monday: { open: '09:00', close: '17:00', isOpen: true },
    tuesday: { open: '09:00', close: '17:00', isOpen: true },
    wednesday: { open: '09:00', close: '17:00', isOpen: true },
    thursday: { open: '09:00', close: '17:00', isOpen: true },
    friday: { open: '09:00', close: '17:00', isOpen: false },
    saturday: { open: '09:00', close: '17:00', isOpen: true },
  };

  // Derive tags
  const tags: BarberTag[] = [];
  if (professional.is_mobile) tags.push('mobile');
  if (professional.uses_scissors) tags.push('old-school');
  if (professional.average_rating && professional.average_rating >= 4.5) tags.push('top-rated');
  if (services.some((s: Service) => s.name.toLowerCase().includes('beard'))) tags.push('premium');

  // Calculate price range
  const prices = services.map((s: Service) => s.price).filter((p: number) => p !== undefined && p > 0);
  let priceRange = 'N/A';
  if (prices.length > 0) {
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    if (minPrice === maxPrice) {
      priceRange = `${minPrice} DZD`;
    } else {
      priceRange = `${minPrice} - ${maxPrice} DZD`;
    }
  }

  return {
    id: professional.id,
    name: professional.business_name || profile?.full_name || 'Unknown Barber',
    avatar: profile?.avatar_url || '/logo-icon.png',
    coverImage: professional.cover_image_url || '/placeholder-cover.jpg',
    rating: professional.average_rating || 0,
    reviewCount: professional.review_count || 0,
    location: professional.business_address || profile?.city || 'Unknown Location',
    wilaya: profile?.city || 'Unknown Wilaya',
    distance: 'N/A',
    coordinates: professional.latitude && professional.longitude ? { lat: professional.latitude, lng: professional.longitude } : undefined,
    isActive: professional.is_active || false,
    isVerified: professional.verification_status === 'verified' || professional.verification_status === 'premium' || profile?.verification_status === 'verified' || profile?.verification_status === 'premium',
    tags: tags.length > 0 ? tags : ['new'],
    services,
    priceRange,
    workingHours: defaultWorkingHours,
    isMobile: professional.is_mobile || false,
    usesScissors: professional.uses_scissors || false,
    yearsOfExperience: professional.years_of_experience || 0,
    bio: professional.bio || 'No bio provided.',
    portfolio: portfolio.map((item: any) => item.url || item),
    phone: professional.business_phone || profile?.phone_number || undefined,
    hasIdCard: professional.has_id_card || false,
    idCardVerified: professional.id_card_verified || false,
    isSubscribed: professional.is_subscribed || false,
    subscriptionPlan: professional.subscription_plan || undefined,
    followers: professional.followers_count || 0,
    following: professional.following_count || 0,
    likes: professional.likes_count || 0,
    isFollowing: false,
    reviews: [],
  };
}
