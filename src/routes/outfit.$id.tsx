import { createFileRoute, Link } from "@tanstack/react-router";
import { sampleOutfit } from "@/lib/fio-data";

export const Route = createFileRoute("/outfit/$id")({
  head: () => ({ meta: [{ title: "Outfit — Fio" }] }),
  component: OutfitDetail,
});

function OutfitDetail() {
  const { id } = Route.useParams();
  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
      <div className="md:col-span-7">
        <div className="relative overflow-hidden rounded-[3rem] shadow-float">
          <img src={sampleOutfit.image} alt={sampleOutfit.title} className="w-full object-cover" loading="lazy" />
          <span className="editorial-number absolute left-6 top-5 text-cream">N°0{id}</span>
        </div>
      </div>

      <div className="md:col-span-5">
        <Link to="/generate" className="text-sm text-espresso/60 hover:text-espresso">
          ← Back to stylist
        </Link>
        <h1 className="mt-3 font-display text-5xl leading-tight">{sampleOutfit.title}</h1>

        <div className="mt-6 rounded-[2rem] glass p-6">
          <p className="editorial-number text-coral text-sm">Why this works</p>
          <p className="mt-2 leading-relaxed text-espresso/80">{sampleOutfit.reasoning}</p>
        </div>

        <div className="mt-8">
          <p className="text-xs uppercase tracking-[0.18em] text-espresso/50">The pieces</p>
          <ul className="mt-3 space-y-3">
            {sampleOutfit.pieces.map((p) => (
              <li key={p.id} className="flex items-center gap-4 rounded-[1.5rem] bg-card p-3 shadow-glass">
                <img src={p.image} alt={p.name} className="h-16 w-16 rounded-2xl object-cover" />
                <div className="flex-1">
                  <p className="font-display text-lg leading-tight">{p.name}</p>
                  <p className="text-xs uppercase tracking-[0.16em] text-espresso/50">{p.category}</p>
                </div>
                <span className="h-5 w-5 rounded-full ring-1 ring-border" style={{ background: p.colorHex }} />
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex gap-3">
          <button className="flex-1 rounded-full bg-espresso py-4 text-cream shadow-soft">
            Save this outfit
          </button>
          <button className="rounded-full glass px-6 py-4 text-espresso">↻</button>
        </div>
      </div>
    </div>
  );
}
