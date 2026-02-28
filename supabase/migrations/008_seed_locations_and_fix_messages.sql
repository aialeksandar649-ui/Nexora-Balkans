-- Nexora: Seed lat/lng for all properties, fix messages RLS

-- 0. Ensure lat, lng columns exist (in case 006 wasn't run)
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS lat numeric;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS lng numeric;

-- 1. Update properties with coordinates based on location
UPDATE public.properties SET lat = 43.3438, lng = 17.8078 WHERE location ILIKE '%Mostar%';
UPDATE public.properties SET lat = 42.4247, lng = 18.7712 WHERE location ILIKE '%Kotor%';
UPDATE public.properties SET lat = 44.7866, lng = 20.4489 WHERE location ILIKE '%Belgrade%';
UPDATE public.properties SET lat = 46.0569, lng = 14.5058 WHERE location ILIKE '%Ljubljana%';
UPDATE public.properties SET lat = 43.8516, lng = 18.3867 WHERE location ILIKE '%Sarajevo%';
UPDATE public.properties SET lat = 41.3275, lng = 19.8187 WHERE location ILIKE '%Tirana%';
UPDATE public.properties SET lat = 41.1171, lng = 20.8018 WHERE location ILIKE '%Ohrid%';
UPDATE public.properties SET lat = 44.8654, lng = 15.5820 WHERE location ILIKE '%Plitvice%';
UPDATE public.properties SET lat = 41.9973, lng = 21.4280 WHERE location ILIKE '%Skopje%';
UPDATE public.properties SET lat = 42.2851, lng = 18.8406 WHERE location ILIKE '%Budva%';
UPDATE public.properties SET lat = 45.8150, lng = 15.9819 WHERE location ILIKE '%Zagreb%';
UPDATE public.properties SET lat = 45.2671, lng = 19.8335 WHERE location ILIKE '%Novi Sad%';

-- 2. Add UPDATE policy for conversations (only if tables exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conversations') THEN
    DROP POLICY IF EXISTS "Participants update conversations" ON public.conversations;
    CREATE POLICY "Participants update conversations" ON public.conversations
      FOR UPDATE USING (
        auth.uid() = guest_id
        OR auth.uid() IN (SELECT user_id FROM public.properties WHERE id = property_id AND user_id = auth.uid())
      );
  END IF;
END $$;

-- 3. Simplify messages INSERT policy (only if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'messages') THEN
    DROP POLICY IF EXISTS "Participants insert messages" ON public.messages;
    CREATE POLICY "Participants insert messages" ON public.messages
      FOR INSERT WITH CHECK (
        auth.uid() = sender_id
        AND EXISTS (
          SELECT 1 FROM public.conversations c
          WHERE c.id = conversation_id
            AND (c.guest_id = auth.uid() OR (SELECT p.user_id FROM public.properties p WHERE p.id = c.property_id) = auth.uid())
        )
      );
  END IF;
END $$;
