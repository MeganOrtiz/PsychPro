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
  Users,
  BookOpen,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Brain,
  CheckCircle2,
  Layers,
  FileText,
  Gift,
} from "lucide-react";
import { useGetTopics } from "@workspace/api-client-react";
import heroBackground from "@assets/landing_page_1779697562530.png";
// Palette comes from the shared single-source-of-truth file.
// Do NOT redefine a local PALETTE here — it will fork the brand.
import { STUDY_PALETTE as P } from "@/lib/study-theme";

// Premium thin uppercase tracking — used for nav, wordmark, and section heads.
const TRACK_WIDE = { letterSpacing: "0.32em" } as const;
const TRACK_NAV = { letterSpacing: "0.28em" } as const;
const TRACK_HERO = { letterSpacing: "0.52em" } as const;

const NAV_LINKS = [
  { label: "HOME", href: "#" },
  { label: "COURSES", href: "#features" },
  { label: "RESOURCES", href: "#topics" },
  { label: "COMMUNITY", href: "#topics" },
  { label: "ABOUT", href: "#footer" },
];

const FEATURE_CARDS = [
  {
    icon: Layers,
    title: "FLASHCARDS / STUDY GUIDES / QUIZZES / EXAMS",
    body: "Reinforce your learning with interactive study tools.",
  },
  {
    icon: Brain,
    title: "EVIDENCE-BASED LEARNING TOOLS",
    body: "Solidify knowledge with spaced, interleaved and retrieval practice, elaboration and concrete examples.",
  },
  {
    icon: FileText,
    title: "CREATE LEARNING RESOURCES FROM YOUR OWN MATERIAL",
    body: "Upload, organize, and transform your material into smart resources.",
  },
  {
    icon: Users,
    title: "CONNECT WITH OTHERS",
    body: "Collaborate, share insights, and grow together.",
  },
  {
    icon: Gift,
    title: "PSYCHPRO SPOTLIGHT",
    body: "Submit your dissertation, research, presentations for opportunities to be featured in the PsychPro Spotlight.",
  },
];

// Topic ordering for the BROWSE TOPICS panel — mirrors the Topics tab so the
// two stay consistent. Categories not in this list are appended alphabetically.
const TOPIC_CATEGORY_ORDER = [
  "Neuroscience",
  "Psychology",
  "Neuropsychology",
  "Assessment",
  "Psychotherapy",
  "Research Methods",
  "Special Topics",
];

interface LandingTopic {
  id: number;
  name: string;
  category: string;
}

export default function LandingPage() {
  const [, navigate] = useLocation();
  const [activeNav, setActiveNav] = useState("HOME");
  const { data: topics, isLoading: topicsLoading, isError: topicsError } =
    useGetTopics() as {
      data: LandingTopic[] | undefined;
      isLoading: boolean;
      isError: boolean;
    };

  const goToApp = () => navigate("/dashboard");

  // Sort topics by the Topics-tab category order, then alphabetically within
  // each category. The chip grid renders this flat list left-to-right,
  // wrapping top-to-bottom within each column.
  const sortedTopics: LandingTopic[] = (() => {
    const list = (topics ?? []) as LandingTopic[];
    const rank = (c: string) => {
      const i = TOPIC_CATEGORY_ORDER.indexOf(c);
      return i === -1 ? TOPIC_CATEGORY_ORDER.length : i;
    };
    return [...list].sort((a, b) => {
      const r = rank(a.category) - rank(b.category);
      if (r !== 0) return r;
      const c = a.category.localeCompare(b.category);
      if (c !== 0) return c;
      return a.name.localeCompare(b.name);
    });
  })();

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
      {/* Hero background — brain-in-clouds image. Sits behind the gradient
          overlay (::before) and in front of the solid ink ground (::after).
          Bound to 100vh so it fades into the ink for the rest of the page. */}
      <img
        className="landing-bg-image"
        src={heroBackground}
        alt=""
        aria-hidden
      />
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
        /* Gradient overlay that sits ON TOP of the background video to
           keep wordmark + CTAs readable. Hero-bound (100vh). */
        .landing-canvas::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100vh;
          z-index: -50;
          background-image:
            linear-gradient(180deg,
              rgba(3, 21, 29, 0.00) 0%,
              rgba(3, 21, 29, 0.00) 55%,
              rgba(3, 21, 29, 0.45) 80%,
              ${P.ink} 100%),
            radial-gradient(ellipse 130% 115% at 50% 50%,
              rgba(3, 21, 29, 0.00) 0%,
              rgba(3, 21, 29, 0.08) 70%,
              rgba(3, 21, 29, 0.25) 100%);
          pointer-events: none;
        }
        /* The actual background image — sits behind the gradient overlay
           and in front of the solid ink ground. Hero-bound (100vh) so it
           fades into the ink color for the rest of the scrollable page. */
        .landing-canvas > .landing-bg-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          object-fit: cover;
          object-position: center top;
          z-index: -55;
          pointer-events: none;
          user-select: none;
          /* Avoid a hard rectangular bottom edge — fade the bottom 18% of
             the image into the ink ground beneath it. */
          -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 82%, transparent 100%);
                  mask-image: linear-gradient(180deg, #000 0%, #000 82%, transparent 100%);
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
              className="text-base"
              style={{
                ...TRACK_NAV,
                color: P.cloud,
                fontFamily: '"Saira", "Outfit", "Inter", system-ui, sans-serif',
                fontWeight: 200,
              }}
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
          {/* Wordmark — Proxima Nova first (for users who have it locally
              via Adobe Creative Cloud), then a carefully chosen free
              fallback stack designed to mimic Proxima Nova's proportions:
                • Mukta — Indian Type Foundry, the closest free match for
                  Proxima Nova's letterform width and x-height.
                • Sofia Sans — secondary near-match.
                • Montserrat — wider/more geometric backup.
              Optical tweaks below (font-stretch, optical-sizing) help
              align the substitute fonts to Proxima Nova's feel. */}
          <h1
            className="leading-none relative mt-2"
            style={{
              ...TRACK_HERO,
              fontFamily:
                '"Proxima Nova", "proxima-nova", "Mukta", "Sofia Sans", "Montserrat", "Inter", system-ui, sans-serif',
              fontWeight: 300,
              fontSize: "clamp(44px, 7.5vw, 88px)",
              fontStretch: "95%",
              fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
              fontOpticalSizing: "auto",
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
            Master clinical psychology. Deeper understanding for topics in
            psychology, neuroscience and intervention for real-world clinical
            application.
          </p>

          {/* CTA pair — equal compact pill buttons, matching the comp.
              Both share the same height and font scale; only the primary
              gets a slightly brighter border to indicate emphasis. */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
            <button
              onClick={goToApp}
              className="landing-glass-btn group inline-flex items-center gap-3 px-8 h-12 rounded-full text-xs font-light"
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
              EXPLORE COURSES
            </button>
            <button
              onClick={goToApp}
              className="landing-glass-btn group inline-flex items-center gap-3 px-8 h-12 rounded-full text-xs font-light"
              style={{
                ...TRACK_NAV,
                color: P.cloud,
                background: "rgba(10, 45, 61, 0.55)",
                border: `1px solid rgba(118, 228, 247, 0.45)`,
                backdropFilter: "blur(18px) saturate(140%)",
                WebkitBackdropFilter: "blur(18px) saturate(140%)",
                boxShadow: `0 0 14px rgba(118, 228, 247, 0.18), inset 0 0 10px rgba(118, 228, 247, 0.04)`,
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
          FEATURE CARDS — 5 glass tiles. Responsive grid:
            mobile:   1 column (full stack)
            sm:       2 columns (last card spans both → no orphan)
            md:       3 columns (3 + 2 layout)
            lg:       5 columns (single row, matches the comp)
          Tightened paddings + icon/type sizes so the 5-up row fits
          comfortably inside max-w-7xl without truncation. */}
      <section
        id="features"
        className="relative max-w-7xl mx-auto px-6 lg:px-10 pb-14"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {FEATURE_CARDS.map((card, i) => (
            <div
              key={card.title}
              className={`group relative rounded-xl p-5 text-center transition-all duration-300 hover:-translate-y-1 flex flex-col ${
                /* Span the lone last card across the full sm row so it
                   never sits as an orphan. md+ resolves naturally. */
                i === FEATURE_CARDS.length - 1 ? "sm:col-span-2 md:col-span-1" : ""
              }`}
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
                className="w-8 h-8 mx-auto mb-3"
                strokeWidth={1.25}
                style={{
                  color: P.surf,
                  filter: `drop-shadow(0 0 12px rgba(118, 228, 247, 0.55))`,
                }}
              />
              <h3
                className="text-[10.5px] font-light mb-2 min-h-[2.6em] flex items-center justify-center"
                style={{
                  ...TRACK_NAV,
                  color: P.cloud,
                  lineHeight: 1.35,
                }}
              >
                {card.title}
              </h3>
              <p
                className="text-[13px] leading-relaxed font-light"
                style={{ color: P.inkSoft }}
              >
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          BROWSE TOPICS — single bordered glass panel, 3-column chip
          grid pulled live from the topics list hook so it stays in sync
          with the database. Matches the approved landing comp.
          ============================================================ */}
      <section
        id="topics"
        className="relative max-w-7xl mx-auto px-6 lg:px-10 pb-16"
      >
        <div
          className="rounded-xl p-6 lg:p-8"
          style={{
            ...glass,
            boxShadow: `0 24px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(118, 228, 247, 0.05)`,
          }}
          data-testid="browse-topics-panel"
        >
          <p
            className="text-[11px] font-light mb-5"
            style={{ ...TRACK_NAV, color: P.mist }}
          >
            BROWSE TOPICS
          </p>

          {topicsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
              {Array.from({ length: 18 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 rounded-md"
                  style={{
                    background: "rgba(10, 45, 61, 0.45)",
                    border: "1px solid rgba(118, 228, 247, 0.12)",
                  }}
                />
              ))}
            </div>
          ) : topicsError || sortedTopics.length === 0 ? (
            <p
              className="text-sm font-light py-4"
              style={{ color: P.inkSoft }}
              data-testid="browse-topics-empty"
            >
              {topicsError
                ? "Topics are temporarily unavailable. Please refresh."
                : "No topics published yet."}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
              {sortedTopics.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => navigate(`/topics/${t.id}`)}
                  className="topic-chip flex items-center gap-3 px-4 min-h-10 py-2 rounded-md text-left text-[13px] font-light"
                  style={{
                    color: P.cloud,
                    background: "rgba(10, 45, 61, 0.45)",
                    border: "1px solid rgba(118, 228, 247, 0.22)",
                  }}
                  data-testid={`topic-chip-${t.id}`}
                >
                  <CheckCircle2
                    className="w-4 h-4 flex-shrink-0"
                    strokeWidth={1.5}
                    style={{
                      color: P.surf,
                      filter: `drop-shadow(0 0 5px rgba(118, 228, 247, 0.55))`,
                    }}
                  />
                  <span className="leading-tight">{t.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <style>{`
          .topic-chip {
            transition: transform .2s cubic-bezier(.2,.8,.2,1),
                        background .2s ease,
                        border-color .2s ease,
                        box-shadow .25s ease;
          }
          .topic-chip:hover {
            transform: translateY(-1px);
            background: rgba(10, 45, 61, 0.72) !important;
            border-color: rgba(167, 243, 255, 0.55) !important;
            box-shadow:
              0 0 0 1px rgba(167, 243, 255, 0.28),
              0 0 18px rgba(118, 228, 247, 0.32);
          }
        `}</style>
      </section>

      {/* === Sections from the previous landing that aren't in the
          approved comp (WHAT'S INSIDE numbered cards, TRUST stats,
          legacy topics grid, email subscribe) were removed in this
          redesign. Re-add only with product approval. === */}

      {/* ============================================================
          FOOTER
          ============================================================ */}
      <footer
        id="footer"
        className="relative border-t"
        style={{ borderColor: "rgba(118, 228, 247, 0.15)" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-5 text-xs">
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5" style={{ color: P.surf }} />
            <span style={{ ...TRACK_NAV, color: P.cloud, fontFamily: '"Saira", "Outfit", "Inter", system-ui, sans-serif', fontWeight: 200 }}>PSYCHPRO</span>
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
