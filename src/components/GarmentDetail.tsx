import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Garment } from "@/routes/wardrobe";

export function GarmentDetail({
  garment,
  onClose,
  onChanged,
  onDeleted,
}: {
  garment: Garment;
  onClose: () => void;
  onChanged: () => void;
  onDeleted: () => void;
}) {
  const [form, setForm] = useState<Garment>(garment);
  const [saving, setSaving] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const img = form.image_catalog_url || form.image_original_url;

  const update = <K extends keyof Garment>(k: K, v: Garment[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    setSaving(true);
    const { error } = await supabase
      .from("garments")
      .update({
        name: form.name,
        category: form.category,
        subcategory: form.subcategory,
        primary_color: form.primary_color,
        material: form.material,
        season: form.season,
        notes: form.notes,
      })
      .eq("id", form.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    onChanged();
  }

  async function wearToday() {
    const next = (form.times_worn ?? 0) + 1;
    const now = new Date().toISOString();
    update("times_worn", next);
    update("last_worn", now);
    const { error } = await supabase
      .from("garments")
      .update({ times_worn: next, last_worn: now })
      .eq("id", form.id);
    if (error) return toast.error(error.message);
    toast.success("Logged for today");
    onChanged();
  }

  async function remove() {
    const { error } = await supabase.from("garments").delete().eq("id", form.id);
    if (error) return toast.error(error.message);
    // best-effort storage cleanup
    if (form.image_original_url) {
      const m = form.image_original_url.match(/garments-original\/(.+)$/);
      if (m) await supabase.storage.from("garments-original").remove([m[1]]);
    }
    toast.success("Piece removed");
    onDeleted();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative grid max-h-[92vh] w-full max-w-4xl grid-cols-1 overflow-auto rounded-[2.5rem] border-2 border-ink bg-cream shadow-pop md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border-2 border-ink bg-cream shadow-pop"
        >
          ✕
        </button>

        <div className="bg-pink p-4">
          <div className="overflow-hidden rounded-[1.6rem] border-2 border-ink bg-cream">
            <div className="aspect-[4/5]">
              {img ? (
                <img src={img} alt={form.name ?? ""} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-ink/30">no image</div>
              )}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-2xl border-2 border-ink bg-cream p-3">
              <p className="font-display text-2xl">{form.times_worn ?? 0}</p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-ink/60">Times worn</p>
            </div>
            <div className="rounded-2xl border-2 border-ink bg-cream p-3">
              <p className="font-display text-sm">
                {form.last_worn ? new Date(form.last_worn).toLocaleDateString() : "—"}
              </p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-ink/60">Last worn</p>
            </div>
          </div>
          <button
            onClick={wearToday}
            className="mt-3 w-full rounded-full border-2 border-ink bg-mustard px-4 py-3 text-sm shadow-pop"
          >
            Wore today
          </button>
        </div>

        <div className="space-y-3 p-6">
          <Field label="Name" value={form.name ?? ""} onChange={(v) => update("name", v)} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category" value={form.category ?? ""} onChange={(v) => update("category", v)} />
            <Field label="Subcategory" value={form.subcategory ?? ""} onChange={(v) => update("subcategory", v)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Primary color"
              value={form.primary_color ?? ""}
              onChange={(v) => update("primary_color", v)}
              placeholder="#color or name"
            />
            <Field label="Material" value={form.material ?? ""} onChange={(v) => update("material", v)} />
          </div>
          <Field label="Season" value={form.season ?? ""} onChange={(v) => update("season", v)} />
          <label className="block">
            <span className="ml-1 text-xs uppercase tracking-[0.18em] text-ink/50">Notes</span>
            <textarea
              value={form.notes ?? ""}
              onChange={(e) => update("notes", e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-2xl border-2 border-ink bg-white/80 px-4 py-2 text-sm outline-none"
            />
          </label>

          <div className="flex gap-2 pt-2">
            <button
              onClick={save}
              disabled={saving}
              className="flex-1 rounded-full border-2 border-ink bg-ink py-3 text-sm text-cream shadow-pop disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            <button
              onClick={() => setConfirmDel(true)}
              className="rounded-full border-2 border-ink bg-cream px-4 py-3 text-sm shadow-pop"
            >
              Delete
            </button>
          </div>

          {confirmDel && (
            <div className="mt-2 rounded-2xl border-2 border-ink bg-orange/30 p-4">
              <p className="text-sm">Delete this piece permanently?</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={remove}
                  className="rounded-full border-2 border-ink bg-cherry px-4 py-2 text-xs text-cream shadow-pop"
                >
                  Yes, delete
                </button>
                <button
                  onClick={() => setConfirmDel(false)}
                  className="rounded-full border-2 border-ink bg-cream px-4 py-2 text-xs shadow-pop"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="ml-1 text-xs uppercase tracking-[0.18em] text-ink/50">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-full border-2 border-ink bg-white/80 px-4 py-2 text-sm outline-none"
      />
    </label>
  );
}
