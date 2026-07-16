-- Complete remaining operational foundation workflows.

DROP POLICY IF EXISTS "Admins update bookings" ON public.bookings;
CREATE POLICY "Admins update bookings"
  ON public.bookings FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE TABLE IF NOT EXISTS public.id_verification_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_path text NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason text,
  reviewed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_id_verification_one_pending
  ON public.id_verification_requests (user_id)
  WHERE status = 'pending';

ALTER TABLE public.id_verification_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users create own verification request" ON public.id_verification_requests;
CREATE POLICY "Users create own verification request"
  ON public.id_verification_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND status = 'pending');
DROP POLICY IF EXISTS "Users read own verification requests" ON public.id_verification_requests;
CREATE POLICY "Users read own verification requests"
  ON public.id_verification_requests FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());
DROP POLICY IF EXISTS "Admins update verification requests" ON public.id_verification_requests;
CREATE POLICY "Admins update verification requests"
  ON public.id_verification_requests FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP TRIGGER IF EXISTS update_id_verification_requests_updated_at
  ON public.id_verification_requests;
CREATE TRIGGER update_id_verification_requests_updated_at
  BEFORE UPDATE ON public.id_verification_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.review_id_verification(
  request_id uuid,
  approve boolean,
  reason text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user uuid;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Administrator access required' USING ERRCODE = '42501';
  END IF;

  UPDATE public.id_verification_requests
  SET
    status = CASE WHEN approve THEN 'approved' ELSE 'rejected' END,
    rejection_reason = CASE WHEN approve THEN NULL ELSE reason END,
    reviewed_by = auth.uid(),
    reviewed_at = now(),
    updated_at = now()
  WHERE id = request_id AND status = 'pending'
  RETURNING user_id INTO target_user;

  IF target_user IS NULL THEN
    RAISE EXCEPTION 'Pending verification request not found' USING ERRCODE = 'P0002';
  END IF;

  UPDATE public.profiles
  SET verification_status = CASE WHEN approve THEN 'verified' ELSE 'unverified' END,
      updated_at = now()
  WHERE id = target_user;

  UPDATE public.professionals
  SET has_id_card = true,
      id_card_verified = approve,
      updated_at = now()
  WHERE id = target_user;
END;
$$;

REVOKE ALL ON FUNCTION public.review_id_verification(uuid, boolean, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.review_id_verification(uuid, boolean, text) TO authenticated;

CREATE TABLE IF NOT EXISTS public.professional_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  professional_id uuid NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  reason text NOT NULL CHECK (char_length(reason) BETWEEN 3 AND 1000),
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'reviewed', 'dismissed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_professional_reports_status
  ON public.professional_reports (status, created_at DESC);

ALTER TABLE public.professional_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users create professional reports" ON public.professional_reports;
CREATE POLICY "Users create professional reports"
  ON public.professional_reports FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reporter_id);
DROP POLICY IF EXISTS "Users read own professional reports" ON public.professional_reports;
CREATE POLICY "Users read own professional reports"
  ON public.professional_reports FOR SELECT TO authenticated
  USING (auth.uid() = reporter_id OR public.is_admin());
DROP POLICY IF EXISTS "Admins update professional reports" ON public.professional_reports;
CREATE POLICY "Admins update professional reports"
  ON public.professional_reports FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP TRIGGER IF EXISTS update_professional_reports_updated_at ON public.professional_reports;
CREATE TRIGGER update_professional_reports_updated_at
  BEFORE UPDATE ON public.professional_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id text PRIMARY KEY,
  name_ar text NOT NULL,
  price_dzd numeric(10, 2) NOT NULL CHECK (price_dzd >= 0),
  billing_period text NOT NULL DEFAULT 'monthly',
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.subscription_plans (id, name_ar, price_dzd, features)
VALUES
  ('free', 'مجاني', 0, '["البحث والحجز","المشاركة في المنتدى"]'::jsonb),
  ('basic', 'أساسي', 500, '["حجوزات غير محدودة","رسائل غير محدودة","إحصائيات أساسية"]'::jsonb),
  ('pro', 'احترافي', 1000, '["ظهور مميز","تحليلات متقدمة","دعم أولوية"]'::jsonb),
  ('premium', 'بريميوم', 2000, '["كل مزايا احترافي","شارة بريميوم","أولوية الظهور"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name_ar = EXCLUDED.name_ar,
  price_dzd = EXCLUDED.price_dzd,
  features = EXCLUDED.features,
  updated_at = now();

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Subscription plans are public" ON public.subscription_plans;
CREATE POLICY "Subscription plans are public"
  ON public.subscription_plans FOR SELECT USING (is_active = true);

CREATE TABLE IF NOT EXISTS public.subscription_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id text NOT NULL REFERENCES public.subscription_plans(id),
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'rejected', 'cancelled', 'expired')),
  payment_provider text,
  payment_reference text,
  starts_at timestamptz,
  expires_at timestamptz,
  reviewed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_subscription_one_open_request
  ON public.subscription_requests (user_id)
  WHERE status IN ('pending', 'active');

ALTER TABLE public.subscription_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users create own subscription requests" ON public.subscription_requests;
CREATE POLICY "Users create own subscription requests"
  ON public.subscription_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND status = 'pending');
DROP POLICY IF EXISTS "Users read own subscription requests" ON public.subscription_requests;
CREATE POLICY "Users read own subscription requests"
  ON public.subscription_requests FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());
DROP POLICY IF EXISTS "Admins update subscription requests" ON public.subscription_requests;
CREATE POLICY "Admins update subscription requests"
  ON public.subscription_requests FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP TRIGGER IF EXISTS update_subscription_plans_updated_at ON public.subscription_plans;
CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS update_subscription_requests_updated_at ON public.subscription_requests;
CREATE TRIGGER update_subscription_requests_updated_at
  BEFORE UPDATE ON public.subscription_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
