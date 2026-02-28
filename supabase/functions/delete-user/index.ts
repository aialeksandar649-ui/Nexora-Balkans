// Supabase Edge Function: delete current user (requires SERVICE_ROLE_KEY in secrets)
// See: https://supabase.com/docs/guides/functions/error-handling
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

function jsonResponse(body: object, status: number) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

function getUserIdFromJwt(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const padLen = (4 - (payload.length % 4)) % 4;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(padLen);
    const decoded = atob(base64);
    const data = JSON.parse(decoded);
    return data?.sub ?? null;
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return jsonResponse({ error: 'Missing authorization' }, 401);
    }

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const userId = getUserIdFromJwt(token);
    if (!userId) {
      return jsonResponse({ error: 'Invalid token' }, 401);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('delete-user: SUPABASE_URL or SERVICE_ROLE_KEY not set');
      return jsonResponse({ error: 'Server misconfigured' }, 500);
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (deleteError) {
      console.error('delete-user: admin.deleteUser failed', deleteError.message);
      return jsonResponse({ error: deleteError.message }, 400);
    }

    return jsonResponse({ ok: true }, 200);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('delete-user: unexpected error', message);
    return jsonResponse({ error: message }, 500);
  }
});
