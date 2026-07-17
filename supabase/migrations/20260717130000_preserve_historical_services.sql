-- Professional account deletion keeps service snapshots referenced by past
-- bookings instead of cascading through services and violating history links.

ALTER TABLE public.services
  DROP CONSTRAINT IF EXISTS services_professional_id_fkey;

ALTER TABLE public.services
  ADD CONSTRAINT services_professional_id_fkey
  FOREIGN KEY (professional_id)
  REFERENCES public.professionals(id)
  ON DELETE SET NULL;
