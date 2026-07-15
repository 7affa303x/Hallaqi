import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import type { Professional, Profile, Service, PortfolioItem } from '@/types/supabase';
import type { Barber, WorkingHours, BarberTag } from '@/types';

export function transformToBarber(professional: Professional & { profiles?: Profile; services?: Service[]; portfolio_items?: PortfolioItem[] }): Barber {
  const profile = professional.profiles;
  const services = professional.services || [];
  const portfolio = professional.portfolio_items || [];

  // Default working hours (e.g., 9 AM to 5 PM every day)
  const defaultWorkingHours: WorkingHours = {
    sunday: { open: '09:00', close: '17:00', isOpen: true },
    monday: { open: '09:00', close: '17:00', isOpen: true },
    tuesday: { open: '09:00', close: '17:00', isOpen: true },
    wednesday: { open: '09:00', close: '17:00', isOpen: true },
    thursday: { open: '09:00', close: '17:00', isOpen: true },
    friday: { open: '09:00', close: '17:00', isOpen: false }, // Assuming Friday is off
    saturday: { open: '09:00', close: '17:00', isOpen: true },
  };

  // Derive tags from services or other professional attributes
  const tags: BarberTag[] = [];
  if (professional.is_mobile) tags.push('mobile');
  if (professional.uses_scissors) tags.push('old-school'); // Example tag
  if (professional.average_rating && professional.average_rating >= 4.5) tags.push('top-rated');
  if (services.some(s => s.name.toLowerCase().includes('beard'))) tags.push('beard-trim');

  // Calculate price range
  const prices = services.map(s => s.price).filter(p => p !== undefined);
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
    avatar: profile?.avatar_url || '/logo-icon.png', // Default avatar
    coverImage: professional.cover_image_url || '/placeholder-cover.jpg', // Default cover image
    rating: professional.average_rating || 0,
    reviewCount: professional.review_count || 0,
    location: professional.business_address || profile?.city || 'Unknown Location',
    wilaya: profile?.city || 'Unknown Wilaya',
    distance: 'N/A', // Distance would typically be calculated on the client-side based on user's location
    coordinates: professional.latitude && professional.longitude ? { lat: professional.latitude, lng: professional.longitude } : undefined,
    isActive: professional.is_active || false,
    isVerified: professional.verification_status === 'verified' || professional.verification_status === 'premium',
    tags: tags.length > 0 ? tags : ['new'], // Default tag if none derived
    services: services.map(s => ({ ...s, category: s.category || 'haircut' })), // Ensure category is present
    priceRange,
    workingHours: defaultWorkingHours, // Placeholder, ideally fetched from availability_schedules
    isMobile: professional.is_mobile || false,
    usesScissors: professional.uses_scissors || false,
    yearsOfExperience: professional.years_of_experience || 0,
    bio: professional.bio || 'No bio provided.',
    portfolio: portfolio.map(item => item.url), // Extract URLs from portfolio items
    phone: professional.business_phone || profile?.phone_number || undefined,
    hasIdCard: professional.has_id_card || false,
    idCardVerified: professional.id_card_verified || false,
    isSubscribed: professional.is_subscribed || false,
    subscriptionPlan: professional.subscription_plan || undefined,
    followers: professional.followers_count || 0,
    following: professional.following_count || 0,
    likes: professional.likes_count || 0,
    isFollowing: false, // This would be dynamic based on user's favorites
    reviews: [], // Reviews are fetched separately
  };
}
