-- Nexora Balkans: create properties table
-- Run this in Supabase Dashboard → SQL Editor (project: wlwscnkdfdulbmyllkik)

CREATE TABLE IF NOT EXISTS public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  images jsonb NOT NULL DEFAULT '[]',
  location text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL,
  rating numeric NOT NULL DEFAULT 5,
  dates text,
  guests int NOT NULL DEFAULT 1,
  bedrooms int NOT NULL DEFAULT 1,
  beds int NOT NULL DEFAULT 1,
  bathrooms numeric NOT NULL DEFAULT 1,
  amenities jsonb NOT NULL DEFAULT '[]',
  category jsonb NOT NULL DEFAULT '[]',
  host jsonb NOT NULL DEFAULT '{}',
  reviews int NOT NULL DEFAULT 0,
  check_in text,
  check_out text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on properties" ON public.properties;
CREATE POLICY "Allow public read access on properties" ON public.properties
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on properties" ON public.properties;
CREATE POLICY "Allow public insert on properties" ON public.properties
  FOR INSERT WITH CHECK (true);

COMMENT ON TABLE public.properties IS 'Nexora Balkans accommodation listings';
