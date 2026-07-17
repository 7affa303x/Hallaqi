-- Keep professional social proof synchronized with favorite/follow rows.

CREATE OR REPLACE FUNCTION public.update_professional_follower_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_professional uuid := COALESCE(NEW.professional_id, OLD.professional_id);
BEGIN
  UPDATE public.professionals
  SET followers_count = (
    SELECT COUNT(*)::integer
    FROM public.favorites favorite
    WHERE favorite.professional_id = target_professional
  ),
  updated_at = now()
  WHERE id = target_professional;
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS update_professional_follower_count_trigger ON public.favorites;
CREATE TRIGGER update_professional_follower_count_trigger
  AFTER INSERT OR DELETE ON public.favorites
  FOR EACH ROW EXECUTE FUNCTION public.update_professional_follower_count();

UPDATE public.professionals professional
SET followers_count = (
  SELECT COUNT(*)::integer
  FROM public.favorites favorite
  WHERE favorite.professional_id = professional.id
);
