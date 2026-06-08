import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/stylist")({
  head: () => ({ meta: [{ title: "Stylist — Fio" }] }),
  component: StylistPage,
});

type Garment = {
  id: string;
  name: string | null;
  category: string | null;
  subcategory: string | null;
  primary_color: string | null;
  material: string | null;
  season: string | null;
  notes: string | null;
  style_tags: string[] | null;
  formality_score: number | null;
  favorite: boolean;
  times_worn: number;
  image_original_url: string | null;
  image_catalog_url: string | null;
};

type Outfit = {
  id: string;
  name: string | null;
  notes: string | null;
  occasion: string | null;
  items: { garment_id: string; image: string | null; name: string | null }[];
};

type PastRequest = { occasion: string; at: string };

const STORAGE_KEY = "fio:stylist:requests";

const SUGGESTIONS = [
  "Sunday brunch in the city",
  "First date, cozy bistro",
  "Office presentation",
  "Weekend countryside walk",
  "Summer wedding guest",
  "Gallery opening",
];

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function scoreText(query: string[], text: string | null | undefined): number {
  if (!text) return 0;
  const hay = text.toLowerCase();
  let s = 0;
  for (const q of query) if (hay.includes(q)) s += 2;
  return s;
}

function scoreGarment(query: string[], g: Garment): number {
  let s = 0;
  s += scoreText(query, g.name);
  s += scoreText(query, g.category);
  s += scoreText(query, g.subcategory);
  s += scoreText(query, g.material);
  s += scoreText(query, g.notes);
  s += scoreText(query, g.season);
  s += scoreText(query, (g.style_tags ?? []).join(" "));
  if (g.favorite) s += 1;
  s += Math.min(g.times_worn, 5) * 0.1;
  return s;
}

function StylistPage() {
  const { user } = useAuth();
  const [occasion, setOccasion] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [garments, setGarments] = useState<Garment[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [history, setHistory] = useState<PastRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [gRes, oRes] = await Promise.all([
      supabase
        .from("garments")
        .select(
          "id, name, category, subcategory, primary_color, material, season, notes, style_tags, formality_score, favorite, times_worn, image_original_url, image_catalog_url",
        )
        .order("created_at", { ascending: false }),
      supabase
        .from("outfits")
        .select(
          "id, name, notes, occasion, outfit_items(garment_id, garments(name, image_original_url, image_catalog_url))",
        )
        .order("created_at", { ascending: false }),
    ]);
    setGarments((gRes.data ?? []) as Garment[]);
    setOutfits(
      (oRes.data ?? []).map((o: any) => ({
        id: o.id,
        name: o.name,
        notes: o.notes,
        occasion: o.occasion,
        items: (o.outfit_items ?? []).map((it: any) => ({
          garment_id: it.garment_id,
          name: it.garments?.name ?? null,
          image: it.garments?.image_catalog_url ?? it.garments?.image_original_url ?? null,
        })),
      })),
    );
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, []);

  function persistHistory(next: PastRequest[]) {
    setHistory(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }

  function ask(text?: string) {
    const value = (text ?? occasion).trim();
    if (!value) return;
    setOccasion(value);
    setSubmitted(value);
    const entry: PastRequest = { occasion: value, at: new Date().toISOString() };
    const next = [entry, ...history.filter((h) => h.occasion !== value)].slice(0, 8);
    persistHistory(next);
  }

  const query = useMemo(() => tokenize(submitted), [submitted]);

  const rankedOutfits = useMemo(() => {
    if (query.length === 0) return [];
    return outfits
      .map((o) => {
        let s = 0;
        s += scoreText(query, o.name) * 1.5;
        s += scoreText(query, o.notes);
        s += scoreText(query, o.occasion) * 2;
        for (const it of o.items) s += scoreText(query, it.name) * 0.5;
        return { o, s };
      })
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 3)
      .map((x) => x.o);
  }, [outfits, query]);

  const composedOutfit = useMemo(() => {
    if (query.length === 0 || garments.length === 0) return null;
    const ranked = garments
      .map((g) => ({ g, s: scoreGarment(query, g) }))
      .sort((a, b) => b.s - a.s);
    const byCategory = new Map<string, Garment>();
    const order = ["top", "bottom", "dress", "outerwear", "shoes", "accessory"];
    for (const { g } of ranked) {
      const cat = (g.category ?? "other").toLowerCase();
      const slot = order.find((k) => cat.includes(k)) ?? cat;
      if (!byCategory.has(slot)) byCategory.set(slot, g);
    }
    const picks = Array.from(byCategory.values()).slice(0, 5);
    if (picks.length === 0) return null;
    return picks;
  }, [garments, query]);

  return (
    <div className="space-y-10">
      <header>
        <span className="editorial-number text-coral">N°05 — The Stylist</span>
        <h1 className="mt-2 font-display text-5xl md:text-6xl">Dress me for…</h1>
        <p className="mt-3 max-w-xl text-ink/70">
          Tell Fio the occasion. We'll pull from your wardrobe and saved outfits for now —
          your future AI stylist lives here.
        </p>
      </header>

      <section className="rounded-[2.5rem] border-2 border-ink bg-cream p-6 shadow-pop">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ask()}
            placeholder="A rainy Tuesday lunch with a friend…"
            className="flex-1 rounded-full border-2 border-ink bg-white px-5 py-3 text-sm outline-none"
          />
          <button
            onClick={() => ask()}
            className="rounded-full border-2 border-ink bg-cherry px-6 py-3 text-cream shadow-pop"
          >
            Style me
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => ask(s)}
              className="rounded-full border-2 border-ink bg-pink/60 px-3 py-1 text-xs hover:bg-pink"
            >
              {s}
            </button>
          ))}
        </div>

        {history.length > 0 && (
          <div className="mt-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-ink/60">Recent requests</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {history.map((h) => (
                <button
                  key={h.at}
                  onClick={() => ask(h.occasion)}
                  className="rounded-full border-2 border-ink bg-cream px-3 py-1 text-xs shadow-pop"
                >
                  {h.occasion}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {loading ? (
        <p className="text-ink/60">Loading your wardrobe…</p>
      ) : !submitted ? (
        <div className="rounded-[2.5rem] border-2 border-ink bg-cream/60 p-12 text-center shadow-pop">
          <p className="editorial-number text-coral">A blank page</p>
          <h2 className="mt-3 font-display text-3xl">Where are we going today?</h2>
        </div>
      ) : garments.length === 0 ? (
        <div className="rounded-[2.5rem] border-2 border-ink bg-cream/60 p-12 text-center shadow-pop">
          <h2 className="font-display text-3xl">Your collection is still empty.</h2>
          <p className="mt-2 text-ink/70">
            <Link to="/add" className="underline">Add your first piece</Link> to begin.
          </p>
        </div>
      ) : (
        <>
          <section>
            <h2 className="font-display text-3xl">Composed for "{submitted}"</h2>
            <p className="mt-1 text-sm text-ink/60">
              A handpicked look from your pieces, ranked by what suits the occasion.
            </p>
            {composedOutfit ? (
              <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-5">
                {composedOutfit.map((g) => {
                  const img = g.image_catalog_url || g.image_original_url;
                  return (
                    <article
                      key={g.id}
                      className="overflow-hidden rounded-2xl border-2 border-ink bg-cream shadow-pop"
                    >
                      <div className="aspect-square bg-white">
                        {img && <img src={img} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <div className="p-3">
                        <p className="truncate font-display text-lg leading-tight">
                          {g.name ?? "Untitled"}
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.16em] text-ink/50">
                          {g.category ?? "piece"}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="mt-3 text-sm text-ink/60">No matching pieces — try a different prompt.</p>
            )}
          </section>

          {rankedOutfits.length > 0 && (
            <section>
              <h2 className="font-display text-3xl">From your saved outfits</h2>
              <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rankedOutfits.map((o, idx) => (
                  <article
                    key={o.id}
                    className="rounded-[2.25rem] border-2 border-ink bg-cream p-4 shadow-pop"
                  >
                    <p className="editorial-number text-coral text-xs">
                      N°{String(idx + 1).padStart(2, "0")}
                    </p>
                    <h3 className="font-display text-2xl leading-tight">{o.name ?? "Untitled"}</h3>
                    {o.notes && <p className="mt-1 text-sm text-ink/70">{o.notes}</p>}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {o.items.map((it) => (
                        <div
                          key={it.garment_id}
                          className="h-16 w-16 overflow-hidden rounded-xl border-2 border-ink bg-white"
                          title={it.name ?? ""}
                        >
                          {it.image && (
                            <img src={it.image} alt="" className="h-full w-full object-cover" />
                          )}
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
