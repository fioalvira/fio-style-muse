import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { inspirations } from "@/lib/fio-data";

export const Route = createFileRoute("/inspirations")({
  head: () => ({ meta: [{ title: "Inspirations — Fio" }] }),
  component: Inspirations,
});

function Inspirations() {
  const [saved, setSaved] = useState<Set<string>>(new Set(["i2", "i5"]));
  function toggle(id: string) {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  return (
    <div className="space-y-10">
      <header className="max-w-2xl">
        <span className="editorial-number text-coral">N°05 — The Moodboard</span>
        <h1 className="mt-2 font-display text-5xl md:text-7xl">Inspirations</h1>
        <p className="mt-4 text-espresso/70">
          The images that move you. Fio weaves them into the way your outfits are composed.
        </p>
      </header>

      <div className="columns-2 gap-5 md:columns-3 lg:columns-4 [&>*]:mb-5">
        {inspirations.map((i) => {
          const isSaved = saved.has(i.id);
          return (
            <figure key={i.id} className="group relative break-inside-avoid overflow-hidden rounded-[2rem] bg-card shadow-soft">
              <img
                src={i.image}
                alt=""
                className="w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                style={{ height: i.h }}
                loading="lazy"
              />
              <button
                onClick={() => toggle(i.id)}
                aria-label={isSaved ? "Unsave" : "Save inspiration"}
                className={`absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full shadow-soft transition ${
                  isSaved ? "bg-coral text-cream" : "glass text-espresso"
                }`}
              >
                {isSaved ? "♥" : "♡"}
              </button>
            </figure>
          );
        })}
      </div>
    </div>
  );
}
