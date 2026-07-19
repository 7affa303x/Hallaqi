import type { MarketplaceProduct } from '@/types/marketplace';

/** Hide incomplete / junk marketplace cards from discovery (#106). */
export function isDisplayableProduct(product: Pick<MarketplaceProduct, 'title' | 'priceDzd' | 'imageUrls' | 'sellerId'>): boolean {
  if (!product.title || product.title.trim().length < 2) return false;
  if (!product.sellerId) return false;
  if (!(product.priceDzd > 0) || product.priceDzd > 5_000_000) return false;
  return true;
}
