/**
 * Hallaqi - Supabase Types
 * Clean types without Firebase dependencies
 */

// ====== USER ======
export type UserRole = 'user' | 'barber' | 'admin';

export interface AppUser {
  id: string;
  email: string;
  display_name: string;
  photo_url: string | null;
  phone: string | null;
  role: UserRole;
  is_verified: boolean;
  is_id_verified: boolean;
  bio: string | null;
  location: string | null;
  wilaya: string | null;
  theme: string;
  language: 'ar' | 'fr' | 'en';
  followers: number;
  following: number;
  stats: Record<string, unknown> | null;
  created_at: string;
  last_login_at: string | null;
  linkedAccounts?: Array<{ provider: 'google' | 'facebook' | 'apple' | 'instagram'; connected: boolean; username?: string }>;
}

// ====== BARBER ======
export interface BarberDoc {
  id: string;
  name: string;
  avatar: string;
  cover_image: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  wilaya: string;
  is_active: boolean;
  is_verified: boolean;
  is_mobile: boolean;
  uses_scissors: boolean;
  is_subscribed: boolean;
  subscription_plan: string | null;
  years_of_experience: number;
  rating: number;
  review_count: number;
  followers: number;
  following: number;
  likes: number;
  tags: string[];
  services: ServiceDoc[];
  working_hours: Record<string, { open: string; close: string; isOpen: boolean }>;
  portfolio: string[];
  created_at: string;
  updated_at: string;
}

export interface ServiceDoc {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
  category: string;
}

// ====== BOOKING ======
export interface BookingDoc {
  id: string;
  user_id: string;
  barber_id: string;
  services: BookingService[];
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  total_price: number;
  note: string | null;
  is_mobile_service: boolean;
  address: string | null;
  payment_method: string | null;
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
  reviewed: boolean;
  rating: number | null;
  review_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingService {
  id: string;
  name: string;
  price: number;
  duration: number;
}

// ====== FORUM ======
export interface ForumPostDoc {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  author_role: string;
  is_verified: boolean;
  title: string;
  content: string;
  category: string;
  tags: string[];
  likes: number;
  liked_by: string[];
  views: number;
  is_pinned: boolean;
  is_announcement: boolean;
  created_at: string;
  updated_at: string;
}

export interface ForumCommentDoc {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  author_role: string;
  is_verified: boolean;
  content: string;
  likes: number;
  parent_id: string | null;
  created_at: string;
}

// ====== NOTIFICATION ======
export interface NotificationDoc {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'booking' | 'message' | 'forum' | 'promo' | 'system' | 'competition';
  read: boolean;
  action_url: string | null;
  image: string | null;
  created_at: string;
}

// ====== FAVORITE ======
export interface FavoriteDoc {
  id: string;
  user_id: string;
  barber_id: string;
  created_at: string;
}

// ====== CACHE ======
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// ====== ERROR ======
export interface AppError {
  code: string;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

// ====== API RESPONSE ======
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}
