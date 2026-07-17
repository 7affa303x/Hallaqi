-- PostgreSQL RESTRICT actions are always immediate. NO ACTION honors the
-- deferred constraint and lets account cascades remove booking snapshots first.

ALTER TABLE public.booking_services
  DROP CONSTRAINT IF EXISTS booking_services_service_id_fkey;

ALTER TABLE public.booking_services
  ADD CONSTRAINT booking_services_service_id_fkey
  FOREIGN KEY (service_id)
  REFERENCES public.services(id)
  ON DELETE NO ACTION
  DEFERRABLE INITIALLY DEFERRED;
