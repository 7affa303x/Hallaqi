-- Require AAL2 for administrators who enrolled an MFA factor, while allowing
-- existing administrators to configure MFA before enforcement applies.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles profile
    WHERE profile.id = auth.uid()
      AND profile.user_role = 'admin'
  )
  AND (
    NOT EXISTS (
      SELECT 1
      FROM auth.mfa_factors factor
      WHERE factor.user_id = auth.uid()
        AND factor.status = 'verified'
    )
    OR COALESCE(auth.jwt()->>'aal', 'aal1') = 'aal2'
  );
$$;
