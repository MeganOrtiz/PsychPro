import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@clerk/clerk-react";
import {
  Brain,
  Search,
  BookOpen,
  Microscope,
  Upload,
  Users,
  ShieldCheck,
  Check,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import brainSmoke from "@/assets/hero/brain-smoke.png";
import { STUDY_PALETTE as P } from "@/lib/study-theme";

// =============================================================================
// Landing — structured premium portal (rebuilt 2026-05-25 per new spec).
// -----------------------------------------------------------------------------
// Layout sections:
//   1. Top navbar (logo + primary nav + search + LOG IN)
//   2. Hero  (brain centerpiece, PSYCHPRO wordmark, tagline, paragraph, CTAs)
//   3. Feature row — 5 glassmorphism cards
//   4. Browse Topics — 3-column dark-pill grid with cyan checkmarks
//   5. Footer
//
// Background: page-level smoke (.study-page-bg::before, deep teal). The brain
// PNG itself ships with baked-in dark smoke clouds, so its radial mask is
// pulled in tight (45% radius) to crop those out — only the glowing brain
// reads, and the surrounding atmosphere comes from the page background.
// =============================================================================

const NAV_ITEMS = [
  { label: "Home", href: "#home", active: true },
  { label: "Courses", href: "#features" },
  { label: "Resources", href: "#topics" },
  { label: "Community", href: "#topics" },
  { label: "About", href: "#features" },
];

const FEATURES = [
  {
    icon: BookOpen,
    title: "Flashcards · Study Guides · Quizzes · Exams",
    body:
      "Every modality you need to retain the material — spaced repetition, structured guides, and full mock exams.",
  },
  {
    icon: Microscope,
    title: "Evidence-Based Learning Tools",
    body:
      "Grounded in cognitive science. Every interaction is tuned to how clinicians actually retain complex material.",
  },
  {
    icon: Upload,
    title: "Create Resources From Your Own Material",
    body:
      "Upload your notes, PDFs, or readings. PsychPro turns them into flashcards, guides, and practice questions.",
  },
  {
    icon: Users,
    title: "Connect With Others",
    body:
      "A growing community of clinicians, researchers, and students sharing what they've learned along the way.",
  },
  {
    icon: ShieldCheck,
    title: "PsychPro Spotlight",
    body:
      "Featured dissertations, case studies, and research from the next generation of clinical leaders.",
  },
] as const;

const TOPICS = [
  "Brain Networks",
  "Neurophysiology",
  "Psychopharmacology",
  "Limbic System",
  "Sensory Systems",
  "Behavioral Neuroscience",
  "Cognitive Psychology",
  "Clinical Assessment",
  "Psychotherapy Modalities",
  "Personality Disorders",
  "Developmental Psychology",
  "Social Psychology",
  "Neuroanatomy",
  "Mood Disorders",
  "Anxiety & Trauma",
];

const FOOTER_LINKS = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Contact", href: "#" },
];

const SOCIAL = [
  { Icon: Linkedin, label: "LinkedIn" },
  { Icon: Twitter, label: "Twitter" },
  { Icon: Instagram, label: "Instagram" },
  { Icon: Youtube, label: "YouTube" },
] as const;

export default function LandingPage() {
  const [, navigate] = useLocation();
  const { isSignedIn } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const goToApp = () => navigate(isSignedIn ? "/dashboard" : "/sign-in");
  const goToTopics = () => navigate(isSignedIn ? "/topics" : "/sign-in");

  return (
    <>
      <style>{styles}</style>
      <div className="landing-root study-page-bg" data-testid="landing-page">
        {/* ============== NAVBAR ============== */}
        <header className="landing-nav">
          <div className="landing-nav-inner">
            <a href="#home" className="landing-brand" aria-label="PsychPro home">
              <Brain
                className="landing-brand-icon"
                aria-hidden
              />
              <span className="landing-brand-mark">PSYCHPRO</span>
            </a>
            <nav className="landing-nav-links" aria-label="Primary">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`landing-nav-link${item.active ? " is-active" : ""}`}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  {item.label.toUpperCase()}
                </a>
              ))}
            </nav>
            <div className="landing-nav-actions">
              <button
                type="button"
                className="landing-nav-search"
                aria-label="Search"
                data-testid="nav-search"
              >
                <Search aria-hidden />
              </button>
              <button
                type="button"
                onClick={goToApp}
                className="landing-nav-login"
                data-testid="nav-login"
              >
                LOG IN
              </button>
            </div>
          </div>
        </header>

        {/* ============== HERO ============== */}
        <section
          id="home"
          className={`landing-hero${mounted ? " is-mounted" : ""}`}
        >
          <div className="landing-hero-brain" aria-hidden>
            <div className="landing-hero-aura" />
            <img src={brainSmoke} alt="" className="landing-hero-brain-img" />
          </div>

          <h1 className="landing-wordmark" style={{ ["--delay" as any]: "120ms" }}>
            PSYCHPRO
          </h1>
          <p className="landing-tagline" style={{ ["--delay" as any]: "240ms" }}>
            LEARN. EXPAND. CONNECT.
          </p>
          <p className="landing-blurb" style={{ ["--delay" as any]: "360ms" }}>
            Master clinical psychology. Deeper understanding for topics in
            psychology, neuroscience, and intervention for real-world clinical
            application.
          </p>

          <div
            className="landing-cta-row"
            style={{ ["--delay" as any]: "480ms" }}
          >
            <button
              type="button"
              onClick={goToApp}
              className="landing-cta landing-cta-primary"
              data-testid="cta-join-now"
            >
              Join Now
            </button>
            <button
              type="button"
              onClick={goToTopics}
              className="landing-cta landing-cta-ghost"
              data-testid="cta-explore-courses"
            >
              Explore Courses
            </button>
          </div>
        </section>

        {/* ============== FEATURES ============== */}
        <section id="features" className="landing-features">
          <div className="landing-features-row">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <article
                key={title}
                className="landing-feature-card"
                data-testid={`feature-${title.split(" ")[0].toLowerCase()}`}
              >
                <div className="landing-feature-icon-wrap">
                  <Icon aria-hidden />
                </div>
                <h3 className="landing-feature-title">{title.toUpperCase()}</h3>
                <p className="landing-feature-body">{body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ============== BROWSE TOPICS ============== */}
        <section id="topics" className="landing-topics">
          <div className="landing-topics-header">
            <h2 className="landing-topics-title">BROWSE TOPICS</h2>
            <p className="landing-topics-sub">
              A growing catalogue across neuroscience, clinical assessment, and
              intervention.
            </p>
          </div>
          <div className="landing-topics-grid">
            {TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={goToTopics}
                className="landing-topic-pill"
                data-testid={`topic-${topic.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <span className="landing-topic-check" aria-hidden>
                  <Check />
                </span>
                <span className="landing-topic-label">{topic}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ============== FOOTER ============== */}
        <footer className="landing-footer">
          <div className="landing-footer-inner">
            <a href="#home" className="landing-brand" aria-label="PsychPro home">
              <Brain className="landing-brand-icon" aria-hidden />
              <span className="landing-brand-mark">PSYCHPRO</span>
            </a>
            <nav className="landing-footer-links" aria-label="Footer">
              {FOOTER_LINKS.map((l) => (
                <a key={l.label} href={l.href} className="landing-footer-link">
                  {l.label.toUpperCase()}
                </a>
              ))}
            </nav>
            <div className="landing-footer-social">
              {SOCIAL.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="landing-footer-social-link"
                >
                  <Icon aria-hidden />
                </a>
              ))}
            </div>
          </div>
          <p className="landing-footer-fineprint">
            © {new Date().getFullYear()} PsychPro. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
}

// CSS embedded so the landing page stays self-contained. Brand hex values
// pulled from STUDY_PALETTE via the JS `P` import where rendered inline; the
// rest are stable CSS tokens used only on this page.
const C = {
  cyan: P.surf,        // #76E4F7 — primary glow
  cyanSoft: P.mist,    // #A7F3FF — icy text
  cyanMid: P.teal,     // #5EB0C8
  cyanDeep: P.tealDeep,// #2A7387
  bg: "#020d12",
  bgPanel: "rgba(8, 32, 42, 0.55)",
  bgPanelStrong: "rgba(6, 28, 38, 0.75)",
  hairline: "rgba(118, 228, 247, 0.18)",
  hairlineStrong: "rgba(118, 228, 247, 0.32)",
};

const styles = `
.landing-root {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  color: ${C.cyanSoft};
  font-family: "Proxima Nova", "Inter", "Montserrat", system-ui, -apple-system, sans-serif;
  font-feature-settings: "ss01", "cv11";
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* ============== NAVBAR ============== */
.landing-nav {
  position: sticky;
  top: 0;
  z-index: 40;
  width: 100%;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  background: linear-gradient(180deg, rgba(2, 13, 18, 0.72), rgba(2, 13, 18, 0.35));
  border-bottom: 1px solid ${C.hairline};
}
.landing-nav-inner {
  max-width: 1320px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 14px 32px;
}
.landing-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #F4FBFF;
}
.landing-brand-icon {
  width: 22px;
  height: 22px;
  color: ${C.cyan};
  filter: drop-shadow(0 0 10px ${C.cyan}99);
}
.landing-brand-mark {
  font-weight: 600;
  letter-spacing: 0.32em;
  font-size: 13px;
  color: #F4FBFF;
}
.landing-nav-links {
  display: none;
  align-items: center;
  gap: 28px;
  margin-left: 24px;
}
.landing-nav-link {
  position: relative;
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.22em;
  color: rgba(244, 251, 255, 0.78);
  padding: 6px 2px;
  transition: color 200ms ease;
}
.landing-nav-link:hover { color: #fff; }
.landing-nav-link.is-active { color: #fff; }
.landing-nav-link.is-active::after {
  content: "";
  position: absolute;
  left: 0; right: 0; bottom: -2px;
  height: 2px;
  background: ${C.cyan};
  box-shadow: 0 0 12px ${C.cyan}cc;
  border-radius: 2px;
}
.landing-nav-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 14px;
}
.landing-nav-search {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background: transparent;
  border: 1px solid ${C.hairline};
  color: ${C.cyanSoft};
  cursor: pointer;
  transition: all 180ms ease;
}
.landing-nav-search:hover {
  border-color: ${C.cyan};
  color: ${C.cyan};
  box-shadow: 0 0 14px ${C.cyan}55;
}
.landing-nav-search svg { width: 16px; height: 16px; }
.landing-nav-login {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.24em;
  padding: 9px 18px;
  border-radius: 999px;
  background: transparent;
  border: 1px solid ${C.cyan};
  color: ${C.cyan};
  cursor: pointer;
  transition: all 180ms ease;
}
.landing-nav-login:hover {
  background: ${C.cyan}1a;
  box-shadow: 0 0 18px ${C.cyan}55;
  color: #fff;
}

@media (min-width: 880px) {
  .landing-nav-links { display: flex; }
}

/* ============== HERO ============== */
.landing-hero {
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
  padding: clamp(24px, 5vh, 56px) 24px clamp(56px, 8vh, 96px);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.landing-hero-brain {
  position: relative;
  width: min(420px, 70vw);
  height: min(340px, 42vh);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: clamp(16px, 3vh, 32px);
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 1000ms cubic-bezier(0.16, 1, 0.3, 1), transform 1000ms cubic-bezier(0.16, 1, 0.3, 1);
  animation: heroBrainFloat 7s ease-in-out infinite;
}
.landing-hero.is-mounted .landing-hero-brain {
  opacity: 1;
  transform: translateY(0);
}
.landing-hero-brain-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Tight radial mask — crops the PNG's baked-in dark smoke clouds out so
     only the glowing brain shows and the page-level smoke provides atmosphere. */
  -webkit-mask-image: radial-gradient(ellipse 42% 42% at 50% 50%,
    rgba(0,0,0,1) 0%,
    rgba(0,0,0,0.95) 55%,
    rgba(0,0,0,0.4) 80%,
    rgba(0,0,0,0) 100%);
  mask-image: radial-gradient(ellipse 42% 42% at 50% 50%,
    rgba(0,0,0,1) 0%,
    rgba(0,0,0,0.95) 55%,
    rgba(0,0,0,0.4) 80%,
    rgba(0,0,0,0) 100%);
  filter:
    drop-shadow(0 0 28px ${C.cyan}66)
    drop-shadow(0 0 80px ${C.cyanMid}44);
  animation: heroBrainPulse 4.2s ease-in-out infinite;
}
.landing-hero-aura {
  position: absolute;
  inset: 18%;
  border-radius: 50%;
  background: radial-gradient(circle, ${C.cyan}44 0%, ${C.cyanMid}1c 40%, transparent 70%);
  filter: blur(42px);
  animation: heroBrainAura 4.2s ease-in-out infinite;
  z-index: -1;
}

.landing-wordmark,
.landing-tagline,
.landing-blurb,
.landing-cta-row {
  opacity: 0;
  transform: translateY(18px);
  transition:
    opacity 900ms cubic-bezier(0.16, 1, 0.3, 1) var(--delay, 0ms),
    transform 900ms cubic-bezier(0.16, 1, 0.3, 1) var(--delay, 0ms);
}
.landing-hero.is-mounted .landing-wordmark,
.landing-hero.is-mounted .landing-tagline,
.landing-hero.is-mounted .landing-blurb,
.landing-hero.is-mounted .landing-cta-row {
  opacity: 1;
  transform: translateY(0);
}

.landing-wordmark {
  margin: 0;
  font-weight: 300;
  font-size: clamp(40px, 7.5vw, 92px);
  letter-spacing: 0.32em;
  line-height: 1;
  color: #F4FBFF;
  text-shadow: 0 0 40px ${C.cyan}55, 0 0 12px ${C.cyan}33;
  padding-left: 0.32em; /* optical centering compensation for tracking */
}
.landing-tagline {
  margin: clamp(10px, 1.4vh, 18px) 0 0;
  font-weight: 500;
  font-size: clamp(11px, 1.1vw, 14px);
  letter-spacing: 0.42em;
  color: ${C.cyanSoft};
  padding-left: 0.42em;
}
.landing-blurb {
  margin: clamp(20px, 2.6vh, 32px) auto 0;
  max-width: 620px;
  font-size: clamp(15px, 1.2vw, 17px);
  line-height: 1.65;
  font-weight: 400;
  color: rgba(199, 230, 240, 0.78);
}
.landing-cta-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
  margin-top: clamp(28px, 3.4vh, 40px);
}
.landing-cta {
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.18em;
  padding: 14px 30px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 220ms cubic-bezier(0.16, 1, 0.3, 1);
}
.landing-cta-primary {
  background: linear-gradient(180deg, #083240 0%, #061f2b 100%);
  border: 1.5px solid ${C.cyan};
  color: #fff;
  box-shadow:
    0 0 0 1px ${C.cyan}33 inset,
    0 0 18px ${C.cyan}55,
    0 8px 24px -10px ${C.cyan}66;
}
.landing-cta-primary:hover {
  transform: translateY(-1px);
  box-shadow:
    0 0 0 1px ${C.cyan}55 inset,
    0 0 28px ${C.cyan}88,
    0 12px 32px -10px ${C.cyan}99;
}
.landing-cta-ghost {
  background: transparent;
  border: 1.5px solid ${C.cyan}aa;
  color: ${C.cyan};
}
.landing-cta-ghost:hover {
  background: ${C.cyan}14;
  color: #fff;
  border-color: ${C.cyan};
  box-shadow: 0 0 22px ${C.cyan}55;
}

/* ============== FEATURES ============== */
.landing-features {
  max-width: 1320px;
  margin: 0 auto;
  padding: clamp(40px, 6vh, 72px) 32px;
}
.landing-features-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
@media (min-width: 640px) { .landing-features-row { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 980px) { .landing-features-row { grid-template-columns: repeat(5, 1fr); } }

.landing-feature-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  padding: 22px 18px 22px;
  background: linear-gradient(180deg, ${C.bgPanel}, ${C.bgPanelStrong});
  border: 1px solid ${C.hairline};
  border-radius: 14px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.02) inset,
    0 18px 36px -22px rgba(0, 0, 0, 0.6),
    0 0 18px ${C.cyan}10;
  transition: all 240ms cubic-bezier(0.16, 1, 0.3, 1);
  min-height: 220px;
}
.landing-feature-card:hover {
  transform: translateY(-2px);
  border-color: ${C.hairlineStrong};
  box-shadow:
    0 0 0 1px ${C.cyan}22 inset,
    0 24px 44px -22px rgba(0, 0, 0, 0.7),
    0 0 28px ${C.cyan}33;
}
.landing-feature-icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${C.cyan}10;
  border: 1px solid ${C.hairlineStrong};
  color: ${C.cyan};
  margin-bottom: 16px;
  box-shadow: 0 0 14px ${C.cyan}33;
}
.landing-feature-icon-wrap svg { width: 18px; height: 18px; }
.landing-feature-title {
  margin: 0 0 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  line-height: 1.4;
  color: #fff;
}
.landing-feature-body {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.55;
  color: rgba(199, 230, 240, 0.7);
}

/* ============== BROWSE TOPICS ============== */
.landing-topics {
  max-width: 1320px;
  margin: 0 auto;
  padding: clamp(40px, 6vh, 80px) 32px;
}
.landing-topics-header {
  margin-bottom: clamp(20px, 2.4vh, 32px);
}
.landing-topics-title {
  margin: 0;
  font-size: clamp(20px, 1.8vw, 26px);
  font-weight: 600;
  letter-spacing: 0.36em;
  color: #fff;
  text-shadow: 0 0 18px ${C.cyan}44;
}
.landing-topics-sub {
  margin: 10px 0 0;
  font-size: 13px;
  letter-spacing: 0.04em;
  color: rgba(199, 230, 240, 0.6);
}
.landing-topics-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px 18px;
}
@media (min-width: 640px) { .landing-topics-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 980px) { .landing-topics-grid { grid-template-columns: repeat(3, 1fr); } }

.landing-topic-pill {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 13px 16px;
  background: ${C.bgPanel};
  border: 1px solid ${C.hairline};
  border-radius: 10px;
  color: ${C.cyanSoft};
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
}
.landing-topic-pill:hover {
  background: ${C.bgPanelStrong};
  border-color: ${C.hairlineStrong};
  transform: translateX(2px);
  box-shadow: 0 0 22px ${C.cyan}22;
  color: #fff;
}
.landing-topic-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 1.5px solid ${C.cyan};
  background: ${C.cyan}1f;
  color: ${C.cyan};
  flex-shrink: 0;
  box-shadow: 0 0 10px ${C.cyan}66;
}
.landing-topic-check svg { width: 12px; height: 12px; stroke-width: 3; }
.landing-topic-label {
  flex: 1;
  min-width: 0;
  letter-spacing: 0.04em;
}

/* ============== FOOTER ============== */
.landing-footer {
  border-top: 1px solid ${C.hairline};
  margin-top: clamp(40px, 6vh, 72px);
  background: linear-gradient(180deg, rgba(2, 13, 18, 0.4), rgba(2, 13, 18, 0.85));
  backdrop-filter: blur(8px);
}
.landing-footer-inner {
  max-width: 1320px;
  margin: 0 auto;
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}
.landing-footer-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 26px;
}
.landing-footer-link {
  font-size: 11px;
  letter-spacing: 0.24em;
  color: rgba(199, 230, 240, 0.65);
  text-decoration: none;
  transition: color 180ms ease;
}
.landing-footer-link:hover { color: ${C.cyan}; }
.landing-footer-social {
  display: flex;
  gap: 12px;
}
.landing-footer-social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid ${C.hairline};
  color: ${C.cyanSoft};
  transition: all 180ms ease;
}
.landing-footer-social-link:hover {
  color: ${C.cyan};
  border-color: ${C.cyan};
  box-shadow: 0 0 12px ${C.cyan}66;
}
.landing-footer-social-link svg { width: 15px; height: 15px; }
.landing-footer-fineprint {
  margin: 0;
  padding: 0 32px 22px;
  text-align: center;
  font-size: 11px;
  letter-spacing: 0.16em;
  color: rgba(199, 230, 240, 0.45);
}

@media (min-width: 720px) {
  .landing-footer-inner {
    flex-direction: row;
    justify-content: space-between;
    gap: 24px;
  }
}

/* ============== KEYFRAMES ============== */
@keyframes heroBrainFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes heroBrainPulse {
  0%, 100% {
    filter: drop-shadow(0 0 28px ${C.cyan}66) drop-shadow(0 0 80px ${C.cyanMid}44);
  }
  50% {
    filter: drop-shadow(0 0 42px ${C.cyan}99) drop-shadow(0 0 100px ${C.cyanMid}66);
  }
}
@keyframes heroBrainAura {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.08); }
}

@media (prefers-reduced-motion: reduce) {
  .landing-hero-brain,
  .landing-hero-brain-img,
  .landing-hero-aura {
    animation: none !important;
  }
  .landing-wordmark,
  .landing-tagline,
  .landing-blurb,
  .landing-cta-row,
  .landing-hero-brain {
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
`;
