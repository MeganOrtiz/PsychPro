import { useLocation } from "wouter";
import { useState } from "react";
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
} from "lucide-react";
import brainHero from "@assets/generated_images/brain_3d_glowing.png";
import smokeBg from "@assets/Screenshot_2026-04-27_at_1.40.17_AM_1778720312053.png";
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
      className="min-h-screen relative overflow-x-hidden"
      data-testid="landing-page"
      style={{
        background: P.ink,
        color: P.cloud,
        fontFamily: '"Outfit", "Inter", system-ui, sans-serif',
      }}
    >
      {/* ============================================================
          BACKGROUND ATMOSPHERE — billowing teal smoke image diffused
          across the entire page (fixed), darkened to brand ink and
          softened with cyan radial glows so it reads as living mist.
          ============================================================ */}
      {/* Layer 1: deep ink wash so smoke never blows out the page */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-30"
        style={{ background: P.ink }}
      />
      {/* Layer 2: the smoke photo, scaled to cover, slowly drifting */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20 landing-smoke-drift"
        style={{
          backgroundImage: `url(${smokeBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.95,
          filter: "blur(1px) saturate(125%) hue-rotate(-6deg) contrast(105%)",
        }}
      />
      {/* Layer 3: gentle vignette + cyan top-glow so smoke reads as living mist */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 70% 45% at 50% 0%, rgba(118, 228, 247, 0.20), transparent 65%),
            radial-gradient(ellipse 100% 90% at 50% 50%, transparent 35%, rgba(3, 21, 29, 0.45) 100%),
            linear-gradient(180deg, rgba(3, 21, 29, 0.20) 0%, rgba(6, 31, 43, 0.10) 50%, rgba(3, 21, 29, 0.45) 100%)
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
        @keyframes landingSmokeDrift {
          0%   { transform: scale(1.05) translate3d(0, 0, 0); }
          50%  { transform: scale(1.08) translate3d(-1.5%, -1%, 0); }
          100% { transform: scale(1.05) translate3d(0, 0, 0); }
        }
        .landing-smoke-drift {
          animation: landingSmokeDrift 32s ease-in-out infinite;
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
          transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease, background .3s ease;
        }
        .landing-glass-btn:hover {
          transform: translateY(-2px);
          border-color: rgba(167, 243, 255, 0.85) !important;
          background: rgba(10, 45, 61, 0.78) !important;
          box-shadow:
            0 0 0 1px rgba(167, 243, 255, 0.45),
            0 0 32px rgba(118, 228, 247, 0.55),
            0 0 64px rgba(118, 228, 247, 0.30),
            inset 0 0 18px rgba(118, 228, 247, 0.18) !important;
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
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105"
              style={{
                color: P.mist,
                border: `1px solid rgba(118, 228, 247, 0.25)`,
                background: "rgba(6, 32, 44, 0.4)",
              }}
              data-testid="header-search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={goToApp}
              className="px-6 h-9 rounded-md text-xs font-light transition-all hover:-translate-y-0.5"
              style={{
                ...TRACK_NAV,
                color: P.cloud,
                background: "rgba(6, 32, 44, 0.55)",
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
        className="relative max-w-7xl mx-auto px-6 lg:px-10 pb-16"
      >
        <div className="text-center mb-10">
          <h2
            className="text-xs font-light"
            style={{ ...TRACK_NAV, color: P.cloud }}
          >
            EVERY TOPIC WE COVER
          </h2>
          <p
            className="mt-3 text-sm font-light"
            style={{ color: P.inkSoft }}
          >
            39 expertly curated subjects across neuroscience, clinical practice, and research methods.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOPIC_CATEGORIES.map((cat) => (
            <div
              key={cat.title}
              className="rounded-xl p-6 lg:p-7"
              style={{
                ...glass,
                boxShadow: `0 24px 50px rgba(0,0,0,0.45)`,
              }}
              data-testid={`topic-category-${cat.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            >
              <h3
                className="text-[11px] font-light mb-5 pb-4"
                style={{
                  ...TRACK_NAV,
                  color: P.surf,
                  borderBottom: `1px solid rgba(118, 228, 247, 0.18)`,
                  textShadow: `0 0 10px rgba(118, 228, 247, 0.4)`,
                }}
              >
                {cat.title}
              </h3>
              <ul className="space-y-2.5">
                {cat.topics.map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-2.5 text-sm font-light leading-relaxed"
                    style={{ color: P.cloud }}
                  >
                    <span
                      aria-hidden
                      className="mt-2 inline-block w-1 h-1 rounded-full flex-shrink-0"
                      style={{
                        background: P.surf,
                        boxShadow: `0 0 6px ${P.surf}`,
                      }}
                    />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
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
              className="h-11 px-7 rounded-md text-xs font-light transition-all hover:-translate-y-0.5"
              style={{
                ...TRACK_NAV,
                color: P.cloud,
                background: "rgba(6, 32, 44, 0.55)",
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
