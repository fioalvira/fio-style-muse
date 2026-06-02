ALTER TABLE public.garments
  ADD COLUMN IF NOT EXISTS favorite boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS times_worn integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_worn timestamptz;

ALTER TABLE public.outfits
  ADD COLUMN IF NOT EXISTS notes text;