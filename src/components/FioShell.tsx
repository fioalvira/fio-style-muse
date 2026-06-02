import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";

const nav = [
  { to: "/wardrobe", label: "Wardrobe", color: "bg-pink" },
  { to: "/add", label: "Add", color: "bg-mustard" },
  { to: "/generate", label: "Outfits", color: "bg-cobalt text-cream" },
  { to: "/inspirations", label: "Moodboard", color: "bg-orange text-cream" },
  { to: "/profile", label: "Profile", color: "bg-forest text-cream" },
] as const;

export function FioShell({ children }: { children: ReactNode }) {
  const { location } = useRouterState();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const initial = (user?.user_metadata?.display_name || user?.email || "E")
    .toString()
    .charAt(0)
    .toUpperCase();
  return (
    <div className="relative min-h-screen">
      {/* floating decorative objects */}
      <FloatingObjects />

      <header className="sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 pt-5 md:px-6">
          <div className="glass shadow-soft flex items-center justify-between gap-3 rounded-full border-2 border-ink/80 px-3 py-2">
            <Link to="/wardrobe" className="flex items-center gap-2 pl-1">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-cherry text-cream font-display text-xl shadow-pop-cobalt border-2 border-ink">
                f
              </span>
              <span className="font-display text-2xl tracking-tight">Fio</span>
            </Link>
            <nav className="hidden items-center gap-1.5 md:flex">
              {nav.map((n) => {
                const active = location.pathname.startsWith(n.to);
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition ${
                      active
                        ? `${n.color} border-ink shadow-pop translate-y-[-1px]`
                        : "border-transparent text-ink/70 hover:text-ink hover:border-ink/30"
                    }`}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="grid h-10 w-10 place-items-center rounded-full bg-cobalt text-cream font-display border-2 border-ink"
                aria-label="Profile"
              >
                {initial}
              </Link>
              <button
                onClick={async () => {
                  await signOut();
                  navigate({ to: "/auth" });
                }}
                className="hidden md:inline-flex rounded-full border-2 border-ink bg-cream px-4 py-2 text-xs font-medium hover:bg-pink"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-28 pt-8 md:px-6">
        {children}
      </main>

      <nav className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 md:hidden">
        <div className="glass shadow-pop flex gap-1 rounded-full border-2 border-ink p-1.5">
          {nav.map((n) => {
            const active = location.pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`rounded-full px-3 py-2 text-xs font-medium ${
                  active ? `${n.color} border-2 border-ink` : "text-ink/70"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function FloatingObjects() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
      <div className="absolute -left-24 top-32 h-72 w-72 blob bg-pink/70 blur-[2px]" />
      <div className="absolute right-[-6rem] top-10 h-80 w-80 blob-2 bg-mustard/60" />
      <div className="absolute left-[10%] bottom-[8%] h-56 w-56 rounded-full bg-cobalt/35 blur-[1px]" />
      <div className="absolute right-[15%] bottom-[20%] h-40 w-40 pebble bg-forest/40" />
      <svg className="absolute left-[40%] top-[20%] h-14 w-14 text-cherry/80" viewBox="0 0 60 60" fill="none">
        <path d="M2 30 C 10 10, 20 50, 30 30 S 50 10, 58 30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <svg className="absolute right-[8%] top-[55%] h-20 w-20 text-cobalt/70" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="3" strokeDasharray="4 8" />
      </svg>
    </div>
  );
}
