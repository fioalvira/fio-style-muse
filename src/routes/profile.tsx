import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { palette } from "@/lib/fio-data";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/profile")({
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
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState<string>("");
  const [favColors, setFavColors] = useState<string[]>([]);
  const [favA, setFavA] = useState<string[]>([]);
  const [counts, setCounts] = useState({ pieces: 0, outfits: 0, pins: 0 });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [profileRes, colorsRes, aestheticsRes, gC, oC, iC] = await Promise.all([
        supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle(),
        supabase.from("favorite_colors").select("color_name").eq("user_id", user.id),
        supabase.from("user_aesthetics").select("aesthetic_name").eq("user_id", user.id),
        supabase.from("garments").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("outfits").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("inspirations").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);
      setDisplayName(profileRes.data?.display_name || user.email || "");
      setFavColors((colorsRes.data ?? []).map((r) => r.color_name));
      setFavA((aestheticsRes.data ?? []).map((r) => r.aesthetic_name));
      setCounts({ pieces: gC.count ?? 0, outfits: oC.count ?? 0, pins: iC.count ?? 0 });
    })();
  }, [user]);

  const toggleColor = async (name: string) => {
    if (!user) return;
    if (favColors.includes(name)) {
      setFavColors((l) => l.filter((x) => x !== name));
      await supabase.from("favorite_colors").delete().eq("user_id", user.id).eq("color_name", name);
    } else {
      setFavColors((l) => [...l, name]);
      await supabase.from("favorite_colors").insert({ user_id: user.id, color_name: name });
    }
  };

  const toggleAesthetic = async (name: string) => {
    if (!user) return;
    if (favA.includes(name)) {
      setFavA((l) => l.filter((x) => x !== name));
      await supabase.from("user_aesthetics").delete().eq("user_id", user.id).eq("aesthetic_name", name);
    } else {
      setFavA((l) => [...l, name]);
      await supabase.from("user_aesthetics").insert({ user_id: user.id, aesthetic_name: name });
    }
  };

  const initial = (displayName || user?.email || "·").trim().charAt(0).toUpperCase();

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
      <aside className="md:col-span-4">
        <div className="rounded-[2.5rem] bg-card p-8 shadow-float text-center">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-blush font-display text-4xl text-espresso">
            {initial}
          </div>
          <h2 className="mt-5 font-display text-3xl break-words">{displayName || "—"}</h2>
          <p className="text-sm text-espresso/60">{user?.email}</p>
          <div className="mt-6 grid grid-cols-3 gap-2 text-center">
            <Stat n={String(counts.pieces)} label="Pieces" />
            <Stat n={String(counts.outfits)} label="Outfits" />
            <Stat n={String(counts.pins)} label="Pins" />
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
              const on = favColors.includes(p.name);
              return (
                <button
                  key={p.name}
                  onClick={() => toggleColor(p.name)}
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
                  onClick={() => toggleAesthetic(a)}
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
