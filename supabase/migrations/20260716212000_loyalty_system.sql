-- Loyalty points, tiers, rewards, and redemption vouchers.

CREATE TABLE IF NOT EXISTS public.loyalty_accounts (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  points integer NOT NULL DEFAULT 0 CHECK (points >= 0),
  lifetime_points integer NOT NULL DEFAULT 0 CHECK (lifetime_points >= 0),
  tier text NOT NULL DEFAULT 'bronze'
    CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.loyalty_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  points_delta integer NOT NULL CHECK (points_delta <> 0),
  type text NOT NULL CHECK (type IN ('booking', 'redemption', 'adjustment')),
  description text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_loyalty_booking_once
  ON public.loyalty_transactions (booking_id)
  WHERE booking_id IS NOT NULL AND type = 'booking';
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_user
  ON public.loyalty_transactions (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.loyalty_rewards (
  id text PRIMARY KEY,
  title_ar text NOT NULL,
  points_cost integer NOT NULL CHECK (points_cost > 0),
  discount_percent integer NOT NULL CHECK (discount_percent BETWEEN 1 AND 50),
  is_active boolean NOT NULL DEFAULT true
);

INSERT INTO public.loyalty_rewards (id, title_ar, points_cost, discount_percent)
VALUES
  ('discount-5', 'خصم 5%', 100, 5),
  ('discount-10', 'خصم 10%', 200, 10),
  ('discount-15', 'خصم 15%', 350, 15)
ON CONFLICT (id) DO UPDATE SET
  title_ar = EXCLUDED.title_ar,
  points_cost = EXCLUDED.points_cost,
  discount_percent = EXCLUDED.discount_percent;

CREATE TABLE IF NOT EXISTS public.loyalty_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reward_id text NOT NULL REFERENCES public.loyalty_rewards(id),
  voucher_code text NOT NULL UNIQUE DEFAULT upper(substr(md5(gen_random_uuid()::text), 1, 10)),
  status text NOT NULL DEFAULT 'available'
    CHECK (status IN ('available', 'used', 'expired')),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '90 days'),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.loyalty_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own loyalty account"
  ON public.loyalty_accounts FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users read own loyalty transactions"
  ON public.loyalty_transactions FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Active loyalty rewards are public"
  ON public.loyalty_rewards FOR SELECT
  USING (is_active = true);
CREATE POLICY "Users read own redemptions"
  ON public.loyalty_redemptions FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

CREATE OR REPLACE FUNCTION public.loyalty_tier(total_points integer)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE
    WHEN total_points >= 1000 THEN 'platinum'
    WHEN total_points >= 500 THEN 'gold'
    WHEN total_points >= 200 THEN 'silver'
    ELSE 'bronze'
  END;
$$;

CREATE OR REPLACE FUNCTION public.award_booking_loyalty()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  awarded integer := GREATEST(1, FLOOR(NEW.total_price / 100)::integer);
  inserted_points integer;
BEGIN
  IF NEW.status <> 'completed' OR OLD.status = 'completed' OR NEW.client_id IS NULL THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.loyalty_transactions (
    user_id, booking_id, points_delta, type, description
  )
  VALUES (
    NEW.client_id, NEW.id, awarded, 'booking', 'نقاط حجز مكتمل'
  )
  ON CONFLICT (booking_id) WHERE booking_id IS NOT NULL AND type = 'booking'
  DO NOTHING
  RETURNING points_delta INTO inserted_points;

  IF inserted_points IS NOT NULL THEN
    INSERT INTO public.loyalty_accounts (user_id, points, lifetime_points, tier)
    VALUES (
      NEW.client_id,
      inserted_points,
      inserted_points,
      public.loyalty_tier(inserted_points)
    )
    ON CONFLICT (user_id) DO UPDATE SET
      points = public.loyalty_accounts.points + inserted_points,
      lifetime_points = public.loyalty_accounts.lifetime_points + inserted_points,
      tier = public.loyalty_tier(public.loyalty_accounts.lifetime_points + inserted_points),
      updated_at = now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS award_booking_loyalty_trigger ON public.bookings;
CREATE TRIGGER award_booking_loyalty_trigger
  AFTER UPDATE OF status ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.award_booking_loyalty();

CREATE OR REPLACE FUNCTION public.redeem_loyalty_reward(reward text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller uuid := auth.uid();
  cost integer;
  code text;
BEGIN
  IF caller IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;
  SELECT points_cost INTO cost
  FROM public.loyalty_rewards
  WHERE id = reward AND is_active = true;
  IF cost IS NULL THEN
    RAISE EXCEPTION 'Reward not found' USING ERRCODE = 'P0002';
  END IF;

  UPDATE public.loyalty_accounts
  SET points = points - cost, updated_at = now()
  WHERE user_id = caller AND points >= cost;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient loyalty points' USING ERRCODE = 'P0001';
  END IF;

  INSERT INTO public.loyalty_transactions (
    user_id, points_delta, type, description
  ) VALUES (
    caller, -cost, 'redemption', 'استبدال مكافأة ' || reward
  );
  INSERT INTO public.loyalty_redemptions (user_id, reward_id)
  VALUES (caller, reward)
  RETURNING voucher_code INTO code;
  RETURN code;
END;
$$;

REVOKE ALL ON FUNCTION public.redeem_loyalty_reward(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.redeem_loyalty_reward(text) TO authenticated;
