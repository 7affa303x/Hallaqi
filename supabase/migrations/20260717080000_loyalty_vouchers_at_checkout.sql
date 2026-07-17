-- Close the loyalty loop by reserving and applying reward vouchers atomically
-- during booking creation.

ALTER TABLE public.loyalty_redemptions
  ADD COLUMN IF NOT EXISTS booking_id uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS used_at timestamptz;

ALTER TABLE public.loyalty_redemptions
  DROP CONSTRAINT IF EXISTS loyalty_redemptions_status_check;
ALTER TABLE public.loyalty_redemptions
  ADD CONSTRAINT loyalty_redemptions_status_check
  CHECK (status IN ('available', 'reserved', 'used', 'expired'));

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS loyalty_redemption_id uuid
    REFERENCES public.loyalty_redemptions(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS discount_amount numeric(10, 2) NOT NULL DEFAULT 0
    CHECK (discount_amount >= 0);

DROP FUNCTION IF EXISTS public.create_booking_with_services(
  uuid, uuid[], timestamptz, text, text, boolean, text
);

CREATE OR REPLACE FUNCTION public.create_booking_with_services(
  professional uuid,
  selected_services uuid[],
  starts_at timestamptz,
  note text DEFAULT NULL,
  payment_method_name text DEFAULT 'cash',
  mobile_service boolean DEFAULT false,
  mobile_address text DEFAULT NULL,
  loyalty_voucher text DEFAULT NULL
)
RETURNS public.bookings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller uuid := auth.uid();
  service_count integer;
  gross_amount numeric(10, 2);
  net_amount numeric(10, 2);
  discount_value numeric(10, 2) := 0;
  total_duration integer;
  primary_service uuid;
  redemption_id uuid;
  reward_discount integer;
  created_booking public.bookings;
BEGIN
  IF caller IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;
  IF selected_services IS NULL OR cardinality(selected_services) = 0 THEN
    RAISE EXCEPTION 'Select at least one service' USING ERRCODE = '22023';
  END IF;
  IF starts_at <= now() THEN
    RAISE EXCEPTION 'Booking must be in the future' USING ERRCODE = '22023';
  END IF;
  IF mobile_service AND COALESCE(trim(mobile_address), '') = '' THEN
    RAISE EXCEPTION 'Mobile service address is required' USING ERRCODE = '22023';
  END IF;

  SELECT
    COUNT(*)::integer,
    COALESCE(SUM(price), 0),
    COALESCE(SUM(duration_minutes), 0),
    (array_agg(id ORDER BY id))[1]
  INTO service_count, gross_amount, total_duration, primary_service
  FROM public.services
  WHERE id = ANY(selected_services)
    AND professional_id = professional
    AND is_active = true;

  IF service_count <> cardinality(selected_services) OR total_duration <= 0 THEN
    RAISE EXCEPTION 'One or more services are unavailable' USING ERRCODE = '22023';
  END IF;

  IF COALESCE(trim(loyalty_voucher), '') <> '' THEN
    SELECT redemption.id, reward.discount_percent
    INTO redemption_id, reward_discount
    FROM public.loyalty_redemptions redemption
    JOIN public.loyalty_rewards reward ON reward.id = redemption.reward_id
    WHERE redemption.user_id = caller
      AND redemption.voucher_code = upper(trim(loyalty_voucher))
      AND redemption.status = 'available'
      AND redemption.expires_at > now()
      AND reward.is_active = true
    FOR UPDATE OF redemption;

    IF redemption_id IS NULL THEN
      RAISE EXCEPTION 'Voucher is invalid or unavailable' USING ERRCODE = '22023';
    END IF;
    discount_value := ROUND(gross_amount * reward_discount / 100.0, 2);
  END IF;

  net_amount := GREATEST(0, gross_amount - discount_value);

  INSERT INTO public.bookings (
    client_id,
    professional_id,
    service_id,
    booking_start_time,
    booking_end_time,
    status,
    total_price,
    payment_status,
    payment_method,
    is_mobile_service,
    service_address,
    notes,
    loyalty_redemption_id,
    discount_amount
  )
  VALUES (
    caller,
    professional,
    primary_service,
    starts_at,
    starts_at + make_interval(mins => total_duration),
    'pending',
    net_amount,
    'pending',
    payment_method_name,
    mobile_service,
    CASE WHEN mobile_service THEN mobile_address ELSE NULL END,
    note,
    redemption_id,
    discount_value
  )
  RETURNING * INTO created_booking;

  INSERT INTO public.booking_services (
    booking_id, service_id, price_snapshot, duration_snapshot
  )
  SELECT created_booking.id, id, price, duration_minutes
  FROM public.services
  WHERE id = ANY(selected_services)
    AND professional_id = professional
    AND is_active = true;

  IF redemption_id IS NOT NULL THEN
    UPDATE public.loyalty_redemptions
    SET status = 'reserved',
        booking_id = created_booking.id,
        used_at = now()
    WHERE id = redemption_id;
  END IF;

  RETURN created_booking;
END;
$$;

REVOKE ALL ON FUNCTION public.create_booking_with_services(
  uuid, uuid[], timestamptz, text, text, boolean, text, text
) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_booking_with_services(
  uuid, uuid[], timestamptz, text, text, boolean, text, text
) TO authenticated;

CREATE OR REPLACE FUNCTION public.sync_booking_loyalty_redemption()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.loyalty_redemption_id IS NULL OR NEW.status IS NOT DISTINCT FROM OLD.status THEN
    RETURN NEW;
  END IF;
  IF NEW.status = 'completed' THEN
    UPDATE public.loyalty_redemptions
    SET status = 'used', used_at = now()
    WHERE id = NEW.loyalty_redemption_id;
  ELSIF NEW.status IN ('cancelled', 'no_show') AND NEW.payment_status <> 'paid' THEN
    UPDATE public.loyalty_redemptions
    SET status = 'available', booking_id = NULL, used_at = NULL
    WHERE id = NEW.loyalty_redemption_id AND status = 'reserved';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sync_booking_loyalty_redemption_trigger ON public.bookings;
CREATE TRIGGER sync_booking_loyalty_redemption_trigger
  AFTER UPDATE OF status ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.sync_booking_loyalty_redemption();
