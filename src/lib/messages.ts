import { supabase } from './supabase';

export interface Conversation {
  id: string;
  property_id: string;
  guest_id: string;
  host_id: string | null;
  property?: { title: string; location: string; image_url: string };
  created_at: string;
  updated_at: string;
  /** Name of the other party (host or guest) */
  other_party_name?: string;
  /** Unread message count for this conversation */
  unread_count?: number;
  /** Truncated last message preview */
  last_message_preview?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
  isOwn: boolean;
}

export async function getConversations(userId: string): Promise<Conversation[]> {
  if (!supabase) return [];
  const { data: rows, error } = await supabase.rpc('get_inbox_conversations');
  if (error) {
    const { data: conv, error: fallbackErr } = await supabase
      .from('conversations')
      .select(`
        id,
        property_id,
        guest_id,
        host_id,
        created_at,
        updated_at,
        property:properties(title, location, image_url)
      `)
      .or(`guest_id.eq.${userId},host_id.eq.${userId}`)
      .order('updated_at', { ascending: false });
    if (fallbackErr) return [];
    return (conv ?? []).map((c: Record<string, unknown>) => ({
      id: c.id,
      property_id: c.property_id,
      guest_id: c.guest_id,
      host_id: c.host_id,
      property: (c.property ?? c.properties) as Record<string, string> | undefined,
      created_at: c.created_at,
      updated_at: c.updated_at,
    })) as Conversation[];
  }
  return (rows ?? []).map((r: Record<string, unknown>) => ({
    id: r.id,
    property_id: r.property_id,
    guest_id: r.guest_id,
    host_id: r.host_id,
    created_at: r.created_at,
    updated_at: r.updated_at,
    property: {
      title: r.property_title ?? '',
      location: r.property_location ?? '',
      image_url: r.property_image_url ?? '',
    },
    other_party_name: r.other_party_name ?? '',
    unread_count: typeof r.unread_count === 'number' ? r.unread_count : Number(r.unread_count) || 0,
    last_message_preview: (r.last_message_preview as string) ?? '',
  })) as Conversation[];
}

export async function getMessages(conversationId: string, userId: string): Promise<Message[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('messages')
    .select('id, conversation_id, sender_id, content, read_at, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  if (error) return [];
  return (data ?? []).map((m: Record<string, unknown>) => ({
    ...m,
    isOwn: m.sender_id === userId,
  })) as Message[];
}

/** Mark messages in a conversation as read for the current user (only messages from others). */
export async function markConversationAsRead(conversationId: string, userId: string): Promise<void> {
  if (!supabase) return;
  await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId)
    .is('read_at', null);
}

export async function sendMessage(conversationId: string, userId: string, content: string): Promise<{ error?: string }> {
  if (!supabase) return { error: 'Not configured' };
  const { error } = await supabase.from('messages').insert({
    conversation_id: conversationId,
    sender_id: userId,
    content: content.trim().slice(0, 2000),
  });
  if (error) return { error: error.message };
  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId);
  return {};
}

/** Get count of unread messages for the current user (messages from others not yet read). */
export async function getUnreadMessageCount(): Promise<number> {
  if (!supabase) return 0;
  const { data, error } = await supabase.rpc('get_unread_message_count');
  if (error) return 0;
  const n = Number(data);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

export async function createConversation(
  propertyId: string,
  guestId: string,
  initialMessage: string
): Promise<{ conversationId?: string; error?: string }> {
  if (!supabase) return { error: 'Not configured' };
  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .eq('property_id', propertyId)
    .eq('guest_id', guestId)
    .maybeSingle();
  if (existing) {
    await sendMessage(existing.id, guestId, initialMessage);
    return { conversationId: existing.id };
  }
  const { data: ins, error } = await supabase
    .from('conversations')
    .insert({ property_id: propertyId, guest_id: guestId })
    .select('id')
    .single();
  if (error) return { error: error.message };
  await sendMessage(ins.id, guestId, initialMessage);
  return { conversationId: ins.id };
}
