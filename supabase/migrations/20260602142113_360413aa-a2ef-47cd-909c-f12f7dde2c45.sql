
CREATE TABLE public.favorite_colors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  color_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, color_name)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.favorite_colors TO authenticated;
GRANT ALL ON public.favorite_colors TO service_role;
ALTER TABLE public.favorite_colors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "favorite_colors_select_own" ON public.favorite_colors FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "favorite_colors_insert_own" ON public.favorite_colors FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorite_colors_delete_own" ON public.favorite_colors FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.user_aesthetics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  aesthetic_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, aesthetic_name)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_aesthetics TO authenticated;
GRANT ALL ON public.user_aesthetics TO service_role;
ALTER TABLE public.user_aesthetics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_aesthetics_select_own" ON public.user_aesthetics FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_aesthetics_insert_own" ON public.user_aesthetics FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_aesthetics_delete_own" ON public.user_aesthetics FOR DELETE TO authenticated USING (auth.uid() = user_id);
