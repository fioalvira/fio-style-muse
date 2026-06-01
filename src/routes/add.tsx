import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/add")({
  head: () => ({ meta: [{ title: "Add a Piece — Fio" }] }),
  component: AddItem,
});

function AddItem() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);

  function pickFile(f: File) {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setDone(false);
  }

  async function handleSave() {
    if (!file || !user) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("garments-original")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from("garments-original").getPublicUrl(path);

      const { error: insErr } = await supabase.from("garments").insert({
        user_id: user.id,
        image_original_url: pub.publicUrl,
        name: name.trim() || null,
      });
      if (insErr) throw insErr;

      setDone(true);
      toast.success("Piece added to your collection");
      setTimeout(() => navigate({ to: "/wardrobe" }), 900);
    } catch (e) {
      const err = e as Error;
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-10">
      <header>
        <span className="editorial-number text-coral">N°03 — The Intake</span>
        <h1 className="mt-2 font-display text-5xl md:text-6xl">Add a piece</h1>
        <p className="mt-3 max-w-xl text-espresso/70">
          Photograph the piece against any background. We'll save it to your private archive.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <label
            className={`relative flex aspect-[4/5] cursor-pointer items-center justify-center overflow-hidden rounded-[2.5rem] border-2 border-dashed transition ${
              preview ? "border-transparent" : "border-coral/40 bg-white/40 hover:bg-white/60"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) pickFile(f);
              }}
            />
            {preview ? (
              <img src={preview} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <div className="text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-coral text-cream shadow-soft">
                  +
                </div>
                <p className="mt-4 font-display text-2xl">Upload an image</p>
                <p className="mt-1 text-sm text-espresso/60">JPG or PNG, ideally on a plain background</p>
              </div>
            )}
          </label>
        </div>

        <div className="space-y-5">
          <div className="rounded-[2.5rem] bg-card p-7 shadow-soft">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-blush text-espresso font-display">f</span>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-espresso/50">New piece</p>
                <p className="font-display text-lg leading-tight">Save to your wardrobe</p>
              </div>
            </div>

            {!preview && (
              <p className="mt-6 text-espresso/60">
                Choose a photograph to begin.
              </p>
            )}

            {preview && !done && (
              <div className="mt-6 space-y-4">
                <label className="block">
                  <span className="ml-1 text-xs uppercase tracking-[0.18em] text-espresso/50">
                    Name (optional)
                  </span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Cream silk blouse"
                    className="mt-2 w-full rounded-full border-0 bg-white/80 px-5 py-3 text-espresso outline-none ring-1 ring-border focus:ring-2 focus:ring-coral"
                  />
                </label>
                <button
                  onClick={handleSave}
                  disabled={uploading}
                  className="w-full rounded-full bg-espresso px-5 py-3.5 text-cream shadow-soft transition hover:opacity-95 disabled:opacity-60"
                >
                  {uploading ? "Saving…" : "Save to wardrobe"}
                </button>
              </div>
            )}

            {done && (
              <div className="mt-6 rounded-2xl bg-mustard/40 p-5 text-center">
                <p className="font-display text-2xl">Piece added to your collection</p>
                <p className="mt-1 text-sm text-espresso/60">Taking you to your wardrobe…</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
