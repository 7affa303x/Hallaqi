import { useAuth } from '@/hooks/useAuth';

/**
 * Stable auth gate for UI.
 * Never treat "session still restoring" as logged-out — that caused Login CTAs
 * to flash on Forum / Profile / Appointments during tab switches.
 */
export function useAuthGate() {
  const auth = useAuth();
  const ready = !auth.isLoading;
  const isLoggedIn = ready && auth.isAuthenticated;
  /** Show "please sign in" only after we know there is no session. */
  const needsLogin = ready && !auth.isAuthenticated;
  return {
    ...auth,
    ready,
    isLoggedIn,
    needsLogin,
  };
}
