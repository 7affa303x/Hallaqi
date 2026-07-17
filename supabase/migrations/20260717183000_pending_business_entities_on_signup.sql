-- Create pending business entity rows at signup so sellers can prepare
-- before admin approval (products still gated by RLS + approval_status).

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  account_type text := COALESCE(NEW.raw_user_meta_data->>'account_type', 'client');
  requested_role public.user_role := CASE account_type
    WHEN 'barber' THEN 'barber'::public.user_role
    WHEN 'store' THEN 'store'::public.user_role
    WHEN 'company' THEN 'company'::public.user_role
    WHEN 'doctor' THEN 'doctor'::public.user_role
    ELSE 'client'::public.user_role
  END;
  display_name text := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    NEW.email
  );
BEGIN
  INSERT INTO public.profiles (
    id, full_name, avatar_url, user_role, user_status, verification_status
  )
  VALUES (
    NEW.id,
    display_name,
    NEW.raw_user_meta_data->>'avatar_url',
    requested_role,
    CASE
      WHEN requested_role IN ('store', 'company', 'doctor') THEN 'pending'::public.user_status
      ELSE 'active'::public.user_status
    END,
    'unverified'
  )
  ON CONFLICT (id) DO NOTHING;

  IF requested_role = 'barber' THEN
    INSERT INTO public.professionals (id, business_name, business_email)
    VALUES (NEW.id, display_name, NEW.email)
    ON CONFLICT (id) DO NOTHING;
  ELSIF requested_role = 'store' THEN
    INSERT INTO public.stores (id, store_name, short_description, approval_status)
    VALUES (NEW.id, display_name, 'متجر جديد بانتظار الموافقة', 'pending')
    ON CONFLICT (id) DO NOTHING;
  ELSIF requested_role = 'company' THEN
    INSERT INTO public.companies (id, company_name, short_description, approval_status)
    VALUES (NEW.id, display_name, 'شركة جديدة بانتظار الموافقة', 'pending')
    ON CONFLICT (id) DO NOTHING;
  ELSIF requested_role = 'doctor' THEN
    INSERT INTO public.doctor_profiles (
      id, display_name, specialty, free_verification, verification_status, trusted_badge
    )
    VALUES (
      NEW.id,
      display_name,
      COALESCE(NEW.raw_user_meta_data->>'specialty', 'dermatologist'),
      true,
      'pending',
      false
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;
