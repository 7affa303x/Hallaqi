import { useContext } from 'react';
import { AuthContext, type AuthContextValue } from '@/contexts/authContext';

export type { AuthContextValue, AuthState } from '@/contexts/authContext';

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
