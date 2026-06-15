import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@clerk/clerk-react";
import {
  Brain,
  BookOpen,
  Layers,
  ClipboardList,
  GraduationCap,
  Target,
  Repeat,
  Shuffle,
  Upload,
  Sparkles,
  Activity,
  Compass,
  ArrowRight,
  Check,
  Award,
  CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useGetTopics } from "@workspace/api-client-react";
import brainLateral from "@/assets/brain-views/lateral.webp";
import founderMegan from "@/assets/founder/megan.png";
import { STUDY_PALETTE as P } from "@/lib/study-theme";
import { isEpppTopic } from "@/lib/eppp-content";

// =============================================================================
// Landing — restructured 2026-05-30.
// -----------------------------------------------------------------------------
// Keeps the established dark cinematic "neuroscience portal" brand (midnight
// teal, cyan glow, glassmorphism, the floating brain motif, Outfit/Inter type)
// but presents the product through a deeper, multi-section narrative:
//   1. Navbar (logo + in-page nav + LOG IN)
//   2. Hero (brain centerpiece, wordmark, tagline, value prop, CTAs, stat strip)
//   3. Positioning band (serious prep, without the four-figure price tag)
//   4. Study tools (flashcards / quizzes / study guides / practice tests / course mastery exam)
//   5. Learning science (active recall / spaced repetition / interleaving)
//   6. Features (custom study tools, beyond traditional learning, reflections)
//   7. Brain Lab (interactive 3D neuroanatomy)
//   8. Dashboard (personalized progress, what to study next)
//   9. Scholar tier (turn your own notes/PDFs into study material with AI)
//  10. Final CTA
//  11. Footer
//
// COPY RULES (from the user): only true facts. No "expert-made" / "built by
// clinicians" claims, no fabricated testimonials, logos, ratings, or user
// counts. Verified facts only (46 topics, 8 domains, the five study formats,
// the learning-science methods, the Brain Lab, the dashboard, Scholar AI).
// =============================================================================

const STAT_STRIP = [
  { value: "46", label: "Topics" },
  { value: "8", label: "Domains" },
  { value: "5", label: "Study formats" },
] as const;

// The five built-in study formats. Each gets a brand-family accent so the row
// reads as a cool cyan spectrum rather than identical tiles.
const STUDY_TOOLS = [
  {
    icon: Layers,
    title: "Flashcards Built for Understanding",
    body:
      "More than simple recall. Every card is designed to strengthen conceptual understanding, clinical reasoning, and long-term retention.",
    accent: "#76E4F7",
  },
  {
    icon: ClipboardList,
    title: "Quizzes That Reinforce Learning",
    body:
      "Every question includes detailed explanations that transform assessment into another opportunity to learn.",
    accent: "#68CCDE",
  },
  {
    icon: BookOpen,
    title: "Comprehensive Study Guides",
    body:
      "Structured, high-yield content that brings together essential concepts, clinical applications, and key details in one place.",
    accent: "#A7F3FF",
  },
  {
    icon: GraduationCap,
    title: "Exam-Style Practice Tests",
    body:
      "Build confidence, identify knowledge gaps, and apply what you've learned under realistic testing conditions.",
    accent: "#6FC9DF",
  },
  {
    icon: Award,
    title: "Course Mastery Exam",
    body:
      "Solidify your understanding of every topic in a course with the final Course Mastery Exam.",
    accent: "#9AD9E8",
  },
] as const;

// Evidence-based learning principles the platform is built around.
const LEARNING_SCIENCE = [
  {
    icon: Target,
    title: "Active recall",
    body:
      "Retrieve, don't reread. Every tool is designed to make you pull knowledge from memory — the way it sticks.",
  },
  {
    icon: Repeat,
    title: "Spaced repetition",
    body:
      "Review at the right moment so what you learn today is still there on exam day, and in practice.",
  },
  {
    icon: Shuffle,
    title: "Interleaving",
    body:
      "Mix related topics instead of cramming one at a time to build flexible, durable clinical knowledge.",
  },
] as const;

// Illustrative 7-day score trend for the landing "Study Analytics" card. This
// is a decorative sample (the card is aria-hidden) mirroring the real dashboard
// Study Analytics chart shape; no live user data is shown on the landing page.
const DASH_ACTIVITY = [
  { day: "Mon", score: 62 },
  { day: "Tue", score: 74 },
  { day: "Wed", score: 58 },
  { day: "Thu", score: 88 },
  { day: "Fri", score: 79 },
  { day: "Sat", score: 94 },
  { day: "Sun", score: 86 },
];

// What the Scholar tier adds — mirrors src/pages/subscription.tsx SCHOLAR_FEATURES.
const SCHOLAR_POINTS = [
  "Upload your own PDFs, DOCX, TXT, or pasted notes",
  "AI builds flashcards, quizzes, and study guides from your content only",
  "Generate practice exams from your own material",
  "Unlimited custom study decks",
] as const;

// What the personalized dashboard surfaces — all real app features.
const DASHBOARD_POINTS = [
  "Progress tracked across every topic you study",
  "A clear recommendation for what to study next",
  "Study streaks that keep your momentum going",
] as const;

const FOOTER_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Contact", href: "mailto:admin@psychprosuite.com" },
];

// Category ordering for the "All topics" list at the bottom — mirrors the
// Topics tab so the two stay consistent. Categories not in this list are
// appended alphabetically.
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

function useScrollReveal() {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function LandingPage() {
  const [, navigate] = useLocation();
  const { isSignedIn } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useScrollReveal();

  // Gated app routes fall back to sign-in when the visitor isn't signed in.
  const navTo = (path: string) => navigate(isSignedIn ? path : "/sign-in");
  const goToApp = () => navTo("/dashboard");
  const goToTopics = () => navTo("/topics");
  const goToPlans = () => navTo("/subscription");

  // Full topic list for the "All topics" section at the bottom. Pulled live
  // from the topics hook so it stays in sync with the database, sorted by the
  // Topics-tab category order then alphabetically within each category.
  const { data: topicsData, isLoading: topicsLoading, isError: topicsError } =
    useGetTopics() as {
      data: LandingTopic[] | undefined;
      isLoading: boolean;
      isError: boolean;
    };
  const sortedTopics: LandingTopic[] = (() => {
    const list = ((topicsData ?? []) as LandingTopic[]).filter(
      (topic) => !isEpppTopic(topic),
    );
    const rank = (c: string) => {
      const i = TOPIC_CATEGORY_ORDER.indexOf(c);
      return i === -1 ? TOPIC_CATEGORY_ORDER.length : i;
    };
    return [...list].sort((a, b) => {
      const r = rank(a.category) - rank(b.category);
      if (r !== 0) return r;
      const c = (a.category || "").localeCompare(b.category || "");
      if (c !== 0) return c;
      return a.name.localeCompare(b.name);
    });
  })();

  return (
    <>
      <style>{styles}</style>
      <div className="landing-root study-page-bg" data-testid="landing-page">
        {/* ============== NAVBAR ============== */}
        <header className="landing-nav">
          <div className="landing-nav-inner">
            <a href="#home" className="landing-brand" aria-label="PsychPro home">
              <Brain className="landing-brand-icon" aria-hidden />
              <span className="landing-brand-mark">PSYCHPRO</span>
            </a>

            <nav className="landing-nav-links" aria-label="Sections">
              <a href="#mastery" className="landing-nav-link">Features</a>
              <a href="#tools" className="landing-nav-link">Study Tools</a>
              <a href="#brain-lab" className="landing-nav-link">Brain Lab</a>
              <a href="#scholar" className="landing-nav-link">Scholar</a>
            </nav>

            <div className="landing-nav-actions">
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
          <h1 className="landing-wordmark" style={{ ["--delay" as any]: "120ms" }}>
            PSYCHPRO
          </h1>
          <p className="landing-tagline" style={{ ["--delay" as any]: "220ms" }}>
            learn. expand. connect.
          </p>
          <p className="landing-headline" style={{ ["--delay" as any]: "320ms" }}>
            Master Topics in Clinical Psychology, Neuropsychology,
            Neuroscience, Assessment, Psychotherapy, and More
          </p>
          <p className="landing-blurb" style={{ ["--delay" as any]: "420ms" }}>
            PsychPro combines evidence-based learning strategies with
            comprehensive educational content to create a modern learning
            experience for psychology students, professionals, and life-long
            learners.
          </p>

          <div
            className="landing-cta-row"
            style={{ ["--delay" as any]: "520ms" }}
          >
            <button
              type="button"
              onClick={goToApp}
              className="landing-cta landing-cta-primary"
              data-testid="cta-join-now"
            >
              <BookOpen className="landing-cta-icon" aria-hidden />
              <span>JOIN NOW</span>
            </button>
            <button
              type="button"
              onClick={goToPlans}
              className="landing-cta landing-cta-ghost"
              data-testid="cta-explore-topics"
            >
              <Compass className="landing-cta-icon" aria-hidden />
              <span>BROWSE COURSES</span>
            </button>
          </div>

          <div className="landing-stat-strip" style={{ ["--delay" as any]: "620ms" }}>
            {STAT_STRIP.map((s, i) => (
              <div key={s.label} className="landing-stat-item">
                {i > 0 && <span className="landing-stat-sep" aria-hidden />}
                <span className="landing-stat-num">{s.value}</span>
                <span className="landing-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ============== EPPP MASTERY SUITE ============== */}
        <section id="mastery" className="landing-section landing-mastery" data-reveal>
          <div className="landing-mastery-card">
            <p className="landing-eyebrow">THE SYSTEM</p>
            <h2 className="landing-section-title">
              The PsychPro EPPP Mastery Suite&trade;
            </h2>
            <p className="landing-mastery-text">
              The PsychPro EPPP Mastery Suite&trade; is a system of learning
              resources designed to promote mastery of EPPP content through
              conceptual understanding, critical thinking, and active
              application. Featuring structured lessons in each domain, clinical
              integration case examples, and full-length practice exams, the
              system equips learners with the knowledge and confidence needed
              for both EPPP success and real-world clinical practice.
            </p>
          </div>
        </section>

        {/* ============== STUDY TOOLS ============== */}
        <section id="tools" className="landing-section landing-tools">
          <div className="landing-section-head" data-reveal>
            <p className="landing-eyebrow">WHAT'S INSIDE</p>
            <h2 className="landing-section-title">
              Learn, apply, retain, and revisit
            </h2>
          </div>
          <div className="landing-tools-grid">
            {STUDY_TOOLS.map((f, i) => {
              const Icon = f.icon;
              return (
                <article
                  key={f.title}
                  className="landing-feature-card"
                  style={{
                    ["--accent" as any]: f.accent,
                    ["--reveal-delay" as any]: `${i * 90}ms`,
                  }}
                  data-reveal
                  data-testid={`tool-${i}`}
                >
                  <div className="landing-feature-icon-wrap">
                    <Icon aria-hidden />
                  </div>
                  <h3 className="landing-feature-title">{f.title}</h3>
                  <p className="landing-feature-body">{f.body}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* ============== LEARNING SCIENCE ============== */}
        <section id="science" className="landing-section landing-science">
          <div className="landing-section-head" data-reveal>
            <p className="landing-eyebrow">THE METHOD</p>
            <h2 className="landing-section-title">
              Built on how learning actually works
            </h2>
            <p className="landing-section-sub">
              PsychPro is designed around evidence-based learning principles, so
              the hours you put in turn into knowledge that lasts.
            </p>
          </div>
          <div className="landing-science-grid">
            {LEARNING_SCIENCE.map((s, i) => {
              const Icon = s.icon;
              return (
                <article
                  key={s.title}
                  className="landing-science-item"
                  style={{ ["--reveal-delay" as any]: `${i * 90}ms` }}
                  data-reveal
                >
                  <div className="landing-science-icon">
                    <Icon aria-hidden />
                  </div>
                  <div>
                    <h3 className="landing-science-title">{s.title}</h3>
                    <p className="landing-science-body">{s.body}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ============== BRAIN LAB (split) ============== */}
        <section id="brain-lab" className="landing-section landing-split" data-reveal>
          <div className="landing-split-media landing-split-media--brain">
            <div className="landing-split-glow" aria-hidden />
            <img
              src={brainLateral}
              alt="Interactive 3D brain anatomy view"
              className="landing-split-img"
            />
          </div>
          <div className="landing-split-body landing-split-body--boxed">
            <p className="landing-eyebrow landing-eyebrow--left">INTERACTIVE 3D</p>
            <h2 className="landing-split-title">
              Interactive Brain Lab
            </h2>
            <p className="landing-split-text">
              Study the structures and functions of the brain with our
              interactive Brain Lab — built for visual learning. Rotate the
              model, open any structure, and connect anatomy to its function and
              clinical relevance.
            </p>
            <button
              type="button"
              onClick={() => navTo("/brain-lab")}
              className="landing-cta landing-cta-ghost"
              data-testid="cta-brain-lab"
            >
              <Brain className="landing-cta-icon" aria-hidden />
              <span>OPEN THE BRAIN LAB</span>
            </button>
          </div>
        </section>

        {/* ============== DASHBOARD (split, reversed) ============== */}
        <section className="landing-section landing-split landing-split--reverse" data-reveal>
          <div className="landing-split-media">
            <div className="landing-dash-card" aria-hidden="true">
              <div className="landing-dash-card-head">
                <Activity className="landing-dash-card-icon" aria-hidden />
                <span>Study Analytics</span>
              </div>
              <div className="landing-dash-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={DASH_ACTIVITY}
                    margin={{ top: 8, right: 8, bottom: 0, left: -8 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(118,228,247,0.12)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: C.mistSoft }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: C.mistSoft }}
                      width={36}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke={C.cyan}
                      strokeWidth={2.5}
                      dot={{ r: 2.5, fill: C.cyanMid }}
                      activeDot={{ r: 4 }}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="landing-dash-note" aria-hidden>
                Illustration
              </p>
            </div>
          </div>
          <div className="landing-split-body landing-split-body--boxed">
            <p className="landing-eyebrow landing-eyebrow--left">YOUR DASHBOARD</p>
            <h2 className="landing-split-title">
              Track progress, prioritize learning, and connect
            </h2>
            <p className="landing-split-text">
              Your personalized dashboard keeps your studying on track, shows you
              what to prioritize next, and connects you with the wider PsychPro
              community.
            </p>
            <ul className="landing-checklist">
              {DASHBOARD_POINTS.map((point) => (
                <li key={point} className="landing-checklist-item">
                  <Check className="landing-checklist-check" aria-hidden />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ============== SCHOLAR TIER ============== */}
        <section id="scholar" className="landing-section landing-scholar" data-reveal>
          <div className="landing-scholar-card">
            <div className="landing-scholar-head">
              <div className="landing-scholar-icon">
                <Sparkles aria-hidden />
              </div>
              <div>
                <p className="landing-eyebrow landing-eyebrow--left">SCHOLAR TIER</p>
                <h2 className="landing-split-title landing-scholar-title">
                  Turn your own material into study tools
                </h2>
              </div>
            </div>
            <p className="landing-split-text">
              Scholar members bring their own content — lecture notes, articles,
              and PDFs — and use AI to generate custom flashcards, quizzes, study
              guides, and practice exams built only from what they upload.
            </p>
            <ul className="landing-checklist landing-checklist--grid">
              {SCHOLAR_POINTS.map((point) => (
                <li key={point} className="landing-checklist-item">
                  <Upload className="landing-checklist-check" aria-hidden />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => navTo("/subscription")}
              className="landing-cta landing-cta-ghost"
              data-testid="cta-scholar"
            >
              <Sparkles className="landing-cta-icon" aria-hidden />
              <span>SEE SCHOLAR PLANS</span>
            </button>
          </div>
        </section>

        {/* ============== FINAL CTA ============== */}
        <section className="landing-section landing-final" data-reveal>
          <div className="landing-final-card">
            <h2 className="landing-final-title">
              Explore topics designed for real-world clinical application
            </h2>
            <div className="landing-cta-row landing-cta-row--center">
              <button
                type="button"
                onClick={goToApp}
                className="landing-cta landing-cta-primary"
                data-testid="cta-final-join"
              >
                <span>GET STARTED FREE</span>
                <ArrowRight className="landing-cta-icon" aria-hidden />
              </button>
            </div>
          </div>
        </section>

        {/* ============== ALL TOPICS ============== */}
        <section id="topics" className="landing-section landing-topics" data-reveal>
          <div className="landing-section-head">
            <p className="landing-eyebrow">ALL TOPICS</p>
            <h2 className="landing-section-title">
              Browse the complete topic library
            </h2>
            <p className="landing-section-sub">
              The full library of topics you can study on PsychPro — flashcards,
              quizzes, study guides, and practice exams for each.
            </p>
          </div>

          {topicsLoading ? (
            <div
              className="landing-topics-grid"
              role="status"
              aria-live="polite"
              aria-label="Loading topics"
            >
              {Array.from({ length: 18 }).map((_, i) => (
                <div
                  key={i}
                  className="landing-topic-chip landing-topic-chip--skeleton"
                  aria-hidden
                />
              ))}
            </div>
          ) : topicsError || sortedTopics.length === 0 ? (
            <p className="landing-topics-empty" data-testid="landing-topics-empty">
              {topicsError
                ? "Topics are temporarily unavailable. Please refresh."
                : "No topics published yet."}
            </p>
          ) : (
            <div className="landing-topics-grid" data-testid="landing-topics-grid">
              {sortedTopics.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => navTo(`/topics/${t.id}`)}
                  className="landing-topic-chip"
                  data-testid={`landing-topic-chip-${t.id}`}
                >
                  <CheckCircle2 className="landing-topic-chip-icon" aria-hidden />
                  <span>{t.name}</span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ============== MEET THE FOUNDER ============== */}
        <section id="founder" className="landing-section landing-founder" data-reveal>
          <div className="landing-founder-card">
            <div className="landing-founder-media">
              <div className="landing-founder-glow" aria-hidden />
              <img
                src={founderMegan}
                alt="Megan, founder of PsychPro"
                className="landing-founder-img"
              />
            </div>
            <div className="landing-founder-body">
              <p className="landing-eyebrow landing-eyebrow--left">
                MEET THE FOUNDER
              </p>
              <h2 className="landing-split-title">Hey Everyone,</h2>
              <div className="landing-founder-text">
                <p>
                  I created PsychPro out of a need to meaningfully organize and
                  connect all the information I'd attained throughout my academic
                  career and clinical training. As a clinical psychology doctoral
                  student myself, I understand firsthand how much there is to
                  learn and apply across psychology, neuroscience, assessment,
                  intervention, research, clinical practice, and licensure prep.
                </p>
                <p>
                  What started as a way to share the countless pages of notes,
                  study materials, and resources I'd created over the years
                  quickly turned into something much more: an all-in-one space
                  where information could be learned, understood, and processed
                  more deeply.
                </p>
                <p>
                  PsychPro offers study guides, flashcards, practice questions,
                  visual learning tools, and EPPP preparation materials designed
                  to support students, clinicians, and lifelong learners from
                  their very first psychology courses through advanced training,
                  licensure, and beyond.
                </p>
                <p>
                  PsychPro is the resource I wish I'd had from day one and I'm so
                  glad you're here to learn alongside me.
                </p>
              </div>
              <p className="landing-founder-sign">— Megan, Founder of PsychPro</p>
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
// pulled from STUDY_PALETTE via the JS `P` import; the rest are stable CSS
// tokens used only on this page.
const C = {
  cyan: P.surf,        // #76E4F7 — primary glow
  cyanSoft: P.mist,    // #A7F3FF — icy text
  mistSoft: P.mistSoft,// #7FBFD0 — muted icy text (chart ticks)
  cyanMid: P.teal,     // #68CCDE
  cyanDeep: P.tealDeep,// #3196AF
  bg: "#082a33",
  bgPanel: "hsl(var(--surf-hue) 88% 19% / 0.82)",
  bgPanelStrong: "hsl(var(--surf-hue) 88% 14% / 0.90)",
  hairline: "rgba(118, 228, 247, 0.36)",
  hairlineStrong: "rgba(118, 228, 247, 0.58)",
};

const styles = `
.landing-root {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  color: ${C.cyanSoft};
  font-family: "Outfit", "Inter", system-ui, -apple-system, sans-serif;
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
  background: linear-gradient(180deg, hsl(var(--surf-hue) 85% 12% / 0.58), hsl(var(--surf-hue) 85% 12% / 0.26));
  border-bottom: 1px solid ${C.hairline};
}
.landing-nav-inner {
  position: relative;
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
}
@media (min-width: 920px) {
  .landing-nav-links {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
.landing-nav-link {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(199, 230, 240, 0.66);
  text-decoration: none;
  transition: color 180ms ease, text-shadow 180ms ease;
}
.landing-nav-link:hover {
  color: ${C.cyan};
  text-shadow: 0 0 14px ${C.cyan}66;
}
@media (min-width: 920px) {
  .landing-nav-links { display: flex; }
}
.landing-nav-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 14px;
}
.landing-nav-login {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.24em;
  padding: 9px 18px;
  border-radius: 8px;
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

/* ============== HERO ============== */
.landing-hero {
  position: relative;
  max-width: 1320px;
  margin: 0 auto;
  /* Generous top padding drops the wordmark into the lower-cloud region of the
     fixed brain-in-clouds backdrop, leaving the glowing brain unobstructed near
     the top of the viewport. */
  padding: clamp(190px, 38vh, 440px) 24px clamp(40px, 6vh, 90px);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
/* Localized legibility scrim — a soft pool of deep teal behind the hero text
   only, so the wordmark, tagline and blurb read cleanly over the glowing brain
   without dimming the rest of the full-intensity backdrop. */
.landing-hero::before {
  content: "";
  position: absolute;
  z-index: -1;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(880px, 92%);
  height: 78%;
  background: radial-gradient(ellipse 64% 56% at 50% 52%,
    hsl(var(--surf-hue) 82% 7% / 0.66) 0%,
    hsl(var(--surf-hue) 82% 7% / 0.40) 46%,
    hsl(var(--surf-hue) 82% 7% / 0.00) 76%);
  pointer-events: none;
}

.landing-wordmark,
.landing-tagline,
.landing-headline,
.landing-blurb,
/* Hero-scoped: .landing-cta-row is reused by the FINAL CTA section, so this
   pre-animation opacity:0 must NOT apply globally or that button stays hidden. */
.landing-hero .landing-cta-row,
.landing-stat-strip {
  opacity: 0;
  transform: translateY(18px);
  transition:
    opacity 900ms cubic-bezier(0.16, 1, 0.3, 1) var(--delay, 0ms),
    transform 900ms cubic-bezier(0.16, 1, 0.3, 1) var(--delay, 0ms);
}
.landing-hero.is-mounted .landing-wordmark,
.landing-hero.is-mounted .landing-tagline,
.landing-hero.is-mounted .landing-headline,
.landing-hero.is-mounted .landing-blurb,
.landing-hero.is-mounted .landing-cta-row,
.landing-hero.is-mounted .landing-stat-strip {
  opacity: 1;
  transform: translateY(0);
}

.landing-wordmark {
  margin: 0;
  font-family: "Outfit", "Inter", system-ui, -apple-system, sans-serif;
  font-weight: 200;
  font-size: clamp(40px, 7.5vw, 92px);
  letter-spacing: 0.22em;
  line-height: 1;
  color: #F4FBFF;
  text-shadow: 0 0 40px ${C.cyan}55, 0 0 12px ${C.cyan}33;
  padding-left: 0.22em;
}
.landing-tagline {
  margin: clamp(6px, 1vh, 12px) 0 0;
  font-weight: 500;
  font-size: clamp(11px, 1.1vw, 14px);
  letter-spacing: 0.42em;
  color: ${C.cyanSoft};
  padding-left: 0.42em;
}
.landing-headline {
  margin: clamp(12px, 1.6vh, 20px) auto 0;
  max-width: 720px;
  font-family: "Outfit", "Inter", system-ui, sans-serif;
  font-weight: 300;
  font-size: clamp(22px, 2.8vw, 36px);
  line-height: 1.2;
  color: #F4FBFF;
  text-shadow: 0 0 30px ${C.cyan}30;
}
.landing-blurb {
  margin: clamp(10px, 1.4vh, 18px) auto 0;
  max-width: 660px;
  font-size: clamp(15px, 1.2vw, 17.5px);
  line-height: 1.7;
  font-weight: 400;
  color: rgba(225, 244, 250, 0.88);
  text-shadow: 0 1px 12px hsl(var(--surf-hue) 92% 5% / 0.55);
}
.landing-cta-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
  margin-top: clamp(16px, 2.2vh, 26px);
}
.landing-cta-row--center { margin-top: clamp(18px, 2.4vh, 28px); }
.landing-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.22em;
  padding: 15px 30px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 220ms cubic-bezier(0.16, 1, 0.3, 1);
}
.landing-cta-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
.landing-cta-ghost {
  background: ${C.cyan}12;
  border: 1.5px solid ${C.cyan}cc;
  color: ${C.cyan};
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.12),
    0 0 0 1px ${C.cyan}22 inset,
    0 0 18px ${C.cyan}45,
    0 0 38px -6px ${C.cyan}33;
}
.landing-cta-ghost:hover {
  background: ${C.cyan}1f;
  color: #fff;
  border-color: ${C.cyan};
  transform: translateY(-1px);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.20),
    0 0 0 1px ${C.cyan}3a inset,
    0 0 30px ${C.cyan}80,
    0 0 62px -6px ${C.cyan}55;
}
.landing-cta-ghost:active {
  transform: translateY(0);
  color: #fff;
  border-color: ${C.cyan};
  background: ${C.cyan}30;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.26),
    0 0 0 1px ${C.cyan}55 inset,
    0 0 44px 2px ${C.cyan}b0,
    0 0 84px -2px ${C.cyan}66;
}
.landing-cta-ghost .landing-cta-icon {
  filter: drop-shadow(0 0 5px ${C.cyan}99);
}
/* Primary CTA — glowing cerulean OUTLINE (lit edge, translucent dark fill,
   soft halo) so the main action reads "lit from within" and dominates via a
   brighter edge + larger bloom than the ghost variant. */
.landing-cta-primary {
  background:
    linear-gradient(180deg, ${C.cyan}24, ${C.cyan}0d),
    hsl(var(--surf-hue) 78% 8% / 0.66);
  border: 1.5px solid ${C.cyan};
  color: #EAFBFF;
  text-shadow: 0 0 12px ${C.cyan}aa;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.16),
    0 0 0 1px ${C.cyan}55 inset,
    0 0 24px ${C.cyan}66,
    0 0 52px -6px ${C.cyan}55,
    0 16px 44px -18px rgba(0,0,0,0.8);
}
.landing-cta-primary:hover {
  transform: translateY(-1px);
  color: #ffffff;
  border-color: #aef1ff;
  background:
    linear-gradient(180deg, ${C.cyan}33, ${C.cyan}14),
    hsl(var(--surf-hue) 78% 9% / 0.6);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.24),
    0 0 0 1px ${C.cyan}80 inset,
    0 0 36px ${C.cyan}99,
    0 0 78px -6px ${C.cyan}80,
    0 20px 50px -18px rgba(0,0,0,0.85);
}
.landing-cta-primary:active {
  transform: translateY(0);
  color: #ffffff;
  border-color: #c6f6ff;
  background:
    linear-gradient(180deg, ${C.cyan}42, ${C.cyan}1c),
    hsl(var(--surf-hue) 78% 10% / 0.55);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.30),
    0 0 0 1px ${C.cyan}aa inset,
    0 0 52px 2px ${C.cyan}b0,
    0 0 100px -2px ${C.cyan}66,
    0 10px 30px -16px rgba(0,0,0,0.9);
}
.landing-cta-primary .landing-cta-icon {
  filter: drop-shadow(0 0 6px ${C.cyan}cc);
}

/* ============== HERO STAT STRIP ============== */
.landing-stat-strip {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0;
  margin-top: clamp(20px, 2.6vh, 32px);
}
.landing-stat-item {
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
  padding: 0 clamp(18px, 3vw, 34px);
  position: relative;
}
.landing-stat-sep {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 26px;
  background: linear-gradient(180deg, transparent, ${C.cyan}55, transparent);
}
.landing-stat-num {
  font-family: "Outfit", "Inter", system-ui, sans-serif;
  font-weight: 300;
  font-size: clamp(26px, 3vw, 38px);
  color: #F4FBFF;
  text-shadow: 0 0 22px ${C.cyan}55;
}
.landing-stat-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #ffffff;
}
@media (max-width: 480px) {
  .landing-stat-item { padding: 0 12px; gap: 7px; }
  .landing-stat-label { letter-spacing: 0.12em; }
  .landing-stat-sep { height: 20px; }
}

/* ============== SHARED SECTION SCAFFOLD ============== */
.landing-section {
  max-width: 1180px;
  margin: 0 auto;
  padding: clamp(22px, 3.4vh, 42px) 32px;
}
.landing-section-head {
  max-width: 760px;
  margin: 0 auto clamp(14px, 2vh, 24px);
  text-align: center;
}
.landing-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 10px;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.4em;
  padding-left: 0.4em;
  color: ${C.cyanSoft};
  text-shadow: 0 0 18px ${C.cyan}88, 0 1px 12px hsl(var(--surf-hue) 92% 5% / 0.7);
}
.landing-eyebrow::before,
.landing-eyebrow::after {
  content: "";
  width: clamp(20px, 4vw, 40px);
  height: 1px;
}
.landing-eyebrow::before {
  background: linear-gradient(90deg, transparent, ${C.cyan}aa);
}
.landing-eyebrow::after {
  background: linear-gradient(90deg, ${C.cyan}aa, transparent);
}
/* Left-aligned eyebrow (split sections) — single trailing rule only. */
.landing-eyebrow--left { gap: 12px; padding-left: 0; }
.landing-eyebrow--left::before { display: none; }
.landing-section-title {
  margin: 0;
  font-family: "Outfit", "Inter", system-ui, sans-serif;
  font-weight: 300;
  font-size: clamp(26px, 3.4vw, 44px);
  letter-spacing: 0.01em;
  line-height: 1.14;
  color: #F4FBFF;
  text-shadow: 0 0 34px ${C.cyan}30;
}
.landing-section-sub {
  margin: clamp(14px, 1.8vh, 20px) auto 0;
  max-width: 600px;
  font-size: clamp(14px, 1.05vw, 16.5px);
  line-height: 1.72;
  font-weight: 400;
  color: rgba(244, 251, 255, 0.95);
  text-shadow: 0 1px 14px hsl(var(--surf-hue) 92% 5% / 0.6);
}

/* ============== STUDY TOOLS / FEATURE CARDS ============== */
.landing-tools-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}
.landing-tools-grid > .landing-feature-card {
  flex: 1 1 200px;
  min-width: 200px;
  max-width: 320px;
}
.landing-feature-card {
  --accent: ${C.cyan};
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 26px 22px 24px;
  background: linear-gradient(180deg, ${C.bgPanel}, ${C.bgPanelStrong});
  border: 1px solid ${C.hairline};
  border-radius: 16px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--accent) 14%, transparent) inset,
    0 18px 36px -22px rgba(0, 0, 0, 0.6),
    0 0 26px color-mix(in srgb, var(--accent) 24%, transparent);
  transition: all 240ms cubic-bezier(0.16, 1, 0.3, 1);
  min-height: 230px;
}
.landing-feature-card:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--accent) 55%, transparent);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--accent) 22%, transparent) inset,
    0 26px 48px -22px rgba(0, 0, 0, 0.7),
    0 0 32px color-mix(in srgb, var(--accent) 40%, transparent);
}
.landing-feature-icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 40%, transparent);
  color: var(--accent);
  margin-bottom: 18px;
  box-shadow:
    0 0 18px color-mix(in srgb, var(--accent) 35%, transparent),
    inset 0 0 0 1px color-mix(in srgb, var(--accent) 14%, transparent);
}
.landing-feature-icon-wrap svg { width: 21px; height: 21px; }
.landing-feature-title {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 1.3;
  color: #ffffff;
  text-shadow: 0 1px 10px hsl(var(--surf-hue) 92% 5% / 0.55);
}
.landing-feature-body {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.62;
  font-weight: 400;
  color: rgba(225, 244, 250, 0.8);
}

/* ============== LEARNING SCIENCE ============== */
.landing-science-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
}
@media (min-width: 860px) {
  .landing-science-grid { grid-template-columns: repeat(3, 1fr); }
}
.landing-science-item {
  display: flex;
  gap: 16px;
  padding: 22px 20px;
  border-radius: 16px;
  border: 1px solid ${C.hairline};
  background: linear-gradient(180deg, hsl(var(--surf-hue) 88% 19% / 0.82), hsl(var(--surf-hue) 88% 14% / 0.90));
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 0 22px ${C.cyan}1f, 0 0 0 1px ${C.cyan}14 inset;
  transition: all 240ms cubic-bezier(0.16, 1, 0.3, 1);
}
.landing-science-item:hover {
  border-color: ${C.hairlineStrong};
  box-shadow: 0 0 34px ${C.cyan}33, 0 0 0 1px ${C.cyan}2a inset;
}
.landing-science-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  border-radius: 11px;
  background: ${C.cyan}14;
  border: 1px solid ${C.cyan}3a;
  color: ${C.cyan};
  box-shadow: 0 0 16px ${C.cyan}33;
}
.landing-science-icon svg { width: 20px; height: 20px; }
.landing-science-title {
  margin: 2px 0 6px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}
.landing-science-body {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.6;
  color: rgba(225, 244, 250, 0.78);
}

/* ============== SPLIT SECTIONS (Brain Lab / Dashboard) ============== */
.landing-split {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(28px, 4vw, 56px);
  align-items: center;
}
@media (min-width: 900px) {
  .landing-split { grid-template-columns: 1fr 1fr; }
  .landing-split--reverse .landing-split-media { order: 2; }
}
.landing-split-media {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 280px;
}
.landing-split-glow {
  position: absolute;
  inset: 8% 12%;
  border-radius: 50%;
  background: radial-gradient(circle, ${C.cyan}33 0%, ${C.cyanMid}14 45%, transparent 72%);
  filter: blur(46px);
  z-index: 0;
}
.landing-split-img {
  position: relative;
  z-index: 1;
  max-width: 100%;
  max-height: 380px;
  object-fit: contain;
  filter: drop-shadow(0 0 30px ${C.cyan}44) drop-shadow(0 0 70px ${C.cyanMid}2a);
}
.landing-split-body { max-width: 520px; }
.landing-split-title {
  margin: 6px 0 0;
  font-family: "Outfit", "Inter", system-ui, sans-serif;
  font-weight: 300;
  font-size: clamp(24px, 3vw, 38px);
  line-height: 1.16;
  color: #F4FBFF;
  text-shadow: 0 0 30px ${C.cyan}30;
}
.landing-split-text {
  margin: clamp(14px, 1.8vh, 20px) 0 clamp(20px, 2.6vh, 28px);
  font-size: clamp(14px, 1.1vw, 16.5px);
  line-height: 1.72;
  color: rgba(225, 244, 250, 0.82);
}
/* Glass box around split copy for readability over the nebula, matching
   the mastery/founder card recipe. */
.landing-split-body--boxed {
  padding: clamp(24px, 3vw, 38px);
  border-radius: 20px;
  background: linear-gradient(150deg, hsl(var(--surf-hue) 88% 19% / 0.82), hsl(var(--surf-hue) 88% 14% / 0.88));
  border: 1px solid ${C.hairlineStrong};
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  box-shadow: 0 30px 80px -40px rgba(0,0,0,0.72), 0 0 40px ${C.cyan}2a, 0 0 0 1px ${C.cyan}1f inset;
}

/* ============== MEET THE FOUNDER ============== */
.landing-founder-card {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(28px, 4vw, 52px);
  align-items: center;
  padding: clamp(26px, 3.4vw, 44px);
  border-radius: 22px;
  border: 1px solid ${C.hairlineStrong};
  background: linear-gradient(150deg, hsl(var(--surf-hue) 88% 19% / 0.85), hsl(var(--surf-hue) 88% 14% / 0.90));
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  box-shadow:
    0 30px 80px -38px rgba(0, 0, 0, 0.72),
    0 0 48px ${C.cyan}30,
    0 0 0 1px ${C.cyan}22 inset;
}
@media (min-width: 880px) {
  .landing-founder-card { grid-template-columns: 320px 1fr; }
}
.landing-founder-media {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  justify-self: center;
  width: 100%;
  max-width: 320px;
}
.landing-founder-glow {
  position: absolute;
  inset: -6%;
  border-radius: 50%;
  background: radial-gradient(circle, ${C.cyan}3a 0%, ${C.cyanMid}14 48%, transparent 72%);
  filter: blur(40px);
  z-index: 0;
}
.landing-founder-img {
  position: relative;
  z-index: 1;
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  object-position: center top;
  border-radius: 18px;
  border: 1px solid ${C.hairlineStrong};
  box-shadow:
    0 24px 54px -26px rgba(0, 0, 0, 0.75),
    0 0 28px ${C.cyan}26;
}
.landing-founder-body { max-width: 640px; }
.landing-founder-text {
  margin: clamp(14px, 1.8vh, 18px) 0 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.landing-founder-text p {
  margin: 0;
  font-size: clamp(13.5px, 1vw, 15.5px);
  line-height: 1.74;
  color: rgba(225, 244, 250, 0.82);
}
.landing-founder-sign {
  margin: 18px 0 0;
  font-family: "Outfit", "Inter", system-ui, sans-serif;
  font-weight: 500;
  font-size: 15px;
  letter-spacing: 0.01em;
  color: ${C.cyanSoft};
  text-shadow: 0 0 22px ${C.cyan}33;
}

/* Dashboard illustration card */
.landing-dash-card {
  width: 100%;
  max-width: 420px;
  border-radius: 18px;
  padding: 22px 22px 16px;
  background: linear-gradient(145deg, hsl(var(--surf-hue) 88% 19% / 0.84), hsl(var(--surf-hue) 88% 14% / 0.90));
  border: 1px solid ${C.hairlineStrong};
  backdrop-filter: blur(18px) saturate(130%);
  -webkit-backdrop-filter: blur(18px) saturate(130%);
  box-shadow: 0 30px 70px -34px rgba(0,0,0,0.7), 0 0 34px ${C.cyan}14;
}
.landing-dash-card-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${C.cyanSoft};
}
.landing-dash-card-icon { width: 18px; height: 18px; color: ${C.cyan}; }
.landing-dash-chart {
  height: 150px;
  margin: 0 -4px;
}
.landing-dash-chart .recharts-cartesian-axis-tick text {
  fill: ${C.mistSoft};
}
.landing-dash-note {
  margin: 14px 0 0;
  text-align: right;
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(199, 230, 240, 0.34);
}

/* Checklists */
.landing-checklist { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.landing-checklist--grid { gap: 12px; }
@media (min-width: 640px) {
  .landing-checklist--grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 22px; }
}
.landing-checklist-item {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  font-size: 14px;
  line-height: 1.5;
  color: rgba(225, 244, 250, 0.86);
}
.landing-checklist-check {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-top: 1px;
  color: ${C.cyan};
  filter: drop-shadow(0 0 6px ${C.cyan}66);
}

/* ============== SCHOLAR TIER ============== */
.landing-scholar { max-width: 1020px; }
.landing-scholar-card {
  position: relative;
  overflow: hidden;
  border-radius: 22px;
  padding: clamp(28px, 4vw, 48px);
  background: linear-gradient(150deg, hsl(var(--surf-hue) 88% 19% / 0.86), hsl(var(--surf-hue) 88% 14% / 0.90));
  border: 1px solid ${C.hairlineStrong};
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  box-shadow: 0 36px 90px -40px rgba(0,0,0,0.75), 0 0 48px ${C.cyan}33, 0 0 0 1px ${C.cyan}22 inset;
}
.landing-scholar-card::before {
  content: "";
  position: absolute;
  top: -40%;
  right: -10%;
  width: 60%;
  height: 120%;
  background: radial-gradient(circle, ${C.cyan}3a 0%, transparent 62%);
  pointer-events: none;
}
.landing-scholar-head {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}
.landing-scholar-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  border-radius: 14px;
  background: ${C.cyan}18;
  border: 1px solid ${C.cyan}55;
  color: ${C.cyan};
  box-shadow: 0 0 22px ${C.cyan}44;
}
.landing-scholar-icon svg { width: 24px; height: 24px; }
.landing-scholar-title { margin: 4px 0 0; }
.landing-scholar .landing-split-text { position: relative; max-width: 720px; }
.landing-scholar .landing-checklist { position: relative; margin-bottom: clamp(22px, 3vh, 30px); }

/* ============== EPPP MASTERY SYSTEM ============== */
.landing-mastery { max-width: 1020px; }
.landing-mastery-card {
  position: relative;
  overflow: hidden;
  text-align: center;
  border-radius: 22px;
  padding: clamp(30px, 4.4vw, 52px);
  background: linear-gradient(150deg, hsl(var(--surf-hue) 88% 19% / 0.86), hsl(var(--surf-hue) 88% 14% / 0.90));
  border: 1px solid ${C.hairlineStrong};
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  box-shadow: 0 36px 90px -40px rgba(0,0,0,0.75), 0 0 48px ${C.cyan}33, 0 0 0 1px ${C.cyan}22 inset;
}
.landing-mastery-card::before {
  content: "";
  position: absolute;
  top: -45%;
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
  height: 120%;
  background: radial-gradient(circle, ${C.cyan}3a 0%, transparent 62%);
  pointer-events: none;
}
.landing-mastery-icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin-bottom: 18px;
  border-radius: 15px;
  background: ${C.cyan}18;
  border: 1px solid ${C.cyan}55;
  color: ${C.cyan};
  box-shadow: 0 0 22px ${C.cyan}44;
}
.landing-mastery-icon svg { width: 26px; height: 26px; }
.landing-mastery .landing-eyebrow,
.landing-mastery .landing-section-title { position: relative; }
.landing-mastery-text {
  position: relative;
  margin: clamp(16px, 2vh, 22px) auto 0;
  max-width: 760px;
  font-size: clamp(14px, 1.1vw, 16.5px);
  line-height: 1.78;
  color: rgba(225, 244, 250, 0.84);
  text-shadow: 0 1px 10px hsl(var(--surf-hue) 92% 5% / 0.45);
}

/* ============== FINAL CTA ============== */
.landing-final { text-align: center; max-width: 880px; padding-bottom: clamp(6px, 0.8vh, 10px); }
.landing-topics { padding-top: clamp(6px, 0.8vh, 10px); }
/* Glass panel around the closing CTA for readability over the nebula,
   matching the mastery/system card recipe. */
.landing-final-card {
  position: relative;
  overflow: hidden;
  text-align: center;
  border-radius: 22px;
  padding: clamp(30px, 4.4vw, 52px);
  background: linear-gradient(150deg, hsl(var(--surf-hue) 88% 19% / 0.86), hsl(var(--surf-hue) 88% 14% / 0.90));
  border: 1px solid ${C.hairlineStrong};
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  box-shadow: 0 36px 90px -40px rgba(0,0,0,0.75), 0 0 48px ${C.cyan}33, 0 0 0 1px ${C.cyan}22 inset;
}
.landing-final-card::before {
  content: "";
  position: absolute;
  top: -45%;
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
  height: 120%;
  background: radial-gradient(circle, ${C.cyan}3a 0%, transparent 62%);
  pointer-events: none;
}
.landing-final-title {
  position: relative;
  margin: 0;
  font-family: "Outfit", "Inter", system-ui, sans-serif;
  font-weight: 300;
  font-size: clamp(28px, 4vw, 50px);
  line-height: 1.1;
  color: #F4FBFF;
  text-shadow: 0 0 40px ${C.cyan}3a;
}
.landing-final-card .landing-cta-row { position: relative; }
/* ============== ALL TOPICS ============== */
.landing-topics-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  max-width: 1040px;
  margin: 0 auto;
}
@media (min-width: 640px) {
  .landing-topics-grid { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 980px) {
  .landing-topics-grid { grid-template-columns: 1fr 1fr 1fr; }
}
.landing-topic-chip {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 44px;
  padding: 10px 16px;
  border-radius: 10px;
  text-align: left;
  font-family: "Inter", "Outfit", system-ui, sans-serif;
  font-size: 13.5px;
  font-weight: 400;
  line-height: 1.3;
  color: ${C.cyanSoft};
  background: ${C.bgPanel};
  border: 1px solid ${C.hairline};
  cursor: pointer;
  transition: transform 200ms cubic-bezier(.2,.8,.2,1),
              background 200ms ease, border-color 200ms ease,
              box-shadow 250ms ease;
}
.landing-topic-chip:hover {
  transform: translateY(-1px);
  background: ${C.bgPanelStrong};
  border-color: ${C.hairlineStrong};
  box-shadow: 0 0 0 1px ${C.cyan}28, 0 0 18px ${C.cyan}30;
}
.landing-topic-chip:focus-visible {
  outline: none;
  border-color: ${C.cyanSoft};
  box-shadow: 0 0 0 2px ${C.cyan}55;
}
.landing-topic-chip-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: ${C.cyan};
  filter: drop-shadow(0 0 5px ${C.cyan}88);
}
.landing-topic-chip--skeleton {
  min-height: 44px;
  opacity: 0.5;
  pointer-events: none;
  animation: landing-topic-pulse 1.4s ease-in-out infinite;
}
@keyframes landing-topic-pulse {
  0%, 100% { opacity: 0.35; }
  50% { opacity: 0.6; }
}
.landing-topics-empty {
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  color: rgba(225, 244, 250, 0.7);
  padding: 12px 0;
}

/* ============== FOOTER ============== */
.landing-footer {
  border-top: 1px solid ${C.hairline};
  margin-top: clamp(28px, 4vh, 48px);
  background: linear-gradient(180deg, hsl(var(--surf-hue) 85% 12% / 0.32), hsl(var(--surf-hue) 85% 12% / 0.7));
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

/* In-page anchor nav: smooth scroll + offset so the sticky navbar doesn't
   overlap the target section heading. */
html { scroll-behavior: smooth; }
#home, #mastery, #tools, #science, #features, #brain-lab, #scholar {
  scroll-margin-top: 84px;
}

/* ============== SCROLL REVEAL ============== */
[data-reveal] {
  opacity: 0;
  transform: translateY(22px);
  transition:
    opacity 760ms cubic-bezier(0.16, 1, 0.3, 1) var(--reveal-delay, 0ms),
    transform 760ms cubic-bezier(0.16, 1, 0.3, 1) var(--reveal-delay, 0ms);
  will-change: opacity, transform;
}
[data-reveal].is-visible {
  opacity: 1;
  transform: none;
}

/* ============== KEYFRAMES ============== */
@media (prefers-reduced-motion: reduce) {
  .landing-wordmark,
  .landing-tagline,
  .landing-headline,
  .landing-blurb,
  .landing-cta-row,
  .landing-stat-strip,
  [data-reveal] {
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
`;
