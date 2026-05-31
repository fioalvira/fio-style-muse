import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_app/add")({
  head: () => ({ meta: [{ title: "Add a Piece — Fio" }] }),
  component: AddItem;
});

function AddItem() {
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<null | {
    name: string;
    category: string;
    color: string;
    fabric: string;
    notes: string;
  }>(null);

  function handleFile(f: File) {
    const url = URL.createObjectURL(f);
    setPreview(url);
    setAnalysis(null);
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysis({
        name: "Cream Silk Blouse",
        category: "Tops",
        color: "Cream",
        fabric: "Silk charmeuse",
        notes:
          "A timeless transitional piece — pairs naturally with your warm coral trouser and espresso accessories.",
      });
    }, 1600);
  }

  return (
    <div className="space-y-10">
      <header>
        <span className="editorial-number text-coral">N°03 — The Intake</span>
        <h1 className="mt-2 font-display text-5xl md:text-6xl">Add a piece</h1>
        <p className="mt-3 max-w-xl text-espresso/70">
          Photograph the piece against any background. Fio will analyse the fabric, colour and silhouette, and write it into your archive.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <label
            className={`relative flex aspect-[4/5] cursor-pointer items-center justify-center overflow-hidden rounded-[2.5rem] border-2 border-dashed transition ${
              preview ? "border-transparent" : "border-coral/40 bg-white/40 hover:bg-white/60"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            {preview ? (
              <img src={preview} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <div className="text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-coral text-cream shadow-soft">
                  +
                </div>
                <p className="mt-4 font-display text-2xl">Upload an image</p>
                <p className="mt-1 text-sm text-espresso/60">JPG or PNG, ideally on a plain background</p>
              </div>
            )}
          </label>
        </div>

        <div className="space-y-5">
          <div className="rounded-[2.5rem] bg-card p-7 shadow-soft">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-blush text-espresso font-display">f</span>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-espresso/50">Fio AI</p>
                <p className="font-display text-lg leading-tight">Visual analysis</p>
              </div>
            </div>

            {!preview && (
              <p className="mt-6 text-espresso/60">
                Upload a photograph to begin. Fio reads the silhouette, fabric and colour story.
              </p>
            )}

            {analyzing && (
              <div className="mt-6 space-y-3">
                {["Reading silhouette…", "Sampling colour palette…", "Composing card…"].map(
                  (s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-coral" />
                      <span className="text-sm text-espresso/70">{s}</span>
                    </div>
                  )
                )}
              </div>
            )}

            {analysis && (
              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
                <Stat label="Category" value={analysis.category} />
                <Stat label="Colour" value={analysis.color} />
                <Stat label="Fabric" value={analysis.fabric} />
                <Stat label="Suggested name" value={analysis.name} />
                <div className="col-span-2">
                  <p className="text-xs uppercase tracking-[0.18em] text-espresso/50">Stylist notes</p>
                  <p className="mt-2 text-espresso/80">{analysis.notes}</p>
                </div>
              </dl>
            )}
          </div>

          {analysis && preview && (
            <div className="overflow-hidden rounded-[2.5rem] bg-card shadow-float">
              <div className="aspect-[4/5] overflow-hidden">
                <img src={preview} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="flex items-center justify-between p-5">
                <div>
                  <p className="font-display text-xl">{analysis.name}</p>
                  <p className="text-xs uppercase tracking-[0.16em] text-espresso/50">
                    {analysis.category} · {analysis.color}
                  </p>
                </div>
                <button className="rounded-full bg-espresso px-5 py-2.5 text-sm text-cream shadow-soft">
                  Save to wardrobe
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.18em] text-espresso/50">{label}</dt>
      <dd className="mt-1 font-display text-lg">{value}</dd>
    </div>
  );
}
