-- Nexora: Storage bucket for property images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-images',
  'property-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload property images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-images');

-- Public read (bucket is public)
CREATE POLICY "Public read for property images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'property-images');

-- Users can update/delete their own uploads (by folder = user_id)
CREATE POLICY "Users can update own property images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'property-images' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete own property images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'property-images' AND (storage.foldername(name))[1] = auth.uid()::text);
