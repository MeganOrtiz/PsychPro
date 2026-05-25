// =============================================================================
// Landing page — PROTECTED.
// ---------------------------------------------------------------------------
// The cerulean-clouds background and the floating isolated brain are the
// canonical PsychPro hero. The clouds image is shared with the in-app
// .study-page-bg surface (see src/index.css) — same composition, lighter
// wash here. DO NOT:
//   - Re-introduce a tiled / repeating cloud layer.
//   - Add a rectangular hero image with a hard edge.
//   - Hardcode brand hex codes — use STUDY_PALETTE tokens.
//   - Rewrite the hero body copy without product approval.
// =============================================================================
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
  Star,
} from "lucide-react";
import cloudsBackground from "@/assets/generated_images/landing_page.png";
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
    title: "EVIDENCE-BASED LEARNING",
    body: "Flashcards, quizzes, study guides, and practice exams designed for optimal knowledge retention.",
  },
  {
    icon: Brain,
    title: "INTERACTIVE BRAIN LAB",
    body: "Explore neuroanatomy through a fully interactive 3D brain — click any region to learn its function and clinical relevance.",
  },
  {
    icon: Sparkles,
    title: "PERSONALIZED RESOURCES",
    body: "Upload your own notes, articles, or PDFs and PsychPro generates flashcards, quizzes, and study guides from your material.",
  },
  {
    icon: Star,
    title: "PSYCHPRO SPOTLIGHT",
    body: "Submit dissertations, research, or presentations for the chance to be featured in our PsychPro Spotlight.",
  },
];

const WHATS_INSIDE_CARDS = [
  {
    n: "01",
    eyebrow: "STUDY SYSTEM",
    headline: "Flashcards, study guides, quizzes & practice exams",
    body: "Built around evidence-based learning principles — spaced repetition, active recall, and interleaving — so every minute of study earns long-term retention.",
  },
  {
    n: "02",
    eyebrow: "BREADTH",
    headline: "39+ topics covered",
    body: "Comprehensive coverage across clinical psychology: neuroscience, neuropsychology, psychopharmacology, assessment, psychotherapy, research methods, and more — curated for both coursework and board prep.",
  },
  {
    n: "03",
    eyebrow: "PERSONALIZATION",
    headline: "Personalized dashboard with progress tracking",
    body: "Streaks, performance analytics, and recommendations tailored to your goals, your degree path, and where you actually need work.",
  },
  {
    n: "04",
    eyebrow: "COMMUNITY",
    headline: "Opt-in community connections",
    body: "Match with peers who share your clinical interests, training stage, and learning goals — only if and when you want to.",
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
      className="landing-canvas min-h-screen relative overflow-x-hidden"
      data-testid="landing-page"
      style={{
        background: "transparent",
        color: P.cloud,
        fontFamily: '"Outfit", "Inter", system-ui, sans-serif',
      }}
    >
      <style>{`
        /* Landing canvas — hero-bound cerulean-clouds composition.
           The image paints ONCE at the top of the page (sized to the
           hero viewport) and fades down into the solid ink ground for
           the rest of the route. Previously this layer was
           position:fixed/inset:0, which kept the same brain visible
           behind every scrolled section. Now ::before paints the
           hero-bound brain+clouds and ::after paints the solid ink
           ground for the rest of the scrollable canvas. The parent
           MUST stay background:transparent so the negative-z layers
           remain visible. DO NOT add a per-section background image
           elsewhere on this page. */
        .landing-canvas::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -60;
          background-color: ${P.ink};
          pointer-events: none;
        }
        .landing-canvas::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100vh;
          z-index: -50;
          background-image:
            /* Strong top scrim — hides the baked-in brain region of the
               source PNG on taller viewports where bottom-anchored
               cropping isn't enough on its own. Fades to clear so the
               clouds in the middle/lower hero still read. */
            linear-gradient(180deg,
              ${P.ink} 0%,
              rgba(3, 21, 29, 0.92) 18%,
              rgba(3, 21, 29, 0.55) 38%,
              rgba(3, 21, 29, 0.20) 60%,
              rgba(3, 21, 29, 0.55) 85%,
              ${P.ink} 100%),
            radial-gradient(ellipse 130% 115% at 50% 50%,
              rgba(3, 21, 29, 0.10) 0%,
              rgba(3, 21, 29, 0.20) 60%,
              rgba(3, 21, 29, 0.38) 100%),
            url(${cloudsBackground});
          background-size: cover, cover, cover;
          /* Anchor at center bottom so the baked-in brain (upper ~45%
             of the portrait source) is cropped off-screen and only the
             cloud composition fills the hero. The isolated brain layer
             below renders as a separate transparent element above the
             wordmark. */
          background-position: center bottom, center bottom, center bottom;
          background-repeat: no-repeat, no-repeat, no-repeat;
          image-rendering: -webkit-optimize-contrast;
          pointer-events: none;
        }
        .landing-glow-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.5rem 0.25rem;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: color .25s ease, text-shadow .35s ease, letter-spacing .35s ease;
        }
        .landing-glow-link:hover {
          color: rgba(232, 252, 255, 1) !important;
          text-shadow:
            0 0 12px rgba(167, 243, 255, 0.85),
            0 0 24px rgba(118, 228, 247, 0.45);
          letter-spacing: 0.34em;
        }
        .landing-glow-link:focus-visible {
          outline: 2px solid rgba(167, 243, 255, 0.85);
          outline-offset: 4px;
          border-radius: 4px;
        }
        .landing-glass-btn:focus-visible,
        .landing-glass-icon-btn:focus-visible {
          outline: 2px solid rgba(167, 243, 255, 0.85);
          outline-offset: 2px;
        }
        .nav-text-link {
          position: relative;
          transition: color .25s ease, text-shadow .3s ease;
        }
        .nav-text-link:hover {
          color: ${P.cloud} !important;
          text-shadow: 0 0 10px rgba(167, 243, 255, 0.7);
        }
        .nav-text-link:focus-visible {
          outline: 2px solid rgba(167, 243, 255, 0.85);
          outline-offset: 4px;
          border-radius: 2px;
        }
        .footer-text-link {
          transition: color .25s ease, text-shadow .3s ease;
        }
        .footer-text-link:hover {
          color: ${P.cloud} !important;
          text-shadow: 0 0 10px rgba(167, 243, 255, 0.7);
        }
        .footer-text-link:focus-visible {
          outline: 2px solid rgba(167, 243, 255, 0.85);
          outline-offset: 3px;
          border-radius: 2px;
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
          color: ${P.mist} !important;
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
          color: ${P.mist} !important;
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
                  className="nav-text-link text-xs font-light"
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
          HERO — floating isolated brain over the fixed cloud canvas,
          followed by wordmark, tagline, body copy and CTAs.
          ============================================================ */}
      {/* Top padding is intentionally generous so the PSYCHPRO wordmark
          drops down into the cloud composition, leaving the brain in the
          fixed background visible centered above it. The fixed canvas
          fills the viewport — there is NO gap above the brain. */}
      <section className="relative flex flex-col items-center justify-center pt-20 md:pt-24 lg:pt-28 pb-20 md:pb-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 text-center relative z-10">
          {/* Wordmark — thin Proxima Nova / Outfit 200 */}
          <h1
            className="leading-none relative mt-2"
            style={{
              ...TRACK_HERO,
              fontFamily: 'var(--app-font-sans), "Outfit", "Inter", system-ui, sans-serif',
              fontWeight: 200,
              fontSize: "clamp(44px, 7.5vw, 88px)",
              color: P.cloud,
              textShadow: `0 0 24px rgba(118, 228, 247, 0.30)`,
            }}
          >
            PSYCHPRO
          </h1>

          {/* Tagline — original color preserved; only a soft dark
              text-shadow added so it reads against the cloud tile. */}
          <p
            className="mt-4 text-sm md:text-base"
            style={{
              ...TRACK_WIDE,
              fontFamily: 'var(--app-font-sans), "Outfit", "Inter", system-ui, sans-serif',
              fontWeight: 200,
              color: P.mist,
              textShadow: `0 1px 6px rgba(3, 21, 29, 0.6)`,
            }}
          >
            LEARN. EXPAND. CONNECT.
          </p>

          {/* Body copy — lightly tightened tone, thin face for cohesion. */}
          <p
            className="mt-8 mx-auto max-w-2xl text-base md:text-[17px] leading-relaxed"
            style={{
              fontFamily: 'var(--app-font-sans), "Outfit", "Inter", system-ui, sans-serif',
              fontWeight: 300,
              color: P.inkSoft,
              textShadow: `0 1px 6px rgba(3, 21, 29, 0.65)`,
            }}
          >
            One quiet place to master clinical psychology — built around the
            way the brain actually learns, with the tools and community to
            keep you moving.
          </p>

          {/* CTA cluster — primary (large), secondary (smaller), tertiary
              text-link with glow that scroll-jumps to "WHAT'S INSIDE". */}
          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <button
                onClick={goToApp}
                className="landing-glass-btn group inline-flex items-center gap-3 px-10 h-14 rounded-full text-sm font-light"
                style={{
                  ...TRACK_NAV,
                  color: P.cloud,
                  background: "rgba(10, 45, 61, 0.72)",
                  border: `1px solid rgba(167, 243, 255, 0.55)`,
                  backdropFilter: "blur(18px) saturate(140%)",
                  WebkitBackdropFilter: "blur(18px) saturate(140%)",
                  boxShadow: `0 0 22px rgba(118, 228, 247, 0.28), inset 0 0 14px rgba(118, 228, 247, 0.08)`,
                }}
                data-testid="cta-explore-courses"
              >
                <BookOpen className="w-4 h-4" style={{ color: P.surf }} />
                START STUDYING
              </button>
              <button
                onClick={goToApp}
                className="landing-glass-btn group inline-flex items-center gap-3 px-7 h-11 rounded-full text-xs font-light"
                style={{
                  ...TRACK_NAV,
                  color: P.cloud,
                  background: "rgba(10, 45, 61, 0.55)",
                  border: `1px solid rgba(118, 228, 247, 0.38)`,
                  backdropFilter: "blur(18px) saturate(140%)",
                  WebkitBackdropFilter: "blur(18px) saturate(140%)",
                  boxShadow: `0 0 14px rgba(118, 228, 247, 0.18), inset 0 0 10px rgba(118, 228, 247, 0.04)`,
                }}
                data-testid="cta-join-community"
              >
                <Users className="w-4 h-4" style={{ color: P.surf }} />
                MEET YOUR COHORT
              </button>
            </div>
            <a
              href="#whats-inside"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("whats-inside")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="landing-glow-link text-[11px] font-light"
              style={{ ...TRACK_NAV, color: P.inkSoft }}
              data-testid="cta-see-inside"
            >
              → SEE WHAT'S INSIDE
            </a>
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
          WHAT'S INSIDE PSYCHPRO — numbered detail cards
          ============================================================ */}
      <section
        id="whats-inside"
        className="relative max-w-7xl mx-auto px-6 lg:px-10 pb-16"
      >
        <div className="text-center mb-10">
          <p
            className="text-xs font-light"
            style={{ ...TRACK_NAV, color: P.surf }}
          >
            WHAT'S INSIDE PSYCHPRO
          </p>
          <h2
            className="mt-3 font-light"
            style={{
              fontSize: "clamp(26px, 3.6vw, 40px)",
              color: P.cloud,
              letterSpacing: "0.01em",
              textShadow: "0 1px 6px rgba(3, 21, 29, 0.65)",
            }}
          >
            High-yield tools for deeper clinical understanding.
          </h2>
          <p
            className="mt-3 mx-auto max-w-2xl text-sm md:text-[15px] leading-relaxed font-light"
            style={{
              color: P.inkSoft,
              textShadow: "0 1px 6px rgba(3, 21, 29, 0.65)",
            }}
          >
            A complete learning experience built for psychology students,
            residents, and early-career professionals.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {WHATS_INSIDE_CARDS.map((card, i) => (
            <div
              key={card.n}
              className="group relative rounded-xl p-7 lg:p-8 transition-all duration-300 hover:-translate-y-1"
              style={{
                ...glass,
                boxShadow: `0 24px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(118, 228, 247, 0.05)`,
              }}
              data-testid={`whats-inside-card-${i}`}
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
              <div className="flex items-baseline gap-3 mb-4">
                <span
                  className="text-xs font-light"
                  style={{ ...TRACK_NAV, color: P.surf }}
                >
                  {card.n}
                </span>
                <span
                  aria-hidden
                  className="flex-1 h-px"
                  style={{ background: `rgba(118, 228, 247, 0.25)` }}
                />
                <span
                  className="text-[10px] font-light"
                  style={{ ...TRACK_NAV, color: P.inkSoft }}
                >
                  {card.eyebrow}
                </span>
              </div>
              <h3
                className="font-light mb-3"
                style={{
                  fontSize: "clamp(18px, 1.8vw, 22px)",
                  color: P.cloud,
                  letterSpacing: "0.01em",
                }}
              >
                {card.headline}
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
              className="footer-text-link"
              style={{ ...TRACK_NAV, color: P.inkSoft }}
            >
              PRIVACY POLICY
            </a>
            <a
              href="#"
              className="footer-text-link"
              style={{ ...TRACK_NAV, color: P.inkSoft }}
            >
              TERMS OF SERVICE
            </a>
            <a
              href="#"
              className="footer-text-link"
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
                className="landing-glass-icon-btn w-8 h-8 rounded-full flex items-center justify-center"
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
