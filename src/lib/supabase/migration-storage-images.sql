-- Supabase Storage bucket untuk upload gambar
-- 1. Buat bucket "images" (public)
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  false,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- 2. Hapus policy SELECT publik (kalau sudah ada dari migrasi sebelumnya)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

-- 3. Policy: hanya authenticated user bisa lihat daftar file (list sendiri)
CREATE POLICY "Authenticated Select"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'images');

-- 4. Policy: hanya authenticated user bisa upload gambar
-- (service_role key akan bypass policy ini untuk upload dari server)
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- 5. Policy: owner bisa hapus gambarnya sendiri
CREATE POLICY "Owner Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images' AND auth.uid() = owner);
