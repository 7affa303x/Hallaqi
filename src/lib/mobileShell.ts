/**
 * Force the full-bleed mobile shell on phones even when the browser
 * "Request Desktop Site" widens CSS viewport (common after OAuth login).
 */

export const MOBILE_SHELL_CLASS = 'hallaqi-mobile-shell';

type NavigatorWithUAData = Navigator & {
  userAgentData?: { mobile?: boolean };
};

/** True for phone/tablet form factors that should stay in mobile layout. */
export function shouldForceMobileShell(
  win: Window = typeof window !== 'undefined' ? window : (undefined as unknown as Window),
): boolean {
  if (!win?.navigator) return false;
  const nav = win.navigator as NavigatorWithUAData;

  // Client Hints — most reliable on Chromium even with Desktop Site.
  if (nav.userAgentData?.mobile === true) return true;

  const ua = nav.userAgent || '';
  if (/Android.+Mobile|iPhone|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return true;
  }
  // iPadOS 13+ may report as Mac; touch + coarse pointer still means mobile shell.
  if (/iPad|Android/i.test(ua)) return true;

  const touchPoints = nav.maxTouchPoints || 0;
  const coarse = typeof win.matchMedia === 'function'
    && win.matchMedia('(pointer: coarse)').matches;
  const noHover = typeof win.matchMedia === 'function'
    && win.matchMedia('(hover: none)').matches;
  const shortestSide = Math.min(win.screen?.width || 0, win.screen?.height || 0);

  // Phones spoofing desktop width still have a small physical screen + touch.
  if (touchPoints > 0 && (coarse || noHover) && shortestSide > 0 && shortestSide <= 920) {
    return true;
  }

  return false;
}

/** Apply/remove the html class used by CSS to keep full-bleed layout. */
export function applyMobileShellClass(root: HTMLElement = document.documentElement): boolean {
  const force = shouldForceMobileShell();
  root.classList.toggle(MOBILE_SHELL_CLASS, force);
  return force;
}
