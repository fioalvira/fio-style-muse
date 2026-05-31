import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { palette } from "@/lib/fio-data";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Profile — Fio" }] }),
  component: Profile,
});

const aesthetics = [
  "Quiet Luxury",
  "Old Money",
  "Coastal Editorial",
  "Bohemian Soft",
  "Parisian Minimal",
  "Mid-century",
  "Romantic",
  "Modern Classic",
];

function Profile() {
  const [favColors, setFavColors] = useState<string[]>(["#F6C7D5", "#FF8E72"]);
  const [favA, setFavA] = useState<string[]>(["Quiet Luxury", "Mid-century"]);

  const toggle = (v: string, list: string[], set: (l: string[]) => void) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
      <aside className="md:col-span-4">
        <div className="rounded-[2.5rem] bg-card p-8 shadow-float text-center">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-blush font-display text-4xl text-espresso">
            E
          </div>
          <h2 className="mt-5 font-display text-3xl">Eloise Marin</h2>
          <p className="text-sm text-espresso/60">Atelier since 2024</p>
          <div className="mt-6 grid grid-cols-3 gap-2 text-center">
            <Stat n="48" label="Pieces" />
            <Stat n="12" label="Outfits" />
            <Stat n="86" label="Pins" />
          </div>
        </div>
      </aside>

      <div className="space-y-8 md:col-span-8">
        <header>
          <span className="editorial-number text-coral">N°06 — Your Style</span>
          <h1 className="mt-2 font-display text-5xl">Style preferences</h1>
          <p className="mt-3 text-espresso/70">
            The more Fio knows your eye, the more considered every recommendation becomes.
          </p>
        </header>

        <section className="rounded-[2.5rem] bg-card p-7 shadow-soft">
          <p className="text-xs uppercase tracking-[0.18em] text-espresso/50">Favourite colours</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {palette.map((p) => {
              const on = favColors.includes(p.hex);
              return (
                <button
                  key={p.hex}
                  onClick={() => toggle(p.hex, favColors, setFavColors)}
                  className={`flex items-center gap-3 rounded-full p-1.5 pr-5 transition ${
                    on ? "bg-espresso text-cream" : "glass text-espresso/70"
                  }`}
                >
                  <span className="h-8 w-8 rounded-full ring-1 ring-border" style={{ background: p.hex }} />
                  <span className="text-sm">{p.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-[2.5rem] bg-card p-7 shadow-soft">
          <p className="text-xs uppercase tracking-[0.18em] text-espresso/50">Favourite aesthetics</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {aesthetics.map((a) => {
              const on = favA.includes(a);
              return (
                <button
                  key={a}
                  onClick={() => toggle(a, favA, setFavA)}
                  className={`rounded-full px-5 py-2.5 text-sm transition ${
                    on ? "bg-coral text-cream" : "glass text-espresso/70"
                  }`}
                >
                  {a}
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-[2.5rem] glass-blush p-7">
          <p className="editorial-number text-espresso/70">A note from Fio</p>
          <p className="mt-2 font-display text-2xl leading-snug">
            "You lean warm and soft — a wardrobe built around cream, blush and coral, with espresso as your quiet anchor."
          </p>
        </section>
      </div>
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <p className="font-display text-2xl">{n}</p>
      <p className="text-xs uppercase tracking-[0.16em] text-espresso/50">{label}</p>
    </div>
  );
}
