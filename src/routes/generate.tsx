import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/generate")({
  head: () => ({ meta: [{ title: "Outfits — Fio" }] }),
  component: OutfitsPage,
});

type Garment = {
  id: string;
  name: string | null;
  category: string | null;
  image_original_url: string | null;
  image_catalog_url: string | null;
};

type Outfit = {
  id: string;
  name: string | null;
  notes: string | null;
  created_at: string;
  items: { garment_id: string; image: string | null; name: string | null }[];
};

function OutfitsPage() {
  const { user } = useAuth();
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [garments, setGarments] = useState<Garment[]>([]);
  const [loading, setLoading] = useState(true);
  const [building, setBuilding] = useState(false);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [picked, setPicked] = useState<string[]>([]);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [gRes, oRes] = await Promise.all([
      supabase
        .from("garments")
        .select("id, name, category, image_original_url, image_catalog_url")
        .order("created_at", { ascending: false }),
      supabase
        .from("outfits")
        .select("id, name, notes, created_at, outfit_items(garment_id, garments(name, image_original_url, image_catalog_url))")
        .order("created_at", { ascending: false }),
    ]);
    setGarments((gRes.data ?? []) as Garment[]);
    const mapped: Outfit[] = (oRes.data ?? []).map((o: any) => ({
      id: o.id,
      name: o.name,
      notes: o.notes,
      created_at: o.created_at,
      items: (o.outfit_items ?? []).map((it: any) => ({
        garment_id: it.garment_id,
        name: it.garments?.name ?? null,
        image: it.garments?.image_catalog_url ?? it.garments?.image_original_url ?? null,
      })),
    }));
    setOutfits(mapped);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const togglePick = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  async function saveOutfit() {
    if (!user || picked.length === 0) return;
    const { data: out, error } = await supabase
      .from("outfits")
      .insert({ user_id: user.id, name: name.trim() || "Untitled outfit", notes: notes.trim() || null })
      .select("id")
      .single();
    if (error || !out) return toast.error(error?.message ?? "Failed");
    const { error: itErr } = await supabase
      .from("outfit_items")
      .insert(picked.map((gid) => ({ outfit_id: out.id, garment_id: gid })));
    if (itErr) return toast.error(itErr.message);
    toast.success("Outfit saved");
    setName("");
    setNotes("");
    setPicked([]);
    setBuilding(false);
    load();
  }

  async function deleteOutfit(id: string) {
    if (!confirm("Delete this outfit?")) return;
    await supabase.from("outfit_items").delete().eq("outfit_id", id);
    const { error } = await supabase.from("outfits").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Outfit deleted");
    load();
  }

  return (
    <div className="space-y-10">
      <header className="flex items-end justify-between gap-4">
        <div>
          <span className="editorial-number text-coral">N°04 — The Wardrobe Stylist</span>
          <h1 className="mt-2 font-display text-5xl md:text-6xl">Your outfits</h1>
          <p className="mt-3 text-ink/70">Compose outfits by hand from the pieces in your collection.</p>
        </div>
        {!building && (
          <button
            onClick={() => setBuilding(true)}
            className="rounded-full border-2 border-ink bg-cherry px-5 py-3 text-cream shadow-pop"
          >
            + New outfit
          </button>
        )}
      </header>

      {building && (
        <section className="rounded-[2.5rem] border-2 border-ink bg-cream p-6 shadow-pop">
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Outfit name"
              className="rounded-full border-2 border-ink bg-white px-5 py-3 text-sm outline-none"
            />
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes (occasion, weather…)"
              className="rounded-full border-2 border-ink bg-white px-5 py-3 text-sm outline-none"
            />
          </div>

          <p className="mt-5 text-xs uppercase tracking-[0.18em] text-ink/60">
            Pick pieces ({picked.length} selected)
          </p>
          {garments.length === 0 ? (
            <p className="mt-3 text-sm text-ink/60">
              You have no pieces yet. <Link to="/add" className="underline">Add one</Link>.
            </p>
          ) : (
            <div className="mt-3 grid grid-cols-3 gap-3 md:grid-cols-5">
              {garments.map((g) => {
                const on = picked.includes(g.id);
                const img = g.image_catalog_url || g.image_original_url;
                return (
                  <button
                    key={g.id}
                    onClick={() => togglePick(g.id)}
                    className={`overflow-hidden rounded-2xl border-2 border-ink shadow-pop transition ${
                      on ? "bg-cherry" : "bg-cream"
                    }`}
                  >
                    <div className="aspect-square bg-white">
                      {img && <img src={img} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <p className={`truncate px-2 py-1 text-[11px] ${on ? "text-cream" : "text-ink/70"}`}>
                      {g.name ?? "Untitled"}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-5 flex gap-2">
            <button
              onClick={saveOutfit}
              disabled={picked.length === 0}
              className="rounded-full border-2 border-ink bg-ink px-5 py-3 text-sm text-cream shadow-pop disabled:opacity-50"
            >
              Save outfit
            </button>
            <button
              onClick={() => {
                setBuilding(false);
                setPicked([]);
                setName("");
                setNotes("");
              }}
              className="rounded-full border-2 border-ink bg-cream px-5 py-3 text-sm shadow-pop"
            >
              Cancel
            </button>
          </div>
        </section>
      )}

      {loading ? (
        <p className="text-ink/60">Loading…</p>
      ) : outfits.length === 0 ? (
        <div className="rounded-[2.5rem] border-2 border-ink bg-cream/80 p-12 text-center shadow-pop">
          <p className="editorial-number text-coral">An empty rail</p>
          <h2 className="mt-3 font-display text-4xl">No outfits yet.</h2>
          <p className="mt-3 text-ink/70">Compose your first look from your collection.</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {outfits.map((o, idx) => (
            <article
              key={o.id}
              className="rounded-[2.25rem] border-2 border-ink bg-cream p-4 shadow-pop"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="editorial-number text-coral text-xs">N°{String(idx + 1).padStart(2, "0")}</p>
                  <h3 className="font-display text-2xl leading-tight">{o.name ?? "Untitled"}</h3>
                </div>
                <button
                  onClick={() => deleteOutfit(o.id)}
                  className="rounded-full border-2 border-ink bg-cream px-3 py-1 text-xs shadow-pop"
                >
                  ✕
                </button>
              </div>
              {o.notes && <p className="mt-2 text-sm text-ink/70">{o.notes}</p>}
              <div className="mt-3 flex flex-wrap gap-2">
                {o.items.map((it) => (
                  <div
                    key={it.garment_id}
                    className="h-16 w-16 overflow-hidden rounded-xl border-2 border-ink bg-white"
                    title={it.name ?? ""}
                  >
                    {it.image && <img src={it.image} alt="" className="h-full w-full object-cover" />}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-ink/50">
                {o.items.length} {o.items.length === 1 ? "piece" : "pieces"}
              </p>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
