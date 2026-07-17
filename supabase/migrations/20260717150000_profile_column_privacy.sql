-- Public identity fields remain discoverable, but personal phone/address data
-- is available only through an authenticated self-profile RPC.

CREATE OR REPLACE FUNCTION public.get_own_profile()
RETURNS public.profiles
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT profile
  FROM public.profiles profile
  WHERE profile.id = auth.uid();
$$;

REVOKE ALL ON FUNCTION public.get_own_profile() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_own_profile() TO authenticated;

REVOKE SELECT ON TABLE public.profiles FROM anon, authenticated;
GRANT SELECT (
  id,
  username,
  full_name,
  avatar_url,
  website,
  city,
  country,
  user_role,
  user_status,
  verification_status,
  updated_at
) ON TABLE public.profiles TO anon, authenticated;
