import { Link } from "wouter";
import {
  GraduationCap,
  BookOpen,
  Layers,
  ClipboardCheck,
  Sparkles,
  ArrowRight,
  Brain,
} from "lucide-react";
import { PP, alpha } from "@/lib/palette";

// ---------------------------------------------------------------------------
// EPPP Mastery Suite hub — the dedicated home for the licensing-exam track.
// Reached from the glowing "EPPP Mastery Suite" button in the top header
// (see app-layout.tsx). Mirrors the full PsychPro study concept but framed
// specifically around the EPPP. Locked cerulean palette; no mint.
// ---------------------------------------------------------------------------

const C = {
  cyan: PP.cyan,
  mist: PP.textDim,
  ink: PP.deep,
  hairline: alpha(PP.ocean, 0.16),
  hairlineStrong: alpha(PP.cyan, 0.32),
  body: alpha(PP.text, 0.84),
  muted: alpha(PP.gray178, 0.66),
};

type Pillar = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
};

const PILLARS: Pillar[] = [
  {
    icon: Layers,
    title: "Structured lessons in each domain",
    body: "Every EPPP content area is broken into focused lessons that build conceptual understanding from the ground up.",
  },
  {
    icon: Brain,
    title: "Clinical integration case examples",
    body: "Apply what you learn to realistic clinical scenarios so knowledge transfers to exam questions and real-world practice.",
  },
  {
    icon: ClipboardCheck,
    title: "Full-length practice exams",
    body: "Test under realistic conditions with comprehensive exams that mirror the scope and pacing of the EPPP.",
  },
];

const ENTRY_POINTS: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  href: string;
  cta: string;
}[] = [
  {
    icon: BookOpen,
    title: "Study the domains",
    body: "Work through structured lessons with flashcards, quizzes, and study guides across every EPPP content area.",
    href: "/eppp/suite/domains",
    cta: "Browse domains",
  },
  {
    icon: GraduationCap,
    title: "Prove mastery",
    body: "Unlock and sit the capstone mastery exams once you've reached 90% on each lesson's practice exam.",
    href: "/eppp/suite/domain-mastery-exams",
    cta: "View mastery path",
  },
  {
    icon: Sparkles,
    title: "Track your readiness",
    body: "See where you stand across domains and focus your time where it moves the needle most.",
    href: "/eppp/suite/performance-analytics",
    cta: "Open dashboard",
  },
];

export default function EpppPage() {
  return (
    <div className="study-page-bg eppp-page" data-testid="eppp-page">
      <style>{styles}</style>

      <div className="eppp-shell">
        {/* Hero */}
        <section className="mat-opaque eppp-hero" data-testid="eppp-hero">
          <div className="eppp-hero-glow" aria-hidden />
          <div className="mat-icon-well eppp-hero-icon">
            <GraduationCap aria-hidden />
          </div>
          <p className="eppp-eyebrow">FOR THE LICENSING EXAM</p>
          <h1 className="eppp-title">
            The PsychPro EPPP Mastery Suite&trade;
          </h1>
          <p className="eppp-lede">
            A system of learning resources designed to promote mastery of EPPP
            content through conceptual understanding, critical thinking, and
            active application — equipping you with the knowledge and confidence
            needed for both EPPP success and real-world clinical practice.
          </p>
          <div className="eppp-cta-row">
            <Link href="/eppp/suite/domains" className="pp-btn-gloss eppp-btn" data-testid="eppp-cta-start">
              Start studying <ArrowRight aria-hidden />
            </Link>
            <Link href="/eppp/suite/performance-analytics" className="pp-btn-glass eppp-btn" data-testid="eppp-cta-progress">
              View my progress
            </Link>
          </div>
        </section>

        {/* Pillars */}
        <section className="eppp-section" data-testid="eppp-pillars">
          <header className="text-scrim text-scrim-start">
            <p className="eppp-section-eyebrow">THE SYSTEM</p>
            <h2 className="eppp-section-title">What the Mastery Suite includes</h2>
          </header>
          <div className="eppp-grid eppp-grid--3">
            {PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <article key={p.title} className="mat-opaque eppp-card">
                  <div className="mat-icon-well eppp-card-icon">
                    <Icon aria-hidden />
                  </div>
                  <h3 className="eppp-card-title">{p.title}</h3>
                  <p className="eppp-card-body">{p.body}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Entry points */}
        <section className="eppp-section" data-testid="eppp-entry-points">
          <header className="text-scrim text-scrim-start">
            <p className="eppp-section-eyebrow">GET STARTED</p>
            <h2 className="eppp-section-title">Your path to a passing score</h2>
          </header>
          <div className="eppp-grid eppp-grid--3">
            {ENTRY_POINTS.map((e) => {
              const Icon = e.icon;
              return (
                <Link
                  key={e.title}
                  href={e.href}
                  className="mat-opaque mat-opaque-interactive eppp-link-card"
                  data-testid={`eppp-entry-${e.cta}`}
                >
                  <div className="mat-icon-well eppp-card-icon">
                    <Icon aria-hidden />
                  </div>
                  <h3 className="eppp-card-title">{e.title}</h3>
                  <p className="eppp-card-body">{e.body}</p>
                  <span className="eppp-link-cta">
                    {e.cta} <ArrowRight aria-hidden />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = `
.eppp-page {
  min-height: 100%;
  padding: clamp(24px, 4vw, 56px) clamp(16px, 4vw, 48px) clamp(48px, 6vw, 96px);
}
.eppp-shell {
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(40px, 6vw, 72px);
}

/* ---- Hero ---- */
.eppp-hero {
  position: relative;
  overflow: hidden;
  text-align: center;
  padding: clamp(32px, 5vw, 64px) clamp(22px, 4vw, 56px);
}
.eppp-hero-glow {
  position: absolute;
  top: -50%;
  left: 50%;
  transform: translateX(-50%);
  width: 72%;
  height: 130%;
  background: transparent;
  pointer-events: none;
}
.eppp-hero-icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  margin-bottom: 18px;
  border-radius: 16px;
  color: ${C.cyan};
}
.eppp-hero-icon svg { width: 28px; height: 28px; }
.eppp-eyebrow {
  position: relative;
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: ${C.mist};
  text-transform: uppercase;
}
.eppp-title {
  position: relative;
  margin: 0;
  font-size: clamp(26px, 4.2vw, 44px);
  font-weight: 800;
  line-height: 1.12;
  color: ${PP.text};
}
.eppp-lede {
  position: relative;
  margin: clamp(16px, 2.4vh, 22px) auto 0;
  max-width: 760px;
  font-size: clamp(14px, 1.1vw, 16.5px);
  line-height: 1.78;
  color: ${PP.textSoft};
}
.eppp-cta-row {
  position: relative;
  margin-top: clamp(22px, 3vh, 30px);
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center;
}

/* ---- Buttons ---- */
.eppp-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 22px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.3s ease, background 0.2s ease;
}
.eppp-btn svg { width: 16px; height: 16px; }

/* ---- Sections ---- */
.eppp-section-eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: ${C.mist};
  text-transform: uppercase;
}
.eppp-section-title {
  margin: 0 0 clamp(20px, 3vw, 30px);
  font-size: clamp(20px, 2.6vw, 30px);
  font-weight: 800;
  color: ${PP.text};
}

/* ---- Cards ---- */
.eppp-grid { display: grid; gap: clamp(14px, 2vw, 22px); }
.eppp-grid--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
@media (max-width: 860px) { .eppp-grid--3 { grid-template-columns: 1fr; } }

.eppp-card,
.eppp-link-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: clamp(20px, 2.4vw, 26px);
}
.eppp-link-card {
  text-decoration: none;
  cursor: pointer;
}
.eppp-card-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: ${C.cyan};
}
.eppp-card-icon svg { width: 22px; height: 22px; }
.eppp-card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: ${PP.text};
}
.eppp-card-body {
  margin: 0;
  font-size: 14px;
  line-height: 1.66;
  color: ${C.muted};
}
.eppp-link-cta {
  margin-top: auto;
  padding-top: 6px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: ${C.mist};
}
.eppp-link-cta svg { width: 15px; height: 15px; transition: transform 0.2s ease; }
.eppp-link-card:hover .eppp-link-cta svg { transform: translateX(3px); }
`;
