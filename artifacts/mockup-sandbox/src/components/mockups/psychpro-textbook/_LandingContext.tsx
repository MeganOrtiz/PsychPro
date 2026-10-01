import type { ReactNode } from "react";
import { Target, Repeat, Shuffle, ArrowRight } from "lucide-react";
import { PP, LANDING, alpha } from "./_palette";
import "./_group.css";
import { neighborStyles } from "./_NeighborStyles";
const LEARNING_SCIENCE = [
  {
    icon: Target,
    title: "Active recall",
    body:
      "Retrieve, don't reread. Every tool is designed to make you pull knowledge from memory, the way it sticks.",
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


const C = { cyan: LANDING.bright, cyanSoft: LANDING.icy, cyanMid: LANDING.cyan, hairlineStrong: alpha(LANDING.cyan, 0.58) };
const contextStyles = `.landing-root {
  position: relative;
  isolation: isolate;
  min-height: 100vh;
  min-height: 100dvh;
  /* The full-bleed hero band spans 100vw, which includes the vertical
     scrollbar — without clipping, that sliver of horizontal overflow lets
     the page shift sideways and the hero reads as off-center. */
  overflow-x: clip;
  /* Pure-white ground (owner 2026-07-25): the landing page opts out of the
     site-wide silver radial backdrop — the ink/water artwork sits on clean
     white, per the owner's mockup. */
  background: ${PP.white};
  color: ${C.cyanSoft};
  font-family: var(--app-font-sans);
  font-feature-settings: "ss01", "cv11";
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

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
}
.landing-eyebrow::before,
.landing-eyebrow::after {
  content: "";
  width: clamp(20px, 4vw, 40px);
  height: 1px;
}
.landing-eyebrow::before {
  background: transparent;
}
.landing-eyebrow::after {
  background: transparent;
}
/* Left-aligned eyebrow (split sections) — single trailing rule only. */
.landing-eyebrow--left { gap: 12px; padding-left: 0; }
.landing-eyebrow--left::before { display: none; }
.landing-section-title {
  margin: 0;
  font-family: var(--app-font-sans);
  font-weight: 300;
  font-size: clamp(26px, 3.4vw, 44px);
  letter-spacing: 0.01em;
  line-height: 1.14;
  color: ${LANDING.icy};
}
.landing-section-sub {
  margin: clamp(14px, 1.8vh, 20px) auto 0;
  max-width: 600px;
  font-size: clamp(14px, 1.05vw, 16.5px);
  line-height: 1.72;
  font-weight: 400;
  color: ${alpha(PP.text, 0.78)};
}

`;
export function LandingFrame({children}:{children:ReactNode}) { return <div className="landing-root"><style>{contextStyles}{neighborStyles}</style>{children}</div>; }
export function MethodSection() { return (<section id="science" className="landing-section landing-science">
          <div className="landing-section-head">
            <p className="landing-eyebrow">THE METHOD</p>
            <h2 className="landing-section-title">
              Evidence-Based by Design
            </h2>
            <p className="landing-section-sub">
              Every feature is built around evidence-based learning principles
              that improve retention, strengthen understanding, and make every
              study session more effective.
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
        </section>); }
export function BrainLabSection() { return (<section id="brain-lab" className="landing-section landing-split">
          <div className="landing-split-media landing-split-media--brain">
            <div className="landing-split-glow" aria-hidden />
            <img
              src="/__mockup/images/psychpro-book-brain-lateral.webp"
              alt="Interactive 3D brain anatomy view"
              className="landing-split-img"
            />
          </div>
          <div className="landing-split-body landing-split-body--boxed">
            <p className="landing-eyebrow landing-eyebrow--left">INTERACTIVE 3D</p>
            <h2 className="landing-split-title">
              Connect Structure to Function
            </h2>
            <p className="landing-split-text">
              Explore neuroanatomy through interactive visual learning that
              helps connect brain structures, systems, and clinical relevance.
            </p>
            <button
              type="button"
              onClick={() => {}}
              className="landing-cta landing-cta-primary landing-cta--center"
              data-testid="cta-brain-lab"
            >
              <span>OPEN THE BRAIN LAB</span>
              <ArrowRight className="landing-cta-icon" aria-hidden />
            </button>
          </div>
        </section>); }
