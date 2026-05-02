import { useLocation } from "wouter";
import { SignIn, SignUp, useUser } from "@clerk/react";
import { useState, useEffect } from "react";
import {
  BookOpen,
  Layers,
  Trophy,
  CheckCircle,
  Zap,
  Sparkles,
  GraduationCap,
  Clock,
  ArrowRight,
  FileText,
} from "lucide-react";
import psychproMark from "@/assets/brand/psychpro-mark.png";

const REAL_TOPICS = [
  "Psychological Disorders", "Personality Disorders", "Neurodevelopmental Disorders",
  "Neurocognitive Disorders", "ADHD & Medications", "Psychopharmacology",
  "Quantitative Statistics & Research Methods", "Qualitative Research Designs",
  "Validity & Effort Testing", "Sleep & Circadian Rhythms",
  "Limbic System & Motivation", "Sensory Pathways",
  "Language Processing & Aphasia", "Apraxia & Agnosia",
  "Cell Biology & Neuron Anatomy", "Neurotransmitters & Synaptic Transmission",
  "Cranial Nerves", "Vascular System of the Brain", "Neuropsychology Overview",
];

const SAMPLE_FLASHCARD = {
  front: "What is the core difference between Broca's and Wernicke's aphasia?",
  back: "Broca's aphasia (left inferior frontal lobe) impairs speech production while comprehension stays largely intact — output is effortful, non-fluent, and agrammatic. Wernicke's aphasia (left posterior superior temporal lobe) preserves fluency but disrupts comprehension — speech flows but is semantically empty, often with paraphasic errors.",
};

function usePrefersReducedMotion(): boolean {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefers(mq.matches);
    const onChange = () => setPrefers(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return prefers;
}

function Starfield({ animate = true, count = 60 }: { animate?: boolean; count?: number }) {
  const stars = Array.from({ length: count }, (_, i) => ({
    x: (i * 73) % 100,
    y: (i * 41) % 100,
    s: 0.5 + ((i * 13) % 18) / 10,
    d: 2 + (i % 5),
  }));
  return (
    <svg className="absolute inset-0 w-full h-full -z-10 pointer-events-none" aria-hidden="true">
      {stars.map((st, i) => (
        <circle
          key={i}
          cx={`${st.x}%`}
          cy={`${st.y}%`}
          r={st.s}
          fill="#BDE5FF"
          opacity={0.35}
        >
          {animate && (
            <animate
              attributeName="opacity"
              values="0.05;0.5;0.05"
              dur={`${st.d}s`}
              begin={`${(i % 6) * 0.4}s`}
              repeatCount="indefinite"
            />
          )}
        </circle>
      ))}
    </svg>
  );
}

const PALETTE = {
  bg: "#061826",
  surface: "#0c2538",
  surfaceElev: "#11324d",
  steel: "#1C4E75",
  teal: "#2FA0C6",
  surf: "#58C9F3",
  mist: "#BDE5FF",
};

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [, navigate] = useLocation();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const animateBg = !reduceMotion;

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate("/dashboard");
    }
  }, [isSignedIn, isLoaded, navigate]);

  if (showSignIn || showSignUp) {
    const isUp = showSignUp;
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        style={{ background: `radial-gradient(circle at 50% 0%, ${PALETTE.steel}55, ${PALETTE.bg} 60%)` }}
      >
        <Starfield animate={animateBg} count={40} />
        <div className="w-full max-w-md relative">
          <button
            className="text-[color:var(--mist)]/70 hover:text-white mb-4 text-sm flex items-center gap-1 transition-colors"
            style={{ ["--mist" as any]: PALETTE.mist }}
            onClick={() => { setShowSignIn(false); setShowSignUp(false); }}
          >
            ← Back
          </button>
          <div
            className="rounded-2xl p-1"
            style={{
              background: `linear-gradient(135deg, ${PALETTE.teal}55, ${PALETTE.surf}22, transparent)`,
            }}
          >
            <div className="rounded-2xl p-2" style={{ background: PALETTE.surface }}>
              {isUp ? (
                <SignUp fallbackRedirectUrl="/onboarding" signInUrl="/sign-in" />
              ) : (
                <SignIn fallbackRedirectUrl="/dashboard" signUpUrl="/sign-up" />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const ctaBtn = `inline-flex items-center justify-center gap-2 rounded-xl text-base font-semibold px-7 h-12 transition-all duration-300`;
  const ctaBtnGradient = `${ctaBtn} bg-gradient-to-br from-[#2FA0C6] to-[#58C9F3] text-[#061826] shadow-[0_14px_40px_-10px_rgba(47,160,198,0.8)] hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_0_0_1px_rgba(189,229,255,0.55),0_18px_50px_-8px_rgba(88,201,243,0.85),0_0_50px_-6px_rgba(88,201,243,0.7)]`;
  const ctaBtnOutline = `${ctaBtn} bg-transparent text-[#BDE5FF] border border-[#58C9F3]/40 hover:-translate-y-0.5 hover:bg-[#58C9F3]/10 hover:border-[#58C9F3] hover:text-white hover:shadow-[0_0_0_1px_rgba(88,201,243,0.45),0_0_28px_-4px_rgba(88,201,243,0.65)]`;

  return (
    <div
      className="min-h-screen overflow-hidden text-white"
      data-testid="landing-page"
      style={{ background: PALETTE.bg, color: PALETTE.mist }}
    >
      {/* NAV */}
      <header
        className="sticky top-0 z-30 backdrop-blur-md border-b"
        style={{ background: `${PALETTE.bg}cc`, borderColor: `${PALETTE.steel}66` }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${PALETTE.teal}, ${PALETTE.surf})` }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="12" r="2" /><circle cx="18" cy="12" r="2" />
                <circle cx="12" cy="6" r="2" /><circle cx="12" cy="18" r="2" />
                <path d="M8 12h8M12 8v8M7.5 7.5l9 9M16.5 7.5l-9 9" />
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-white">PsychPro</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSignIn(true)}
              className="text-sm transition-colors"
              style={{ color: `${PALETTE.mist}cc` }}
              data-testid="header-sign-in"
            >
              Sign In
            </button>
            <button
              onClick={() => setShowSignUp(true)}
              className="text-sm font-semibold rounded-lg px-3.5 h-9 transition-all"
              style={{
                background: `linear-gradient(135deg, ${PALETTE.teal}, ${PALETTE.surf})`,
                color: PALETTE.bg,
                boxShadow: `0 4px 18px -4px ${PALETTE.teal}aa`,
              }}
              data-testid="header-sign-up"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <Starfield animate={animateBg} />
        {/* nebula glows */}
        <div
          className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1100px] h-[700px] rounded-full blur-[140px] -z-10"
          style={{ background: `radial-gradient(circle, ${PALETTE.teal}55, transparent 60%)` }}
          aria-hidden
        />
        <div
          className="absolute top-40 right-[-100px] w-[400px] h-[400px] rounded-full blur-[110px] -z-10"
          style={{ background: `${PALETTE.surf}33` }}
          aria-hidden
        />
        <div
          className="absolute top-20 left-[-100px] w-[350px] h-[350px] rounded-full blur-[110px] -z-10"
          style={{ background: `${PALETTE.steel}55` }}
          aria-hidden
        />

        <div className="max-w-5xl mx-auto px-4 pt-12 md:pt-16 pb-12 md:pb-16 relative">
          <div className="relative flex flex-col items-center text-center">
            {/* Eyebrow pill */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm backdrop-blur-md border mb-10 md:mb-12 z-10"
              style={{
                background: `${PALETTE.surface}cc`,
                borderColor: `${PALETTE.surf}55`,
                color: PALETTE.mist,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: PALETTE.surf }} />
              Built for the next generation of psychologists
            </div>

            {/* Wordmark with ghosted brain behind */}
            <div className="relative w-full flex flex-col items-center">
              {/* Brain ghost layer */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(720px,90vw)] aspect-square opacity-50"
                style={{
                  backgroundImage: `url(${psychproMark})`,
                  backgroundSize: "180% auto",
                  backgroundPosition: "center 18%",
                  backgroundRepeat: "no-repeat",
                  filter: "blur(2px) saturate(140%)",
                  maskImage:
                    "radial-gradient(closest-side, #000 35%, transparent 78%)",
                  WebkitMaskImage:
                    "radial-gradient(closest-side, #000 35%, transparent 78%)",
                }}
              />

              {/* PsychPro wordmark — thin geometric sans */}
              <h1
                className="relative z-10 leading-none select-none"
                style={{
                  fontFamily: '"Outfit", "Inter", system-ui, sans-serif',
                  fontWeight: 300,
                  fontSize: "clamp(64px, 14vw, 168px)",
                  letterSpacing: "-0.01em",
                  textShadow: `0 8px 40px ${PALETTE.bg}cc`,
                }}
              >
                <span style={{ color: "#FFFFFF" }}>Psych</span>
                <span style={{ color: PALETTE.surf }}>Pro</span>
              </h1>

              {/* Tagline */}
              <p
                className="relative z-10 mt-3 md:mt-4 text-xs sm:text-sm md:text-base font-medium"
                style={{
                  color: `${PALETTE.mist}cc`,
                  letterSpacing: "0.32em",
                }}
              >
                LEARN.&nbsp;&nbsp;EXPAND.&nbsp;&nbsp;CONNECT.
              </p>
            </div>

            {/* CTAs */}
            <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center items-center mt-10 md:mt-12">
              <button
                onClick={() => setShowSignUp(true)}
                data-testid="button-start-learning"
                className={ctaBtnGradient}
              >
                Start Learning <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#features"
                data-testid="button-explore-methods"
                className={ctaBtnOutline}
              >
                Explore Methods
              </a>
            </div>

            {/* Benefit line */}
            <p
              className="relative z-10 text-base md:text-lg mt-8 md:mt-10 max-w-2xl mx-auto leading-relaxed"
              style={{ color: `${PALETTE.mist}cc` }}
            >
              Cut your study time in half — and engage in the kind of{" "}
              <span style={{ color: PALETTE.surf }}>deep processing</span> and
              learning that actually sticks.
            </p>

            {/* Trust line */}
            <p
              className="relative z-10 text-sm mt-5 flex items-center justify-center gap-1.5"
              style={{ color: `${PALETTE.mist}99` }}
            >
              <CheckCircle className="w-3.5 h-3.5" style={{ color: PALETTE.surf }} />
              10 free interactions — no credit card required
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section
        className="py-12 border-y"
        style={{
          background: `linear-gradient(180deg, ${PALETTE.surface}, ${PALETTE.bg})`,
          borderColor: `${PALETTE.steel}55`,
        }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { n: "27+", l: "Topics covered" },
              { n: "1,200+", l: "Practice questions" },
              { n: "27+", l: "Study guides" },
            ].map((s) => (
              <div key={s.l}>
                <div
                  className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(135deg, ${PALETTE.surf}, ${PALETTE.mist})` }}
                >
                  {s.n}
                </div>
                <div className="text-sm mt-1" style={{ color: `${PALETTE.mist}99` }}>
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-20 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Four ways to study. One system.
          </h2>
          <p style={{ color: `${PALETTE.mist}99` }}>
            Each mode reinforces the others — built to move information from short-term to long-term recall.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Layers, title: "Flashcards", description: "High-yield decks sorted by difficulty, with spaced review." },
            { icon: BookOpen, title: "Quizzes", description: "10-question multiple-choice sets with detailed clinical rationale." },
            { icon: FileText, title: "Study Guides", description: "Comprehensive notes with tables and frameworks for every topic." },
            { icon: Trophy, title: "Practice Exams", description: "25 or 50-question timed exams to prepare for boards and finals." },
          ].map((feature, i) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl p-6 border transition-all hover:-translate-y-1"
              style={{
                background: `linear-gradient(180deg, ${PALETTE.surface}, ${PALETTE.bg})`,
                borderColor: `${PALETTE.steel}99`,
              }}
            >
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${PALETTE.teal}33, transparent 70%)`,
                }}
              />
              <div
                className="relative w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: `linear-gradient(135deg, ${PALETTE.teal}33, ${PALETTE.surf}22)`,
                  border: `1px solid ${PALETTE.surf}44`,
                }}
              >
                <feature.icon className="w-5 h-5" style={{ color: PALETTE.surf }} />
              </div>
              <h3 className="relative font-semibold text-white mb-2">{feature.title}</h3>
              <p className="relative text-sm leading-relaxed" style={{ color: `${PALETTE.mist}aa` }}>
                {feature.description}
              </p>
              <div
                className="relative mt-3 text-[11px] font-mono uppercase tracking-wider opacity-50"
                style={{ color: PALETTE.surf }}
              >
                0{i + 1}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SAMPLE FLASHCARD */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 text-xs font-semibold rounded-full px-3 py-1 mb-3 border"
              style={{
                background: `${PALETTE.steel}66`,
                color: PALETTE.surf,
                borderColor: `${PALETTE.surf}55`,
              }}
            >
              <Layers className="w-3.5 h-3.5" /> Try it now
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              A real flashcard, on the house.
            </h2>
            <p className="mb-6 leading-relaxed" style={{ color: `${PALETTE.mist}aa` }}>
              Tap the card to flip. Every topic ships with 55+ cards covering core
              concepts, clinical reasoning, and exam-ready content.
            </p>
            <button
              onClick={() => setShowSignUp(true)}
              data-testid="button-try-now"
              className={ctaBtnGradient}
            >
              Get full access free <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            className="select-none group relative w-full text-left rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              ["--tw-ring-color" as any]: PALETTE.surf,
              ["--tw-ring-offset-color" as any]: PALETTE.bg,
            }}
            onClick={() => setFlipped((f) => !f)}
            aria-pressed={flipped}
            aria-label={
              flipped
                ? "Showing answer — press to show question"
                : "Showing question — press to show answer"
            }
            data-testid="sample-flashcard"
          >
            <div
              className="absolute -inset-4 rounded-3xl opacity-50 group-hover:opacity-90 transition-opacity blur-2xl pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 50%, ${PALETTE.teal}, transparent 65%)` }}
              aria-hidden
            />
            <div
              className="relative rounded-2xl p-8 min-h-44 flex flex-col justify-center border transition-all group-hover:-translate-y-1"
              style={{
                background: `linear-gradient(180deg, ${PALETTE.surfaceElev}, ${PALETTE.surface})`,
                borderColor: `${PALETTE.surf}55`,
                boxShadow: `0 20px 60px -20px ${PALETTE.teal}77`,
              }}
            >
              <div
                className="absolute top-3 right-3 text-[11px] font-medium px-2.5 py-0.5 rounded-full border"
                style={{
                  background: `${PALETTE.bg}99`,
                  color: PALETTE.mist,
                  borderColor: `${PALETTE.surf}44`,
                }}
              >
                {flipped ? "Answer" : "Question — tap to flip"}
              </div>
              <p className="text-white text-center leading-relaxed font-medium">
                {flipped ? SAMPLE_FLASHCARD.back : SAMPLE_FLASHCARD.front}
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* TOPICS */}
      <section
        className="py-20 border-y"
        style={{
          background: `linear-gradient(180deg, ${PALETTE.bg}, ${PALETTE.surface}, ${PALETTE.bg})`,
          borderColor: `${PALETTE.steel}55`,
        }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Every topic. Mapped.
            </h2>
            <p style={{ color: `${PALETTE.mist}99` }}>
              Foundations, assessment, intervention, research methods, and clinical
              specialties — all in one place.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            {REAL_TOPICS.map((topic) => (
              <div
                key={topic}
                className="group flex items-center gap-2 text-sm rounded-lg px-3 py-2.5 border bg-[#0c2538]/80 border-[#1C4E75]/60 text-[#BDE5FF] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#11324d]/90 hover:border-[#58C9F3]/80 hover:shadow-[0_0_0_1px_rgba(88,201,243,0.35),0_0_28px_-4px_rgba(88,201,243,0.55)] cursor-pointer"
              >
                <CheckCircle
                  className="w-3.5 h-3.5 flex-shrink-0 transition-all duration-200 text-[#58C9F3] group-hover:text-[#BDE5FF] group-hover:drop-shadow-[0_0_6px_rgba(88,201,243,0.9)]"
                />
                <span className="truncate transition-colors duration-200 group-hover:text-white">{topic}</span>
              </div>
            ))}
            <div
              className="group flex items-center gap-2 text-sm font-medium rounded-lg px-3 py-2.5 border bg-[#2FA0C6]/10 border-[#58C9F3]/40 text-[#58C9F3] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2FA0C6]/20 hover:border-[#58C9F3] hover:shadow-[0_0_0_1px_rgba(88,201,243,0.45),0_0_28px_-4px_rgba(88,201,243,0.7)] cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 flex-shrink-0 transition-all duration-200 group-hover:drop-shadow-[0_0_6px_rgba(88,201,243,0.9)]" />
              <span>+ More being added</span>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="max-w-5xl mx-auto px-4 py-20 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Simple, transparent pricing.
          </h2>
          <p style={{ color: `${PALETTE.mist}99` }}>
            Start free. Upgrade when you're ready for more.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              name: "Free", price: "$0", period: "forever",
              features: ["10 free interactions", "All topics accessible", "Flashcards & quizzes"],
              cta: "Get Started", highlight: false,
            },
            {
              name: "Pro", price: "$9.99", period: "/ month",
              features: ["Unlimited interactions", "All study guides", "Practice exams", "Progress tracking"],
              cta: "Start Free Trial", highlight: true,
            },
            {
              name: "Scholar", price: "$19.99", period: "/ month",
              features: ["Everything in Pro", "AI-generated custom decks", "Upload your own notes", "Priority access to new content"],
              cta: "Go Scholar", highlight: false,
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 flex flex-col border transition-all ${
                plan.highlight ? "md:-translate-y-3" : "hover:-translate-y-1"
              }`}
              style={
                plan.highlight
                  ? {
                      background: `linear-gradient(180deg, ${PALETTE.surfaceElev}, ${PALETTE.surface})`,
                      borderColor: PALETTE.surf,
                      boxShadow: `0 30px 70px -25px ${PALETTE.teal}cc, 0 0 0 1px ${PALETTE.surf}55`,
                    }
                  : {
                      background: `${PALETTE.surface}cc`,
                      borderColor: `${PALETTE.steel}99`,
                    }
              }
            >
              {plan.highlight && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-bold uppercase tracking-wider rounded-full px-3 py-1"
                  style={{
                    background: `linear-gradient(135deg, ${PALETTE.teal}, ${PALETTE.surf})`,
                    color: PALETTE.bg,
                  }}
                >
                  Most Popular
                </div>
              )}
              <h3 className="font-bold text-lg text-white">{plan.name}</h3>
              <div className="mt-1 mb-4">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-sm ml-1" style={{ color: `${PALETTE.mist}99` }}>
                  {plan.period}
                </span>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm" style={{ color: `${PALETTE.mist}cc` }}>
                    <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: PALETTE.surf }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setShowSignUp(true)}
                data-testid={`button-plan-${plan.name.toLowerCase()}`}
                className={
                  plan.highlight
                    ? "w-full rounded-xl h-11 font-semibold transition-all duration-300 bg-gradient-to-br from-[#2FA0C6] to-[#58C9F3] text-[#061826] shadow-[0_10px_30px_-10px_rgba(47,160,198,0.8)] hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(189,229,255,0.55),0_14px_40px_-8px_rgba(88,201,243,0.85),0_0_44px_-6px_rgba(88,201,243,0.7)] hover:brightness-110"
                    : "w-full rounded-xl h-11 font-semibold transition-all duration-300 bg-transparent text-[#BDE5FF] border border-[#58C9F3]/40 hover:-translate-y-0.5 hover:bg-[#58C9F3]/10 hover:border-[#58C9F3] hover:text-white hover:shadow-[0_0_0_1px_rgba(88,201,243,0.45),0_0_28px_-4px_rgba(88,201,243,0.65)]"
                }
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: `linear-gradient(135deg, ${PALETTE.steel}, ${PALETTE.bg} 70%)`,
          }}
        />
        <div
          className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: `${PALETTE.surf}33` }}
          aria-hidden
        />
        <div
          className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: `${PALETTE.teal}55` }}
          aria-hidden
        />
        <div className="max-w-2xl mx-auto text-center px-4 py-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to start studying?
          </h2>
          <p className="mb-8 text-lg" style={{ color: `${PALETTE.mist}cc` }}>
            Join now and get 10 free interactions — no credit card required.
          </p>
          <button
            onClick={() => setShowSignUp(true)}
            data-testid="button-cta"
            className={`${ctaBtn} text-base px-8`}
            style={{
              background: PALETTE.mist,
              color: PALETTE.bg,
              boxShadow: `0 20px 50px -15px ${PALETTE.surf}cc`,
            }}
          >
            Create free account <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="border-t py-8"
        style={{ borderColor: `${PALETTE.steel}55`, background: PALETTE.bg }}
      >
        <div
          className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm"
          style={{ color: PALETTE.mist }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-md"
              style={{ background: `linear-gradient(135deg, ${PALETTE.teal}, ${PALETTE.surf})` }}
            />
            <span>© {new Date().getFullYear()} PsychPro. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <button onClick={() => setShowSignIn(true)} className="hover:text-white transition-colors">Sign In</button>
            <button onClick={() => setShowSignUp(true)} className="hover:text-white transition-colors">Start Free</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
