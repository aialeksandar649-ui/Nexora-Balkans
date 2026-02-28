-- Nexora: Allow reading profiles of conversation partners + RPC for inbox with other party name and unread count

-- Users can read profiles of users they share a conversation with
DROP POLICY IF EXISTS "Users read conversation partners profiles" ON public.profiles;
CREATE POLICY "Users read conversation partners profiles" ON public.profiles
  FOR SELECT USING (
    id IN (
      SELECT host_id FROM public.conversations
      WHERE guest_id = auth.uid() AND host_id IS NOT NULL
      UNION
      SELECT guest_id FROM public.conversations
      WHERE host_id = auth.uid()
    )
  );

-- RPC: Get inbox conversations with other party name, unread count, last message preview
CREATE OR REPLACE FUNCTION public.get_inbox_conversations()
RETURNS TABLE (
  id uuid,
  property_id uuid,
  guest_id uuid,
  host_id uuid,
  created_at timestamptz,
  updated_at timestamptz,
  property_title text,
  property_location text,
  property_image_url text,
  other_party_name text,
  unread_count bigint,
  last_message_preview text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH convs AS (
    SELECT c.id, c.property_id, c.guest_id, c.host_id, c.created_at, c.updated_at
    FROM public.conversations c
    WHERE c.guest_id = auth.uid()
       OR c.host_id = auth.uid()
  ),
  props AS (
    SELECT p.id, p.title, p.location, p.image_url, p.host
    FROM public.properties p
    WHERE p.id IN (SELECT property_id FROM convs)
  ),
  unread_counts AS (
    SELECT m.conversation_id, COUNT(*)::bigint AS cnt
    FROM public.messages m
    JOIN convs c ON c.id = m.conversation_id
    WHERE m.sender_id != auth.uid() AND m.read_at IS NULL
    GROUP BY m.conversation_id
  ),
  last_msgs AS (
    SELECT DISTINCT ON (conversation_id) conversation_id, content
    FROM public.messages
    WHERE conversation_id IN (SELECT id FROM convs)
    ORDER BY conversation_id, created_at DESC
  )
  SELECT
    c.id,
    c.property_id,
    c.guest_id,
    c.host_id,
    c.created_at,
    c.updated_at,
    pr.title AS property_title,
    pr.location AS property_location,
    pr.image_url AS property_image_url,
    CASE
      WHEN auth.uid() = c.guest_id THEN COALESCE(hp.full_name, pr.host->>'name', 'Host')
      ELSE COALESCE(gp.full_name, gp.email, 'Guest')
    END AS other_party_name,
    COALESCE(uc.cnt, 0) AS unread_count,
    LEFT(lm.content, 80) AS last_message_preview
  FROM convs c
  LEFT JOIN props pr ON pr.id = c.property_id
  LEFT JOIN public.profiles hp ON hp.id = c.host_id
  LEFT JOIN public.profiles gp ON gp.id = c.guest_id
  LEFT JOIN unread_counts uc ON uc.conversation_id = c.id
  LEFT JOIN last_msgs lm ON lm.conversation_id = c.id
  ORDER BY c.updated_at DESC;
$$;
