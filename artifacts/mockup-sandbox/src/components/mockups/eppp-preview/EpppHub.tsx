import {
  GraduationCap,
  BookOpen,
  Layers,
  ClipboardCheck,
  Sparkles,
  ArrowRight,
  Brain,
  Bell,
} from "lucide-react";

// Verification-only mockup: reproduces the real /eppp hub page + the glowing
// "EPPP Mastery System" header button, with the app's .study-page-bg surface.
// CSS is copied verbatim from artifacts/neuronotes/src/index.css and
// artifacts/neuronotes/src/pages/eppp.tsx so the preview matches production.

const C = {
  cyan: "#76E4F7",
  mist: "#A7F3FF",
  ink: "#03151D",
  hairline: "rgba(118,228,247,0.16)",
  hairlineStrong: "rgba(118,228,247,0.32)",
  body: "rgba(225,244,250,0.84)",
  muted: "rgba(186,214,224,0.66)",
};

const PILLARS = [
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

const ENTRY_POINTS = [
  {
    icon: BookOpen,
    title: "Study the domains",
    body: "Work through structured lessons with flashcards, quizzes, and study guides across every EPPP content area.",
    cta: "Browse courses",
  },
  {
    icon: GraduationCap,
    title: "Prove mastery",
    body: "Unlock and sit the capstone mastery exams once you've reached 90% on each lesson's practice exam.",
    cta: "View mastery path",
  },
  {
    icon: Sparkles,
    title: "Track your readiness",
    body: "See where you stand across domains and focus your time where it moves the needle most.",
    cta: "Open progress",
  },
];

export function EpppHub() {
  return (
    <div className="study-page-bg eppp-preview-root">
      <style>{styles}</style>

      {/* Header strip showing the glowing launch button in context */}
      <header className="eppp-prev-header">
        <span className="eppp-prev-brand">PsychPro</span>
        <div className="eppp-prev-header-right">
          <button className="eppp-launch-btn" type="button">
            <span className="eppp-launch-btn__inner">
              <GraduationCap />
              EPPP Mastery System
            </span>
          </button>
          <span className="eppp-prev-bell">
            <Bell />
          </span>
          <span className="eppp-prev-avatar" />
        </div>
      </header>

      <div className="eppp-page">
        <div className="eppp-shell">
          {/* Hero */}
          <section className="eppp-hero">
            <div className="eppp-hero-glow" aria-hidden />
            <div className="eppp-hero-icon">
              <GraduationCap aria-hidden />
            </div>
            <p className="eppp-eyebrow">FOR THE LICENSING EXAM</p>
            <h1 className="eppp-title">The PsychPro EPPP Mastery System&trade;</h1>
            <p className="eppp-lede">
              A system of learning resources designed to promote mastery of EPPP
              content through conceptual understanding, critical thinking, and
              active application — equipping you with the knowledge and confidence
              needed for both EPPP success and real-world clinical practice.
            </p>
            <div className="eppp-cta-row">
              <span className="eppp-btn eppp-btn--primary">
                Start studying <ArrowRight aria-hidden />
              </span>
              <span className="eppp-btn eppp-btn--ghost">View my progress</span>
            </div>
          </section>

          {/* Pillars */}
          <section className="eppp-section">
            <p className="eppp-section-eyebrow">THE SYSTEM</p>
            <h2 className="eppp-section-title">What the Mastery System includes</h2>
            <div className="eppp-grid eppp-grid--3">
              {PILLARS.map((p) => {
                const Icon = p.icon;
                return (
                  <article key={p.title} className="eppp-card">
                    <div className="eppp-card-icon">
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
          <section className="eppp-section">
            <p className="eppp-section-eyebrow">GET STARTED</p>
            <h2 className="eppp-section-title">Your path to a passing score</h2>
            <div className="eppp-grid eppp-grid--3">
              {ENTRY_POINTS.map((e) => {
                const Icon = e.icon;
                return (
                  <span key={e.title} className="eppp-link-card">
                    <div className="eppp-card-icon">
                      <Icon aria-hidden />
                    </div>
                    <h3 className="eppp-card-title">{e.title}</h3>
                    <p className="eppp-card-body">{e.body}</p>
                    <span className="eppp-link-cta">
                      {e.cta} <ArrowRight aria-hidden />
                    </span>
                  </span>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

const styles = `
.study-page-bg.eppp-preview-root {
  min-height: 100vh;
  background:
    radial-gradient(1200px 600px at 50% -10%, rgba(118,228,247,0.10), transparent 60%),
    linear-gradient(180deg, #061F2B 0%, #04161F 100%);
  color: #A7F3FF;
}

/* ---- Header strip (mirrors app-layout header right cluster) ---- */
.eppp-prev-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px clamp(16px, 4vw, 40px);
  border-bottom: 1px solid rgba(118,228,247,0.14);
  background: rgba(6,28,38,0.6);
  backdrop-filter: blur(12px);
}
.eppp-prev-brand {
  font-weight: 800;
  font-size: 18px;
  color: #EAF7FB;
  letter-spacing: 0.01em;
}
.eppp-prev-header-right { display: flex; align-items: center; gap: 14px; }
.eppp-prev-bell {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px; height: 38px;
  border-radius: 999px;
  color: ${C.mist};
  border: 1px solid rgba(118,228,247,0.2);
  background: rgba(12,28,38,0.5);
}
.eppp-prev-bell svg { width: 18px; height: 18px; }
.eppp-prev-avatar {
  width: 34px; height: 34px;
  border-radius: 999px;
  background: linear-gradient(135deg, #2A7387, #0A2D3D);
  border: 1px solid rgba(118,228,247,0.3);
}

/* ===== eppp-launch-btn (copied verbatim from index.css) ===== */
.eppp-launch-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 8px 16px;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.01em;
  white-space: nowrap;
  color: #04222c;
  cursor: pointer;
  overflow: hidden;
  isolation: isolate;
  border: 1px solid rgba(167, 243, 255, 0.7);
  background: linear-gradient(135deg, #a7f3ff 0%, #76e4f7 46%, #38bdf8 100%);
  transition: transform 0.2s ease, box-shadow 0.3s ease;
  animation: eppp-launch-pulse 2.8s ease-in-out infinite;
}
.eppp-launch-btn:hover { transform: translateY(-1px); }
.eppp-launch-btn__inner {
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 7px;
}
.eppp-launch-btn__inner svg { width: 16px; height: 16px; }
.eppp-launch-btn::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    115deg,
    transparent 22%,
    rgba(255, 255, 255, 0.55) 50%,
    transparent 78%
  );
  transform: translateX(-130%);
  animation: eppp-launch-shimmer 3.8s ease-in-out infinite;
  pointer-events: none;
}
@keyframes eppp-launch-pulse {
  0%, 100% {
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.55),
      0 0 16px -2px rgba(118, 228, 247, 0.6),
      0 0 34px -8px rgba(118, 228, 247, 0.45);
  }
  50% {
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.6),
      0 0 26px 0 rgba(118, 228, 247, 0.92),
      0 0 60px -4px rgba(118, 228, 247, 0.72);
  }
}
@keyframes eppp-launch-shimmer {
  0% { transform: translateX(-130%); }
  55%, 100% { transform: translateX(130%); }
}

/* ===== EPPP page (copied verbatim from pages/eppp.tsx) ===== */
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
.eppp-hero {
  position: relative;
  overflow: hidden;
  text-align: center;
  border-radius: 26px;
  padding: clamp(32px, 5vw, 64px) clamp(22px, 4vw, 56px);
  background: linear-gradient(150deg, rgba(14,60,80,0.62), rgba(6,28,38,0.84));
  border: 1px solid ${C.hairlineStrong};
  backdrop-filter: blur(20px) saturate(130%);
  -webkit-backdrop-filter: blur(20px) saturate(130%);
  box-shadow: 0 40px 100px -44px rgba(0,0,0,0.78), 0 0 48px ${C.cyan}1c;
}
.eppp-hero-glow {
  position: absolute;
  top: -50%;
  left: 50%;
  transform: translateX(-50%);
  width: 72%;
  height: 130%;
  background: radial-gradient(circle, ${C.cyan}26 0%, transparent 62%);
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
  background: ${C.cyan}1a;
  border: 1px solid ${C.cyan}59;
  color: ${C.cyan};
  box-shadow: 0 0 24px ${C.cyan}4d;
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
  color: #F2FBFE;
  text-shadow: 0 2px 24px rgba(2,13,18,0.5);
}
.eppp-lede {
  position: relative;
  margin: clamp(16px, 2.4vh, 22px) auto 0;
  max-width: 760px;
  font-size: clamp(14px, 1.1vw, 16.5px);
  line-height: 1.78;
  color: ${C.body};
}
.eppp-cta-row {
  position: relative;
  margin-top: clamp(22px, 3vh, 30px);
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center;
}
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
.eppp-btn--primary {
  color: ${C.ink};
  border: 1px solid rgba(167,243,255,0.65);
  background: linear-gradient(135deg, ${C.mist} 0%, ${C.cyan} 48%, #38BDF8 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.5), 0 0 22px -4px ${C.cyan}b3;
}
.eppp-btn--ghost {
  color: ${C.mist};
  border: 1px solid ${C.hairlineStrong};
  background: rgba(12,28,38,0.55);
}
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
  color: #EAF7FB;
}
.eppp-grid { display: grid; gap: clamp(14px, 2vw, 22px); }
.eppp-grid--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
@media (max-width: 860px) { .eppp-grid--3 { grid-template-columns: 1fr; } }
.eppp-card,
.eppp-link-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 18px;
  padding: clamp(20px, 2.4vw, 26px);
  background: linear-gradient(145deg, rgba(10,45,61,0.58), rgba(6,28,40,0.66));
  border: 1px solid ${C.hairline};
  backdrop-filter: blur(16px) saturate(125%);
  -webkit-backdrop-filter: blur(16px) saturate(125%);
  box-shadow: 0 24px 60px -40px rgba(0,0,0,0.7);
}
.eppp-link-card { cursor: pointer; }
.eppp-card-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${C.cyan}16;
  border: 1px solid ${C.cyan}40;
  color: ${C.cyan};
}
.eppp-card-icon svg { width: 22px; height: 22px; }
.eppp-card-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #EAF7FB;
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
.eppp-link-cta svg { width: 15px; height: 15px; }
`;
