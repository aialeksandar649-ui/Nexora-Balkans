-- Nexora: profiles (from auth.users), bookings, properties.user_id
-- Run after 001_create_properties.sql. Enable Email auth in Supabase Dashboard → Authentication → Providers.

-- Profiles: extended user info (optional; auth.users holds email)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create profile on signup (run as superuser or in Dashboard)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Properties: add host user_id (owner)
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

DROP POLICY IF EXISTS "Allow public insert on properties" ON public.properties;
DROP POLICY IF EXISTS "Allow authenticated insert on properties" ON public.properties;
CREATE POLICY "Allow authenticated insert on properties" ON public.properties
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Allow owners update own properties" ON public.properties;
CREATE POLICY "Allow owners update own properties" ON public.properties
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow owners delete own properties" ON public.properties;
CREATE POLICY "Allow owners delete own properties" ON public.properties
  FOR DELETE USING (auth.uid() = user_id);

-- Bookings
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  check_in date NOT NULL,
  check_out date NOT NULL,
  guests int NOT NULL DEFAULT 1,
  total_price numeric NOT NULL,
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON public.bookings(property_id);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own bookings" ON public.bookings;
CREATE POLICY "Users can read own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own bookings" ON public.bookings;
CREATE POLICY "Users can insert own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
CREATE POLICY "Users can update own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own bookings" ON public.bookings;
CREATE POLICY "Users can delete own bookings" ON public.bookings
  FOR DELETE USING (auth.uid() = user_id);

COMMENT ON TABLE public.bookings IS 'Nexora accommodation bookings';
