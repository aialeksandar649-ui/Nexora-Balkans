-- Nexora Balkans: fake reviews for each property (one per property, uses first user in auth)
-- Run AFTER 005_reviews.sql and after at least one user has signed up (Supabase Dashboard → SQL Editor)

INSERT INTO public.reviews (property_id, user_id, rating, comment, created_at)
SELECT
  p.id,
  u.id,
  4 + (floor(random() * 2)::int),  -- 4 or 5
  (array[
    'Amazing stay! The property exceeded our expectations. Clean, comfortable, and in a perfect location.',
    'Beautiful place with great amenities. The host was very responsive and helpful throughout our stay.',
    'Perfect location and wonderful host. Would definitely stay here again on our next visit.',
    'The property was exactly as described. Clean, cozy, and had everything we needed for a comfortable stay.',
    'Great value for money! The place was spotless and the host provided excellent recommendations.',
    'We had a fantastic time! The property is well-maintained and the location is perfect for exploring.',
    'Highly recommend! The host was welcoming and the property had all the amenities we needed.',
    'Wonderful experience from start to finish. The property is beautiful and the location is ideal.',
    'Clean, comfortable, and convenient. The host was very accommodating and made our stay enjoyable.',
    'Excellent stay! The property is well-equipped and the host was very helpful with local tips.',
    'Odličan smeštaj! Sve je bilo čisto i udobno, lokacija savršena.',
    'Prelepo mesto, ljubazni domaćin. Definitivno ćemo se vratiti.'
  ])[1 + (floor(random() * 12)::int)],
  now() - (random() * interval '120 days')
FROM public.properties p
CROSS JOIN (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1) u
ON CONFLICT (property_id, user_id) DO NOTHING;
