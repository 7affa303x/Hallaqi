-- Harden signup trigger so auth.users inserts never fail due to profile side-effects.
-- Also ensure marketplace seller rows get required defaults.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requested_role public.user_role;
  meta_type text := lower(COALESCE(NEW.raw_user_meta_data->>'account_type', 'client'));
  display text;
BEGIN
  display := COALESCE(
    NULLIF(trim(NEW.raw_user_meta_data->>'full_name'), ''),
    NULLIF(trim(NEW.raw_user_meta_data->>'name'), ''),
    NEW.email,
    'مستخدم حلاقي'
  );

  requested_role := CASE meta_type
    WHEN 'barber' THEN 'barber'::public.user_role
    WHEN 'store' THEN 'store'::public.user_role
    WHEN 'company' THEN 'company'::public.user_role
    WHEN 'doctor' THEN 'doctor'::public.user_role
    ELSE 'client'::public.user_role
  END;

  BEGIN
    INSERT INTO public.profiles (
      id, full_name, avatar_url, user_role, user_status, verification_status
    )
    VALUES (
      NEW.id,
      display,
      NEW.raw_user_meta_data->>'avatar_url',
      requested_role,
      'active',
      'unverified'
    )
    ON CONFLICT (id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user profiles insert failed for %: %', NEW.id, SQLERRM;
    -- Last-resort minimal profile so auth signup can complete
    BEGIN
      INSERT INTO public.profiles (id, full_name, user_role, user_status, verification_status)
      VALUES (NEW.id, display, 'client', 'active', 'unverified')
      ON CONFLICT (id) DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'handle_new_user minimal profile failed for %: %', NEW.id, SQLERRM;
    END;
  END;

  BEGIN
    IF requested_role = 'barber' THEN
      INSERT INTO public.professionals (id, business_name, business_email)
      VALUES (NEW.id, display, NEW.email)
      ON CONFLICT (id) DO NOTHING;
    ELSIF requested_role IN ('store', 'company', 'doctor') THEN
      INSERT INTO public.marketplace_sellers (
        id, seller_type, display_name, contact_email, approval_status,
        is_company_badge, listing_cap, subscription_plan,
        social_links, delivery_areas
      )
      VALUES (
        NEW.id,
        requested_role::text::public.marketplace_seller_type,
        display,
        NEW.email,
        'pending',
        requested_role = 'company',
        12,
        'free',
        '{}'::jsonb,
        '{}'::text[]
      )
      ON CONFLICT (id) DO NOTHING;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user role side-table failed for % (%): %', NEW.id, requested_role, SQLERRM;
  END;

  RETURN NEW;
END;
$$;

-- Ensure trigger still points at the hardened function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
