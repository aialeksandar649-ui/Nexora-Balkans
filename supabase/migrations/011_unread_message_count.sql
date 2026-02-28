-- Nexora: RPC to get unread message count for current user (uses auth.uid() for security)
CREATE OR REPLACE FUNCTION public.get_unread_message_count()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::bigint
  FROM public.messages m
  JOIN public.conversations c ON c.id = m.conversation_id
  WHERE (c.guest_id = auth.uid() OR c.host_id = auth.uid())
    AND m.sender_id != auth.uid()
    AND m.read_at IS NULL;
$$;

-- Participants can update messages in their conversation (for marking as read)
DROP POLICY IF EXISTS "Participants update messages" ON public.messages;
CREATE POLICY "Participants update messages" ON public.messages
  FOR UPDATE USING (
    conversation_id IN (
      SELECT id FROM public.conversations
      WHERE guest_id = auth.uid()
         OR (SELECT user_id FROM public.properties p WHERE p.id = property_id) = auth.uid()
    )
  );
