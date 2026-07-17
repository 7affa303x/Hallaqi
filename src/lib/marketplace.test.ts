import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ALGERIA_WILAYAS,
  debounceMs,
  type MarketplaceFilters,
} from './marketplace';

describe('marketplace helpers', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('exposes a fixed Algeria wilaya list', () => {
    expect(ALGERIA_WILAYAS).toHaveLength(10);
    expect(ALGERIA_WILAYAS[0]).toEqual({ code: 16, nameAr: 'الجزائر' });
    expect(ALGERIA_WILAYAS.every(w => typeof w.code === 'number' && w.nameAr.length > 0)).toBe(true);
  });

  it('debounceMs fires once after the wait window', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounceMs(fn, 300);

    debounced();
    debounced();
    debounced();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(299);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('MarketplaceFilters accepts the search filter shape used by the UI', () => {
    const filters: MarketplaceFilters = {
      q: 'زيت',
      category: 'hair',
      brand: 'Hallaqi',
      storeId: 'store-1',
      companyId: undefined,
      wilaya: 16,
      deliveryArea: 'الجزائر',
      minPrice: 500,
      maxPrice: 5000,
      minRating: 4,
      sort: 'featured',
      featuredOnly: true,
      premiumOnly: false,
      todayOnly: true,
    };

    expect(filters.sort).toBe('featured');
    expect(filters.wilaya).toBe(16);
    expect(Object.keys(filters)).toEqual(expect.arrayContaining([
      'q', 'category', 'brand', 'wilaya', 'sort', 'featuredOnly', 'todayOnly',
    ]));
  });
});
