import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { sampleOutfit } from "@/lib/fio-data";

export const Route = createFileRoute("/generate")({
  head: () => ({ meta: [{ title: "Stylist — Fio" }] }),
  component: Generate,
});

const prompts = [
  "A gallery opening in Marais",
  "Sunday brunch with old friends",
  "First day of a new role",
  "A late dinner in Lisbon",
];

function Generate() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [shown, setShown] = useState(false);
  const navigate = useNavigate();

  function generate() {
    if (!prompt) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShown(true);
    }, 1400);
  }

  return (
    <div className="space-y-12">
      <header className="max-w-2xl">
        <span className="editorial-number text-coral">N°04 — The Stylist</span>
        <h1 className="mt-2 font-display text-5xl md:text-7xl leading-[0.95]">
          What are you dressing <em className="text-coral">for?</em>
        </h1>
        <p className="mt-5 text-espresso/70">
          Describe the moment. Fio will compose an outfit from the pieces in your wardrobe.
        </p>
      </header>

      <div className="rounded-[3rem] bg-card p-3 shadow-float">
        <div className="flex flex-col gap-3 rounded-[2.5rem] bg-cream/60 p-4 md:flex-row md:items-center">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generate()}
            placeholder="A gallery opening, warm evening…"
            className="flex-1 rounded-full bg-white/80 px-6 py-4 text-lg outline-none placeholder:text-espresso/40 focus:ring-2 focus:ring-coral"
          />
          <button
            onClick={generate}
            disabled={!prompt || loading}
            className="rounded-full bg-coral px-7 py-4 text-cream shadow-soft transition hover:translate-y-[-2px] disabled:opacity-40"
          >
            {loading ? "Composing…" : "Generate outfit"}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 px-4 pb-3 pt-4">
          {prompts.map((p) => (
            <button
              key={p}
              onClick={() => setPrompt(p)}
              className="rounded-full border border-border bg-white/50 px-4 py-2 text-sm text-espresso/70 hover:bg-white"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {shown && (
        <section>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="editorial-number text-coral">Composed for you</p>
              <h2 className="mt-1 font-display text-3xl">Three directions</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <article
                key={i}
                onClick={() => navigate({ to: "/outfit/$id", params: { id: String(i + 1) } })}
                className="group cursor-pointer overflow-hidden rounded-[2.5rem] bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-float"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={sampleOutfit.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="editorial-number text-coral text-sm">N°0{i + 1}</p>
                  <p className="mt-1 font-display text-xl">
                    {["Sunday at the Gallery", "The Warm Editor", "Late Light, Lisbon"][i]}
                  </p>
                  <p className="mt-2 text-sm text-espresso/60">
                    {sampleOutfit.pieces.length} pieces from your wardrobe
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
