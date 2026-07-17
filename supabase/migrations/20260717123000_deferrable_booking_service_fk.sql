-- Allow account-level cascading deletes to remove bookings before checking
-- historical service references, while still protecting standalone service
-- deletion at transaction commit.

ALTER TABLE public.booking_services
  DROP CONSTRAINT IF EXISTS booking_services_service_id_fkey;

ALTER TABLE public.booking_services
  ADD CONSTRAINT booking_services_service_id_fkey
  FOREIGN KEY (service_id)
  REFERENCES public.services(id)
  ON DELETE RESTRICT
  DEFERRABLE INITIALLY DEFERRED;
