-- Replace legacy marketplace tables (store_id / company_id) with unified seller model.
-- Run once on projects that have the old schema. Safe to skip if marketplace_sellers already exists.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'marketplace_sellers'
  ) THEN
    RAISE NOTICE 'marketplace_sellers already exists — skipping legacy replacement';
    RETURN;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'marketplace_products'
      AND column_name = 'store_id'
  ) THEN
    DROP TABLE IF EXISTS public.marketplace_analytics_events CASCADE;
    DROP TABLE IF EXISTS public.marketplace_placements CASCADE;
    DROP TABLE IF EXISTS public.marketplace_reviews CASCADE;
    DROP TABLE IF EXISTS public.marketplace_products CASCADE;
    DROP TABLE IF EXISTS public.marketplace_subscription_requests CASCADE;
    DROP TABLE IF EXISTS public.marketplace_subscription_plans CASCADE;
    RAISE NOTICE 'Dropped legacy marketplace tables';
  END IF;
END $$;

-- Re-apply core marketplace objects (idempotent sections from 20260718120000)
DO $$ BEGIN
  CREATE TYPE public.marketplace_seller_type AS ENUM ('store', 'company', 'doctor');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.marketplace_approval_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.marketplace_plan_tier AS ENUM ('free', 'basic', 'professional', 'business');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.marketplace_product_kind AS ENUM ('physical', 'service_extra', 'course', 'device', 'accessory');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.marketplace_placement_type AS ENUM (
    'featured_product', 'featured_store', 'product_of_the_day',
    'banner', 'sponsored', 'premium_badge'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.marketplace_analytics_event AS ENUM (
    'view', 'click', 'save', 'profile_visit', 'search_impression',
    'featured_impression', 'featured_click', 'visit_store',
    'product_of_day_view', 'product_of_day_click'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.marketplace_sellers (
  id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_type public.marketplace_seller_type NOT NULL,
  display_name text NOT NULL,
  slug text UNIQUE,
  logo_url text,
  cover_url text,
  short_description text,
  about text,
  website_url text,
  contact_email text,
  contact_phone text,
  social_links jsonb NOT NULL DEFAULT '{}'::jsonb,
  wilaya text,
  delivery_areas text[] NOT NULL DEFAULT '{}',
  brand_name text,
  approval_status public.marketplace_approval_status NOT NULL DEFAULT 'pending',
  approved_at timestamptz,
  approved_by uuid REFERENCES public.profiles(id),
  is_verified boolean NOT NULL DEFAULT false,
  is_premium boolean NOT NULL DEFAULT false,
  is_company_badge boolean NOT NULL DEFAULT false,
  is_trusted_doctor boolean NOT NULL DEFAULT false,
  subscription_plan public.marketplace_plan_tier NOT NULL DEFAULT 'free',
  subscription_expires_at timestamptz,
  listing_cap integer NOT NULL DEFAULT 12 CHECK (listing_cap > 0 AND listing_cap <= 99),
  rating numeric(3,2) NOT NULL DEFAULT 0,
  review_count integer NOT NULL DEFAULT 0,
  follower_count integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_marketplace_sellers_type ON public.marketplace_sellers(seller_type);
CREATE INDEX IF NOT EXISTS idx_marketplace_sellers_status ON public.marketplace_sellers(approval_status);
CREATE INDEX IF NOT EXISTS idx_marketplace_sellers_wilaya ON public.marketplace_sellers(wilaya);

CREATE TABLE IF NOT EXISTS public.marketplace_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES public.marketplace_sellers(id) ON DELETE CASCADE,
  category_id text REFERENCES public.marketplace_categories(id) ON DELETE SET NULL,
  kind public.marketplace_product_kind NOT NULL DEFAULT 'physical',
  title text NOT NULL,
  slug text,
  description text,
  seo_description text,
  keywords text[] NOT NULL DEFAULT '{}',
  brand text,
  price_dzd numeric(12,2) NOT NULL CHECK (price_dzd >= 0),
  compare_at_price_dzd numeric(12,2),
  currency text NOT NULL DEFAULT 'DZD',
  image_urls text[] NOT NULL DEFAULT '{}',
  image_captions text[] NOT NULL DEFAULT '{}',
  wilaya text,
  delivery_areas text[] NOT NULL DEFAULT '{}',
  is_featured boolean NOT NULL DEFAULT false,
  is_premium_visibility boolean NOT NULL DEFAULT false,
  is_product_of_the_day boolean NOT NULL DEFAULT false,
  is_bestseller boolean NOT NULL DEFAULT false,
  is_new boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  rating numeric(3,2) NOT NULL DEFAULT 0,
  review_count integer NOT NULL DEFAULT 0,
  popularity_score integer NOT NULL DEFAULT 0,
  external_url text,
  offer_text text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_marketplace_products_seller ON public.marketplace_products(seller_id);

ALTER TABLE public.marketplace_sellers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Approved sellers are public" ON public.marketplace_sellers;
CREATE POLICY "Approved sellers are public"
  ON public.marketplace_sellers FOR SELECT
  USING (approval_status = 'approved' AND is_active = true OR id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Sellers manage own profile" ON public.marketplace_sellers;
CREATE POLICY "Sellers manage own profile"
  ON public.marketplace_sellers FOR UPDATE
  USING (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Sellers insert own profile" ON public.marketplace_sellers;
CREATE POLICY "Sellers insert own profile"
  ON public.marketplace_sellers FOR INSERT
  WITH CHECK (id = auth.uid() OR public.is_admin());

NOTIFY pgrst, 'reload schema';
