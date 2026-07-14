-- Hallaqi Storage Policies
-- Run in Supabase SQL Editor after creating buckets

-- ============================================
-- BUCKET: avatars
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Avatars public read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users upload own avatar" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users update own avatar" ON storage.objects FOR UPDATE USING (
  bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users delete own avatar" ON storage.objects FOR DELETE USING (
  bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================
-- BUCKET: portfolio
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Portfolio public read" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');
CREATE POLICY "Barbers upload own portfolio" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Barbers delete own portfolio" ON storage.objects FOR DELETE USING (
  bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================
-- BUCKET: id-cards
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('id-cards', 'id-cards', false) ON CONFLICT DO NOTHING;

CREATE POLICY "Users read own ID cards" ON storage.objects FOR SELECT USING (
  bucket_id = 'id-cards' AND auth.uid()::text = (storage.foldername(name))[1]
);
CREATE POLICY "Users upload own ID cards" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'id-cards' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================
-- BUCKET: review-images
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('review-images', 'review-images', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Review images public read" ON storage.objects FOR SELECT USING (bucket_id = 'review-images');
CREATE POLICY "Users upload own review images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'review-images' AND auth.uid()::text = (storage.foldername(name))[1]
);
