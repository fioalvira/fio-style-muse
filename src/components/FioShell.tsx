import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

const nav = [
  { to: "/wardrobe", label: "Wardrobe" },
  { to: "/add", label: "Add" },
  { to: "/generate", label: "Stylist" },
  { to: "/inspirations", label: "Inspirations" },
  { to: "/profile", label: "Profile" },
] as const;

export function FioShell({ children }: { children: ReactNode }) {
  const { location } = useRouterState();
  return (
    <div className="min-h-screen gradient-warm">
      <header className="sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 pt-5">
          <div className="glass shadow-glass flex items-center justify-between rounded-full px-5 py-3">
            <Link to="/wardrobe" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-espresso text-cream font-display text-lg">f</span>
              <span className="font-display text-xl tracking-tight">Fio</span>
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {nav.map((n) => {
                const active = location.pathname.startsWith(n.to);
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      active ? "bg-espresso text-cream" : "text-espresso/70 hover:text-espresso"
                    }`}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>
            <Link
              to="/profile"
              className="grid h-9 w-9 place-items-center rounded-full bg-blush text-espresso font-display"
              aria-label="Profile"
            >
              E
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-8">
        {children}
      </main>
      <nav className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 md:hidden">
        <div className="glass shadow-float flex gap-1 rounded-full p-1.5">
          {nav.map((n) => {
            const active = location.pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`rounded-full px-3 py-2 text-xs ${active ? "bg-espresso text-cream" : "text-espresso/70"}`}
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
