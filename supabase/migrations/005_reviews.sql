-- Nexora Balkans: property reviews (authenticated users only to submit)
-- Run in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(property_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_property_id ON public.reviews(property_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews for a property
DROP POLICY IF EXISTS "Anyone can read reviews" ON public.reviews;
CREATE POLICY "Anyone can read reviews" ON public.reviews
  FOR SELECT USING (true);

-- Only authenticated users can insert their own review
DROP POLICY IF EXISTS "Authenticated users can insert own review" ON public.reviews;
CREATE POLICY "Authenticated users can insert own review" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update/delete only their own review
DROP POLICY IF EXISTS "Users can update own review" ON public.reviews;
CREATE POLICY "Users can update own review" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own review" ON public.reviews;
CREATE POLICY "Users can delete own review" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger: after insert/update/delete on reviews, recalculate property rating and review count
CREATE OR REPLACE FUNCTION public.update_property_review_stats()
RETURNS trigger AS $$
DECLARE
  target_id uuid;
  new_rating numeric;
  new_count bigint;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_id := OLD.property_id;
  ELSE
    target_id := NEW.property_id;
  END IF;

  SELECT ROUND(AVG(rating)::numeric, 2), COUNT(*)
  INTO new_rating, new_count
  FROM public.reviews
  WHERE property_id = target_id;

  UPDATE public.properties
  SET rating = COALESCE(new_rating, 0),
      reviews = COALESCE(new_count, 0)::int
  WHERE id = target_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_reviews_change ON public.reviews;
CREATE TRIGGER on_reviews_change
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_property_review_stats();

COMMENT ON TABLE public.reviews IS 'Nexora property reviews; one per user per property';
