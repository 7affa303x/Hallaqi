-- Secure subscription review and entitlement activation.

ALTER TABLE public.subscription_requests
  ADD COLUMN IF NOT EXISTS rejection_reason text;

CREATE OR REPLACE FUNCTION public.review_subscription_request(
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
  target_plan text;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Administrator access required' USING ERRCODE = '42501';
  END IF;

  UPDATE public.subscription_requests
  SET
    status = CASE WHEN approve THEN 'active' ELSE 'rejected' END,
    rejection_reason = CASE WHEN approve THEN NULL ELSE reason END,
    reviewed_by = auth.uid(),
    starts_at = CASE WHEN approve THEN now() ELSE NULL END,
    expires_at = CASE WHEN approve THEN now() + interval '30 days' ELSE NULL END,
    updated_at = now()
  WHERE id = request_id
    AND status = 'pending'
  RETURNING user_id, plan_id INTO target_user, target_plan;

  IF target_user IS NULL THEN
    RAISE EXCEPTION 'Pending subscription request not found' USING ERRCODE = 'P0002';
  END IF;

  IF approve THEN
    UPDATE public.professionals
    SET
      is_subscribed = target_plan <> 'free',
      subscription_plan = CASE WHEN target_plan = 'free' THEN NULL ELSE target_plan END,
      updated_at = now()
    WHERE id = target_user;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.review_subscription_request(uuid, boolean, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.review_subscription_request(uuid, boolean, text) TO authenticated;
