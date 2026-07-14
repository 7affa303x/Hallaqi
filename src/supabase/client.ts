import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return supabaseUrl.length > 10 && supabaseKey.length > 10 && supabaseUrl.startsWith('http');
};

export const isDeveloperMode = !isSupabaseConfigured();

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : createClient('https://placeholder.supabase.co', 'placeholder', {
      auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    });

export const TABLES = {
  USERS: 'profiles',
  BARBERS: 'barbers',
  BOOKINGS: 'bookings',
  CHATS: 'chats',
  MESSAGES: 'messages',
  FORUM_POSTS: 'forum_posts',
  FORUM_COMMENTS: 'forum_comments',
  NOTIFICATIONS: 'notifications',
  REVIEWS: 'reviews',
  REPORTS: 'reports',
  FAVORITES: 'favorites',
} as const;

export const STORAGE = {
  AVATARS: 'avatars',
  PORTFOLIO: 'portfolio',
  ID_CARDS: 'id-cards',
  REVIEWS: 'review-images',
} as const;

export default supabase;
