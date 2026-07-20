-- Soft-launch: allow authenticated users to switch among client / barber / store
-- without admin approval. Doctor/company/admin remain blocked.

CREATE OR REPLACE FUNCTION public.switch_own_account_type(new_role text)
RETURNS public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_id uuid := auth.uid();
  allowed text[] := ARRAY['client', 'barber', 'store'];
  updated_row public.profiles;
  caller_name text;
BEGIN
  IF caller_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501';
  END IF;

  IF new_role IS NULL OR NOT (new_role = ANY (allowed)) THEN
    RAISE EXCEPTION 'Allowed roles: client, barber, store' USING ERRCODE = '22023';
  END IF;

  -- Bypass protect_profile_privileged_fields via security definer + service-like update
  UPDATE public.profiles
  SET
    user_role = new_role::public.user_role,
    updated_at = now()
  WHERE id = caller_id
  RETURNING * INTO updated_row;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found' USING ERRCODE = 'P0002';
  END IF;

  IF new_role = 'barber' THEN
    SELECT full_name INTO caller_name FROM public.profiles WHERE id = caller_id;
    INSERT INTO public.professionals (id, business_name)
    VALUES (caller_id, COALESCE(caller_name, 'حلاق'))
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN updated_row;
END;
$$;

REVOKE ALL ON FUNCTION public.switch_own_account_type(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.switch_own_account_type(text) TO authenticated;
