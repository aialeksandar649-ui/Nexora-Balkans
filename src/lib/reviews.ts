import { supabase } from './supabase';

export interface ReviewRow {
  id: string;
  property_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ReviewWithAuthor {
  id: string;
  propertyId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  authorName: string;
}

function reviewRowToReview(row: ReviewRow, authorName: string): ReviewWithAuthor {
  return {
    id: row.id,
    propertyId: row.property_id,
    userId: row.user_id,
    rating: row.rating,
    comment: row.comment || '',
    createdAt: new Date(row.created_at),
    authorName: authorName || 'Guest',
  };
}

export async function fetchPropertyReviews(propertyId: string): Promise<ReviewWithAuthor[]> {
  if (!supabase) return [];
  const { data: rows, error } = await supabase
    .from('reviews')
    .select('id, property_id, user_id, rating, comment, created_at')
    .eq('property_id', propertyId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  const reviews = (rows ?? []) as ReviewRow[];
  if (reviews.length === 0) return [];
  const userIds = [...new Set(reviews.map((r) => r.user_id))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name')
    .in('id', userIds);
  const nameByUserId = new Map<string, string>();
  (profiles ?? []).forEach((p: { id: string; full_name: string | null }) => {
    nameByUserId.set(p.id, p.full_name?.trim() || 'Guest');
  });
  return reviews.map((r) => reviewRowToReview(r, nameByUserId.get(r.user_id) || 'Guest'));
}

export async function submitReview(
  propertyId: string,
  userId: string,
  rating: number,
  comment: string
): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Supabase not configured' };
  const ratingInt = Math.min(5, Math.max(1, Math.floor(rating)));
  const { error } = await supabase.from('reviews').upsert(
    {
      property_id: propertyId,
      user_id: userId,
      rating: ratingInt,
      comment: (comment || '').trim().slice(0, 2000),
    },
    { onConflict: 'property_id,user_id' }
  );
  if (error) {
    if (error.code === '23503') return { error: 'Property or user not found' };
    return { error: error.message };
  }
  return { error: null };
}

export async function userAlreadyReviewed(propertyId: string, userId: string): Promise<boolean> {
  if (!supabase) return false;
  const { data, error } = await supabase
    .from('reviews')
    .select('id')
    .eq('property_id', propertyId)
    .eq('user_id', userId)
    .maybeSingle();
  if (error) return false;
  return !!data;
}
