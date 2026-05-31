import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { items, categories, palette } from "@/lib/fio-data";

export const Route = createFileRoute("/wardrobe")({
  head: () => ({ meta: [{ title: "My Wardrobe — Fio" }] }),
  component: Wardrobe,
});

// Rotating tones for the bubble-like item cards
const tones = [
  "bg-pink",
  "bg-mustard",
  "bg-cream",
  "bg-cobalt/15",
  "bg-forest/15",
  "bg-orange/20",
];

// Tiny per-item rotation for a playful "pinned to corkboard" feeling
const tilts = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "rotate-0", "-rotate-3"];

function Wardrobe() {
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const [color, setColor] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (cat !== "All" && i.category !== cat) return false;
      if (color && i.colorHex !== color) return false;
      if (q && !i.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [cat, color, q]);

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
            {items.length} pieces, arranged like objects on a curated apartment shelf. Tap any to pick it up.
          </p>
        </div>
        <div className="md:col-span-5">
          <div className="glass shadow-pop flex items-center gap-3 rounded-full border-2 border-ink px-5 py-3">
            <SearchIcon />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="search blouses, coats, colours…"
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

      {/* FILTERS */}
      <section className="flex flex-wrap items-center justify-between gap-5">
        <div className="flex flex-wrap gap-2">
          {categories.map((c, i) => {
            const active = cat === c;
            const tone =
              i % 5 === 0 ? "bg-pink"
              : i % 5 === 1 ? "bg-mustard"
              : i % 5 === 2 ? "bg-cobalt text-cream"
              : i % 5 === 3 ? "bg-orange text-cream"
              : "bg-forest text-cream";
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full border-2 border-ink px-5 py-2.5 text-sm font-medium transition ${
                  active ? `${tone} shadow-pop translate-y-[-1px]` : "bg-cream/60 hover:bg-cream"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 rounded-full border-2 border-ink bg-cream/80 px-4 py-2">
          <span className="text-xs uppercase tracking-[0.18em] text-ink/60">Colour</span>
          <button
            onClick={() => setColor(null)}
            className={`h-7 w-7 rounded-full border-2 border-dashed border-ink/60 ${
              color === null ? "ring-2 ring-cobalt ring-offset-2 ring-offset-cream" : ""
            }`}
            aria-label="All colours"
          />
          {palette.map((p) => (
            <button
              key={p.hex}
              onClick={() => setColor(p.hex)}
              className={`h-7 w-7 rounded-full border-2 border-ink transition ${
                color === p.hex ? "ring-2 ring-cobalt ring-offset-2 ring-offset-cream" : ""
              }`}
              style={{ background: p.hex }}
              aria-label={p.name}
            />
          ))}
        </div>
      </section>

      {/* GRID — bubble cards on a shelf */}
      <section className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((item, idx) => {
          const tone = tones[idx % tones.length];
          const tilt = tilts[idx % tilts.length];
          return (
            <article
              key={item.id}
              className={`group relative rounded-[2.25rem] border-2 border-ink ${tone} p-3 shadow-pop transition hover:-translate-y-1 hover:rotate-0 ${tilt}`}
            >
              <div className="relative overflow-hidden rounded-[1.6rem] border-2 border-ink">
                <div className="aspect-[4/5]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <span className="editorial-number absolute right-2 top-2 rounded-full border-2 border-ink bg-cream px-2 py-0.5 text-xs">
                  N°{String(idx + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex items-center justify-between px-1 pt-3">
                <div>
                  <p className="font-display text-lg leading-tight">{item.name}</p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-ink/60">{item.category}</p>
                </div>
                <span
                  className="h-6 w-6 rounded-full border-2 border-ink"
                  style={{ background: item.colorHex }}
                />
              </div>
            </article>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-[2rem] border-2 border-dashed border-ink/40 bg-cream/60 p-10 text-center text-ink/60">
            Nothing matches that combination. Try another colour.
          </div>
        )}
      </section>
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
