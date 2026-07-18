-- Placement request queue for marketplace monetization (no commissions).
CREATE TABLE IF NOT EXISTS public.marketplace_placement_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES public.marketplace_sellers(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.marketplace_products(id) ON DELETE SET NULL,
  placement_type public.marketplace_placement_type NOT NULL,
  bid_amount_dzd numeric(12,2) NOT NULL DEFAULT 0,
  title text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'rejected', 'expired')),
  reviewed_by uuid REFERENCES public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_marketplace_placement_requests_status
  ON public.marketplace_placement_requests(status, created_at DESC);

ALTER TABLE public.marketplace_placement_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Sellers manage own placement requests" ON public.marketplace_placement_requests;
CREATE POLICY "Sellers manage own placement requests"
  ON public.marketplace_placement_requests FOR ALL
  USING (seller_id = auth.uid() OR public.is_admin())
  WITH CHECK (seller_id = auth.uid() OR public.is_admin());

DROP TRIGGER IF EXISTS update_marketplace_placement_requests_updated_at ON public.marketplace_placement_requests;
CREATE TRIGGER update_marketplace_placement_requests_updated_at
  BEFORE UPDATE ON public.marketplace_placement_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.admin_review_marketplace_placement(request_id uuid, approve boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  req record;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Admin only' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO req FROM public.marketplace_placement_requests WHERE id = request_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Request not found';
  END IF;

  IF NOT approve THEN
    UPDATE public.marketplace_placement_requests
    SET status = 'rejected', reviewed_by = auth.uid(), reviewed_at = now(), updated_at = now()
    WHERE id = request_id;
    RETURN;
  END IF;

  UPDATE public.marketplace_placement_requests
  SET status = 'active', reviewed_by = auth.uid(), reviewed_at = now(), updated_at = now()
  WHERE id = request_id;

  IF req.placement_type = 'product_of_the_day' AND req.product_id IS NOT NULL THEN
    PERFORM public.admin_set_product_of_the_day(req.product_id, req.bid_amount_dzd);
  ELSIF req.product_id IS NOT NULL THEN
    UPDATE public.marketplace_products
    SET
      is_featured = CASE WHEN req.placement_type IN ('featured_product', 'sponsored') THEN true ELSE is_featured END,
      is_premium_visibility = CASE WHEN req.placement_type IN ('premium_badge', 'sponsored') THEN true ELSE is_premium_visibility END,
      updated_at = now()
    WHERE id = req.product_id;
  END IF;

  INSERT INTO public.marketplace_placements (
    placement_type, seller_id, product_id, title, bid_amount_dzd, is_active, created_by
  ) VALUES (
    req.placement_type, req.seller_id, req.product_id, req.title, req.bid_amount_dzd, true, auth.uid()
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_review_marketplace_placement(uuid, boolean) TO authenticated;
