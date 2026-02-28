import { supabase } from './supabase';

/**
 * Calls Supabase Edge Function to permanently delete the current user from auth.users.
 * Sends the session JWT and anon key via direct fetch. Edge Function must be deployed
 * with --no-verify-jwt; it validates the JWT and deletes only that user.
 * Server must have SERVICE_ROLE_KEY in Edge Function secrets.
 */
export async function deleteAccount(): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData?.session;
  if (!session?.access_token) {
    throw new Error('Invalid session');
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !anonKey) {
    throw new Error('Supabase not configured');
  }

  const url = `${supabaseUrl.replace(/\/$/, '')}/functions/v1/delete-user`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
      apikey: anonKey,
    },
    body: '{}',
  });

  const resText = await res.text();
  let data: { ok?: boolean; error?: string } = {};
  try {
    if (resText) data = JSON.parse(resText);
  } catch {
    // non-JSON response (e.g. gateway HTML)
  }

  if (!res.ok) {
    throw new Error(data?.error ?? `Request failed: ${res.status}`);
  }

  if (data && typeof data === 'object' && 'error' in data && data.error) {
    throw new Error(String(data.error));
  }
}
