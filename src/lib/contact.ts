import { supabase } from './supabase';

export async function submitContact(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Not configured' };
  const { error } = await supabase.from('contact_submissions').insert({
    name: data.name.trim(),
    email: data.email.trim(),
    subject: data.subject.trim(),
    message: data.message.trim(),
  });
  return { error: error?.message ?? null };
}
