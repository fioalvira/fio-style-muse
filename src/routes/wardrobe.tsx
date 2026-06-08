import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { GarmentDetail } from "@/components/GarmentDetail";

export const Route = createFileRoute("/wardrobe")({
  head: () => ({ meta: [{ title: "My Wardrobe — Fio" }] }),
  component: Wardrobe,
});

export type Garment = {
  id: string;
  name: string | null;
  category: string | null;
  subcategory: string | null;
  image_original_url: string | null;
  image_catalog_url: string | null;
  primary_color: string | null;
  material: string | null;
  season: string | null;
  notes: string | null;
  favorite: boolean;
  times_worn: number;
  last_worn: string | null;
};

const tones = ["bg-pink", "bg-mustard", "bg-cream", "bg-cobalt/15", "bg-forest/15", "bg-orange/20"];
const tilts = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "rotate-0", "-rotate-3"];

const catLabel: Record<string, string> = {
  top: "Top",
  bottom: "Bottom",
  dress: "Dress",
  outerwear: "Outerwear",
  shoes: "Shoes",
  accessory: "Accessory",
  bag: "Bag",
};

const seasonLabel: Record<string, string> = {
  spring: "Spring",
  summer: "Summer",
  autumn: "Autumn",
  winter: "Winter",
  all: "All seasons",
};

function Wardrobe() {
  const { user } = useAuth();
  const [items, setItems] = useState<Garment[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [favOnly, setFavOnly] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [filterCats, setFilterCats] = useState<Set<string>>(new Set());
  const [filterColors, setFilterColors] = useState<Set<string>>(new Set());
  const [filterMaterials, setFilterMaterials] = useState<Set<string>>(new Set());
  const [filterSeasons, setFilterSeasons] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("garments")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setItems(data as Garment[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleFavorite = async (g: Garment, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !g.favorite;
    setItems((arr) => arr.map((i) => (i.id === g.id ? { ...i, favorite: next } : i)));
    await supabase.from("garments").update({ favorite: next }).eq("id", g.id);
  };

  const allCats = useMemo(() => {
    const s = new Set<string>();
    items.forEach((i) => { if (i.category) s.add(i.category.toLowerCase()); });
    return Array.from(s).sort();
  }, [items]);

  const allColors = useMemo(() => {
    const s = new Set<string>();
    items.forEach((i) => { if (i.primary_color) s.add(i.primary_color.toLowerCase()); });
    return Array.from(s).sort();
  }, [items]);

  const allMaterials = useMemo(() => {
    const s = new Set<string>();
    items.forEach((i) => { if (i.material) s.add(i.material.toLowerCase()); });
    return Array.from(s).sort();
  }, [items]);

  const allSeasons = useMemo(() => {
    const s = new Set<string>();
    items.forEach((i) => { if (i.season) s.add(i.season.toLowerCase()); });
    return Array.from(s).sort();
  }, [items]);

  const filtered = items.filter((i) => {
    if (favOnly && !i.favorite) return false;
    if (q && !(i.name ?? "").toLowerCase().includes(q.toLowerCase())) return false;
    if (filterCats.size > 0 && !filterCats.has((i.category ?? "").toLowerCase())) return false;
    if (filterColors.size > 0 && !filterColors.has((i.primary_color ?? "").toLowerCase())) return false;
    if (filterMaterials.size > 0 && !filterMaterials.has((i.material ?? "").toLowerCase())) return false;
    if (filterSeasons.size > 0 && !filterSeasons.has((i.season ?? "").toLowerCase())) return false;
    return true;
  });

  const activeCount =
    filterCats.size + filterColors.size + filterMaterials.size + filterSeasons.size + (favOnly ? 1 : 0);

  const clearFilters = () => {
    setFilterCats(new Set());
    setFilterColors(new Set());
    setFilterMaterials(new Set());
    setFilterSeasons(new Set());
    setFavOnly(false);
    setQ("");
  };

  const selected = items.find((i) => i.id === selectedId) ?? null;

  const toggleSet = (set: Set<string>, val: string) => {
    const next = new Set(set);
    if (next.has(val)) next.delete(val); else next.add(val);
    return next;
  };

  return (
    <div className="space-y-10">
      <section className="relative grid grid-cols-1 items-end gap-8 md:grid-cols-12">
        <div className="md:col-span-7">
          <span className="editorial-number inline-block rounded-full border-2 border-ink bg-mustard px-3 py-1 text-sm">
            N°02 — The Shelf
          </span>
          <h1 className="mt-4 font-display text-5xl md:text-7xl">
            My <span className="italic text-cherry">little</span> collection
          </h1>
          <p className="mt-4 max-w-md text-ink/75">
            {filtered.length} {filtered.length === 1 ? "piece" : "pieces"} shown
            {items.length !== filtered.length && ` of ${items.length} total`}, arranged like objects on a curated apartment shelf.
          </p>
        </div>
        <div className="md:col-span-5 space-y-3">
          <div className="glass shadow-pop flex items-center gap-3 rounded-full border-2 border-ink px-5 py-3">
            <SearchIcon />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="search your pieces…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-ink/40"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFavOnly((v) => !v)}
              className={`rounded-full border-2 border-ink px-4 py-2 text-sm shadow-pop transition ${
                favOnly ? "bg-cherry text-cream" : "bg-cream"
              }`}
            >
              ♥ Favorites {favOnly ? "on" : "off"}
            </button>
            <Link
              to="/add"
              className="rounded-full border-2 border-ink bg-cherry px-5 py-2 text-sm text-cream shadow-pop"
            >
              + Add a piece
            </Link>
          </div>
        </div>
      </section>

      {!loading && items.length > 0 && (
        <div className="space-y-4 rounded-[2rem] border-2 border-ink bg-cream/60 p-5 shadow-pop">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-bold uppercase tracking-widest text-ink/60">Filters</span>
            {activeCount > 0 && (
              <button
                onClick={clearFilters}
                className="rounded-full border-2 border-ink bg-cream px-3 py-1 text-xs shadow-pop transition hover:bg-cherry hover:text-cream"
              >
                Clear all
              </button>
            )}
          </div>

          {allCats.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.18em] text-ink/50">Category</span>
              {allCats.map((c) => {
                const on = filterCats.has(c);
                return (
                  <button
                    key={c}
                    onClick={() => setFilterCats(toggleSet(filterCats, c))}
                    className={`rounded-full border-2 border-ink px-3 py-1 text-xs shadow-pop transition ${
                      on ? "bg-cobalt text-cream" : "bg-cream"
                    }`}
                  >
                    {catLabel[c] ?? c}
                  </button>
                );
              })}
            </div>
          )}

          {allColors.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.18em] text-ink/50">Color</span>
              {allColors.map((c) => {
                const on = filterColors.has(c);
                return (
                  <button
                    key={c}
                    onClick={() => setFilterColors(toggleSet(filterColors, c))}
                    className={`flex items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1 text-xs shadow-pop transition ${
                      on ? "bg-ink text-cream" : "bg-cream"
                    }`}
                  >
                    <span
                      className="inline-block h-3 w-3 rounded-full border border-ink/40"
                      style={{ background: c }}
                    />
                    {c}
                  </button>
                );
              })}
            </div>
          )}

          {allMaterials.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.18em] text-ink/50">Material</span>
              {allMaterials.map((m) => {
                const on = filterMaterials.has(m);
                return (
                  <button
                    key={m}
                    onClick={() => setFilterMaterials(toggleSet(filterMaterials, m))}
                    className={`rounded-full border-2 border-ink px-3 py-1 text-xs shadow-pop transition ${
                      on ? "bg-forest text-cream" : "bg-cream"
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          )}

          {allSeasons.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.18em] text-ink/50">Season</span>
              {allSeasons.map((s) => {
                const on = filterSeasons.has(s);
                return (
                  <button
                    key={s}
                    onClick={() => setFilterSeasons(toggleSet(filterSeasons, s))}
                    className={`rounded-full border-2 border-ink px-3 py-1 text-xs shadow-pop transition ${
                      on ? "bg-orange text-cream" : "bg-cream"
                    }`}
                  >
                    {seasonLabel[s] ?? s}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="rounded-[2rem] border-2 border-dashed border-ink/30 bg-cream/60 p-10 text-center text-ink/60">
          Loading your collection…
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="rounded-[2.5rem] border-2 border-ink bg-cream/80 p-12 text-center shadow-pop">
          <p className="editorial-number text-coral">A blank page</p>
          <h2 className="mt-3 font-display text-4xl">Your collection is still empty.</h2>
          <p className="mt-3 text-ink/70">Add your first piece to begin building your archive.</p>
          <Link
            to="/add"
            className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-cherry px-6 py-3 text-cream shadow-pop"
          >
            + Add your first piece
          </Link>
        </div>
      )}

      {!loading && items.length > 0 && filtered.length === 0 && (
        <div className="rounded-[2.5rem] border-2 border-ink bg-cream/80 p-12 text-center shadow-pop">
          <p className="editorial-number text-coral">Nothing here</p>
          <h2 className="mt-3 font-display text-4xl">No pieces match your filters.</h2>
          <button
            onClick={clearFilters}
            className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-cherry px-6 py-3 text-cream shadow-pop"
          >
            Reset filters
          </button>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <section className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item, idx) => {
            const tone = tones[idx % tones.length];
            const tilt = tilts[idx % tilts.length];
            const img = item.image_catalog_url || item.image_original_url;
            return (
              <article
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`group relative cursor-pointer rounded-[2.25rem] border-2 border-ink ${tone} p-3 shadow-pop transition hover:-translate-y-1 hover:rotate-0 ${tilt}`}
              >
                <button
                  onClick={(e) => toggleFavorite(item, e)}
                  className={`absolute -top-2 -left-2 z-10 grid h-9 w-9 place-items-center rounded-full border-2 border-ink shadow-pop ${
                    item.favorite ? "bg-cherry text-cream" : "bg-cream text-ink/40"
                  }`}
                  aria-label="Toggle favorite"
                >
                  ♥
                </button>
                <div className="relative overflow-hidden rounded-[1.6rem] border-2 border-ink bg-cream">
                  <div className="aspect-[4/5]">
                    {img ? (
                      <img
                        src={img}
                        alt={item.name ?? "Garment"}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-ink/30 font-display">
                        no image
                      </div>
                    )}
                  </div>
                  <span className="editorial-number absolute right-2 top-2 rounded-full border-2 border-ink bg-cream px-2 py-0.5 text-xs">
                    N°{String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex items-center justify-between px-1 pt-3">
                  <div>
                    <p className="font-display text-lg leading-tight">
                      {item.name ?? "Untitled piece"}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-ink/60">
                      {item.category ?? "Uncategorised"}
                      {item.times_worn > 0 && ` · worn ${item.times_worn}×`}
                    </p>
                  </div>
                  {item.primary_color && (
                    <span
                      className="h-6 w-6 rounded-full border-2 border-ink"
                      style={{ background: item.primary_color }}
                    />
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}

      {selected && (
        <GarmentDetail
          garment={selected}
          onClose={() => setSelectedId(null)}
          onChanged={() => {
            load();
          }}
          onDeleted={() => {
            setSelectedId(null);
            load();
          }}
        />
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}
