interface SupabaseEnv {
  url: string;
  anonKey: string;
  serviceKey?: string;
}

export function getSupabaseEnv(): SupabaseEnv | null {
  const url = process.env.VITE_SUPABASE_URL?.trim();
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) return null;
  return {
    url,
    anonKey,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || undefined,
  };
}

function restHeaders(token: string, apiKey: string): Record<string, string> {
  return {
    apikey: apiKey,
    authorization: `Bearer ${token}`,
    'content-type': 'application/json',
  };
}

export async function fetchUserProfile(
  accessToken: string,
): Promise<{ id: string; fullName?: string; city?: string; role?: string } | null> {
  const env = getSupabaseEnv();
  if (!env) return null;

  try {
    const rpc = await fetch(`${env.url}/rest/v1/rpc/get_own_profile`, {
      method: 'POST',
      headers: restHeaders(accessToken, env.anonKey),
      body: '{}',
    });
    if (rpc.ok) {
      const row = await rpc.json() as {
        id?: string;
        full_name?: string | null;
        city?: string | null;
        user_role?: string | null;
      };
      if (row?.id) {
        return {
          id: row.id,
          fullName: row.full_name?.trim() || undefined,
          city: row.city?.trim() || undefined,
          role: row.user_role || undefined,
        };
      }
    }

    const userRes = await fetch(`${env.url}/auth/v1/user`, {
      headers: restHeaders(accessToken, env.anonKey),
    });
    if (!userRes.ok) return null;
    const user = await userRes.json() as { id?: string };
    if (!user.id) return null;

    const profileRes = await fetch(
      `${env.url}/rest/v1/profiles?select=full_name,city,user_role&id=eq.${encodeURIComponent(user.id)}&limit=1`,
      { headers: restHeaders(accessToken, env.anonKey) },
    );
    if (!profileRes.ok) return { id: user.id };
    const rows = await profileRes.json() as Array<{
      full_name?: string | null;
      city?: string | null;
      user_role?: string | null;
    }>;
    const profile = rows[0];
    return {
      id: user.id,
      fullName: profile?.full_name?.trim() || undefined,
      city: profile?.city?.trim() || undefined,
      role: profile?.user_role || undefined,
    };
  } catch {
    return null;
  }
}

export interface CatalogProfessional {
  id: string;
  name: string;
  city: string;
  rating: number;
  reviewCount: number;
  isMobile: boolean;
  isVerified: boolean;
  services: Array<{ name: string; priceDzd: number; category?: string }>;
}

type ProfessionalRow = {
  id: string;
  business_name?: string | null;
  average_rating?: number | null;
  review_count?: number | null;
  is_mobile?: boolean | null;
  profiles?: { full_name?: string | null; city?: string | null; verification_status?: string | null } | Array<{ full_name?: string | null; city?: string | null; verification_status?: string | null }>;
  services?: Array<{ name?: string | null; price?: number | null; category?: string | null; is_active?: boolean | null }> | null;
};

function unwrapProfile(
  profiles: ProfessionalRow['profiles'],
): { full_name?: string | null; city?: string | null; verification_status?: string | null } | undefined {
  if (!profiles) return undefined;
  return Array.isArray(profiles) ? profiles[0] : profiles;
}

function mapProfessional(row: ProfessionalRow): CatalogProfessional | null {
  if (!row.id) return null;
  const profile = unwrapProfile(row.profiles);
  const name = row.business_name?.trim() || profile?.full_name?.trim() || 'حلاق';
  const services = (row.services || [])
    .filter(s => s.is_active !== false && s.name)
    .slice(0, 5)
    .map(s => ({
      name: String(s.name).trim(),
      priceDzd: Number(s.price) || 0,
      category: s.category || undefined,
    }));

  return {
    id: row.id,
    name,
    city: profile?.city?.trim() || 'الجزائر',
    rating: Number(row.average_rating) || 0,
    reviewCount: Number(row.review_count) || 0,
    isMobile: Boolean(row.is_mobile),
    isVerified: profile?.verification_status === 'verified' || profile?.verification_status === 'premium',
    services,
  };
}

export async function fetchCatalogProfessionals(options: {
  city?: string;
  limit?: number;
}): Promise<CatalogProfessional[]> {
  const env = getSupabaseEnv();
  if (!env) return [];

  const token = env.serviceKey || env.anonKey;
  const limit = Math.min(options.limit ?? 10, 15);
  const select = [
    'id',
    'business_name',
    'average_rating',
    'review_count',
    'is_mobile',
    'profiles(full_name,city,verification_status)',
    'services(name,price,category,is_active)',
  ].join(',');

  let url = `${env.url}/rest/v1/professionals?select=${encodeURIComponent(select)}&is_active=eq.true&order=average_rating.desc&limit=${limit}`;
  if (options.city?.trim()) {
    url += `&profiles.city=eq.${encodeURIComponent(options.city.trim())}`;
  }

  try {
    const res = await fetch(url, { headers: restHeaders(token, env.anonKey) });
    if (!res.ok) return [];
    const rows = await res.json() as ProfessionalRow[];
    return rows.map(mapProfessional).filter((p): p is CatalogProfessional => Boolean(p && p.services.length > 0));
  } catch {
    return [];
  }
}

export interface MarketplaceSnapshot {
  approvedSellers: number;
  activeProducts: number;
  sampleCategories: string[];
}

export async function fetchMarketplaceSnapshot(): Promise<MarketplaceSnapshot | null> {
  const env = getSupabaseEnv();
  if (!env) return null;

  const token = env.serviceKey || env.anonKey;
  const headers = {
    ...restHeaders(token, env.anonKey),
    prefer: 'count=exact',
  };

  try {
    const [sellersRes, productsRes, categoriesRes] = await Promise.all([
      fetch(`${env.url}/rest/v1/marketplace_sellers?select=id&approval_status=eq.approved&is_active=eq.true&limit=1`, { headers }),
      fetch(`${env.url}/rest/v1/marketplace_products?select=id&is_active=eq.true&limit=1`, { headers }),
      fetch(`${env.url}/rest/v1/marketplace_categories?select=name_ar&is_active=eq.true&order=sort_order.asc&limit=8`, {
        headers: restHeaders(token, env.anonKey),
      }),
    ]);

    const countFrom = (res: Response) => {
      const range = res.headers.get('content-range');
      if (!range) return 0;
      const total = range.split('/')[1];
      return total ? Number(total) : 0;
    };

    const categories = categoriesRes.ok
      ? (await categoriesRes.json() as Array<{ name_ar?: string }>).map(c => c.name_ar).filter(Boolean) as string[]
      : [];

    return {
      approvedSellers: sellersRes.ok ? countFrom(sellersRes) : 0,
      activeProducts: productsRes.ok ? countFrom(productsRes) : 0,
      sampleCategories: categories,
    };
  } catch {
    return null;
  }
}
