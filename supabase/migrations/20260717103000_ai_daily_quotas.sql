-- Per-user daily AI quotas enforced in Postgres before any paid model call.

CREATE TABLE IF NOT EXISTS public.ai_usage_daily (
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  usage_date date NOT NULL DEFAULT current_date,
  feature text NOT NULL CHECK (feature IN ('advice', 'style-image')),
  request_count integer NOT NULL DEFAULT 0 CHECK (request_count >= 0),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, usage_date, feature)
);

ALTER TABLE public.ai_usage_daily ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.consume_ai_quota(ai_feature text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller uuid := auth.uid();
  daily_limit integer;
  updated_count integer;
BEGIN
  IF caller IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;
  daily_limit := CASE
    WHEN ai_feature = 'advice' THEN 20
    WHEN ai_feature = 'style-image' THEN 3
    ELSE 0
  END;
  IF daily_limit = 0 THEN
    RAISE EXCEPTION 'Unknown AI feature' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.ai_usage_daily (
    user_id, usage_date, feature, request_count
  )
  VALUES (caller, current_date, ai_feature, 1)
  ON CONFLICT (user_id, usage_date, feature) DO UPDATE SET
    request_count = public.ai_usage_daily.request_count + 1,
    updated_at = now()
  WHERE public.ai_usage_daily.request_count < daily_limit
  RETURNING request_count INTO updated_count;

  RETURN updated_count IS NOT NULL AND updated_count <= daily_limit;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_ai_quota(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.consume_ai_quota(text) TO authenticated;
