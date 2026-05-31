import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import hero from "@/assets/hero-editorial.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fio — Your AI Atelier" },
      { name: "description", content: "Fio is an AI-powered wardrobe and stylist for a more considered, beautiful daily ritual." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen gradient-warm">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 pt-7">
        <div className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-espresso text-cream font-display">f</span>
          <span className="font-display text-2xl">Fio</span>
        </div>
        <Link
          to="/auth"
          className="rounded-full bg-espresso px-5 py-2.5 text-sm text-cream transition hover:opacity-90"
        >
          Enter
        </Link>
      </header>

      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pt-16 pb-24 md:grid-cols-12 md:pt-24">
        <div className="md:col-span-6">
          <span className="editorial-number text-coral">N°01 — Autumn Edit</span>
          <h1 className="mt-4 font-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] tracking-tight">
            A wardrobe that <em className="text-coral">thinks</em> with you.
          </h1>
          <p className="mt-6 max-w-md text-lg text-espresso/70">
            Fio is your private atelier — part archive, part stylist. Photograph the pieces you love, and let our AI compose the outfits you'll want to wear all season.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate({ to: "/auth" })}
              className="rounded-full bg-espresso px-7 py-4 text-cream shadow-float transition hover:translate-y-[-2px]"
            >
              Begin the ritual
            </button>
            <Link to="/wardrobe" className="rounded-full glass px-7 py-4 text-espresso">
              Preview the app
            </Link>
          </div>
        </div>

        <div className="relative md:col-span-6">
          <div className="absolute -left-10 top-10 h-64 w-64 rounded-full bg-blush opacity-70 blur-3xl" />
          <div className="absolute -right-6 bottom-0 h-72 w-72 blob bg-coral/30 blur-2xl" />
          <div className="relative overflow-hidden rounded-[3rem] shadow-float">
            <img
              src={hero}
              alt="Editorial fashion portrait in coral silk"
              className="h-full w-full object-cover"
              width={1080}
              height={1600}
            />
            <div className="absolute bottom-5 left-5 right-5 glass rounded-[2rem] px-5 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-espresso/60">Today's outfit</p>
              <p className="mt-1 font-display text-xl">Coral Silk, Cream Light</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
