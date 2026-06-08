import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import heroAsset from "@/assets/moodboard-wall.jpg.asset.json";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
const hero = heroAsset.url;

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Enter Fio" }] }),
  component: Auth,
});

function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/wardrobe" });
  }, [user, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const { error } =
        mode === "signup"
          ? await signUp(email, password, displayName || undefined)
          : await signIn(email, password);

      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success(mode === "signup" ? "Welcome to your atelier" : "Welcome back");
      navigate({ to: "/wardrobe" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-screen gradient-warm">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-2 md:py-20">
        <Link
          to="/"
          aria-label="Back to home"
          className="absolute left-6 top-6 z-10 grid h-11 w-11 place-items-center rounded-full border-2 border-ink bg-cream shadow-pop transition hover:-translate-x-0.5"
        >
          <span className="text-xl">←</span>
        </Link>
        <div className="relative hidden overflow-hidden rounded-[3rem] shadow-float md:block">
          <img src={hero} alt="" className="h-full w-full object-cover" loading="lazy" />
        </div>

        <div className="flex flex-col justify-center">
          <span className="editorial-number text-coral">The Atelier</span>
          <h2 className="mt-2 font-display text-5xl">
            {mode === "signup" ? "Begin." : "Welcome back."}
          </h2>
          <p className="mt-3 text-espresso/70">
            {mode === "signup"
              ? "A few details and your atelier is yours."
              : "Sign in to your private wardrobe."}
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            {mode === "signup" && (
              <Field
                label="Your name"
                placeholder="Eloise Marin"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            )}
            <Field
              label="Email"
              type="email"
              required
              placeholder="hello@fio.studio"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Field
              label="Password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full rounded-full bg-espresso py-4 text-cream shadow-soft transition hover:opacity-95 disabled:opacity-60"
            >
              {submitting ? "One moment…" : mode === "signup" ? "Enter the atelier" : "Sign in"}
            </button>
          </form>

          <button
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            className="mt-6 text-sm text-espresso/60 hover:text-espresso"
          >
            {mode === "signup" ? "Already a member? Sign in" : "New to Fio? Create your atelier"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="ml-4 text-xs uppercase tracking-[0.18em] text-espresso/60">{label}</span>
      <input
        {...rest}
        className="mt-2 w-full rounded-full border-0 bg-white/70 px-6 py-4 text-espresso shadow-glass outline-none ring-1 ring-border focus:ring-2 focus:ring-coral"
      />
    </label>
  );
}
