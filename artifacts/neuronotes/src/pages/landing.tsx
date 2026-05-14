import { useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  GraduationCap,
  FlaskConical,
  Wrench,
  Users,
  BookOpen,
  Award,
  Globe,
  Mail,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Brain,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import brainHero from "@assets/generated_images/brain_top_v2.png";
import smokeWallpaper from "@assets/generated_images/smoke_wallpaper_v3.png";
// Palette comes from the shared single-source-of-truth file.
// Do NOT redefine a local PALETTE here — it will fork the brand.
import { STUDY_PALETTE as P } from "@/lib/study-theme";

// Premium thin uppercase tracking — used for nav, wordmark, and section heads.
const TRACK_WIDE = { letterSpacing: "0.32em" } as const;
const TRACK_NAV = { letterSpacing: "0.28em" } as const;
const TRACK_HERO = { letterSpacing: "0.42em" } as const;

const NAV_LINKS = [
  { label: "HOME", href: "#" },
  { label: "COURSES", href: "#features" },
  { label: "RESOURCES", href: "#trust" },
  { label: "COMMUNITY", href: "#testimonial" },
  { label: "ABOUT", href: "#about" },
];

const FEATURE_CARDS = [
  {
    icon: GraduationCap,
    title: "EXPERT-LED COURSES",
    body: "Learn from leading professionals in clinical psychology.",
  },
  {
    icon: Brain,
    title: "EVIDENCE-BASED",
    body: "Content grounded in the latest research and best practices.",
  },
  {
    icon: Wrench,
    title: "PRACTICAL TOOLS",
    body: "Resources and tools you can use in real-world settings.",
  },
  {
    icon: Users,
    title: "PROFESSIONAL COMMUNITY",
    body: "Connect, collaborate, and grow with peers worldwide.",
  },
];

const TRUST_STATS = [
  { icon: BookOpen, n: "39+", l: "TOPICS" },
  { icon: GraduationCap, n: "1,612+", l: "FLASHCARDS" },
  { icon: Award, n: "935+", l: "QUIZ QUESTIONS" },
  { icon: Globe, n: "738+", l: "EXAM QUESTIONS" },
];

// All 39 topics PsychPro currently offers, grouped for the landing page.
const TOPIC_CATEGORIES: Array<{ title: string; topics: string[] }> = [
  {
    title: "NEUROSCIENCE & NEUROANATOMY",
    topics: [
      "Brain Networks",
      "Central Nervous System",
      "Cranial Nerves",
      "Endocrine System & Reproduction",
      "Enteric Nervous System",
      "Limbic System & Motivation",
      "Neurophysiology",
      "Peripheral Nervous System",
      "Sensory Systems",
      "Sleep & Circadian Rhythms",
      "Vascular System of the Brain",
    ],
  },
  {
    title: "NEUROPSYCHOLOGY",
    topics: [
      "Apraxia & Agnosia",
      "Executive Function",
      "Forensic Neuropsychology",
      "Language Processing & Aphasia",
      "Neurocognitive Disorders",
      "Neurodevelopmental Disorders",
      "Neuroimaging & Neuromodulation",
      "Neuropsychology Overview",
      "Validity & Effort Testing",
    ],
  },
  {
    title: "CLINICAL & PHARMACOLOGY",
    topics: [
      "ADHD & Medications",
      "Personality Disorders",
      "Psychiatric Disorders",
      "Psychopharmacology",
      "Trauma-Focused Approaches",
    ],
  },
  {
    title: "THERAPY & COUNSELING",
    topics: [
      "Acceptance, Mindfulness, and Third-Wave Approaches",
      "Adlerian, Humanistic, and Existential Approaches",
      "Analytical Psychology — Jung",
      "Behavior Therapy and Applied Behavior Analysis",
      "Cognitive Therapy, CBT, and Schema Therapy",
      "Family, Systems, and Couples Therapies",
      "Foundations of Psychotherapy",
      "Gestalt, Experiential, and Emotion-Focused Therapy",
      "Psychoanalytic and Psychodynamic Approaches",
    ],
  },
  {
    title: "ASSESSMENT & RESEARCH",
    topics: [
      "Foundations in Statistics",
      "Objective Measures",
      "Qualitative Research Methods",
      "Quantitative Research Methods",
      "Subjective Measures & Rating Scales",
    ],
  },
];

export default function LandingPage() {
  const [, navigate] = useLocation();
  const [activeNav, setActiveNav] = useState("HOME");
  const [email, setEmail] = useState("");
  // Interactive parallax — mouse position drives smoke layers + cursor glow.
  // Refs avoid re-rendering the whole page on every mousemove; we mutate
  // CSS custom properties directly on the root for buttery-smooth motion.
  const fxRootRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const root = fxRootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let tx = 0, ty = 0;
    const onMove = (e: PointerEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      tx = (e.clientX / w) * 2 - 1; // -1..1
      ty = (e.clientY / h) * 2 - 1;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          root.style.setProperty("--mx", tx.toFixed(3));
          root.style.setProperty("--my", ty.toFixed(3));
          root.style.setProperty("--cx", `${e.clientX}px`);
          root.style.setProperty("--cy", `${e.clientY}px`);
        });
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const goToApp = () => navigate("/dashboard");

  // Reusable glass surface — translucent dark teal, thin cyan border, blur.
  const glass = {
    background: "rgba(6, 32, 44, 0.58)",
    border: `1px solid rgba(118, 228, 247, 0.38)`,
    backdropFilter: "blur(18px) saturate(140%)",
    WebkitBackdropFilter: "blur(18px) saturate(140%)",
  } as const;

  return (
    <div
      ref={fxRootRef}
      className="min-h-screen relative overflow-x-hidden landing-fx-root"
      data-testid="landing-page"
      style={{
        background: "transparent",
        color: P.cloud,
        fontFamily: '"Outfit", "Inter", system-ui, sans-serif',
        // CSS-var defaults so first paint is centered (no layout shift).
        ["--mx" as any]: 0,
        ["--my" as any]: 0,
        ["--cx" as any]: "50vw",
        ["--cy" as any]: "50vh",
      }}
    >
      {/* ============================================================
          BACKGROUND ATMOSPHERE — billowing teal smoke image diffused
          across the entire page (fixed), darkened to brand ink and
          softened with cyan radial glows so it reads as living mist.
          ============================================================ */}
      {/* Layer 1: deep ink floor */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-40"
        style={{ background: P.ink }}
      />
      {/* Layer 2: FAR smoke plate — the wallpaper hero photo. Sits behind
          everything, breathes slowly, drifts opposite to the cursor for
          the deepest parallax depth. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-30 landing-smoke-far"
        style={{
          backgroundImage: `url(${smokeWallpaper})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: P.ink,
          willChange: "transform",
        }}
      />
      {/* Layer 3: NEAR smoke — same wallpaper, larger and screen-blended.
          Drifts further with the cursor → ink billows shimmer like you're
          stirring water with your pointer. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20 landing-smoke-near"
        style={{
          backgroundImage: `url(${smokeWallpaper})`,
          backgroundSize: "150% auto",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.55,
          filter: "blur(4px) saturate(125%) hue-rotate(-4deg)",
          mixBlendMode: "screen",
          willChange: "transform",
        }}
      />
      {/* Layer 4: CURSOR GLOW — a soft cyan light that follows the pointer,
          revealing detail in the smoke under it. The whole point of "fun
          to fidget with". */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-15 landing-cursor-glow"
        style={{
          background:
            "radial-gradient(circle 360px at var(--cx) var(--cy), rgba(118, 228, 247, 0.22), rgba(167, 243, 255, 0.08) 35%, transparent 70%)",
          mixBlendMode: "screen",
          transition: "opacity .4s ease",
        }}
      />
      {/* Layer 5: DARK→LIGHT radial vignette — deepens corners, keeps the
          center luminous; the vignette also tracks the cursor a touch so
          the "spotlight" follows you across the page. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 landing-vignette"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at calc(50% + (var(--mx) * 6%)) calc(45% + (var(--my) * 5%)), rgba(167, 243, 255, 0.22) 0%, rgba(118, 228, 247, 0.08) 38%, transparent 68%),
            radial-gradient(ellipse 120% 110% at 50% 50%, transparent 22%, rgba(3, 21, 29, 0.45) 60%, rgba(3, 21, 29, 0.85) 88%, rgba(3, 21, 29, 0.96) 100%)
          `,
        }}
      />
      {/* Layer 4: sparse electric particles for depth */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(1.2px 1.2px at 12% 18%, rgba(167, 243, 255, 0.9), transparent 60%), radial-gradient(1px 1px at 78% 12%, rgba(118, 228, 247, 0.85), transparent 60%), radial-gradient(1.4px 1.4px at 38% 72%, rgba(167, 243, 255, 0.7), transparent 60%), radial-gradient(1px 1px at 88% 58%, rgba(118, 228, 247, 0.75), transparent 60%), radial-gradient(1.2px 1.2px at 22% 88%, rgba(167, 243, 255, 0.6), transparent 60%), radial-gradient(0.8px 0.8px at 62% 38%, rgba(118, 228, 247, 0.7), transparent 60%), radial-gradient(1px 1px at 8% 52%, rgba(167, 243, 255, 0.5), transparent 60%), radial-gradient(1px 1px at 92% 80%, rgba(118, 228, 247, 0.65), transparent 60%)",
        }}
      />
      <style>{`
        /* The smoke layers combine a slow ambient drift (keyframes) with
           a live cursor-driven offset (CSS vars). Multiplying the var by
           different magnitudes per layer creates depth: far layer barely
           moves, near layer lurches → real parallax. */
        @keyframes landingSmokeFarDrift {
          0%, 100% { background-position: 50% 50%; }
          50%      { background-position: 52% 48%; }
        }
        @keyframes landingSmokeNearDrift {
          0%   { transform: scale(1.18) translate3d(calc(var(--mx, 0) * -28px), calc(var(--my, 0) * -22px), 0) rotate(0deg); }
          50%  { transform: scale(1.22) translate3d(calc(var(--mx, 0) * -28px), calc(var(--my, 0) * -22px), 0) rotate(0.6deg); }
          100% { transform: scale(1.18) translate3d(calc(var(--mx, 0) * -28px), calc(var(--my, 0) * -22px), 0) rotate(0deg); }
        }
        .landing-smoke-far {
          transform: scale(1.06) translate3d(calc(var(--mx, 0) * -10px), calc(var(--my, 0) * -8px), 0);
          transition: transform 600ms cubic-bezier(.2,.8,.2,1);
          animation: landingSmokeFarDrift 32s ease-in-out infinite;
        }
        .landing-smoke-near {
          animation: landingSmokeNearDrift 44s ease-in-out infinite;
          transition: transform 500ms cubic-bezier(.2,.8,.2,1);
        }
        .landing-cursor-glow { transition: opacity .4s ease; }
        @media (prefers-reduced-motion: reduce) {
          .landing-smoke-far, .landing-smoke-near { animation: none; transform: none; }
          .landing-cursor-glow { display: none; }
        }
        @keyframes landingBrainPulse {
          0%, 100% { filter: drop-shadow(0 0 60px rgba(118, 228, 247, 0.45)) drop-shadow(0 0 120px rgba(118, 228, 247, 0.18)); }
          50%      { filter: drop-shadow(0 0 90px rgba(118, 228, 247, 0.70)) drop-shadow(0 0 160px rgba(118, 228, 247, 0.30)); }
        }
        .landing-brain-pulse {
          animation: landingBrainPulse 6s ease-in-out infinite;
          mix-blend-mode: screen;
        }
        .landing-glass-btn {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          backdrop-filter: blur(18px) saturate(140%);
          -webkit-backdrop-filter: blur(18px) saturate(140%);
          transition: transform .25s cubic-bezier(.2,.8,.2,1),
                      box-shadow .35s ease,
                      border-color .25s ease,
                      background .25s ease,
                      letter-spacing .35s ease;
        }
        .landing-glass-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background: linear-gradient(120deg,
            transparent 0%,
            transparent 35%,
            rgba(167, 243, 255, 0.55) 50%,
            transparent 65%,
            transparent 100%);
          transform: translateX(-120%);
          transition: transform .8s cubic-bezier(.2,.8,.2,1);
          mix-blend-mode: screen;
          pointer-events: none;
        }
        .landing-glass-btn:hover {
          transform: translateY(-2px);
          border-color: rgba(167, 243, 255, 0.9) !important;
          background: rgba(10, 45, 61, 0.78) !important;
          box-shadow:
            0 0 0 1px rgba(167, 243, 255, 0.55),
            0 0 28px rgba(118, 228, 247, 0.55),
            0 0 60px rgba(118, 228, 247, 0.32),
            0 12px 40px rgba(0, 0, 0, 0.45),
            inset 0 0 20px rgba(118, 228, 247, 0.20) !important;
        }
        .landing-glass-btn:hover::before {
          transform: translateX(120%);
        }
        .landing-glass-btn:hover svg {
          color: #A7F3FF !important;
          filter: drop-shadow(0 0 8px rgba(167, 243, 255, 0.85));
          transform: scale(1.08);
        }
        .landing-glass-btn:active {
          transform: translateY(0);
          box-shadow:
            0 0 0 1px rgba(167, 243, 255, 0.7),
            0 0 18px rgba(118, 228, 247, 0.45),
            inset 0 0 24px rgba(118, 228, 247, 0.30) !important;
        }
        .landing-glass-btn svg {
          transition: color .25s ease, filter .25s ease, transform .25s ease;
        }
        .landing-glass-icon-btn {
          position: relative;
          backdrop-filter: blur(14px) saturate(140%);
          -webkit-backdrop-filter: blur(14px) saturate(140%);
          transition: transform .25s cubic-bezier(.2,.8,.2,1),
                      box-shadow .3s ease,
                      border-color .25s ease,
                      background .25s ease;
        }
        .landing-glass-icon-btn:hover {
          transform: translateY(-1px) scale(1.06);
          border-color: rgba(167, 243, 255, 0.85) !important;
          background: rgba(10, 45, 61, 0.78) !important;
          box-shadow:
            0 0 0 1px rgba(167, 243, 255, 0.45),
            0 0 22px rgba(118, 228, 247, 0.55),
            inset 0 0 12px rgba(118, 228, 247, 0.18) !important;
        }
        .landing-glass-icon-btn:hover svg {
          color: #A7F3FF !important;
          filter: drop-shadow(0 0 8px rgba(167, 243, 255, 0.9));
        }
        .landing-glass-icon-btn svg {
          transition: color .25s ease, filter .25s ease;
        }
      `}</style>

      {/* ============================================================
          TOP NAVIGATION
          ============================================================ */}
      <header className="relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Brain
              className="w-6 h-6"
              style={{ color: P.surf, filter: `drop-shadow(0 0 8px ${P.surf}aa)` }}
            />
            <span
              className="font-light text-base"
              style={{ ...TRACK_NAV, color: P.cloud }}
            >
              PSYCHPRO
            </span>
          </div>

          {/* Center nav */}
          <nav className="hidden md:flex items-center gap-9">
            {NAV_LINKS.map((link) => {
              const isActive = activeNav === link.label;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setActiveNav(link.label)}
                  className="relative text-xs font-light transition-colors"
                  style={{
                    ...TRACK_NAV,
                    color: isActive ? P.cloud : P.inkSoft,
                  }}
                  data-testid={`nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute left-0 right-0 -bottom-2 h-px"
                      style={{
                        background: P.surf,
                        boxShadow: `0 0 10px ${P.surf}, 0 0 4px ${P.surf}`,
                      }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-4">
            <button
              aria-label="Search"
              className="landing-glass-icon-btn w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                color: P.mist,
                border: `1px solid rgba(118, 228, 247, 0.45)`,
                background: "rgba(10, 45, 61, 0.55)",
                boxShadow: `0 0 14px rgba(118, 228, 247, 0.18), inset 0 0 10px rgba(118, 228, 247, 0.06)`,
              }}
              data-testid="header-search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={goToApp}
              className="landing-glass-btn px-6 h-9 rounded-md text-xs font-light"
              style={{
                ...TRACK_NAV,
                color: P.cloud,
                background: "rgba(10, 45, 61, 0.62)",
                border: `1px solid rgba(118, 228, 247, 0.45)`,
                boxShadow: `0 0 18px rgba(118, 228, 247, 0.22), inset 0 0 12px rgba(118, 228, 247, 0.05)`,
              }}
              data-testid="header-login"
            >
              LOG IN
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================
          HERO — brain centered, wordmark, tagline, copy, CTAs
          ============================================================ */}
      <section className="relative">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 pt-2 pb-14 text-center">
          {/* 3D glowing brain — superior view, top center, no card */}
          <div className="relative flex justify-center">
            <div
              className="relative w-full max-w-[520px]"
              style={{ aspectRatio: "1 / 1" }}
            >
              {/* Soft cyan halo behind the brain */}
              <div
                aria-hidden
                className="absolute inset-0 rounded-full blur-3xl opacity-60"
                style={{
                  background: `radial-gradient(closest-side, rgba(118, 228, 247, 0.55), rgba(118, 228, 247, 0.15) 50%, transparent 70%)`,
                }}
              />
              <img
                src={brainHero}
                alt="Glowing 3D anatomical brain, superior view"
                className="relative w-full h-full object-contain landing-brain-pulse"
                draggable={false}
              />
            </div>
          </div>

          {/* Wordmark */}
          <h1
            className="font-light leading-none -mt-16 md:-mt-24 lg:-mt-32 relative"
            style={{
              ...TRACK_HERO,
              fontSize: "clamp(44px, 7.5vw, 88px)",
              color: P.cloud,
              textShadow: `0 0 40px rgba(118, 228, 247, 0.35), 0 8px 50px ${P.ink}`,
            }}
          >
            PSYCHPRO
          </h1>

          {/* Tagline */}
          <p
            className="mt-4 text-sm md:text-base font-light"
            style={{
              ...TRACK_WIDE,
              color: P.mist,
              textShadow: `0 0 12px rgba(118, 228, 247, 0.2)`,
            }}
          >
            LEARN. EXPAND. CONNECT.
          </p>

          {/* Body copy */}
          <p
            className="mt-8 mx-auto max-w-2xl text-base md:text-[17px] leading-relaxed font-light"
            style={{ color: P.inkSoft }}
          >
            Cut study time in half and actually retain the information over time
            with clinically grounded tools built for psychology students and
            professionals.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={goToApp}
              className="landing-glass-btn group inline-flex items-center gap-3 px-8 h-12 rounded-md text-xs font-light"
              style={{
                ...TRACK_NAV,
                color: P.cloud,
                background: "rgba(10, 45, 61, 0.72)",
                border: `1px solid rgba(118, 228, 247, 0.45)`,
                backdropFilter: "blur(18px) saturate(140%)",
                WebkitBackdropFilter: "blur(18px) saturate(140%)",
                boxShadow: `0 0 18px rgba(118, 228, 247, 0.20), inset 0 0 12px rgba(118, 228, 247, 0.05)`,
              }}
              data-testid="cta-explore-courses"
            >
              <BookOpen className="w-4 h-4" style={{ color: P.surf }} />
              EXPLORE COURSES
            </button>
            <button
              onClick={goToApp}
              className="landing-glass-btn group inline-flex items-center gap-3 px-8 h-12 rounded-md text-xs font-light"
              style={{
                ...TRACK_NAV,
                color: P.cloud,
                background: "rgba(10, 45, 61, 0.72)",
                border: `1px solid rgba(118, 228, 247, 0.45)`,
                backdropFilter: "blur(18px) saturate(140%)",
                WebkitBackdropFilter: "blur(18px) saturate(140%)",
                boxShadow: `0 0 18px rgba(118, 228, 247, 0.20), inset 0 0 12px rgba(118, 228, 247, 0.05)`,
              }}
              data-testid="cta-join-community"
            >
              <Users className="w-4 h-4" style={{ color: P.surf }} />
              JOIN COMMUNITY
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================
          FEATURE CARDS — 4 glass tiles
          ============================================================ */}
      <section
        id="features"
        className="relative max-w-7xl mx-auto px-6 lg:px-10 pb-14"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURE_CARDS.map((card, i) => (
            <div
              key={card.title}
              className="group relative rounded-xl p-7 text-center transition-all duration-300 hover:-translate-y-1"
              style={{
                ...glass,
                boxShadow: `0 24px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(118, 228, 247, 0.05)`,
              }}
              data-testid={`feature-card-${i}`}
            >
              {/* Hover glow */}
              <div
                aria-hidden
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  boxShadow: `0 0 32px rgba(118, 228, 247, 0.32), inset 0 0 20px rgba(118, 228, 247, 0.06)`,
                  border: `1px solid rgba(118, 228, 247, 0.72)`,
                  borderRadius: "inherit",
                }}
              />
              <card.icon
                className="w-10 h-10 mx-auto mb-5"
                strokeWidth={1.25}
                style={{
                  color: P.surf,
                  filter: `drop-shadow(0 0 12px rgba(118, 228, 247, 0.55))`,
                }}
              />
              <h3
                className="text-xs font-light mb-3"
                style={{ ...TRACK_NAV, color: P.cloud }}
              >
                {card.title}
              </h3>
              <p
                className="text-sm leading-relaxed font-light"
                style={{ color: P.inkSoft }}
              >
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          STATS — full-width content library panel (real numbers only)
          ============================================================ */}
      <section
        id="trust"
        className="relative max-w-7xl mx-auto px-6 lg:px-10 pb-16"
      >
        <div
          className="rounded-xl p-8 lg:p-12"
          style={{
            ...glass,
            boxShadow: `0 24px 50px rgba(0,0,0,0.45)`,
          }}
          data-testid="trust-panel"
        >
          <h2
            className="text-xs font-light mb-10 text-center"
            style={{ ...TRACK_NAV, color: P.cloud }}
          >
            A COMPLETE STUDY LIBRARY
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {TRUST_STATS.map((s) => (
              <div key={s.l} className="text-center">
                <s.icon
                  className="w-8 h-8 mx-auto mb-4"
                  strokeWidth={1.25}
                  style={{
                    color: P.surf,
                    filter: `drop-shadow(0 0 10px rgba(118, 228, 247, 0.5))`,
                  }}
                />
                <div
                  className="text-3xl lg:text-4xl font-light"
                  style={{ color: P.cloud, letterSpacing: "0.04em" }}
                >
                  {s.n}
                </div>
                <div
                  className="text-[10px] mt-2 font-light"
                  style={{ ...TRACK_NAV, color: P.inkSoft }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          ALL TOPICS — every subject PsychPro currently offers
          ============================================================ */}
      <section
        id="topics"
        className="relative max-w-6xl mx-auto px-6 lg:px-10 pb-20"
      >
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-semibold tracking-tight"
            style={{ color: P.cloud }}
          >
            The full clinical map.
          </h2>
          <p
            className="mt-4 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed"
            style={{ color: "rgba(244, 251, 255, 0.65)" }}
          >
            Foundations, assessment, intervention, research methods, and clinical specialties — all in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {TOPIC_CATEGORIES.flatMap((c) => c.topics).map((t) => (
            <div
              key={t}
              className="topic-pill flex items-center gap-3 px-4 h-12 rounded-lg text-sm font-light"
              style={{
                color: P.cloud,
                background: "rgba(10, 45, 61, 0.55)",
                border: "1px solid rgba(118, 228, 247, 0.22)",
                backdropFilter: "blur(12px) saturate(135%)",
                WebkitBackdropFilter: "blur(12px) saturate(135%)",
              }}
              data-testid={`topic-pill-${t.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            >
              <CheckCircle2
                className="w-4 h-4 flex-shrink-0"
                style={{
                  color: P.surf,
                  filter: `drop-shadow(0 0 5px rgba(118, 228, 247, 0.55))`,
                }}
              />
              <span className="truncate">{t}</span>
            </div>
          ))}
          {/* "More being added" pill — final cell, accent-styled */}
          <div
            className="topic-pill flex items-center gap-3 px-4 h-12 rounded-lg text-sm font-light"
            style={{
              color: P.mist,
              background: "rgba(10, 45, 61, 0.62)",
              border: "1px solid rgba(167, 243, 255, 0.55)",
              backdropFilter: "blur(12px) saturate(135%)",
              WebkitBackdropFilter: "blur(12px) saturate(135%)",
              boxShadow: `0 0 18px rgba(118, 228, 247, 0.22), inset 0 0 10px rgba(118, 228, 247, 0.08)`,
            }}
            data-testid="topic-pill-more"
          >
            <Sparkles
              className="w-4 h-4 flex-shrink-0"
              style={{
                color: P.mist,
                filter: `drop-shadow(0 0 6px rgba(167, 243, 255, 0.85))`,
              }}
            />
            <span className="truncate">+ More being added</span>
          </div>
        </div>

        <style>{`
          .topic-pill {
            transition: transform .25s cubic-bezier(.2,.8,.2,1),
                        background .25s ease,
                        border-color .25s ease,
                        box-shadow .3s ease;
          }
          .topic-pill:hover {
            transform: translateY(-1px);
            background: rgba(10, 45, 61, 0.78) !important;
            border-color: rgba(167, 243, 255, 0.7) !important;
            box-shadow:
              0 0 0 1px rgba(167, 243, 255, 0.35),
              0 0 22px rgba(118, 228, 247, 0.40),
              inset 0 0 12px rgba(118, 228, 247, 0.12);
          }
        `}</style>
      </section>

      {/* ============================================================
          SUBSCRIBE
          ============================================================ */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-10 pb-16">
        <div
          className="rounded-xl p-6 lg:p-8 flex flex-col lg:flex-row items-center gap-6"
          style={{
            ...glass,
            boxShadow: `0 24px 50px rgba(0,0,0,0.45)`,
          }}
          data-testid="subscribe-panel"
        >
          <div className="flex items-center gap-4 flex-shrink-0">
            <Mail
              className="w-6 h-6"
              strokeWidth={1.5}
              style={{
                color: P.surf,
                filter: `drop-shadow(0 0 8px rgba(118, 228, 247, 0.5))`,
              }}
            />
            <div>
              <div
                className="text-xs font-light"
                style={{ ...TRACK_NAV, color: P.cloud }}
              >
                STAY INSPIRED.
              </div>
              <div
                className="text-sm mt-1 font-light"
                style={{ color: P.inkSoft }}
              >
                Get expert insights and updates.
              </div>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setEmail("");
            }}
            className="flex-1 flex flex-col sm:flex-row gap-3 w-full lg:ml-auto lg:max-w-lg"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 h-11 rounded-md px-4 text-sm font-light outline-none transition-all"
              style={{
                background: "rgba(6, 32, 44, 0.7)",
                border: `1px solid rgba(118, 228, 247, 0.28)`,
                color: P.cloud,
              }}
              data-testid="subscribe-email"
            />
            <button
              type="submit"
              className="landing-glass-btn h-11 px-7 rounded-md text-xs font-light"
              style={{
                ...TRACK_NAV,
                color: P.cloud,
                background: "rgba(10, 45, 61, 0.62)",
                border: `1px solid rgba(118, 228, 247, 0.55)`,
                boxShadow: `0 0 18px rgba(118, 228, 247, 0.28), inset 0 0 10px rgba(118, 228, 247, 0.08)`,
              }}
              data-testid="subscribe-submit"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>

      {/* ============================================================
          FOOTER
          ============================================================ */}
      <footer
        id="about"
        className="relative border-t"
        style={{ borderColor: "rgba(118, 228, 247, 0.15)" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-5 text-xs">
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5" style={{ color: P.surf }} />
            <span style={{ ...TRACK_NAV, color: P.cloud }}>PSYCHPRO</span>
          </div>
          <div className="flex items-center gap-7 font-light">
            <a
              href="#"
              className="transition-colors hover:opacity-100"
              style={{ ...TRACK_NAV, color: P.inkSoft }}
            >
              PRIVACY POLICY
            </a>
            <a
              href="#"
              className="transition-colors hover:opacity-100"
              style={{ ...TRACK_NAV, color: P.inkSoft }}
            >
              TERMS OF SERVICE
            </a>
            <a
              href="#"
              className="transition-colors hover:opacity-100"
              style={{ ...TRACK_NAV, color: P.inkSoft }}
            >
              CONTACT
            </a>
          </div>
          <div className="flex items-center gap-4">
            {[Linkedin, Twitter, Instagram, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{
                  border: `1px solid rgba(118, 228, 247, 0.28)`,
                  background: "rgba(6, 32, 44, 0.4)",
                  color: P.mist,
                }}
                aria-label="Social link"
              >
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>
        <div
          className="text-center pb-6 text-[11px] font-light"
          style={{ color: P.inkSoft }}
        >
          © {new Date().getFullYear()} PsychPro. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
