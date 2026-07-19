/** Hide incomplete / junk marketplace cards from discovery (#106, #143). */

import type { MarketplaceProduct } from '@/types/marketplace';

/**
 * In production, hide obvious test prices (1–99 DZD) that often leak from staging.
 * Dev builds still show them so sellers can preview.
 */
export function isSuspiciousTestPrice(priceDzd: number): boolean {
  if (!import.meta.env.PROD) return false;
  return priceDzd > 0 && priceDzd < 100;
}

export function isDisplayableProduct(product: Pick<MarketplaceProduct, 'title' | 'priceDzd' | 'imageUrls' | 'sellerId'>): boolean {
  if (!product.title || product.title.trim().length < 2) return false;
  if (!product.sellerId) return false;
  if (!(product.priceDzd > 0) || product.priceDzd > 5_000_000) return false;
  if (isSuspiciousTestPrice(product.priceDzd)) return false;
  return true;
}
