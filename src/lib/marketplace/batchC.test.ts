import { describe, expect, it } from 'vitest';
import { findSimilarProducts } from '@/lib/marketplace/similarProducts';
import { isSuspiciousTestPrice, isDisplayableProduct } from '@/lib/marketplace/displayable';
import { currentSeasonHints } from '@/lib/algeriaSeasons';
import type { MarketplaceProduct } from '@/types/marketplace';

const base = (over: Partial<MarketplaceProduct>): MarketplaceProduct => ({
  id: 'p1',
  title: 'منتج',
  description: 'وصف',
  brand: 'Brand',
  priceDzd: 1500,
  compareAtPriceDzd: null,
  imageUrls: ['/x.png'],
  sellerId: 's1',
  sellerName: 'Store',
  sellerType: 'store',
  categoryId: 'hair',
  wilaya: 'وهران',
  deliveryAreas: [],
  keywords: [],
  rating: 4,
  reviewCount: 1,
  isActive: true,
  isFeatured: false,
  isPremiumVisibility: false,
  isProductOfTheDay: false,
  externalUrl: null,
  offerText: null,
  ...over,
} as MarketplaceProduct);

describe('batch C helpers', () => {
  it('finds similar products by category/brand', () => {
    const product = base({ id: 'a', brand: 'X', categoryId: 'hair' });
    const catalog = [
      product,
      base({ id: 'b', brand: 'X', categoryId: 'hair', priceDzd: 1600 }),
      base({ id: 'c', brand: 'Y', categoryId: 'beard', priceDzd: 9000 }),
    ];
    const similar = findSimilarProducts(product, catalog, 4);
    expect(similar.map(p => p.id)).toContain('b');
    expect(similar.map(p => p.id)).not.toContain('a');
  });

  it('flags test prices only conceptually via helper', () => {
    expect(typeof isSuspiciousTestPrice(50)).toBe('boolean');
    expect(isDisplayableProduct(base({ title: 'ok', priceDzd: 1500 }))).toBe(true);
    expect(isDisplayableProduct(base({ title: '', priceDzd: 1500 }))).toBe(false);
  });

  it('returns season hints for current month', () => {
    expect(Array.isArray(currentSeasonHints())).toBe(true);
  });
});
