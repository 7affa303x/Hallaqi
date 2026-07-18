import { describe, expect, it } from 'vitest';
import { canOpenExternalStore, sanitizeExternalHttpsUrl } from '@/lib/marketplace/externalUrl';

describe('externalUrl safety', () => {
  it('allows https storefronts', () => {
    expect(sanitizeExternalHttpsUrl('https://shop.example.com/path')).toContain('https://shop.example.com');
    expect(canOpenExternalStore('https://hallaqi.vercel.app')).toBe(true);
  });

  it('rejects http, javascript, and localhost', () => {
    expect(sanitizeExternalHttpsUrl('http://evil.com')).toBeNull();
    expect(sanitizeExternalHttpsUrl('javascript:alert(1)')).toBeNull();
    expect(sanitizeExternalHttpsUrl('https://localhost/x')).toBeNull();
    expect(canOpenExternalStore('ftp://files.example.com')).toBe(false);
  });
});
