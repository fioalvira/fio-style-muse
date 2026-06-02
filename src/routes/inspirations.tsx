import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/inspirations")({
  head: () => ({ meta: [{ title: "Inspirations — Fio" }] }),
  component: Inspirations,
});

type Inspiration = {
  id: string;
  image_url: string | null;
  title: string | null;
  notes: string | null;
};

function Inspirations() {
  const { user } = useAuth();
  const [items, setItems] = useState<Inspiration[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<Inspiration | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("inspirations")
      .select("id, image_url, title, notes")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !files.length || !user) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("inspirations")
          .upload(path, file, { contentType: file.type });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("inspirations").getPublicUrl(path);
        const { error: insErr } = await supabase
          .from("inspirations")
          .insert({ user_id: user.id, image_url: pub.publicUrl });
        if (insErr) throw insErr;
      }
      toast.success("Inspiration added");
      await load();
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("inspirations").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setEditing(null);
    toast.success("Removed");
  }

  async function handleSaveMeta(id: string, title: string, notes: string) {
    const { error } = await supabase
      .from("inspirations")
      .update({ title, notes })
      .eq("id", id);
    if (error) return toast.error(error.message);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, title, notes } : i)));
    setEditing(null);
    toast.success("Saved");
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <span className="editorial-number text-coral">N°05 — The Moodboard</span>
          <h1 className="mt-2 font-display text-5xl md:text-7xl">Inspirations</h1>
          <p className="mt-4 text-espresso/70">
            The images that move you. Collect anything that sparks an outfit idea.
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-full bg-coral px-6 py-3 text-cream shadow-soft transition hover:opacity-90 disabled:opacity-50"
          >
            {uploading ? "Uploading…" : "+ Add inspiration"}
          </button>
        </div>
      </header>

      {loading ? (
        <p className="text-espresso/60">Loading…</p>
      ) : items.length === 0 ? (
        <div className="rounded-[2.5rem] bg-card p-12 text-center shadow-soft">
          <p className="font-display text-3xl">Your moodboard is empty.</p>
          <p className="mt-3 text-espresso/70">
            Pin the images that make you feel something. They'll shape every outfit Fio dreams up.
          </p>
        </div>
      ) : (
        <div className="columns-2 gap-5 md:columns-3 lg:columns-4 [&>*]:mb-5">
          {items.map((i) => (
            <figure
              key={i.id}
              className="group relative break-inside-avoid overflow-hidden rounded-[2rem] bg-card shadow-soft"
            >
              {i.image_url && (
                <img
                  src={i.image_url}
                  alt={i.title ?? ""}
                  className="w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/50 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                <div className="text-cream">
                  {i.title && <p className="font-display text-lg leading-tight">{i.title}</p>}
                  {i.notes && <p className="text-xs opacity-80 line-clamp-2">{i.notes}</p>}
                </div>
                <button
                  onClick={() => setEditing(i)}
                  className="rounded-full bg-cream px-3 py-1 text-xs text-espresso shadow-soft"
                >
                  Edit
                </button>
              </div>
            </figure>
          ))}
        </div>
      )}

      {editing && (
        <EditModal
          inspiration={editing}
          onClose={() => setEditing(null)}
          onSave={handleSaveMeta}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

function EditModal({
  inspiration,
  onClose,
  onSave,
  onDelete,
}: {
  inspiration: Inspiration;
  onClose: () => void;
  onSave: (id: string, title: string, notes: string) => void;
  onDelete: (id: string) => void;
}) {
  const [title, setTitle] = useState(inspiration.title ?? "");
  const [notes, setNotes] = useState(inspiration.notes ?? "");
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-[2rem] bg-card p-6 shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        {inspiration.image_url && (
          <img
            src={inspiration.image_url}
            alt=""
            className="mb-4 max-h-60 w-full rounded-2xl object-cover"
          />
        )}
        <label className="text-xs uppercase tracking-wider text-espresso/60">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={120}
          className="mt-1 mb-4 w-full rounded-xl border border-espresso/15 bg-transparent px-3 py-2"
          placeholder="Give it a name"
        />
        <label className="text-xs uppercase tracking-wider text-espresso/60">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={500}
          rows={4}
          className="mt-1 mb-4 w-full rounded-xl border border-espresso/15 bg-transparent px-3 py-2"
          placeholder="What inspires you about it?"
        />
        <div className="flex justify-between gap-3">
          <button
            onClick={() => onDelete(inspiration.id)}
            className="rounded-full px-4 py-2 text-sm text-coral hover:bg-coral/10"
          >
            Delete
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-full px-4 py-2 text-sm text-espresso/70"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(inspiration.id, title, notes)}
              className="rounded-full bg-espresso px-4 py-2 text-sm text-cream"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
