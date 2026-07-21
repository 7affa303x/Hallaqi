import { afterEach, describe, expect, it, vi } from 'vitest';
import { MOBILE_SHELL_CLASS, applyMobileShellClass, shouldForceMobileShell } from '@/lib/mobileShell';

function mockWindow(partial: {
  ua?: string;
  mobileHint?: boolean;
  touchPoints?: number;
  coarse?: boolean;
  noHover?: boolean;
  screenW?: number;
  screenH?: number;
}) {
  const matchMedia = vi.fn((query: string) => ({
    matches:
      (query.includes('pointer: coarse') && !!partial.coarse)
      || (query.includes('hover: none') && !!partial.noHover),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  return {
    navigator: {
      userAgent: partial.ua || '',
      maxTouchPoints: partial.touchPoints ?? 0,
      userAgentData: partial.mobileHint === undefined
        ? undefined
        : { mobile: partial.mobileHint },
    },
    matchMedia,
    screen: {
      width: partial.screenW ?? 1920,
      height: partial.screenH ?? 1080,
    },
  } as unknown as Window;
}

describe('mobileShell', () => {
  afterEach(() => {
    document.documentElement.classList.remove(MOBILE_SHELL_CLASS);
  });

  it('forces mobile shell for Android Mobile UA', () => {
    expect(shouldForceMobileShell(mockWindow({
      ua: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Mobile Safari/537.36',
    }))).toBe(true);
  });

  it('forces mobile shell via Client Hints even when viewport looks desktop', () => {
    expect(shouldForceMobileShell(mockWindow({
      ua: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/120.0.0.0',
      mobileHint: true,
      screenW: 980,
      screenH: 1800,
    }))).toBe(true);
  });

  it('forces mobile shell for touch phone with desktop-spoofed CSS width', () => {
    expect(shouldForceMobileShell(mockWindow({
      ua: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/120.0.0.0',
      touchPoints: 5,
      coarse: true,
      noHover: true,
      screenW: 980,
      screenH: 400,
    }))).toBe(true);
  });

  it('does not force mobile shell on desktop mouse setups', () => {
    expect(shouldForceMobileShell(mockWindow({
      ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      mobileHint: false,
      touchPoints: 0,
      coarse: false,
      screenW: 1920,
      screenH: 1080,
    }))).toBe(false);
  });

  it('toggles the html class', () => {
    const spy = vi.spyOn(window.navigator, 'userAgent', 'get')
      .mockReturnValue('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)');
    const forced = applyMobileShellClass();
    expect(forced).toBe(true);
    expect(document.documentElement.classList.contains(MOBILE_SHELL_CLASS)).toBe(true);
    spy.mockRestore();
  });
});
