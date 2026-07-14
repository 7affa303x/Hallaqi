-- Hallaqi Seed Data
-- Run this after migration 001 to populate initial data

-- ============================================
-- SEED BARBERS
-- ============================================

INSERT INTO barbers (id, name, avatar, cover_image, bio, email, phone, location, wilaya, is_active, is_verified, is_mobile, uses_scissors, years_of_experience, rating, review_count, followers, likes, tags, services, working_hours, portfolio) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'حسين الحلاق',
  'https://images.unsplash.com/photo-1503951914875-452162b0f77f?w=400',
  'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800',
  'خبير في قصات الشعر العصرية والتقليدية. 15 سنة خبرة.',
  'hussain@hallaqi.dz',
  '0555123456',
  'حي البدر، شارع الأمير عبد القادر',
  'الجزائر العاصمة',
  true, true, false, true, 15, 4.8, 127, 342, 520,
  ARRAY['active', 'scissors-user', 'old-school', 'verified'],
  ARRAY[
    '{"id":"s1","name":"قصة شعر","price":400,"duration":30,"description":"قصة شعر عصرية","category":"haircut"}'::jsonb,
    '{"id":"s2","name":"حلاقة كاملة","price":300,"duration":20,"description":"حلاقة ذقن كاملة","category":"shave"}'::jsonb,
    '{"id":"s3","name":"قص وصبغة","price":1200,"duration":90,"description":"قصة مع صبغة","category":"color"}'::jsonb
  ],
  '{"saturday":{"open":"09:00","close":"20:00","isOpen":true},"sunday":{"open":"09:00","close":"20:00","isOpen":true},"monday":{"open":"09:00","close":"20:00","isOpen":true},"tuesday":{"open":"09:00","close":"20:00","isOpen":true},"wednesday":{"open":"09:00","close":"20:00","isOpen":true},"thursday":{"open":"09:00","close":"20:00","isOpen":true},"friday":{"open":"14:00","close":"20:00","isOpen":true}}'::jsonb,
  ARRAY['https://images.unsplash.com/photo-1503951914875-452162b0f77f?w=400']
),
(
  '22222222-2222-2222-2222-222222222222',
  'أمين بربر شوب',
  'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400',
  'https://images.unsplash.com/photo-1599351431202-0e671340044d?w=800',
  'متخصص في التسريحات الرجالية والعناية بالشعر.',
  'amine@hallaqi.dz',
  '0555234567',
  'باب الزوار',
  'الجزائر العاصمة',
  true, true, true, false, 8, 4.6, 89, 215, 340,
  ARRAY['mobile', 'trending', 'verified'],
  ARRAY[
    '{"id":"s4","name":"قصة كلاسيكية","price":350,"duration":25,"description":"قصة كلاسيكية أنيقة","category":"haircut"}'::jsonb,
    '{"id":"s5","name":"تشذيب اللحية","price":250,"duration":15,"description":"تشذيب وتصفيف","category":"beard"}'::jsonb,
    '{"id":"s6","name":"غسل وتدليك","price":200,"duration":20,"description":"غسل شامبو وتدليك","category":"care"}'::jsonb
  ],
  '{"saturday":{"open":"10:00","close":"22:00","isOpen":true},"sunday":{"open":"10:00","close":"22:00","isOpen":true},"monday":{"open":"10:00","close":"22:00","isOpen":true},"tuesday":{"open":"10:00","close":"22:00","isOpen":true},"wednesday":{"open":"10:00","close":"22:00","isOpen":true},"thursday":{"open":"10:00","close":"22:00","isOpen":true},"friday":{"open":"15:00","close":"21:00","isOpen":true}}'::jsonb,
  ARRAY['https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400']
),
(
  '33333333-3333-3333-3333-333333333333',
  'كمال فايد',
  'https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=400',
  'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800',
  'حلاق متنقل يأتي لباب بيتك. خدمة ممتازة وسريعة.',
  'kamel@hallaqi.dz',
  '0555345678',
  'الرويبة',
  'الجزائر العاصمة',
  true, false, true, true, 5, 4.2, 45, 120, 180,
  ARRAY['mobile', 'new'],
  ARRAY[
    '{"id":"s7","name":"قصة سريعة","price":250,"duration":15,"description":"قصة سريعة","category":"haircut"}'::jsonb,
    '{"id":"s8","name":"حلاقة منزلية","price":500,"duration":45,"description":"خدمة متنقلة","category":"shave"}'::jsonb
  ],
  '{"saturday":{"open":"08:00","close":"21:00","isOpen":true},"sunday":{"open":"08:00","close":"21:00","isOpen":true},"monday":{"open":"08:00","close":"21:00","isOpen":true},"tuesday":{"open":"08:00","close":"21:00","isOpen":true},"wednesday":{"open":"08:00","close":"21:00","isOpen":true},"thursday":{"open":"08:00","close":"21:00","isOpen":true},"friday":{"open":"13:00","close":"19:00","isOpen":true}}'::jsonb,
  ARRAY['https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=400']
),
(
  '44444444-4444-4444-4444-444444444444',
  'سفيان ستوديو',
  'https://images.unsplash.com/photo-1599351431615-178898507c43?w=400',
  'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800',
  'صالون فاخر بتصميم عصري. خدمات VIP.',
  'sofiane@hallaqi.dz',
  '0555456789',
  'المرادية',
  'الجزائر العاصمة',
  true, true, false, false, 12, 4.9, 203, 567, 890,
  ARRAY['active', 'trending', 'verified', 'luxury'],
  ARRAY[
    '{"id":"s9","name":"VIP قصة","price":800,"duration":45,"description":"قصة فاخرة مع استشارة","category":"haircut"}'::jsonb,
    '{"id":"s10","name":"عناية كاملة","price":1500,"duration":90,"description":"باقة العناية الكاملة","category":"care"}'::jsonb,
    '{"id":"s11","name":"صبغة احترافية","price":2000,"duration":120,"description":"صبغة احترافية","category":"color"}'::jsonb,
    '{"id":"s12","name":"تسريحة مناسبة","price":1000,"duration":60,"description":"تسريحة للمناسبات","category":"styling"}'::jsonb
  ],
  '{"saturday":{"open":"09:00","close":"21:00","isOpen":true},"sunday":{"open":"09:00","close":"21:00","isOpen":true},"monday":{"open":"09:00","close":"21:00","isOpen":true},"tuesday":{"open":"09:00","close":"21:00","isOpen":true},"wednesday":{"open":"09:00","close":"21:00","isOpen":true},"thursday":{"open":"09:00","close":"21:00","isOpen":true},"friday":{"open":"14:00","close":"20:00","isOpen":true}}'::jsonb,
  ARRAY['https://images.unsplash.com/photo-1599351431615-178898507c43?w=400']
);

-- ============================================
-- SEED FORUM POSTS
-- ============================================

-- Note: forum_posts require valid user_id references.
-- These will be inserted after first user signup via trigger or manually.
-- For now, the app will show empty forum until real users post.
