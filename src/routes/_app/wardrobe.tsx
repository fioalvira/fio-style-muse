import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { items, categories, palette } from "@/lib/fio-data";

export const Route = createFileRoute("/_app/wardrobe")({
  head: () => ({ meta: [{ title: "My Wardrobe — Fio" }] }),
  component: Wardrobe,
});

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
    <div className="space-y-10">
      <section className="grid grid-cols-1 items-end gap-8 md:grid-cols-12">
        <div className="md:col-span-7">
          <span className="editorial-number text-coral">N°02 — The Archive</span>
          <h1 className="mt-2 font-display text-5xl md:text-7xl">My Wardrobe</h1>
          <p className="mt-4 max-w-md text-espresso/70">
            {items.length} pieces, catalogued like a private collection.
          </p>
        </div>
        <div className="md:col-span-5">
          <div className="glass shadow-glass flex items-center gap-3 rounded-full px-5 py-3">
            <SearchIcon />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search blouses, coats, colours…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-espresso/40"
            />
          </div>
          <Link
            to="/add"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-coral px-5 py-3 text-sm text-cream shadow-soft"
          >
            + Add a piece
          </Link>
        </div>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-5 py-2.5 text-sm transition ${
                cat === c ? "bg-espresso text-cream" : "glass text-espresso/70 hover:text-espresso"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-[0.18em] text-espresso/50">Colour</span>
          <button
            onClick={() => setColor(null)}
            className={`h-7 w-7 rounded-full border ${color === null ? "ring-2 ring-coral ring-offset-2 ring-offset-cream" : ""}`}
            style={{ background: "transparent", borderStyle: "dashed" }}
            aria-label="All colours"
          />
          {palette.map((p) => (
            <button
              key={p.hex}
              onClick={() => setColor(p.hex)}
              className={`h-7 w-7 rounded-full transition ${color === p.hex ? "ring-2 ring-coral ring-offset-2 ring-offset-cream" : ""}`}
              style={{ background: p.hex }}
              aria-label={p.name}
            />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((item, idx) => (
          <article
            key={item.id}
            className="group relative overflow-hidden rounded-[2rem] bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-float"
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-display text-lg leading-tight">{item.name}</p>
                <p className="text-xs uppercase tracking-[0.16em] text-espresso/50">{item.category}</p>
              </div>
              <span
                className="h-6 w-6 rounded-full ring-1 ring-border"
                style={{ background: item.colorHex }}
              />
            </div>
            <span className="editorial-number absolute right-4 top-3 text-coral">
              N°{String(idx + 1).padStart(2, "0")}
            </span>
          </article>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full rounded-[2rem] glass p-10 text-center text-espresso/60">
            Nothing matches that combination. Try another colour.
          </p>
        )}
      </section>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}
