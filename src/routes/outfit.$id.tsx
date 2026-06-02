import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/outfit/$id")({
  head: () => ({ meta: [{ title: "Outfit — Fio" }] }),
  component: OutfitDetail,
});

function OutfitDetail() {
  const { id } = Route.useParams();
  const [outfit, setOutfit] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("outfits")
        .select("id, name, notes, created_at, outfit_items(garment_id, garments(id, name, category, primary_color, image_original_url, image_catalog_url))")
        .eq("id", id)
        .maybeSingle();
      setOutfit(data);
      setLoading(false);
    })();
  }, [id]);

  if (loading) return <p className="text-ink/60">Loading…</p>;
  if (!outfit)
    return (
      <div className="rounded-[2rem] border-2 border-ink bg-cream p-8 text-center shadow-pop">
        <p>Outfit not found.</p>
        <Link to="/generate" className="mt-3 inline-block underline">← Back to outfits</Link>
      </div>
    );

  const pieces = (outfit.outfit_items ?? []).map((it: any) => it.garments).filter(Boolean);

  return (
    <div className="space-y-8">
      <Link to="/generate" className="text-sm text-ink/60 hover:text-ink">← Back to outfits</Link>
      <header>
        <h1 className="font-display text-5xl">{outfit.name ?? "Untitled"}</h1>
        {outfit.notes && <p className="mt-3 max-w-xl text-ink/70">{outfit.notes}</p>}
      </header>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {pieces.map((p: any) => {
          const img = p.image_catalog_url || p.image_original_url;
          return (
            <li key={p.id} className="rounded-[1.5rem] border-2 border-ink bg-cream p-3 shadow-pop">
              <div className="aspect-[4/5] overflow-hidden rounded-xl border-2 border-ink bg-white">
                {img && <img src={img} alt={p.name ?? ""} className="h-full w-full object-cover" />}
              </div>
              <p className="mt-2 font-display text-lg leading-tight">{p.name ?? "Untitled"}</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-ink/60">{p.category ?? "—"}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
