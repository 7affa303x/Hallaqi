-- Store/company reviews for marketplace discovery pages.
CREATE TABLE IF NOT EXISTS public.marketplace_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type text NOT NULL CHECK (target_type IN ('store', 'company', 'product')),
  store_id uuid REFERENCES public.stores(id) ON DELETE CASCADE,
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.marketplace_products(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  moderation_status text NOT NULL DEFAULT 'approved'
    CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT marketplace_reviews_target_chk CHECK (
    (target_type = 'store' AND store_id IS NOT NULL) OR
    (target_type = 'company' AND company_id IS NOT NULL) OR
    (target_type = 'product' AND product_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_mp_reviews_store ON public.marketplace_reviews(store_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mp_reviews_company ON public.marketplace_reviews(company_id, created_at DESC);

ALTER TABLE public.marketplace_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS mp_reviews_read ON public.marketplace_reviews;
CREATE POLICY mp_reviews_read ON public.marketplace_reviews FOR SELECT
  USING (moderation_status = 'approved' OR reviewer_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS mp_reviews_insert ON public.marketplace_reviews;
CREATE POLICY mp_reviews_insert ON public.marketplace_reviews FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);

DROP POLICY IF EXISTS mp_reviews_admin ON public.marketplace_reviews;
CREATE POLICY mp_reviews_admin ON public.marketplace_reviews FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE OR REPLACE FUNCTION public.refresh_store_rating()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.store_id IS NOT NULL THEN
    UPDATE public.stores s SET
      average_rating = COALESCE((
        SELECT ROUND(AVG(r.rating)::numeric, 2)
        FROM public.marketplace_reviews r
        WHERE r.store_id = NEW.store_id AND r.moderation_status = 'approved'
      ), 0),
      review_count = COALESCE((
        SELECT COUNT(*) FROM public.marketplace_reviews r
        WHERE r.store_id = NEW.store_id AND r.moderation_status = 'approved'
      ), 0)
    WHERE s.id = NEW.store_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS refresh_store_rating_trigger ON public.marketplace_reviews;
CREATE TRIGGER refresh_store_rating_trigger
  AFTER INSERT OR UPDATE ON public.marketplace_reviews
  FOR EACH ROW EXECUTE FUNCTION public.refresh_store_rating();
