import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import hero from "@/assets/hero-editorial.jpg";
import insp1 from "@/assets/insp-1.jpg";
import insp2 from "@/assets/insp-2.jpg";
import insp3 from "@/assets/insp-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fio — A wardrobe that plays" },
      { name: "description", content: "Fio is a playful AI wardrobe and stylist — colored glass, curved objects and a Pinterest moodboard energy." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Floor of color */}
      <div className="absolute inset-0 -z-10 gradient-warm" />
      <div aria-hidden className="absolute inset-0 -z-10 opacity-[0.06] pattern-grid" />

      {/* Decorative objects */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -left-20 top-24 h-80 w-80 blob bg-pink shadow-soft" />
        <div className="absolute right-[-4rem] top-10 h-72 w-72 blob-2 bg-mustard shadow-soft" />
        <div className="absolute left-[8%] bottom-[8%] h-40 w-40 rounded-full bg-cobalt shadow-pop-cherry" />
        <div className="absolute right-[18%] bottom-[12%] h-28 w-28 pebble bg-forest" />
        <svg className="absolute left-[44%] top-[12%] h-16 w-40 text-cherry" viewBox="0 0 200 50" fill="none">
          <path d="M5 25 C 25 5, 45 45, 65 25 S 105 5, 125 25 S 165 45, 195 25" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        </svg>
      </div>

      <header className="relative mx-auto flex max-w-7xl items-center justify-between px-6 pt-7">
        <div className="flex items-center gap-2">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-cherry text-cream font-display text-xl border-2 border-ink shadow-pop-cobalt">f</span>
          <span className="font-display text-3xl">Fio</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/wardrobe"
            className="hidden rounded-full border-2 border-ink bg-cream px-5 py-2.5 text-sm font-medium shadow-pop transition hover:translate-y-[-2px] sm:inline-block"
          >
            Peek inside
          </Link>
          <Link
            to="/auth"
            className="rounded-full border-2 border-ink bg-cobalt px-5 py-2.5 text-sm font-medium text-cream shadow-pop transition hover:translate-y-[-2px]"
          >
            Enter
          </Link>
        </div>
      </header>

      <section className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pt-14 pb-20 md:grid-cols-12 md:pt-20">
        <div className="md:col-span-7">
          <span className="editorial-number rounded-full border-2 border-ink bg-mustard px-3 py-1 text-sm">
            N°01 — The Curated Apartment
          </span>
          <h1 className="mt-5 font-display text-[clamp(3rem,8.5vw,7rem)] font-medium leading-[0.92] tracking-tight">
            A wardrobe that{" "}
            <em className="not-italic">
              <span className="relative inline-block">
                <span className="relative z-10 text-cream px-3">plays</span>
                <span className="absolute inset-0 -z-0 -rotate-2 rounded-2xl bg-cherry shadow-pop-cobalt" />
              </span>
            </em>{" "}
            with you.
          </h1>
          <p className="mt-7 max-w-lg text-lg text-ink/75">
            Photograph the pieces you love. Fio arranges them like collectible objects on a shelf, then plays stylist — pulling outfits out of your closet like a curious friend on a Sunday afternoon.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate({ to: "/auth" })}
              className="rounded-full border-2 border-ink bg-orange px-7 py-4 text-cream shadow-pop transition hover:translate-y-[-2px]"
            >
              Begin the ritual →
            </button>
            <Link
              to="/wardrobe"
              className="rounded-full border-2 border-ink bg-cream px-7 py-4 shadow-pop-cherry transition hover:translate-y-[-2px]"
            >
              Preview the app
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-6">
            <Swatch hex="var(--pink)" label="Warm pink" />
            <Swatch hex="var(--orange)" label="Burnt orange" />
            <Swatch hex="var(--cherry)" label="Cherry" />
            <Swatch hex="var(--cobalt)" label="Cobalt" />
            <Swatch hex="var(--forest)" label="Forest" />
            <Swatch hex="var(--mustard)" label="Mustard" />
          </div>
        </div>

        {/* Collectible composition */}
        <div className="relative md:col-span-5">
          <div className="relative aspect-[4/5] w-full">
            {/* Big curved card */}
            <div className="absolute inset-0 overflow-hidden rounded-[3.5rem] border-2 border-ink shadow-pop">
              <img src={hero} alt="A styled outfit" className="h-full w-full object-cover" />
            </div>

            {/* Floating colored glass block — top right */}
            <div className="glass-cobalt absolute -right-6 -top-6 w-44 rounded-[2rem] border-2 border-ink p-4 shadow-pop">
              <p className="font-display text-2xl leading-tight">Today</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] opacity-90">Coral silk · Cream light</p>
            </div>

            {/* Inspiration polaroid */}
            <div className="absolute -left-8 top-[40%] w-36 -rotate-6 rounded-2xl border-2 border-ink bg-cream p-2 shadow-pop-cherry">
              <img src={insp2} alt="" className="h-32 w-full rounded-xl object-cover" />
              <p className="mt-1 px-1 text-[11px] text-ink/70">moodboard · 03</p>
            </div>

            {/* Pebble sticker */}
            <div className="sticker absolute -bottom-6 left-12 grid h-20 w-20 place-items-center rounded-full bg-mustard">
              <span className="editorial-number text-xl">N°01</span>
            </div>

            {/* Tiny inspiration */}
            <div className="absolute -right-4 bottom-10 w-28 rotate-3 rounded-2xl border-2 border-ink bg-pink p-2 shadow-pop">
              <img src={insp3} alt="" className="h-20 w-full rounded-xl object-cover" />
              <p className="mt-1 text-center text-[10px] font-medium">saved ♡</p>
            </div>

            {/* Squiggle */}
            <svg className="absolute -left-10 -top-10 h-16 w-24 text-cherry" viewBox="0 0 120 60" fill="none">
              <path d="M5 30 C 20 5, 35 55, 50 30 S 80 5, 95 30 S 115 50, 118 30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </section>

      {/* Wavy divider */}
      <div aria-hidden className="relative mx-auto max-w-7xl px-6">
        <div className="wavy-divider text-ink/30" />
      </div>

      {/* Three "object" cards */}
      <section className="relative mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-20 md:grid-cols-3">
        <ObjectCard
          tone="bg-pink"
          n="N°02"
          title="A closet that feels like a shelf"
          body="Each piece is photographed, tagged and laid out like a small ceramic object. Browse it for the sheer pleasure."
          img={insp1}
        />
        <ObjectCard
          tone="bg-cobalt text-cream"
          n="N°03"
          title="A stylist who knows your moodboards"
          body="Pin the rooms, outfits and colors you love. Fio reads the room — literally — and proposes outfits in your language."
          img={insp2}
          dark
        />
        <ObjectCard
          tone="bg-mustard"
          n="N°04"
          title="Collectible outfits, not productivity"
          body="Every recommendation arrives like an object card you can save, flip and revisit. Nothing here looks like a dashboard."
          img={insp3}
        />
      </section>
    </div>
  );
}

function Swatch({ hex, label }: { hex: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span
        className="h-7 w-7 rounded-full border-2 border-ink shadow-pop-cherry"
        style={{ background: hex }}
      />
      <span className="text-[10px] uppercase tracking-[0.12em] text-ink/60">{label}</span>
    </div>
  );
}

function ObjectCard({
  tone, n, title, body, img, dark,
}: { tone: string; n: string; title: string; body: string; img: string; dark?: boolean }) {
  return (
    <article className={`relative rounded-[2.5rem] border-2 border-ink ${tone} p-6 shadow-pop transition hover:-translate-y-1`}>
      <span className={`editorial-number text-sm ${dark ? "text-cream/80" : "text-ink/60"}`}>{n}</span>
      <div className="mt-3 overflow-hidden rounded-[1.75rem] border-2 border-ink">
        <img src={img} alt="" className="h-48 w-full object-cover" />
      </div>
      <h3 className="mt-4 font-display text-2xl leading-tight">{title}</h3>
      <p className={`mt-2 text-sm ${dark ? "text-cream/80" : "text-ink/75"}`}>{body}</p>
    </article>
  );
}
