-- Nexora Balkans: remove all reviews from all properties
-- Run this in Supabase Dashboard → SQL Editor

UPDATE public.properties
SET reviews = 0,
    rating = 0
WHERE reviews != 0 OR rating != 0;
