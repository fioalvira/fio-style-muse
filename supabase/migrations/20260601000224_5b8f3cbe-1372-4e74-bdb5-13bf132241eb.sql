
-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- GARMENTS
CREATE TABLE public.garments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_original_url text,
  image_catalog_url text,
  name text,
  category text,
  subcategory text,
  primary_color text,
  secondary_colors text[],
  material text,
  pattern text,
  season text,
  style_tags text[],
  formality_score int,
  ai_description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.garments TO authenticated;
GRANT ALL ON public.garments TO service_role;
ALTER TABLE public.garments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "garments_select_own" ON public.garments FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "garments_insert_own" ON public.garments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "garments_update_own" ON public.garments FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "garments_delete_own" ON public.garments FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- OUTFITS
CREATE TABLE public.outfits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  occasion text,
  ai_reasoning text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.outfits TO authenticated;
GRANT ALL ON public.outfits TO service_role;
ALTER TABLE public.outfits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "outfits_select_own" ON public.outfits FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "outfits_insert_own" ON public.outfits FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "outfits_update_own" ON public.outfits FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "outfits_delete_own" ON public.outfits FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- OUTFIT_ITEMS (join)
CREATE TABLE public.outfit_items (
  outfit_id uuid NOT NULL REFERENCES public.outfits(id) ON DELETE CASCADE,
  garment_id uuid NOT NULL REFERENCES public.garments(id) ON DELETE CASCADE,
  PRIMARY KEY (outfit_id, garment_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.outfit_items TO authenticated;
GRANT ALL ON public.outfit_items TO service_role;
ALTER TABLE public.outfit_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "outfit_items_select_own" ON public.outfit_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.outfits o WHERE o.id = outfit_id AND o.user_id = auth.uid()));
CREATE POLICY "outfit_items_insert_own" ON public.outfit_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.outfits o WHERE o.id = outfit_id AND o.user_id = auth.uid()));
CREATE POLICY "outfit_items_delete_own" ON public.outfit_items FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.outfits o WHERE o.id = outfit_id AND o.user_id = auth.uid()));

-- INSPIRATIONS
CREATE TABLE public.inspirations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url text,
  source text,
  ai_description text,
  style_tags text[],
  colors text[],
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inspirations TO authenticated;
GRANT ALL ON public.inspirations TO service_role;
ALTER TABLE public.inspirations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inspirations_select_own" ON public.inspirations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "inspirations_insert_own" ON public.inspirations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "inspirations_update_own" ON public.inspirations FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "inspirations_delete_own" ON public.inspirations FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES
  ('garments-original', 'garments-original', true),
  ('garments-catalog', 'garments-catalog', true),
  ('inspirations', 'inspirations', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: files are stored under <user_id>/<filename>
CREATE POLICY "garments_original_read" ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'garments-original');
CREATE POLICY "garments_original_insert_own" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'garments-original' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "garments_original_update_own" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'garments-original' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "garments_original_delete_own" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'garments-original' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "garments_catalog_read" ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'garments-catalog');
CREATE POLICY "garments_catalog_insert_own" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'garments-catalog' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "garments_catalog_update_own" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'garments-catalog' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "garments_catalog_delete_own" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'garments-catalog' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "inspirations_read" ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'inspirations');
CREATE POLICY "inspirations_insert_own" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'inspirations' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "inspirations_update_own" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'inspirations' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "inspirations_delete_own" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'inspirations' AND (storage.foldername(name))[1] = auth.uid()::text);
