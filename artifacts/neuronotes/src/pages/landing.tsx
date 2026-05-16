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
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import heroReference from "@assets/generated_images/hero_brain_topdown_clean_v1_cropped.png";
import cloudsDrift from "@assets/generated_images/clouds_drift_v1.png";
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
        background: "transparent",
        color: P.cloud,
        fontFamily: '"Outfit", "Inter", system-ui, sans-serif',
      }}
    >
      {/* ============================================================
          LIVING HERO — three fixed bg layers:
          - L0 (deep ink floor): solid ink color so any uncovered area
            never blows out white.
          - L1 (cerulean clouds drift): a wide cloud texture stretched
            to cover the entire viewport, slowly drifting horizontally
            in an infinite ease-in-out loop. This is what makes the
            background feel alive and what carries the cerulean smoke
            all the way down behind the cards/footer.
          - L2 (brain hero image): the cropped top-down brain on its
            own composition, anchored to the top of the viewport and
            sized via `--hero-bg-h`. Has its own slow drift so the
            two cloud cadences read as continuously moving, not looped.
          - L3 (readability gradient): subtle darkening that begins
            after the brain so wordmark/copy/CTAs/cards stay crisp,
            with a final fade-to-ink at the very bottom of the page.
          ============================================================ */}
      {/* L0: deep ink floor */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-40"
        style={{ background: P.ink }}
      />
      {/* L1: full-viewport drifting cerulean clouds — provides the
          atmospheric texture that extends from the top of the page
          all the way down behind every section. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-30 landing-clouds-drift"
        style={{
          backgroundImage: `url(${cloudsDrift})`,
          backgroundSize: "120% auto",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          opacity: 0.55,
        }}
      />
      {/* L2: brain hero image — top-down, sparkle-free, anchored to
          the top of the viewport with its own gentle drift cadence.
          The bottom edge is masked to fade into transparent so it
          blends seamlessly into the cerulean cloud layer below
          instead of leaving a visible horizontal seam. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 -z-20 hero-bg-image landing-brain-drift"
        style={{
          backgroundImage: `url(${heroReference})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          WebkitMaskImage:
            "linear-gradient(180deg, black 0%, black 70%, rgba(0,0,0,0.7) 85%, transparent 100%)",
          maskImage:
            "linear-gradient(180deg, black 0%, black 70%, rgba(0,0,0,0.7) 85%, transparent 100%)",
        }}
      />
      {/* L3: bottom fade — anchored to the document container
          (absolute, not fixed), so the dark wash is concentrated at
          the very bottom of the page rather than glued to the bottom
          of the viewport at every scroll position. Clouds stay
          visible across the full page height; only the final ~15%
          of the document fades into deep ink. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `linear-gradient(180deg,
            rgba(3, 21, 29, 0.00) 0%,
            rgba(3, 21, 29, 0.00) 70%,
            rgba(3, 21, 29, 0.25) 85%,
            rgba(3, 21, 29, 0.70) 95%,
            rgba(3, 21, 29, 1.00) 100%)`,
        }}
      />
      <style>{`
        /* Single source of truth for the hero background image height.
           Both the fixed bg layer and the spacer below the brain
           consume this so they always stay locked together regardless
           of viewport size. The 34% multiplier mirrors the cropped
           brain image's aspect ratio (480/1408 ≈ 0.341), capped at
           70vh so the brain never grows taller than the viewport and
           floored at 220px so it stays prominent on phones. */
        :root {
          --hero-bg-h: clamp(220px, calc(100vw * 0.341), 70vh);
        }
        .hero-bg-image { height: var(--hero-bg-h); }
        .hero-spacer   { height: var(--hero-bg-h); }

        /* Cloud drift — the wide cloud texture slowly pans horizontally
           and breathes a tiny bit in scale. 80s loop is intentional:
           slow enough that the page feels calm and atmospheric, fast
           enough that you can see the motion if you watch for it. */
        @keyframes landingCloudsDrift {
          0%   { transform: scale(1.05) translate3d(-1.5%, 0, 0); }
          50%  { transform: scale(1.10) translate3d( 1.5%, -0.6%, 0); }
          100% { transform: scale(1.05) translate3d(-1.5%, 0, 0); }
        }
        .landing-clouds-drift {
          animation: landingCloudsDrift 80s ease-in-out infinite;
          will-change: transform;
        }
        /* Brain drift — same idea but a different cadence so the two
           layers never sync. Scale stays very tight so the brain
           reads as still-but-alive, not floating. */
        @keyframes landingBrainDrift {
          0%   { transform: scale(1.00) translate3d(0, 0, 0); }
          50%  { transform: scale(1.015) translate3d(0.4%, 0.3%, 0); }
          100% { transform: scale(1.00) translate3d(0, 0, 0); }
        }
        .landing-brain-drift {
          animation: landingBrainDrift 11s ease-in-out infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .landing-clouds-drift,
          .landing-brain-drift {
            animation: none;
            will-change: auto;
          }
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
        <div className="max-w-5xl mx-auto px-6 lg:px-10 text-center">
          {/* Spacer — pushes the wordmark down so it sits exactly at
              the bottom of the brain image. Consumes the same
              `--hero-bg-h` token as the fixed bg layer, so the two
              stay locked together at every viewport size. */}
          <div aria-hidden className="w-full hero-spacer" />

          {/* Wordmark */}
          <h1
            className="font-light leading-none relative"
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
