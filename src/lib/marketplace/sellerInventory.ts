import type {
  MarketplacePlacementType,
  MarketplaceProduct,
  MarketplaceProductKind,
  MarketplacePlanTier,
} from '@/types/marketplace';
import { MARKETPLACE_PREMIUM_LISTING_CAP } from '@/types/marketplace';
import { marketplacePlans } from '@/data/marketplaceSeed';

const PRODUCTS_KEY = 'hallaqi-seller-products';
const PLACEMENTS_KEY = 'hallaqi-seller-placement-requests';

export interface SellerPlacementRequest {
  id: string;
  sellerId: string;
  placementType: MarketplacePlacementType;
  productId?: string;
  bidAmountDzd: number;
  title: string;
  status: 'pending' | 'active' | 'rejected';
  createdAt: string;
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota
  }
}

export function listingCapForPlan(plan: MarketplacePlanTier): number {
  const found = marketplacePlans.find(p => p.id === plan);
  return Math.min(found?.listingCap ?? 12, MARKETPLACE_PREMIUM_LISTING_CAP);
}

export function getSellerOwnedProducts(sellerId: string): MarketplaceProduct[] {
  return readJson<MarketplaceProduct[]>(PRODUCTS_KEY, []).filter(p => p.sellerId === sellerId);
}

export function getAllSellerOwnedProducts(): MarketplaceProduct[] {
  return readJson<MarketplaceProduct[]>(PRODUCTS_KEY, []).filter(p => p.isActive);
}

export function upsertSellerProduct(
  sellerId: string,
  plan: MarketplacePlanTier,
  input: {
    id?: string;
    title: string;
    description: string;
    brand: string;
    categoryId: string;
    kind: MarketplaceProductKind;
    priceDzd: number;
    compareAtPriceDzd?: number;
    externalUrl?: string;
    offerText?: string;
    keywords?: string[];
    wilaya?: string;
    deliveryAreas?: string[];
    imageUrl?: string;
    seoDescription?: string;
    sellerName?: string;
    sellerType?: MarketplaceProduct['sellerType'];
  }
): { ok: true; product: MarketplaceProduct } | { ok: false; error: string } {
  const all = readJson<MarketplaceProduct[]>(PRODUCTS_KEY, []);
  const mine = all.filter(p => p.sellerId === sellerId && p.isActive);
  const cap = listingCapForPlan(plan);
  const editing = input.id ? all.find(p => p.id === input.id && p.sellerId === sellerId) : undefined;

  if (!editing && mine.length >= cap) {
    return {
      ok: false,
      error: `وصلت للحد الأقصى (${cap}/${MARKETPLACE_PREMIUM_LISTING_CAP}). رقِّ خطتك لزيادة الظهور — ليس غير محدود.`,
    };
  }

  const product: MarketplaceProduct = {
    id: editing?.id || `local-${crypto.randomUUID()}`,
    sellerId,
    sellerName: input.sellerName || editing?.sellerName,
    sellerType: input.sellerType || editing?.sellerType,
    categoryId: input.categoryId,
    kind: input.kind,
    title: input.title.trim(),
    description: input.description.trim(),
    seoDescription: input.seoDescription?.trim(),
    keywords: input.keywords || [],
    brand: input.brand.trim() || 'بدون علامة',
    priceDzd: Math.max(0, input.priceDzd),
    compareAtPriceDzd: input.compareAtPriceDzd,
    imageUrls: input.imageUrl
      ? [input.imageUrl]
      : (editing?.imageUrls || ['https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=800&q=80']),
    imageCaptions: editing?.imageCaptions || [],
    wilaya: input.wilaya || 'الجزائر',
    deliveryAreas: input.deliveryAreas || ['الجزائر'],
    isFeatured: editing?.isFeatured || false,
    isPremiumVisibility: editing?.isPremiumVisibility || false,
    isProductOfTheDay: editing?.isProductOfTheDay || false,
    isBestseller: editing?.isBestseller || false,
    isNew: editing ? editing.isNew : true,
    isActive: true,
    rating: editing?.rating || 0,
    reviewCount: editing?.reviewCount || 0,
    popularityScore: editing?.popularityScore || 10,
    externalUrl: input.externalUrl,
    offerText: input.offerText,
    createdAt: editing?.createdAt || new Date().toISOString(),
  };

  const next = editing
    ? all.map(p => (p.id === editing.id ? product : p))
    : [...all, product];
  writeJson(PRODUCTS_KEY, next);
  return { ok: true, product };
}

export function deactivateSellerProduct(sellerId: string, productId: string) {
  const all = readJson<MarketplaceProduct[]>(PRODUCTS_KEY, []);
  writeJson(PRODUCTS_KEY, all.map(p => (
    p.id === productId && p.sellerId === sellerId ? { ...p, isActive: false } : p
  )));
}

export function getPlacementRequests(sellerId?: string): SellerPlacementRequest[] {
  const all = readJson<SellerPlacementRequest[]>(PLACEMENTS_KEY, []);
  return sellerId ? all.filter(r => r.sellerId === sellerId) : all;
}

export function createPlacementRequest(input: Omit<SellerPlacementRequest, 'id' | 'createdAt' | 'status'>): SellerPlacementRequest {
  const all = readJson<SellerPlacementRequest[]>(PLACEMENTS_KEY, []);
  const row: SellerPlacementRequest = {
    ...input,
    id: `place-req-${crypto.randomUUID()}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  writeJson(PLACEMENTS_KEY, [row, ...all]);
  return row;
}

export function reviewPlacementRequest(id: string, approve: boolean): SellerPlacementRequest | null {
  const all = readJson<SellerPlacementRequest[]>(PLACEMENTS_KEY, []);
  let updated: SellerPlacementRequest | null = null;
  const next = all.map(r => {
    if (r.id !== id) return r;
    updated = { ...r, status: approve ? 'active' : 'rejected' };
    return updated;
  });
  writeJson(PLACEMENTS_KEY, next);

  if (updated && approve) {
    applyActivePlacement(updated);
  }
  return updated;
}

function applyActivePlacement(req: SellerPlacementRequest) {
  if (!req.productId) return;
  const products = readJson<MarketplaceProduct[]>(PRODUCTS_KEY, []);
  const next = products.map(p => {
    if (p.id !== req.productId) {
      if (req.placementType === 'product_of_the_day') {
        return { ...p, isProductOfTheDay: false };
      }
      return p;
    }
    return {
      ...p,
      isFeatured: req.placementType === 'featured_product' || req.placementType === 'product_of_the_day' || p.isFeatured,
      isPremiumVisibility: req.placementType === 'premium_badge' || req.placementType === 'sponsored' || p.isPremiumVisibility,
      isProductOfTheDay: req.placementType === 'product_of_the_day',
      offerText: req.placementType === 'product_of_the_day'
        ? (p.offerText || 'موضع منتج اليوم — ظهور إعلاني مدفوع')
        : p.offerText,
    };
  });
  writeJson(PRODUCTS_KEY, next);
}
