import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/wardrobe")({
  head: () => ({ meta: [{ title: "My Wardrobe — Fio" }] }),
  component: Wardrobe,
});

type Garment = {
  id: string;
  name: string | null;
  category: string | null;
  image_original_url: string | null;
  image_catalog_url: string | null;
  primary_color: string | null;
};

const tones = ["bg-pink", "bg-mustard", "bg-cream", "bg-cobalt/15", "bg-forest/15", "bg-orange/20"];
const tilts = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "rotate-0", "-rotate-3"];

function Wardrobe() {
  const { user } = useAuth();
  const [items, setItems] = useState<Garment[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!user) return;
    let alive = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("garments")
        .select("id, name, category, image_original_url, image_catalog_url, primary_color")
        .order("created_at", { ascending: false });
      if (!alive) return;
      if (!error && data) setItems(data as Garment[]);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [user]);

  const filtered = items.filter((i) =>
    q ? (i.name ?? "").toLowerCase().includes(q.toLowerCase()) : true,
  );

  return (
    <div className="space-y-12">
      {/* HERO */}
      <section className="relative grid grid-cols-1 items-end gap-8 md:grid-cols-12">
        <div className="md:col-span-7">
          <span className="editorial-number inline-block rounded-full border-2 border-ink bg-mustard px-3 py-1 text-sm">
            N°02 — The Shelf
          </span>
          <h1 className="mt-4 font-display text-5xl md:text-7xl">
            My <span className="italic text-cherry">little</span> collection
          </h1>
          <p className="mt-4 max-w-md text-ink/75">
            {items.length} {items.length === 1 ? "piece" : "pieces"}, arranged like objects on a curated apartment shelf.
          </p>
        </div>
        <div className="md:col-span-5">
          <div className="glass shadow-pop flex items-center gap-3 rounded-full border-2 border-ink px-5 py-3">
            <SearchIcon />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="search your pieces…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-ink/40"
            />
          </div>
          <Link
            to="/add"
            className="mt-3 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-cherry px-5 py-3 text-sm text-cream shadow-pop transition hover:translate-y-[-2px]"
          >
            + Add a piece
          </Link>
        </div>
      </section>

      {loading && (
        <div className="rounded-[2rem] border-2 border-dashed border-ink/30 bg-cream/60 p-10 text-center text-ink/60">
          Loading your collection…
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="rounded-[2.5rem] border-2 border-ink bg-cream/80 p-12 text-center shadow-pop">
          <p className="editorial-number text-coral">A blank page</p>
          <h2 className="mt-3 font-display text-4xl">Your collection is still empty.</h2>
          <p className="mt-3 text-ink/70">
            Add your first piece to begin building your archive.
          </p>
          <Link
            to="/add"
            className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-cherry px-6 py-3 text-cream shadow-pop"
          >
            + Add your first piece
          </Link>
        </div>
      )}

      {!loading && items.length > 0 && (
        <section className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item, idx) => {
            const tone = tones[idx % tones.length];
            const tilt = tilts[idx % tilts.length];
            const img = item.image_catalog_url || item.image_original_url;
            return (
              <article
                key={item.id}
                className={`group relative rounded-[2.25rem] border-2 border-ink ${tone} p-3 shadow-pop transition hover:-translate-y-1 hover:rotate-0 ${tilt}`}
              >
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
