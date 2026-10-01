import { PP, LANDING, alpha } from "./_palette";
const C={cyan:LANDING.bright,cyanMid:LANDING.cyan,cyanSoft:LANDING.icy,hairlineStrong:alpha(LANDING.cyan,0.58)};
export const neighborStyles=`.landing-science-grid {
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
  border: 1px solid ${C.hairlineStrong};
  background: hsl(var(--surf-hue) var(--surf-sat) 100% / 0.88);
  box-shadow: 0 30px 80px -40px rgba(var(--pp-black-rgb), 0.14), 0 0 0 1px ${C.cyan}1f inset;
  transition: all 240ms cubic-bezier(0.16, 1, 0.3, 1);
}
.landing-science-item:hover {
  border-color: ${C.cyan}55;
  box-shadow: 0 34px 84px -40px rgba(var(--pp-black-rgb), 0.16), 0 0 0 1px ${C.cyan}2a inset;
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
}
.landing-science-icon svg { width: 20px; height: 20px; }
.landing-science-title {
  margin: 2px 0 6px;
  font-size: 16px;
  font-weight: 600;
  color: ${LANDING.icy};
}
.landing-science-body {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.6;
  color: ${alpha(PP.text, 0.78)};
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
  background: transparent;
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
  font-family: var(--app-font-sans);
  font-weight: 300;
  font-size: clamp(24px, 3vw, 38px);
  line-height: 1.16;
  color: ${LANDING.icy};
}
.landing-split-text {
  margin: clamp(14px, 1.8vh, 20px) 0 clamp(20px, 2.6vh, 28px);
  font-size: clamp(14px, 1.1vw, 16.5px);
  line-height: 1.72;
  color: ${alpha(PP.text, 0.82)};
}
/* Glass box around split copy for readability over the nebula, matching
   the mastery/founder card recipe. */
.landing-split-body--boxed {
  padding: clamp(24px, 3vw, 38px);
  border-radius: 20px;
  background: hsl(var(--surf-hue) var(--surf-sat) 100% / 0.88);
  border: 1px solid ${C.hairlineStrong};
  box-shadow: 0 30px 80px -40px rgba(var(--pp-black-rgb), 0.14), 0 0 40px ${C.cyan}2a, 0 0 0 1px ${C.cyan}1f inset;
}

`;
