import { supabase } from './supabase';

const BUCKET = 'property-images';
const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

/** Upload via ImgBB (fallback when Supabase fails). Returns public URL or error. */
async function uploadViaImgBB(file: File): Promise<{ url: string } | { error: string }> {
  if (!IMGBB_API_KEY) return { error: 'ImgBB not configured' };
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string)?.split(',')[1];
      if (!base64) {
        resolve({ error: 'Could not read file' });
        return;
      }
      const formData = new FormData();
      formData.set('key', IMGBB_API_KEY);
      formData.set('image', base64);
      try {
        const res = await fetch('https://api.imgbb.com/1/upload', {
          method: 'POST',
          body: formData,
        });
        const json = await res.json();
        if (json.success && json.data?.url) {
          resolve({ url: json.data.url });
        } else {
          resolve({ error: json.error?.message || 'ImgBB upload failed' });
        }
      } catch (e) {
        resolve({ error: (e as Error).message || 'Network error' });
      }
    };
    reader.onerror = () => resolve({ error: 'Could not read file' });
    reader.readAsDataURL(file);
  });
}

/** Upload a file to property-images bucket or ImgBB fallback. Returns public URL or error. */
export async function uploadPropertyImage(
  userId: string,
  file: File
): Promise<{ url: string } | { error: string }> {
  // Try Supabase first if configured
  if (supabase) {
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 50);
    const path = `${userId}/${Date.now()}-${safeName}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (!error) {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      return { url: data.publicUrl };
    }
    // Supabase failed – try ImgBB fallback if configured
    if (IMGBB_API_KEY) {
      const fallback = await uploadViaImgBB(file);
      if ('url' in fallback) return fallback;
    }
    return { error: error.message };
  }

  // Supabase not configured – try ImgBB or return helpful error
  const fallback = await uploadViaImgBB(file);
  if ('url' in fallback) return fallback;
  return {
    error:
      fallback.error === 'ImgBB not configured'
        ? 'Configure Supabase storage or add VITE_IMGBB_API_KEY. Or paste an image URL below.'
        : fallback.error,
  };
}
