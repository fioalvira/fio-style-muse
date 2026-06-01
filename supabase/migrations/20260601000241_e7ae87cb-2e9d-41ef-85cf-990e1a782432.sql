
-- Restrict SECURITY DEFINER trigger function to system only
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Drop broad public listing policies; files in public buckets remain accessible
-- via their direct getPublicUrl() CDN URLs without needing a SELECT policy.
DROP POLICY IF EXISTS "garments_original_read" ON storage.objects;
DROP POLICY IF EXISTS "garments_catalog_read" ON storage.objects;
DROP POLICY IF EXISTS "inspirations_read" ON storage.objects;
