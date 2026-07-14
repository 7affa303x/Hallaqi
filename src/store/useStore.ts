/**
 * Hallaqi - Zustand Store
 * Production state management with persistence
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeName, AnimationStyle } from '@/types';

interface AppStore {
  // Auth
  isAuthenticated: boolean;
  setAuthenticated: (v: boolean) => void;
  
  // Theme
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  
  // Animation
  animationStyle: AnimationStyle;
  setAnimationStyle: (style: AnimationStyle) => void;
  
  // Language
  language: 'ar' | 'fr' | 'en';
  setLanguage: (lang: 'ar' | 'fr' | 'en') => void;
  
  // Notifications
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  
  // Search
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  
  // UI State
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  
  // Offline
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  
  // Loading
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  globalError: string | null;
  setGlobalError: (error: string | null) => void;
  
  // Reset
  reset: () => void;
}

const initialState = {
  isAuthenticated: false,
  theme: 'hallaqi' as ThemeName,
  animationStyle: 'modern' as AnimationStyle,
  language: 'ar' as const,
  unreadCount: 0,
  recentSearches: [],
  isSearchOpen: false,
  showNotifications: false,
  isOnline: true,
  isLoading: false,
  globalError: null,
};

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      ...initialState,
      
      setAuthenticated: (v) => set({ isAuthenticated: v }),
      setTheme: (theme) => set({ theme }),
      setAnimationStyle: (style) => set({ animationStyle: style }),
      setLanguage: (lang) => set({ language: lang }),
      setUnreadCount: (count) => set({ unreadCount: count }),
      addRecentSearch: (query) => set((s) => ({
        recentSearches: [query, ...s.recentSearches.filter(q => q !== query)].slice(0, 10),
      })),
      clearRecentSearches: () => set({ recentSearches: [] }),
      setIsSearchOpen: (open) => set({ isSearchOpen: open }),
      setShowNotifications: (show) => set({ showNotifications: show }),
      setIsOnline: (online) => set({ isOnline: online }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setGlobalError: (error) => set({ globalError: error }),
      reset: () => set(initialState),
    }),
    {
      name: 'hallaqi-store',
      partialize: (state) => ({
        theme: state.theme,
        animationStyle: state.animationStyle,
        language: state.language,
        recentSearches: state.recentSearches,
      }),
    }
  )
);
