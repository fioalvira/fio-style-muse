import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import hero from "@/assets/hero-editorial.jpg";
import insp1 from "@/assets/insp-1.jpg";
import insp5 from "@/assets/insp-5.jpg";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Enter Fio" }] }),
  component: Auth,
});

function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [step, setStep] = useState(0);

  const onboardSteps = [
    {
      eyebrow: "N°01",
      title: "Welcome to your atelier",
      body: "Fio is a private place for the clothes you love. Photograph each piece, and we'll archive it like a magazine.",
      image: insp5,
    },
    {
      eyebrow: "N°02",
      title: "Style, generated softly",
      body: "Tell Fio what your day looks like. We'll compose outfits from your real wardrobe — never from a catalogue.",
      image: hero,
    },
    {
      eyebrow: "N°03",
      title: "An evolving moodboard",
      body: "Save the images that move you. Fio learns your eye and weaves it into every suggestion.",
      image: insp1,
    },
  ];

  if (step < onboardSteps.length) {
    const s = onboardSteps[step];
    return (
      <div className="min-h-screen gradient-warm">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-2 md:py-20">
          <div className="relative overflow-hidden rounded-[3rem] shadow-float">
            <img src={s.image} alt="" className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="editorial-number text-coral">{s.eyebrow}</span>
            <h2 className="mt-3 font-display text-5xl leading-tight">{s.title}</h2>
            <p className="mt-6 text-lg text-espresso/70">{s.body}</p>

            <div className="mt-10 flex items-center gap-3">
              {onboardSteps.map((_, i) => (
                <span
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i === step ? "w-10 bg-coral" : "w-2 bg-espresso/20"
                  }`}
                />
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="rounded-full glass px-6 py-3 text-espresso"
                >
                  Back
                </button>
              )}
              <button
                onClick={() => setStep(step + 1)}
                className="rounded-full bg-espresso px-7 py-3 text-cream shadow-soft"
              >
                {step === onboardSteps.length - 1 ? "Create my atelier" : "Continue"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-warm">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-2 md:py-20">
        <div className="relative hidden overflow-hidden rounded-[3rem] shadow-float md:block">
          <img src={hero} alt="" className="h-full w-full object-cover" loading="lazy" />
          <div className="absolute bottom-6 left-6 right-6 glass rounded-[2rem] p-5">
            <p className="editorial-number text-coral text-sm">A note from Fio</p>
            <p className="mt-1 font-display text-xl">"Dress as the person you want to be seen as."</p>
          </div>
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

          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/wardrobe" });
            }}
            className="mt-8 space-y-4"
          >
            {mode === "signup" && (
              <Field label="Your name" placeholder="Eloise Marin" />
            )}
            <Field label="Email" type="email" placeholder="hello@fio.studio" />
            <Field label="Password" type="password" placeholder="••••••••" />

            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-espresso py-4 text-cream shadow-soft transition hover:opacity-95"
            >
              {mode === "signup" ? "Enter the atelier" : "Sign in"}
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
