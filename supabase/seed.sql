-- Nexora Balkans: seed properties (run after 001_create_properties.sql)
-- Run in Supabase Dashboard → SQL Editor

INSERT INTO public.properties (image_url, images, location, lat, lng, title, description, price, rating, dates, guests, bedrooms, beds, bathrooms, amenities, category, host, reviews, check_in, check_out)
VALUES
(
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80',
  '["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1600585152915-d208867a1?w=800","https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800","https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800"]'::jsonb,
  'Mostar, Bosnia and Herzegovina', 43.3438, 17.8078,
  'Historic Ottoman House with Neretva River View',
  'Step back in time at this beautifully restored 17th-century Ottoman house overlooking the iconic Stari Most bridge and the emerald Neretva River.',
  95, 0, 'May 10-15', 4, 2, 2, 1.5,
  '["WiFi","Kitchen","Air Conditioning","Heating","Washer","TV","Parking","Balcony","River View","Historic Building"]'::jsonb,
  '["Historic","City","Mansions"]'::jsonb,
  '{"name":"Amira","isSuperhost":true,"hostingSince":"4 years hosting","avatar":"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100","responseTime":"Within an hour","responseRate":98}'::jsonb,
  0, 0, '3:00 PM', '11:00 AM'
),
(
  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&auto=format&fit=crop&q=80',
  '["https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800","https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800","https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800"]'::jsonb,
  'Kotor, Montenegro', 42.4247, 18.7712,
  'Charming Stone House in Old Town',
  'Discover the magic of medieval Kotor from this enchanting stone house nestled within the UNESCO World Heritage Old Town.',
  120, 0, 'Jun 5-10', 3, 1, 2, 1,
  '["WiFi","Kitchen","Heating","TV","Historic Building","Courtyard","City Center","Mountain View","Restaurant Nearby"]'::jsonb,
  '["Historic","City","Cabins"]'::jsonb,
  '{"name":"Marko","isSuperhost":true,"hostingSince":"5 years hosting","avatar":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100","responseTime":"Within an hour","responseRate":100}'::jsonb,
  0, 0, '2:00 PM', '10:00 AM'
),
(
  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&auto=format&fit=crop&q=80',
  '["https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800","https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800","https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800"]'::jsonb,
  'Belgrade, Serbia', 44.7866, 20.4489,
  'Modern Loft in Savamala District',
  'Experience Belgrade''s vibrant creative scene from this stunning industrial loft in the trendy Savamala district.',
  85, 0, 'Apr 12-17', 2, 1, 1, 1,
  '["WiFi","Kitchen","Air Conditioning","Heating","Washer","TV","Workspace","City View","Nightlife","Art District"]'::jsonb,
  '["City","Lofts"]'::jsonb,
  '{"name":"Stefan","isSuperhost":true,"hostingSince":"3 years hosting","avatar":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100","responseTime":"Within 2 hours","responseRate":95}'::jsonb,
  76, '3:00 PM', '11:00 AM'
),
(
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop&q=80',
  '["https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800","https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800","https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800"]'::jsonb,
  'Ljubljana, Slovenia', 46.0569, 14.5058,
  'Cozy Apartment near Ljubljana Castle',
  'Nestled in Ljubljana''s charming Old Town, this beautifully renovated apartment offers the perfect base for exploring Slovenia''s capital.',
  110, 0, 'May 20-25', 4, 2, 2, 1,
  '["WiFi","Kitchen","Air Conditioning","Heating","Washer","TV","City View","Historic Area","Family Friendly","Restaurant Nearby"]'::jsonb,
  '["City"]'::jsonb,
  '{"name":"Ana","isSuperhost":true,"hostingSince":"6 years hosting","avatar":"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100","responseTime":"Within an hour","responseRate":99}'::jsonb,
  0, 0, '3:00 PM', '11:00 AM'
),
(
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80',
  '["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800","https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800","https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800"]'::jsonb,
  'Sarajevo, Bosnia and Herzegovina', 43.8516, 18.3867,
  'Traditional Bosnian Home with Mountain Views',
  'Experience authentic Bosnian hospitality in this traditional family home set against the stunning backdrop of the Dinaric Alps.',
  78, 0, 'Jul 8-13', 5, 3, 3, 2,
  '["WiFi","Kitchen","Heating","Washer","TV","Garden","Parking","Mountain View","Family Friendly","Traditional Architecture"]'::jsonb,
  '["Mountains","Historic","Mansions"]'::jsonb,
  '{"name":"Emir","isSuperhost":false,"hostingSince":"2 years hosting","avatar":"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100","responseTime":"Within 3 hours","responseRate":92}'::jsonb,
  0, 0, '2:00 PM', '10:00 AM'
),
(
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&auto=format&fit=crop&q=80',
  '["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800","https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800","https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800"]'::jsonb,
  'Tirana, Albania', 41.3275, 19.8187,
  'Contemporary Studio in Blloku District',
  'Discover Tirana''s trendy Blloku district from this stylish, modern studio apartment.',
  65, 0, 'Aug 15-20', 2, 1, 1, 1,
  '["WiFi","Kitchen","Air Conditioning","Heating","TV","City View","Nightlife","Restaurant Nearby","Modern Design","Central Location"]'::jsonb,
  '["City"]'::jsonb,
  '{"name":"Altin","isSuperhost":false,"hostingSince":"1 year hosting","avatar":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100","responseTime":"Within 2 hours","responseRate":88}'::jsonb,
  0, 0, '3:00 PM', '11:00 AM'
),
(
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
  '["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800","https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800","https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800"]'::jsonb,
  'Ohrid, North Macedonia', 41.1171, 20.8018,
  'Lakefront Villa with Private Beach',
  'Indulge in luxury at this stunning lakefront villa on the shores of Lake Ohrid, one of Europe''s oldest and deepest lakes.',
  145, 0, 'Jun 22-27', 6, 3, 4, 2,
  '["WiFi","Kitchen","Air Conditioning","Heating","Washer","TV","Private Beach","Lake View","Garden","Parking","BBQ","Family Friendly"]'::jsonb,
  '["Beach","Mansions"]'::jsonb,
  '{"name":"Elena","isSuperhost":true,"hostingSince":"7 years hosting","avatar":"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100","responseTime":"Within an hour","responseRate":100}'::jsonb,
  0, 0, '4:00 PM', '10:00 AM'
),
(
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=80',
  '["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800","https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800","https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800"]'::jsonb,
  'Plitvice Lakes, Croatia', 44.8654, 15.5820,
  'Rustic Cabin near National Park',
  'Escape to nature in this charming rustic cabin located just minutes from Plitvice Lakes National Park, a UNESCO World Heritage site.',
  135, 0, 'Sep 5-10', 4, 2, 3, 1,
  '["WiFi","Kitchen","Heating","Fireplace","TV","Garden","Parking","Nature","Hiking","National Park Nearby","Mountain View"]'::jsonb,
  '["Cabins","Mountains","Countryside"]'::jsonb,
  '{"name":"Ivan","isSuperhost":true,"hostingSince":"5 years hosting","avatar":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100","responseTime":"Within 2 hours","responseRate":96}'::jsonb,
  167, '3:00 PM', '11:00 AM'
),
(
  'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&auto=format&fit=crop&q=80',
  '["https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800","https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800","https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"]'::jsonb,
  'Skopje, North Macedonia', 41.9973, 21.4280,
  'Urban Apartment in City Center',
  'Experience modern Skopje from this sleek, centrally located apartment in the heart of the capital.',
  72, 0, 'Oct 10-15', 3, 1, 2, 1,
  '["WiFi","Kitchen","Air Conditioning","Heating","Washer","TV","Workspace","City View","Central Location","Business Travel"]'::jsonb,
  '["City"]'::jsonb,
  '{"name":"Nikola","isSuperhost":false,"hostingSince":"2 years hosting","avatar":"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100","responseTime":"Within 2 hours","responseRate":90}'::jsonb,
  0, 0, '3:00 PM', '11:00 AM'
),
(
  'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&auto=format&fit=crop&q=80',
  '["https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800","https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800","https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800"]'::jsonb,
  'Budva, Montenegro', 42.2851, 18.8406,
  'Beachfront Apartment with Sea Views',
  'Wake up to the sound of waves at this stunning beachfront apartment overlooking the Adriatic Sea.',
  155, 0, 'Jul 1-6', 4, 2, 2, 1.5,
  '["WiFi","Kitchen","Air Conditioning","Heating","Washer","TV","Beach Access","Sea View","Balcony","Beachfront","Restaurant Nearby"]'::jsonb,
  '["Beach"]'::jsonb,
  '{"name":"Luka","isSuperhost":true,"hostingSince":"4 years hosting","avatar":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100","responseTime":"Within an hour","responseRate":97}'::jsonb,
  0, 0, '3:00 PM', '11:00 AM'
),
(
  'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800&auto=format&fit=crop&q=80',
  '["https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800","https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800","https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"]'::jsonb,
  'Zagreb, Croatia', 45.8150, 15.9819,
  'Historic Apartment in Upper Town',
  'Immerse yourself in Zagreb''s rich history from this beautifully restored apartment in the Upper Town (Gornji Grad).',
  105, 0, 'Apr 25-30', 3, 1, 2, 1,
  '["WiFi","Kitchen","Air Conditioning","Heating","Washer","TV","Historic Building","City View","Cultural District","Museum Nearby"]'::jsonb,
  '["Historic","City"]'::jsonb,
  '{"name":"Petra","isSuperhost":true,"hostingSince":"3 years hosting","avatar":"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100","responseTime":"Within an hour","responseRate":98}'::jsonb,
  0, 0, '3:00 PM', '11:00 AM'
),
(
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80',
  '["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800","https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800","https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800"]'::jsonb,
  'Novi Sad, Serbia', 45.2671, 19.8335,
  'Charming Flat near Petrovaradin Fortress',
  'Discover Novi Sad, Serbia''s cultural capital, from this charming flat located in the shadow of the historic Petrovaradin Fortress.',
  68, 0, 'May 5-10', 2, 1, 1, 1,
  '["WiFi","Kitchen","Air Conditioning","Heating","TV","City View","Historic Area","Cultural District","River Nearby","Festival Area"]'::jsonb,
  '["City"]'::jsonb,
  '{"name":"Dusan","isSuperhost":false,"hostingSince":"1 year hosting","avatar":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100","responseTime":"Within 3 hours","responseRate":85}'::jsonb,
  0, 0, '3:00 PM', '11:00 AM'
);
