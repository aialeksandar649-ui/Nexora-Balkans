-- Nexora: Availability RPC, Messages, Coordinates, Cancellation Policy
-- Run after 005_reviews.sql

-- 0. Ensure contact_submissions exists (in case 003 wasn't run)
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow insert for anyone" ON public.contact_submissions;
CREATE POLICY "Allow insert for anyone" ON public.contact_submissions
  FOR INSERT WITH CHECK (true);

-- 1. RPC: Get blocked dates for a property (from bookings, excludes cancelled)
CREATE OR REPLACE FUNCTION public.get_property_booked_dates(p_property_id uuid)
RETURNS TABLE(check_in date, check_out date)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT b.check_in, b.check_out
  FROM bookings b
  WHERE b.property_id = p_property_id
    AND b.status != 'cancelled';
$$;

GRANT EXECUTE ON FUNCTION public.get_property_booked_dates(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.get_property_booked_dates(uuid) TO authenticated;

-- 2. Add lat, lng, cancellation_policy to properties
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS lat numeric;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS lng numeric;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS cancellation_policy text DEFAULT 'flexible';

COMMENT ON COLUMN public.properties.lat IS 'Latitude for map display';
COMMENT ON COLUMN public.properties.lng IS 'Longitude for map display';
COMMENT ON COLUMN public.properties.cancellation_policy IS 'flexible|moderate|strict';

-- 3. Messages / Guest-Host conversations
CREATE TABLE IF NOT EXISTS public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  guest_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  host_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(property_id, guest_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversations_property ON public.conversations(property_id);
CREATE INDEX IF NOT EXISTS idx_conversations_guest ON public.conversations(guest_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Guests see their own conversations
CREATE POLICY "Guests read own conversations" ON public.conversations
  FOR SELECT USING (auth.uid() = guest_id);

-- Hosts see conversations for their properties
CREATE POLICY "Hosts read conversations for their properties" ON public.conversations
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM public.properties WHERE id = property_id AND user_id = auth.uid())
  );

-- Anyone in the conversation can insert (guest or host)
CREATE POLICY "Participants insert conversations" ON public.conversations
  FOR INSERT WITH CHECK (
    auth.uid() = guest_id OR
    auth.uid() IN (SELECT user_id FROM public.properties WHERE id = property_id AND user_id = auth.uid())
  );

-- Participants can read messages in their conversation
CREATE POLICY "Participants read messages" ON public.messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM public.conversations
      WHERE guest_id = auth.uid()
         OR (SELECT user_id FROM public.properties p WHERE p.id = property_id) = auth.uid()
    )
  );

-- Participants can send messages
CREATE POLICY "Participants insert messages" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    conversation_id IN (
      SELECT id FROM public.conversations
      WHERE guest_id = auth.uid()
         OR (SELECT user_id FROM public.properties p WHERE p.id = property_id) = auth.uid()
    )
  );

-- 4. Admin users (simple: email list in app_metadata or separate table)
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only admins can read admin_users (for self-check)
CREATE POLICY "Admins read admin list" ON public.admin_users
  FOR SELECT USING (auth.uid() = user_id);

-- Add policy for admins to read contact_submissions (service role or create RPC)
-- Contact submissions: add policy so admin can read (via RPC with SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.admin_get_contact_submissions()
RETURNS SETOF public.contact_submissions
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 100;
$$;

-- Only if user is in admin_users
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid());
$$;

CREATE OR REPLACE FUNCTION public.admin_get_contact_submissions()
RETURNS SETOF public.contact_submissions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  RETURN QUERY SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 100;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_get_contact_submissions() TO authenticated;

-- Trigger: set host_id when conversation is created
CREATE OR REPLACE FUNCTION public.set_conversation_host()
RETURNS trigger AS $$
BEGIN
  SELECT user_id INTO NEW.host_id FROM public.properties WHERE id = NEW.property_id;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_conversation_insert ON public.conversations;
CREATE TRIGGER on_conversation_insert
  BEFORE INSERT ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.set_conversation_host();
