/** Find similar marketplace products for compare UI (#114). */

import type { MarketplaceProduct } from '@/types/marketplace';

export function findSimilarProducts(
  product: MarketplaceProduct,
  catalog: MarketplaceProduct[],
  limit = 4
): MarketplaceProduct[] {
  const scored = catalog
    .filter(p => p.id !== product.id && p.isActive)
    .map(p => {
      let score = 0;
      if (p.categoryId === product.categoryId) score += 5;
      if (p.brand && product.brand && p.brand.toLowerCase() === product.brand.toLowerCase()) score += 4;
      if (p.sellerId === product.sellerId) score += 2;
      if (p.wilaya === product.wilaya) score += 1;
      const priceDiff = Math.abs(p.priceDzd - product.priceDzd);
      if (priceDiff < product.priceDzd * 0.35) score += 2;
      return { p, score };
    })
    .filter(x => x.score >= 5)
    .sort((a, b) => b.score - a.score || Math.abs(a.p.priceDzd - product.priceDzd) - Math.abs(b.p.priceDzd - product.priceDzd));

  return scored.slice(0, limit).map(x => x.p);
}
