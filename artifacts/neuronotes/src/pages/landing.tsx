import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@clerk/clerk-react";
import {
  Brain,
  Search,
  BookOpen,
  Layers,
  FileText,
  Users,
  Award,
  Check,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import brainSmoke from "@/assets/hero/brain.png";
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

const FEATURES_TOP = [
  {
    icon: Layers,
    title: "Flashcards / Study Guides / Quizzes / Exams",
    body: "Reinforce your learning with interactive study tools.",
  },
  {
    icon: Brain,
    title: "Evidence-Based Learning Tools",
    body:
      "Utilize specific tools for spaced repetition, interleaved learning and active recall.",
  },
  {
    icon: FileText,
    title: "Create Learning Resources From Your Own Material",
    body:
      "Upload, organize, and transform your material into smart resources.",
  },
] as const;

const FEATURES_BOTTOM = [
  {
    icon: Users,
    title: "Connect With Others",
    body: "Collaborate, share insights, and grow together.",
  },
  {
    icon: Award,
    title: "PsychPro Spotlight",
    body:
      "Submit your dissertation, research, presentations for opportunities to be featured in the PsychPro Spotlight.",
  },
] as const;

// Topics organized into 3 columns, read top-to-bottom by column.
const TOPIC_COLUMNS: string[][] = [
  [
    "Brain Networks",
    "Endocrine System & Reproduction",
    "Neurophysiology",
    "Sleep & Circadian Rhythms",
    "Executive Function",
    "Neurocognitive Disorders",
    "Neuropsychology Overview",
    "Personality Disorders",
    "Trauma-Focused Approaches",
    "Analytical Psychology — Jung",
    "Family, Systems, and Couples Therapies",
  ],
  [
    "Central Nervous System",
    "Enteric Nervous System",
    "Peripheral Nervous System",
    "Vascular System of the Brain",
    "Forensic Neuropsychology",
    "Neurodevelopmental Disorders",
    "Validity & Effort Testing",
    "Psychiatric Disorders",
    "Acceptance, Mindfulness, and Third-Wave Approaches",
    "Behavior Therapy and Applied Behavior Analysis",
    "Foundations of Psychotherapy",
  ],
  [
    "Cranial Nerves",
    "Limbic System & Motivation",
    "Sensory Systems",
    "Apraxia & Agnosia",
    "Language Processing & Aphasia",
    "Neuroimaging & Neuromodulation",
    "ADHD & Medications",
    "Psychopharmacology",
    "Adlerian, Humanistic, and Existential Approaches",
    "Cognitive Therapy, CBT, and Schema Therapy",
    "Gestalt, Experiential, and Emotion-Focused Therapy",
  ],
];

const FOOTER_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Contact", href: "mailto:admin@psychprosuites.com" },
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
              className="landing-cta landing-cta-ghost"
              data-testid="cta-join-now"
            >
              <BookOpen className="landing-cta-icon" aria-hidden />
              <span>JOIN NOW</span>
            </button>
            <button
              type="button"
              onClick={goToTopics}
              className="landing-cta landing-cta-ghost"
              data-testid="cta-explore-topics"
            >
              <Users className="landing-cta-icon" aria-hidden />
              <span>EXPLORE TOPICS</span>
            </button>
          </div>
        </section>

        {/* ============== FEATURES (3 above / 2 below) ============== */}
        <section id="features" className="landing-features">
          <div className="landing-features-row landing-features-row--three">
            {FEATURES_TOP.map(({ icon: Icon, title, body }) => (
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
          <div className="landing-features-row landing-features-row--two">
            {FEATURES_BOTTOM.map(({ icon: Icon, title, body }) => (
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
          <div className="landing-topics-panel">
            <div className="landing-topics-header">
              <h2 className="landing-topics-title">BROWSE TOPICS</h2>
            </div>
            <div className="landing-topics-grid">
              {TOPIC_COLUMNS.map((col, ci) => (
                <div key={ci} className="landing-topics-col">
                  {col.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={goToTopics}
                      className="landing-topic-pill"
                      data-testid={`topic-${topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}
                    >
                      <span className="landing-topic-check" aria-hidden>
                        <Check />
                      </span>
                      <span className="landing-topic-label">{topic}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
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
              {FOOTER_LINKS.map((l, i) => (
                <span key={l.label} className="landing-footer-link-item">
                  {i > 0 && (
                    <span className="landing-footer-sep" aria-hidden>|</span>
                  )}
                  <a href={l.href} className="landing-footer-link">
                    {l.label.toUpperCase()}
                  </a>
                </span>
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
  max-width: 1320px;
  margin: 0 auto;
  /* No top padding — brain bleeds off the top edge of the page.
     The negative top margin pulls the brain slot up so its top edge
     sits above the navbar baseline and reads as bleeding off-screen. */
  padding: 0 24px clamp(56px, 8vh, 96px);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.landing-hero-brain {
  position: relative;
  /* Portrait-shaped stage that matches the source image's native
     aspect (576×1024 ≈ 9:16). The whole brain-clouds composition
     renders cinematically with the brain centered in the upper
     portion and cloud bank trailing below, exactly as in the source. */
  width: clamp(360px, 56vw, 620px);
  height: clamp(560px, 82vh, 980px);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: clamp(-48px, -4vh, -16px);
  margin-bottom: clamp(-180px, -16vh, -120px);
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 1000ms cubic-bezier(0.16, 1, 0.3, 1), transform 1000ms cubic-bezier(0.16, 1, 0.3, 1);
  animation: heroBrainFloat 7s ease-in-out infinite;
  pointer-events: none;
}
.landing-hero.is-mounted .landing-hero-brain {
  opacity: 1;
  transform: translateY(0);
}
.landing-hero-brain-img {
  width: 100%;
  height: 100%;
  /* Show the WHOLE image at native aspect — brain centered upper,
     clouds fanning out below, with all four edges feathered so the
     composition dissolves into the surrounding page-bg clouds for
     one continuous ethereal atmosphere with no visible seams. */
  object-fit: contain;
  object-position: center center;
  -webkit-mask-image: radial-gradient(ellipse 62% 78% at 50% 42%,
    rgba(0,0,0,1) 0%,
    rgba(0,0,0,1) 32%,
    rgba(0,0,0,0.92) 55%,
    rgba(0,0,0,0.55) 75%,
    rgba(0,0,0,0.18) 90%,
    rgba(0,0,0,0) 100%);
  mask-image: radial-gradient(ellipse 62% 78% at 50% 42%,
    rgba(0,0,0,1) 0%,
    rgba(0,0,0,1) 32%,
    rgba(0,0,0,0.92) 55%,
    rgba(0,0,0,0.55) 75%,
    rgba(0,0,0,0.18) 90%,
    rgba(0,0,0,0) 100%);
  filter:
    drop-shadow(0 0 32px ${C.cyan}55)
    drop-shadow(0 0 90px ${C.cyanMid}33);
  animation: heroBrainPulse 4.2s ease-in-out infinite;
}
.landing-hero-aura {
  position: absolute;
  inset: 22% 28%;
  border-radius: 50%;
  background: radial-gradient(circle, ${C.cyan}3a 0%, ${C.cyanMid}18 40%, transparent 70%);
  filter: blur(48px);
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
  /* Match the dashboard BrandBanner wordmark typeface. */
  font-family: "Outfit", "Inter", system-ui, sans-serif;
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.22em;
  padding: 14px 28px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 220ms cubic-bezier(0.16, 1, 0.3, 1);
}
.landing-cta-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
.landing-cta-ghost {
  background: transparent;
  border: 1.5px solid ${C.cyan}cc;
  color: ${C.cyan};
  box-shadow: 0 0 14px ${C.cyan}33, 0 0 0 1px ${C.cyan}1a inset;
}
.landing-cta-ghost:hover {
  background: ${C.cyan}14;
  color: #fff;
  border-color: ${C.cyan};
  box-shadow: 0 0 24px ${C.cyan}66, 0 0 0 1px ${C.cyan}33 inset;
  transform: translateY(-1px);
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
.landing-features-row + .landing-features-row {
  margin-top: 16px;
}
@media (min-width: 640px) {
  .landing-features-row--three { grid-template-columns: repeat(2, 1fr); }
  .landing-features-row--two { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 980px) {
  .landing-features-row--three { grid-template-columns: repeat(3, 1fr); }
  /* 2-card row sits centered under the 3-card row above it. */
  .landing-features-row--two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    max-width: calc((1320px - 64px) * 2 / 3 + 16px);
    margin-left: auto;
    margin-right: auto;
    width: 100%;
  }
}

.landing-feature-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 26px 22px 26px;
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
  padding: clamp(24px, 3vh, 40px) 32px clamp(40px, 6vh, 80px);
}
.landing-topics-panel {
  position: relative;
  background: linear-gradient(180deg, ${C.bgPanel}, ${C.bgPanelStrong});
  border: 1px solid ${C.hairlineStrong};
  border-radius: 18px;
  padding: clamp(20px, 3vh, 32px) clamp(20px, 2.6vw, 36px);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.02) inset,
    0 24px 60px -30px rgba(0, 0, 0, 0.6),
    0 0 32px ${C.cyan}10;
}
.landing-topics-header {
  margin-bottom: clamp(16px, 2vh, 24px);
}
.landing-topics-title {
  margin: 0;
  font-size: clamp(18px, 1.4vw, 22px);
  font-weight: 600;
  letter-spacing: 0.34em;
  color: #fff;
  text-shadow: 0 0 18px ${C.cyan}44;
}
.landing-topics-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
}
.landing-topics-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
@media (min-width: 640px) { .landing-topics-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 980px) { .landing-topics-grid { grid-template-columns: repeat(3, 1fr); } }

.landing-topic-pill {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 11px 14px;
  background: rgba(3, 17, 24, 0.55);
  border: 1px solid ${C.hairline};
  border-radius: 10px;
  color: ${C.cyanSoft};
  font-family: inherit;
  font-size: 13.5px;
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
  align-items: center;
  gap: 0;
}
.landing-footer-link-item {
  display: inline-flex;
  align-items: center;
}
.landing-footer-sep {
  display: inline-block;
  padding: 0 18px;
  color: rgba(199, 230, 240, 0.28);
  font-weight: 300;
  user-select: none;
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
