-- ============================================
-- STORAGE BUCKET: payment-receipts
-- Stores CCP/BaridiMob payment receipt images and PDFs
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-receipts', 'payment-receipts', false)
ON CONFLICT DO NOTHING;

-- Clients can upload their own receipts (folder = user_id)
CREATE POLICY "Users upload own receipts"
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'payment-receipts'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Clients can view their own receipts
CREATE POLICY "Users view own receipts"
  ON storage.objects FOR SELECT USING (
    bucket_id = 'payment-receipts'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Professionals can view receipts for their bookings
CREATE POLICY "Professionals view booking receipts"
  ON storage.objects FOR SELECT USING (
    bucket_id = 'payment-receipts'
    AND auth.uid() IN (
      SELECT professional_id FROM bookings
      WHERE bookings.id::text = ANY(
        SELECT (p.metadata->>'booking_id')::text
        FROM payments p
        WHERE p.metadata->>'receipt_url' LIKE '%' || storage.filename(name) || '%'
      )
    )
  );

-- Service role has full access
CREATE POLICY "Service role full access receipts"
  ON storage.objects FOR ALL USING (
    bucket_id = 'payment-receipts'
    AND auth.role() = 'service_role'
  );

-- ============================================
-- ADD receipt_url column to payments table (if not exists)
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'payments' AND column_name = 'receipt_url'
  ) THEN
    ALTER TABLE payments ADD COLUMN receipt_url TEXT;
  END IF;
END $$;

-- ============================================
-- ADD payment_id column to bookings table (if not exists)
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'payment_id'
  ) THEN
    ALTER TABLE bookings ADD COLUMN payment_id UUID REFERENCES payments(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Index for payment_id on bookings
CREATE INDEX IF NOT EXISTS idx_bookings_payment ON bookings(payment_id);
