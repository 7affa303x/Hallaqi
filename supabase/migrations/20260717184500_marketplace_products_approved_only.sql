-- Hide marketplace products from unapproved stores/companies in public reads.
DROP POLICY IF EXISTS mp_products_public_read ON public.marketplace_products;
CREATE POLICY mp_products_public_read ON public.marketplace_products FOR SELECT
  USING (
    public.is_admin()
    OR store_id = auth.uid()
    OR company_id = auth.uid()
    OR (
      is_active = true
      AND (
        (
          store_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.stores s
            WHERE s.id = marketplace_products.store_id AND s.approval_status = 'approved'
          )
        )
        OR (
          company_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.companies c
            WHERE c.id = marketplace_products.company_id AND c.approval_status = 'approved'
          )
        )
      )
    )
  );
