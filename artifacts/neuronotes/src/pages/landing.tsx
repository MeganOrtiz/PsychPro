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
  Menu,
  X,
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
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

  // Reusable glass surface — translucent dark teal, faint cyan border,
  // blur. Border opacity intentionally low (0.15) so the cards read as
  // glassmorphic accents against the near-black ground rather than as
  // hard-bordered panels.
  const glass = {
    background: "rgba(4, 12, 18, 0.55)",
    border: "1px solid rgba(58, 224, 236, 0.15)",
    backdropFilter: "blur(18px) saturate(140%)",
    WebkitBackdropFilter: "blur(18px) saturate(140%)",
    boxShadow: "inset 0 0 24px rgba(58, 224, 236, 0.06)",
  } as const;

  return (
    <div
      className="landing-canvas min-h-screen relative overflow-x-hidden"
      data-testid="landing-page"
      style={{
        background: "#04080c",
        color: P.cloud,
        fontFamily: '"Montserrat", sans-serif',
      }}
    >
      {/* NOTE: the brain image is no longer a full-bleed cover background.
          It is rendered as an in-flow <img> inside the hero section below,
          sized to 40vh, horizontally centered, with generous dark space
          around it on all sides. The page ground (#04080c) shows through
          the natural transparency around the brain in the source PNG. */}
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
        /* Brain element — in-flow image sized to 40vh, horizontally
           centered with generous dark space around it. object-fit:contain
           preserves the full portrait so the cerebellum at the bottom
           and the smoke wisps at the top/sides remain visible. A soft
           radial mask fades the rectangular edges of the PNG into the
           near-black page ground so there is no visible container edge. */
        /* Brain element — the source PNG is a tall portrait with a long
           smoke column trailing well below the brain itself. We render
           it into a fixed-aspect wrapper and use object-fit:cover with
           object-position centered on the upper-third (where the brain
           lives) to crop out the bottom smoke tail. A soft radial mask
           then dissolves the rectangular wrapper edges into the
           near-black ground so the brain reads as floating in smoke. */
        .landing-canvas .landing-brain {
          position: relative;
          z-index: 2;
          display: block;
          width: min(60vh, 78vw);
          aspect-ratio: 1 / 1;
          margin: 0 auto;
          object-fit: cover;
          object-position: center 28%;
          pointer-events: none;
          user-select: none;
          filter: drop-shadow(0 0 80px rgba(58, 224, 236, 0.30));
          -webkit-mask-image:
            radial-gradient(circle at 50% 50%,
              #000 45%,
              rgba(0,0,0,0.55) 72%,
              transparent 100%);
                  mask-image:
            radial-gradient(circle at 50% 50%,
              #000 45%,
              rgba(0,0,0,0.55) 72%,
              transparent 100%);
          animation: brain-breathe 9s ease-in-out infinite;
        }
        @media (max-width: 768px) {
          .landing-canvas .landing-brain {
            width: min(52vh, 88vw);
          }
        }

        /* ──────────────────────────────────────────────────────────────
           ATMOSPHERIC LAYERS — engagement polish
           Three stacked decorative layers behind the brain that bring
           the dead side-margins to life without competing with content:
             • landing-aurora — large, soft, slowly pulsing turquoise
               radial that bleeds across the full viewport width so the
               brain doesn't feel like a stamp on a black void.
             • landing-halo   — slow-rotating conic ring directly behind
               the brain that adds a subtle "energy field" feel.
             • landing-stars  — twinkling pinpoint particle field for
               depth. Generated with stacked box-shadows (no JS / no
               extra DOM nodes).
           All layers are pointer-events:none, z-index:0–1 (brain is 2,
           text is 10), and respect prefers-reduced-motion. */
        .landing-hero-stage {
          position: relative;
        }
        .landing-aurora {
          position: absolute;
          inset: -10% -10% 0 -10%;
          z-index: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse 55% 45% at 50% 38%,
              rgba(58, 224, 236, 0.22) 0%,
              rgba(58, 224, 236, 0.10) 35%,
              rgba(10, 60, 80, 0.06) 60%,
              transparent 85%),
            radial-gradient(ellipse 80% 30% at 50% 50%,
              rgba(118, 228, 247, 0.06) 0%,
              transparent 70%);
          filter: blur(8px);
          animation: aurora-pulse 11s ease-in-out infinite;
        }
        .landing-halo {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(72vh, 92vw);
          aspect-ratio: 1 / 1;
          z-index: 1;
          pointer-events: none;
          border-radius: 50%;
          background:
            conic-gradient(from 0deg,
              rgba(58, 224, 236, 0.00) 0deg,
              rgba(58, 224, 236, 0.18) 60deg,
              rgba(118, 228, 247, 0.05) 130deg,
              rgba(58, 224, 236, 0.20) 220deg,
              rgba(58, 224, 236, 0.00) 320deg,
              rgba(58, 224, 236, 0.00) 360deg);
          -webkit-mask-image:
            radial-gradient(circle at 50% 50%,
              transparent 38%,
              #000 46%,
              #000 52%,
              transparent 62%);
                  mask-image:
            radial-gradient(circle at 50% 50%,
              transparent 38%,
              #000 46%,
              #000 52%,
              transparent 62%);
          filter: blur(6px);
          opacity: 0.7;
          animation: halo-spin 45s linear infinite;
        }
        .landing-stars {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }
        /* Pinpoint stars — three stacked dots, each given a small army
           of box-shadow copies at hand-picked positions so they spread
           naturally across the hero. Three layers with different sizes
           and twinkle phases keep the field from feeling mechanical. */
        .landing-stars::before,
        .landing-stars::after,
        .landing-stars > .stars-mid {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 1px;
          height: 1px;
          border-radius: 50%;
          background: transparent;
        }
        .landing-stars::before {
          box-shadow:
             7vw  9vh 0 0.5px rgba(167,243,255,0.85),
            14vw 22vh 0 0.5px rgba(167,243,255,0.55),
            21vw  5vh 0 0.5px rgba(167,243,255,0.70),
            28vw 32vh 0 0.5px rgba(167,243,255,0.40),
            34vw 14vh 0 0.5px rgba(167,243,255,0.80),
            42vw 28vh 0 0.5px rgba(167,243,255,0.50),
            48vw  7vh 0 0.5px rgba(167,243,255,0.65),
            56vw 35vh 0 0.5px rgba(167,243,255,0.45),
            63vw 11vh 0 0.5px rgba(167,243,255,0.75),
            70vw 26vh 0 0.5px rgba(167,243,255,0.55),
            78vw  6vh 0 0.5px rgba(167,243,255,0.85),
            85vw 30vh 0 0.5px rgba(167,243,255,0.60),
            92vw 18vh 0 0.5px rgba(167,243,255,0.50),
             4vw 38vh 0 0.5px rgba(167,243,255,0.60),
            96vw  9vh 0 0.5px rgba(167,243,255,0.70);
          animation: star-twinkle 4.5s ease-in-out infinite;
        }
        .landing-stars > .stars-mid {
          box-shadow:
            10vw 16vh 0 0.5px rgba(118,228,247,0.55),
            18vw 41vh 0 0.5px rgba(118,228,247,0.40),
            25vw 18vh 0 0.5px rgba(118,228,247,0.65),
            38vw 44vh 0 0.5px rgba(118,228,247,0.45),
            52vw 21vh 0 0.5px rgba(118,228,247,0.55),
            66vw 40vh 0 0.5px rgba(118,228,247,0.50),
            74vw 17vh 0 0.5px rgba(118,228,247,0.60),
            82vw 43vh 0 0.5px rgba(118,228,247,0.40),
            89vw 24vh 0 0.5px rgba(118,228,247,0.55),
             2vw 28vh 0 0.5px rgba(118,228,247,0.50);
          animation: star-twinkle 6.5s ease-in-out infinite;
          animation-delay: -2s;
        }
        .landing-stars::after {
          box-shadow:
             6vw 47vh 0 0.5px rgba(58,224,236,0.70),
            16vw 52vh 0 0.5px rgba(58,224,236,0.45),
            29vw 49vh 0 0.5px rgba(58,224,236,0.55),
            44vw 53vh 0 0.5px rgba(58,224,236,0.40),
            59vw 47vh 0 0.5px rgba(58,224,236,0.55),
            71vw 51vh 0 0.5px rgba(58,224,236,0.45),
            86vw 48vh 0 0.5px rgba(58,224,236,0.60),
            94vw 54vh 0 0.5px rgba(58,224,236,0.40);
          animation: star-twinkle 5.5s ease-in-out infinite;
          animation-delay: -3.5s;
        }

        /* Wordmark — subtle slow shine sweep every ~12s. */
        .landing-wordmark {
          position: relative;
          display: inline-block;
        }
        .landing-wordmark::after {
          content: "PSYCHPRO";
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg,
            transparent 38%,
            rgba(255, 255, 255, 0.85) 50%,
            transparent 62%);
          -webkit-background-clip: text;
                  background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          background-size: 250% 100%;
          background-position: 200% 0;
          animation: wordmark-shine 12s ease-in-out infinite;
          pointer-events: none;
        }

        /* CTA buttons — magnetic hover lift + intensified glow. */
        .landing-glass-btn {
          transition:
            transform .35s cubic-bezier(.2,.8,.2,1),
            box-shadow .35s ease,
            border-color .35s ease,
            background-color .35s ease !important;
        }
        .landing-glass-btn:hover {
          transform: translateY(-2px);
          box-shadow:
            0 0 32px rgba(118, 228, 247, 0.55),
            0 0 60px rgba(58, 224, 236, 0.25),
            inset 0 0 18px rgba(118, 228, 247, 0.12) !important;
          border-color: rgba(167, 243, 255, 0.85) !important;
        }

        /* ── Keyframes ─────────────────────────────────────────────── */
        @keyframes brain-breathe {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 80px rgba(58, 224, 236, 0.28));
          }
          50% {
            transform: scale(1.025);
            filter: drop-shadow(0 0 110px rgba(58, 224, 236, 0.42));
          }
        }
        @keyframes aurora-pulse {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50%      { opacity: 1;    transform: scale(1.04); }
        }
        @keyframes halo-spin {
          to { transform: translateX(-50%) rotate(360deg); }
        }
        @keyframes star-twinkle {
          0%, 100% { opacity: 0.35; }
          50%      { opacity: 1; }
        }
        @keyframes wordmark-shine {
          0%   { background-position: 200% 0; }
          55%  { background-position: -50% 0; }
          100% { background-position: -50% 0; }
        }

        /* Accessibility — kill all decorative motion for users who
           have requested reduced motion at the OS level. */
        @media (prefers-reduced-motion: reduce) {
          .landing-canvas .landing-brain,
          .landing-aurora,
          .landing-halo,
          .landing-stars::before,
          .landing-stars::after,
          .landing-stars > .stars-mid,
          .landing-wordmark::after {
            animation: none !important;
          }
          .landing-halo { opacity: 0.5; }
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
                fontFamily: '"Montserrat", sans-serif',
                fontWeight: 300,
              }}
            >
              PSYCHPRO
            </span>
          </div>

          {/* Center nav — absolutely positioned so the links read as
              perfectly centered on the page regardless of the brand /
              right-cluster widths. Lighter weight (200) per redesign.
              Hidden below lg (1024px) so the nav doesn't collide with
              the right-cluster on tablet — replaced by the hamburger
              button + dropdown drawer in the right cluster instead. */}
          <nav className="hidden lg:flex items-center gap-9 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((link) => {
              const isActive = activeNav === link.label;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setActiveNav(link.label)}
                  className="nav-text-link text-xs"
                  style={{
                    ...TRACK_NAV,
                    fontWeight: 200,
                    color: isActive ? P.cloud : P.inkSoft,
                  }}
                  data-testid={`nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute left-0 right-0 -bottom-2 h-px"
                      style={{
                        background: "#3ae0ec",
                        boxShadow: "0 0 10px #3ae0ec, 0 0 4px #3ae0ec",
                      }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-4">
            {/* Plain icon glyph — no circular pill — per the redesign. */}
            <button
              aria-label="Search"
              className="nav-text-link p-1"
              style={{ color: P.mist, background: "transparent", border: "none" }}
              data-testid="header-search"
            >
              <Search className="w-4 h-4" strokeWidth={1.5} />
            </button>
            <button
              onClick={goToApp}
              className="landing-glass-btn px-4 sm:px-6 h-9 rounded-md text-xs font-light whitespace-nowrap"
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
            {/* Hamburger — visible below lg, opens the mobile drawer
                with the same NAV_LINKS. Hidden on desktop where the
                center nav is shown. */}
            <button
              type="button"
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileNavOpen}
              aria-controls="landing-mobile-nav"
              onClick={() => setMobileNavOpen((v) => !v)}
              className="lg:hidden nav-text-link p-1"
              style={{ color: P.cloud, background: "transparent", border: "none" }}
              data-testid="header-mobile-menu"
            >
              {mobileNavOpen ? (
                <X className="w-5 h-5" strokeWidth={1.5} />
              ) : (
                <Menu className="w-5 h-5" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile / tablet nav drawer — slides down from the header.
            Same NAV_LINKS as desktop, stacked vertically with generous
            tap targets. Closes on link tap. */}
        {mobileNavOpen && (
          <div
            id="landing-mobile-nav"
            className="lg:hidden border-t"
            style={{
              borderColor: "rgba(58, 224, 236, 0.15)",
              background: "rgba(4, 8, 12, 0.92)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
            data-testid="mobile-nav-drawer"
          >
            <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = activeNav === link.label;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => {
                      setActiveNav(link.label);
                      setMobileNavOpen(false);
                    }}
                    className="nav-text-link text-sm py-3 px-2 rounded-md"
                    style={{
                      ...TRACK_NAV,
                      fontWeight: 300,
                      color: isActive ? P.cloud : P.inkSoft,
                    }}
                    data-testid={`mobile-nav-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* ============================================================
          HERO — floating isolated brain over the fixed cloud canvas,
          followed by wordmark, tagline, body copy and CTAs.
          ============================================================ */}
      {/* Hero stack — brain image (40vh, centered, dark space around it),
          then PSYCHPRO wordmark, tagline, body copy, CTAs. All centered
          in a vertical column. Tightened bottom padding so the feature
          cards pull up into the first screen. */}
      <section className="landing-hero-stage relative flex flex-col items-center pt-6 md:pt-8 pb-8 md:pb-10">
        {/* Atmospheric decoration — see the .landing-aurora / .landing-halo
            / .landing-stars CSS block above for layering rules. All three
            are pointer-events:none and sit behind the brain (z 0–1). */}
        <div className="landing-aurora" aria-hidden />
        <div className="landing-stars" aria-hidden>
          <div className="stars-mid" />
        </div>
        <div className="landing-halo" aria-hidden />
        <img
          src={heroBackground}
          alt=""
          aria-hidden
          className="landing-brain"
        />
        <div className="max-w-5xl mx-auto px-6 lg:px-10 text-center relative z-10 mt-4 md:mt-6">
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
            className="landing-wordmark leading-none relative"
            style={{
              fontFamily: '"Montserrat", sans-serif',
              fontWeight: 200,
              fontSize: "clamp(40px, 6.8vw, 78px)",
              letterSpacing: "0.35em",
              fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
              color: "#e8fcff",
              // Soft turquoise glow per the redesign brief.
              textShadow: "0 0 30px rgba(58, 224, 236, 0.4)",
            }}
          >
            PSYCHPRO
          </h1>

          {/* Tagline — directly beneath the wordmark, wider tracking
              and lower opacity (~0.7) per the redesign brief. */}
          <p
            className="mt-3 text-xs md:text-sm"
            style={{
              fontFamily: 'var(--app-font-sans), "Outfit", "Inter", system-ui, sans-serif',
              fontWeight: 200,
              color: "#e8fcff",
              opacity: 0.7,
              letterSpacing: "0.5em",
            }}
          >
            LEARN. EXPAND. CONNECT.
          </p>

          {/* Body copy — tightened. */}
          <p
            className="mt-5 mx-auto max-w-2xl text-sm md:text-[15px] leading-relaxed"
            style={{
              fontFamily: 'var(--app-font-sans), "Outfit", "Inter", system-ui, sans-serif',
              fontWeight: 300,
              color: "rgba(232, 252, 255, 0.72)",
            }}
          >
            Master clinical psychology. Deeper understanding for topics in
            psychology, neuroscience and intervention for real-world clinical
            application.
          </p>

          {/* CTA pair — tightened margin so the feature row pulls up. */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-center">
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
        className="relative max-w-7xl mx-auto px-6 lg:px-10 pb-8"
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
        className="relative max-w-7xl mx-auto px-6 lg:px-10 pb-10"
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
            <span style={{ ...TRACK_NAV, color: P.cloud, fontFamily: '"Montserrat", sans-serif', fontWeight: 300 }}>PSYCHPRO</span>
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
