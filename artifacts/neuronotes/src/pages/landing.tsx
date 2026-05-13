import { useLocation } from "wouter";
import { useState, useEffect, useRef, type FormEvent } from "react";
import {
  BookOpen,
  Users,
  Mail,
  Search,
  Brain,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Sparkles,
  Timer,
  Repeat,
  Layers,
  ListTree,
  Activity,
  Microscope,
  HeartPulse,
  Stethoscope,
  Pill,
  ClipboardList,
  Baby,
  GraduationCap,
  FlaskConical,
  Scale,
  ShieldAlert,
  Eye,
  Zap,
  TrendingUp,
} from "lucide-react";
import brainHero from "@assets/generated_images/cosmic_brain_hero.png";
import smokeTexture from "@assets/Screenshot_2026-04-27_at_1.40.17_AM_1778535214205.png";
const sideSmoke = smokeTexture;
// Single source of truth for the brand palette — do NOT fork.
import { STUDY_PALETTE as PALETTE } from "@/lib/study-theme";

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

// Subtle mouse-driven parallax for the hero brain + glow layers.
function useParallax(disabled: boolean) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (disabled) return;
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      setPos({ x: nx, y: ny });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [disabled]);
  return pos;
}

const NAV_LINKS = [
  { label: "HOME", href: "#home" },
  { label: "COURSES", href: "#features" },
  { label: "RESOURCES", href: "#features" },
  { label: "TOPICS", href: "#topics" },
  { label: "ABOUT", href: "#topics" },
];

const FEATURES = [
  {
    icon: Timer,
    title: "CUT STUDY TIME IN HALF",
    body: "Use adaptive flashcards, active recall, spaced repetition, and integrated study systems designed to maximize long-term retention.",
  },
  {
    icon: Repeat,
    title: "ACTUALLY RETAIN INFORMATION",
    body: "PsychPro reinforces learning through evidence-based memory consolidation techniques rather than passive rereading.",
  },
  {
    icon: Layers,
    title: "MASTER COMPLEX TOPICS",
    body: "Study difficult concepts through visually immersive explanations, neuroscience-based learning tools, and practical clinical application.",
  },
  {
    icon: ListTree,
    title: "STRUCTURE, NOT CHAOS",
    body: "Organized systems for neuropsychology, psychotherapy, assessment, neuroscience, research methods, DSM disorders, and more.",
  },
];

// Topic grid — a curated 28-tile sample of the 39+ specialized
// psychology and neuroscience domains PsychPro covers. The remaining
// topics are surfaced in-app; copy below the grid signals expansion.
// Icons stay understated and editorial, not LMS-style.
const TOPICS: { icon: typeof Brain; label: string }[] = [
  { icon: Brain, label: "Neuropsychology" },
  { icon: Activity, label: "Neuroscience" },
  { icon: HeartPulse, label: "Psychotherapy" },
  { icon: ClipboardList, label: "Clinical Assessment" },
  { icon: Pill, label: "Psychopharmacology" },
  { icon: BookOpen, label: "DSM-5 Disorders" },
  { icon: Users, label: "Personality Disorders" },
  { icon: Baby, label: "Developmental Psychology" },
  { icon: Microscope, label: "Cognitive Neuroscience" },
  { icon: Sparkles, label: "Learning & Memory" },
  { icon: FlaskConical, label: "Research Methods" },
  { icon: TrendingUp, label: "Statistics" },
  { icon: Layers, label: "Autism Spectrum" },
  { icon: Zap, label: "ADHD" },
  { icon: ListTree, label: "Executive Function" },
  { icon: ShieldAlert, label: "Brain Injury" },
  { icon: Eye, label: "Sensation & Perception" },
  { icon: Scale, label: "Ethics" },
  { icon: GraduationCap, label: "Child Psychology" },
  { icon: Stethoscope, label: "Health Psychology" },
  { icon: ShieldAlert, label: "Forensic Psychology" },
  { icon: Repeat, label: "CBT" },
  { icon: HeartPulse, label: "ACT / DBT" },
  { icon: Brain, label: "Psychoanalytic Theory" },
  { icon: Users, label: "Family Systems" },
  { icon: HeartPulse, label: "Emotion Regulation" },
  { icon: ClipboardList, label: "Diagnostic Interviewing" },
  { icon: Layers, label: "Case Conceptualization" },
];

export default function LandingPage() {
  const [, navigate] = useLocation();
  const reduceMotion = usePrefersReducedMotion();
  const parallax = useParallax(reduceMotion);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);

  const goCourses = () => navigate("/topics");
  const goCommunity = () => navigate("/feature-request");
  const goLogin = () => navigate("/dashboard");

  const onSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  // Glass surface used throughout (nav, panels, cards, buttons).
  const glassBg = "rgba(5, 35, 48, 0.58)";
  const glassBorder = `${PALETTE.surf}55`;
  const glassBorderStrong = `${PALETTE.surf}80`;
  const glassShadow = `0 14px 50px -16px ${PALETTE.teal}55, inset 0 1px 0 ${PALETTE.surf}1f`;

  return (
    <div
      className="relative min-h-screen overflow-x-hidden text-white antialiased"
      style={{
        // No background here — the fixed cinematic brain layer below
        // owns the entire page canvas. A dark fallback sits on <body>
        // so areas the brain hasn't covered (very tall pages) stay dark.
        color: PALETTE.cloud,
        fontFamily:
          '"Outfit", "Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
      }}
      data-testid="landing-page"
    >
      {/* Local keyframes — kept inline so the page is self-contained. */}
      <style>{`
        body { background: linear-gradient(180deg, #050B14 0%, #07101D 40%, #0A1628 75%, #0D1E36 100%); }
        @keyframes psp-drift-a { 0%,100% { transform: translate3d(0,0,0) scale(1);} 50% { transform: translate3d(2%,-2%,0) scale(1.04);} }
        @keyframes psp-drift-b { 0%,100% { transform: scaleX(-1) translate3d(0,0,0);} 50% { transform: scaleX(-1) translate3d(2%,1%,0) scale(1.04);} }
        @keyframes psp-drift-c { 0%,100% { transform: translate3d(-1%,0,0) scale(1.05);} 50% { transform: translate3d(1.5%,-1.2%,0) scale(1.10);} }
        @keyframes psp-pulse { 0%,100% { opacity: .55; filter: drop-shadow(0 0 30px ${PALETTE.surf}aa) drop-shadow(0 0 70px ${PALETTE.teal}77);} 50% { opacity: .85; filter: drop-shadow(0 0 60px ${PALETTE.surf}cc) drop-shadow(0 0 120px ${PALETTE.teal}aa);} }
        @keyframes psp-spark { 0% { opacity: 0; transform: translateX(0);} 30% { opacity: 1;} 100% { opacity: 0; transform: translateX(60px);} }
        @keyframes psp-shimmer { 0% { transform: translateX(-120%);} 100% { transform: translateX(220%);} }
        @keyframes psp-node-pulse { 0%,100% { opacity: .35;} 50% { opacity: 1;} }
        .psp-cta-shimmer { position: relative; overflow: hidden; }
        .psp-cta-shimmer::before {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(120deg, transparent 30%, ${PALETTE.surf}55 50%, transparent 70%);
          transform: translateX(-120%);
          pointer-events: none;
        }
        .psp-cta-shimmer:hover::before { animation: psp-shimmer 1.1s ease forwards; }
        .psp-card:hover { transform: translateY(-6px); border-color: ${PALETTE.surf} !important; box-shadow: 0 22px 60px -20px ${PALETTE.teal}aa, 0 0 0 1px ${PALETTE.surf}66, 0 0 50px -10px ${PALETTE.surf}66 !important; }
        .psp-nav-link { position: relative; }
        .psp-nav-link::after { content:""; position:absolute; left:50%; bottom:-8px; transform: translateX(-50%); width: 0; height: 1px; background: ${PALETTE.surf}; box-shadow: 0 0 8px ${PALETTE.surf}, 0 0 16px ${PALETTE.surf}88; transition: width .3s ease; }
        .psp-nav-link:hover::after { width: 70%; }
        .psp-nav-link.psp-active::after { width: 70%; }

        /* Honour reduced-motion: kill non-essential hover/transition motion.
           Opacity/colour transitions stay (they don't induce motion sickness),
           but transforms, shimmer sweeps, and underline grows are disabled. */
        @media (prefers-reduced-motion: reduce) {
          .psp-cta-shimmer:hover::before { animation: none !important; }
          .psp-card:hover { transform: none !important; }
          .psp-nav-link::after,
          .psp-nav-link:hover::after,
          .psp-nav-link.psp-active::after { transition: none !important; }
          [data-testid="landing-page"] *,
          [data-testid="landing-page"] *::before,
          [data-testid="landing-page"] *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>

      {/* ============================================================ */}
      {/* GLOBAL CINEMATIC BACKGROUND                                  */}
      {/* The brain + smoky neural artwork IS the page — fixed,        */}
      {/* edge-to-edge. Every section overlays this single canvas.     */}
      {/* ============================================================ */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-x-0 top-0 select-none mix-blend-screen"
          style={{
            backgroundImage: `url(${brainHero})`,
            backgroundSize: "82% auto",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
            aspectRatio: "1024 / 573",
            animation: reduceMotion ? "none" : "psp-pulse 6s ease-in-out infinite",
          }}
          aria-hidden
        />
        <div
          className="absolute inset-x-0 top-0 pointer-events-none"
          aria-hidden
          style={{
            aspectRatio: "1024 / 573",
            background: `linear-gradient(180deg, transparent 0%, transparent 45%, ${PALETTE.ink}aa 78%, ${PALETTE.ink} 100%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.55] mix-blend-screen"
          style={{
            backgroundImage: `url(${smokeTexture})`,
            backgroundSize: "180% auto",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            animation: reduceMotion ? "none" : "psp-drift-c 90s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-0 -left-32 w-[60vw] h-full opacity-[0.32] mix-blend-screen"
          style={{
            backgroundImage: `url(${sideSmoke})`,
            backgroundSize: "auto 120%",
            backgroundPosition: "left center",
            backgroundRepeat: "no-repeat",
            maskImage:
              "linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.55) 55%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.55) 55%, transparent 100%)",
            animation: reduceMotion ? "none" : "psp-drift-a 38s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-0 -right-32 w-[60vw] h-full opacity-[0.30] mix-blend-screen"
          style={{
            backgroundImage: `url(${sideSmoke})`,
            backgroundSize: "auto 120%",
            backgroundPosition: "right center",
            backgroundRepeat: "no-repeat",
            transform: "scaleX(-1)",
            maskImage:
              "linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.55) 55%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.55) 55%, transparent 100%)",
            animation: reduceMotion ? "none" : "psp-drift-b 46s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-[6%] left-1/2 -translate-x-1/2 w-[55vw] h-[55vh] rounded-full blur-[100px] opacity-50"
          style={{
            background: `radial-gradient(circle, ${PALETTE.surf}66, transparent 65%)`,
            transform: reduceMotion
              ? "translate(-50%, 0)"
              : `translate(calc(-50% + ${parallax.x * -14}px), ${parallax.y * -10}px)`,
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-40"
          style={{
            background: `linear-gradient(180deg, ${PALETTE.ink}cc 0%, ${PALETTE.ink}55 60%, transparent 100%)`,
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[55%]"
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${PALETTE.bg}cc 45%, ${PALETTE.ink} 100%)`,
          }}
        />
      </div>

      {/* ============================================================ */}
      {/* NAV                                                          */}
      {/* ============================================================ */}
      <header
        className="fixed top-0 inset-x-0 z-40 backdrop-blur-xl border-b"
        style={{
          background: glassBg,
          borderColor: `${PALETTE.surf}33`,
          boxShadow: `0 6px 30px -12px ${PALETTE.teal}66`,
        }}
      >
        <nav
          className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-6"
          aria-label="Main"
        >
          {/* Brand */}
          <a
            href="#home"
            className="flex items-center gap-2.5 shrink-0"
            data-testid="nav-brand"
          >
            <BrainLineIcon className="w-7 h-7" color={PALETTE.surf} />
            <span
              className="font-light text-base md:text-[17px] text-white"
              style={{ letterSpacing: "0.32em" }}
            >
              PSYCHPRO
            </span>
          </a>

          {/* Center nav (hidden on small screens) */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10 text-[12px] font-medium">
            {NAV_LINKS.map((l, i) => (
              <a
                key={l.label}
                href={l.href}
                className={`psp-nav-link transition-colors ${
                  i === 0 ? "psp-active text-white" : ""
                }`}
                style={{
                  color: i === 0 ? PALETTE.cloud : `${PALETTE.mist}cc`,
                  letterSpacing: "0.22em",
                }}
                data-testid={`nav-link-${l.label.toLowerCase()}`}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            <button
              type="button"
              aria-label="Search"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-white/5"
              style={{ color: `${PALETTE.mist}cc` }}
              data-testid="nav-search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={goLogin}
              className="text-[12px] font-medium px-4 md:px-5 h-9 rounded-md border transition-all hover:bg-white/5 hover:text-white"
              style={{
                color: PALETTE.cloud,
                borderColor: glassBorderStrong,
                letterSpacing: "0.22em",
                boxShadow: `0 0 18px -6px ${PALETTE.surf}66, inset 0 0 12px -8px ${PALETTE.surf}55`,
              }}
              data-testid="nav-login"
            >
              LOG IN
            </button>
          </div>
        </nav>
      </header>

      {/* ============================================================ */}
      {/* HERO — overlays the global brain background, no image box.   */}
      {/* Spacer pushes the wordmark down so it lands over the lower   */}
      {/* third of the brain artwork (matches reference composition).  */}
      {/* ============================================================ */}
      <section
        id="home"
        ref={heroRef}
        className="relative pb-10 md:pb-14"
      >
        {/* Spacer — pushes wordmark down so it lands just below the
            cinematic brain artwork in the fixed background. */}
        <div className="h-[36vw] max-h-[640px] min-h-[260px]" aria-hidden />

        {/* Wordmark + copy — sits directly over the brain background */}
        <div className="relative max-w-[1180px] mx-auto px-5 md:px-8 text-center">
          <h1
            className="text-white"
            style={{
              fontWeight: 200,
              fontSize: "clamp(48px, 9vw, 120px)",
              letterSpacing: "0.28em",
              lineHeight: 1,
              textShadow: `0 0 40px ${PALETTE.surf}66, 0 8px 60px ${PALETTE.ink}, 0 2px 12px ${PALETTE.ink}`,
            }}
            data-testid="hero-wordmark"
          >
            PSYCHPRO
          </h1>
          <p
            className="mt-4 md:mt-6 text-[12px] sm:text-sm md:text-base"
            style={{
              color: `${PALETTE.mist}dd`,
              letterSpacing: "0.42em",
              fontWeight: 300,
            }}
          >
            LEARN.&nbsp;&nbsp;EXPAND.&nbsp;&nbsp;CONNECT.
          </p>
          <p
            className="mt-7 md:mt-9 text-[15px] md:text-[17px] max-w-2xl mx-auto leading-relaxed"
            style={{ color: `${PALETTE.paperSoft}` }}
          >
            PsychPro combines neuroscience-based learning systems, clinical
            psychology education, active recall, and immersive study tools to
            help you learn faster and retain information long term.
          </p>

          {/* CTAs */}
          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <GlassCTA
              onClick={goCourses}
              icon={<BookOpen className="w-4 h-4" />}
              label="EXPLORE COURSES"
              testId="cta-explore-courses"
              palette={PALETTE}
            />
            <GlassCTA
              onClick={goCommunity}
              icon={<Users className="w-4 h-4" />}
              label="JOIN COMMUNITY"
              testId="cta-join-community"
              palette={PALETTE}
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FEATURE CARDS                                                */}
      {/* ============================================================ */}
      <section
        id="features"
        className="relative max-w-[1180px] mx-auto px-5 md:px-8 pt-6 md:pt-10 pb-8 md:pb-10 scroll-mt-24"
      >
        <div className="text-center mb-10 md:mb-14">
          <p
            className="text-[11px] md:text-[12px] font-medium"
            style={{
              color: PALETTE.surf,
              letterSpacing: "0.42em",
              textShadow: `0 0 14px ${PALETTE.surf}66`,
            }}
          >
            BUILT FOR PSYCHOLOGY STUDENTS &amp; CLINICIANS
          </p>
          <h2
            className="mt-4 text-3xl md:text-5xl font-light text-white leading-tight"
            style={{ letterSpacing: "0.02em" }}
          >
            Master Clinical Psychology Faster
          </h2>
          <p
            className="mt-5 text-[14px] md:text-[15px] max-w-2xl mx-auto leading-relaxed"
            style={{ color: PALETTE.paperSoft }}
          >
            Evidence-based study tools grounded in cognitive neuroscience —
            designed to help you study less, retain more, and think clinically.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="psp-card relative rounded-2xl p-6 md:p-7 border backdrop-blur-md transition-all duration-300 text-center"
              style={{
                background: glassBg,
                borderColor: glassBorder,
                boxShadow: glassShadow,
              }}
              data-testid={`feature-${f.title.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div
                className="w-14 h-14 mx-auto mb-5 rounded-xl flex items-center justify-center border"
                style={{
                  background: `linear-gradient(180deg, ${PALETTE.surf}22, transparent)`,
                  borderColor: glassBorder,
                  boxShadow: `inset 0 0 18px ${PALETTE.surf}22, 0 0 14px -4px ${PALETTE.surf}66`,
                }}
              >
                <f.icon
                  className="w-6 h-6"
                  style={{
                    color: PALETTE.surf,
                    filter: `drop-shadow(0 0 6px ${PALETTE.surf}aa)`,
                  }}
                  strokeWidth={1.4}
                />
              </div>
              <h3
                className="text-[13px] font-medium text-white mb-3"
                style={{ letterSpacing: "0.22em" }}
              >
                {f.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: `${PALETTE.paperSoft}` }}
              >
                {f.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* TOPIC GRID — 39+ specialized psychology / neuroscience areas */}
      {/* ============================================================ */}
      <section
        id="topics"
        className="relative max-w-[1180px] mx-auto px-5 md:px-8 pt-10 md:pt-16 pb-12 md:pb-16 scroll-mt-24"
      >
        <div className="text-center mb-10 md:mb-14">
          <p
            className="text-[11px] md:text-[12px] font-medium"
            style={{
              color: PALETTE.surf,
              letterSpacing: "0.42em",
              textShadow: `0 0 14px ${PALETTE.surf}66`,
            }}
          >
            COMPREHENSIVE COVERAGE
          </p>
          <h2
            className="mt-4 text-3xl md:text-5xl font-light text-white leading-tight"
            style={{ letterSpacing: "0.02em" }}
          >
            Explore 39+ Specialized Psychology Topics
          </h2>
          <p
            className="mt-5 text-[14px] md:text-[15px] max-w-2xl mx-auto leading-relaxed"
            style={{ color: PALETTE.paperSoft }}
          >
            From neuropsychology and psychotherapy to assessment, ethics, and
            specialized clinical populations — every domain you need to study
            for boards or practice with confidence.
          </p>
        </div>

        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4"
          data-testid="topic-grid"
        >
          {TOPICS.map((t) => (
            <div
              key={t.label}
              className="psp-card group flex items-center gap-3 rounded-xl px-4 py-3.5 border backdrop-blur-md transition-all duration-300"
              style={{
                background: glassBg,
                borderColor: glassBorder,
                boxShadow: glassShadow,
              }}
              data-testid={`topic-${t.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            >
              <span
                className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center border"
                style={{
                  background: `linear-gradient(180deg, ${PALETTE.surf}1c, transparent)`,
                  borderColor: glassBorder,
                  boxShadow: `inset 0 0 10px ${PALETTE.surf}22`,
                }}
              >
                <t.icon
                  className="w-4 h-4"
                  style={{
                    color: PALETTE.surf,
                    filter: `drop-shadow(0 0 5px ${PALETTE.surf}88)`,
                  }}
                  strokeWidth={1.5}
                />
              </span>
              <span
                className="text-[12.5px] md:text-[13px] font-light text-white truncate"
                style={{ letterSpacing: "0.04em" }}
              >
                {t.label}
              </span>
            </div>
          ))}
        </div>

        <p
          className="mt-8 text-center text-[12px]"
          style={{
            color: `${PALETTE.mist}cc`,
            letterSpacing: "0.22em",
          }}
        >
          + MORE TOPICS ADDED EVERY MONTH
        </p>
      </section>

      {/* ============================================================ */}
      {/* SUBSCRIBE                                                    */}
      {/* ============================================================ */}
      <section className="relative max-w-[1180px] mx-auto px-5 md:px-8 py-6 md:py-8">
        <form
          onSubmit={onSubscribe}
          className="rounded-2xl p-5 md:p-6 border backdrop-blur-md flex flex-col md:flex-row items-stretch md:items-center gap-5 md:gap-6"
          style={{
            background: glassBg,
            borderColor: glassBorder,
            boxShadow: glassShadow,
          }}
          data-testid="subscribe-panel"
        >
          <div className="flex items-center gap-4 md:gap-5 md:flex-1">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center border shrink-0"
              style={{
                background: `linear-gradient(180deg, ${PALETTE.surf}22, transparent)`,
                borderColor: glassBorder,
                boxShadow: `inset 0 0 14px ${PALETTE.surf}33`,
              }}
            >
              <Mail
                className="w-5 h-5"
                style={{
                  color: PALETTE.surf,
                  filter: `drop-shadow(0 0 6px ${PALETTE.surf}aa)`,
                }}
                strokeWidth={1.5}
              />
            </div>
            <div className="min-w-0">
              <div
                className="text-[13px] md:text-sm font-medium text-white"
                style={{ letterSpacing: "0.22em" }}
              >
                STAY INSPIRED.
              </div>
              <div
                className="text-xs md:text-sm mt-0.5"
                style={{ color: `${PALETTE.paperSoft}` }}
              >
                Get expert insights and updates.
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-3 md:flex-1">
            <input
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-11 px-4 rounded-lg border bg-transparent text-sm text-white placeholder:opacity-60 outline-none transition-all focus:ring-1"
              style={{
                borderColor: glassBorder,
                background: `${PALETTE.ink}80`,
                color: PALETTE.cloud,
                ["--tw-ring-color" as any]: PALETTE.surf,
              }}
              data-testid="subscribe-email"
              aria-label="Email address"
            />
            <button
              type="submit"
              className="psp-cta-shimmer h-11 px-6 rounded-lg text-[12px] font-semibold transition-all hover:-translate-y-0.5"
              style={{
                background: `linear-gradient(135deg, ${PALETTE.teal}, ${PALETTE.surf})`,
                color: PALETTE.ink,
                letterSpacing: "0.24em",
                boxShadow: `0 10px 32px -10px ${PALETTE.surf}cc, 0 0 0 1px ${PALETTE.surf}66`,
              }}
              data-testid="subscribe-submit"
            >
              {subscribed ? "SUBSCRIBED" : "SUBSCRIBE"}
            </button>
          </div>
        </form>
        {subscribed && (
          <div
            className="mt-3 text-xs flex items-center justify-center gap-1.5"
            style={{ color: `${PALETTE.mist}cc` }}
            role="status"
          >
            <Sparkles className="w-3 h-3" /> Thanks — we'll be in touch.
          </div>
        )}
      </section>

      {/* ============================================================ */}
      {/* FOOTER                                                       */}
      {/* ============================================================ */}
      <footer
        className="relative mt-6 border-t backdrop-blur-md"
        style={{
          borderColor: `${PALETTE.surf}33`,
          background: `${PALETTE.ink}cc`,
        }}
      >
        <div className="max-w-[1180px] mx-auto px-5 md:px-8 py-6 md:py-7 flex flex-col md:flex-row items-center justify-between gap-5 text-[12px]">
          {/* Left — brand */}
          <div className="flex items-center gap-2.5">
            <BrainLineIcon className="w-5 h-5" color={PALETTE.surf} />
            <span
              className="font-light text-white"
              style={{ letterSpacing: "0.32em" }}
            >
              PSYCHPRO
            </span>
          </div>

          {/* Center — legal */}
          <div
            className="flex items-center gap-5 md:gap-7"
            style={{ color: `${PALETTE.mist}cc`, letterSpacing: "0.18em" }}
          >
            <a href="#" className="hover:text-white transition-colors">
              PRIVACY POLICY
            </a>
            <span className="opacity-40">|</span>
            <a href="#" className="hover:text-white transition-colors">
              TERMS OF SERVICE
            </a>
            <span className="opacity-40">|</span>
            <a href="#" className="hover:text-white transition-colors">
              CONTACT
            </a>
          </div>

          {/* Right — social */}
          <div className="flex items-center gap-4" style={{ color: `${PALETTE.mist}cc` }}>
            <a href="#" aria-label="LinkedIn" className="hover:text-white transition-colors">
              <Linkedin className="w-4 h-4" strokeWidth={1.6} />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-white transition-colors">
              <Twitter className="w-4 h-4" strokeWidth={1.6} />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-white transition-colors">
              <Instagram className="w-4 h-4" strokeWidth={1.6} />
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-white transition-colors">
              <Youtube className="w-4 h-4" strokeWidth={1.6} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

// Small inline brain-outline mark used in nav + footer. Kept as SVG so it
// renders crisp at any size without an extra image fetch.
function BrainLineIcon({
  className,
  color,
}: {
  className?: string;
  color: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke={color}
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ filter: `drop-shadow(0 0 6px ${color}99)` }}
    >
      <path d="M9 4.5a2.5 2.5 0 0 0-2.5 2.5v.2A2.8 2.8 0 0 0 4 9.8c0 1 .5 1.9 1.3 2.4A2.8 2.8 0 0 0 4 14.7c0 1.5 1.2 2.7 2.7 2.7H7c.1 1.4 1.3 2.6 2.7 2.6A2.3 2.3 0 0 0 12 17.7V6.5A2 2 0 0 0 10 4.5Z" />
      <path d="M15 4.5a2.5 2.5 0 0 1 2.5 2.5v.2A2.8 2.8 0 0 1 20 9.8c0 1-.5 1.9-1.3 2.4A2.8 2.8 0 0 1 20 14.7c0 1.5-1.2 2.7-2.7 2.7H17c-.1 1.4-1.3 2.6-2.7 2.6A2.3 2.3 0 0 1 12 17.7V6.5a2 2 0 0 1 2-2Z" />
      <path d="M12 9v6" opacity=".6" />
    </svg>
  );
}

// Glass CTA button used in the hero — cyan border, soft inner glow,
// hover lift + animated shimmer sweep.
function GlassCTA({
  onClick,
  icon,
  label,
  testId,
  palette,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  testId: string;
  palette: typeof PALETTE;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      className="psp-cta-shimmer group relative inline-flex items-center justify-center gap-2.5 h-12 px-7 md:px-8 rounded-md text-[12px] font-medium text-white transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: `linear-gradient(180deg, ${palette.surf}1a, ${palette.ink}66)`,
        border: `1px solid ${palette.surf}88`,
        letterSpacing: "0.24em",
        boxShadow: `inset 0 0 18px -4px ${palette.surf}55, 0 8px 30px -10px ${palette.teal}88, 0 0 0 1px ${palette.surf}33`,
        backdropFilter: "blur(8px)",
      }}
    >
      <span
        className="relative z-10 flex items-center justify-center"
        style={{
          color: palette.surf,
          filter: `drop-shadow(0 0 4px ${palette.surf}aa)`,
        }}
      >
        {icon}
      </span>
      <span className="relative z-10">{label}</span>
    </button>
  );
}
