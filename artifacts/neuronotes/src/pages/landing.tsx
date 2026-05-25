import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@clerk/clerk-react";
import brainSmoke from "@/assets/hero/brain-smoke.png";

// =============================================================================
// Landing — cinematic "glowing neural brain floating in dark teal smoke" hero.
// -----------------------------------------------------------------------------
// Single full-bleed scene:
//   - deep teal radial gradient ground (#03161c -> #01080a)
//   - glowing brain centerpiece with breathe + float animations
//   - HTML5 canvas particle field drifting upward (teal dust motes)
//   - mouse-parallax that gently tilts the brain + shifts the particle field
//   - headline / subheadline / CTA fade-and-slide up on mount
// =============================================================================

export default function LandingPage() {
  const [, navigate] = useLocation();
  const { isSignedIn } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const brainRef = useRef<HTMLDivElement | null>(null);
  const particleLayerRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  // Trigger entrance animations one tick after mount.
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Mouse parallax: translate brain + particle layer subtly with cursor.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMove = (e: PointerEvent) => {
      const rect = scene.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = nx;
      targetY = ny;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      if (brainRef.current) {
        brainRef.current.style.setProperty("--mx", String(currentX));
        brainRef.current.style.setProperty("--my", String(currentY));
      }
      if (particleLayerRef.current) {
        particleLayerRef.current.style.transform = `translate3d(${currentX * -20}px, ${currentY * -20}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    scene.addEventListener("pointermove", handleMove);
    raf = requestAnimationFrame(tick);
    return () => {
      scene.removeEventListener("pointermove", handleMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Particle field — tiny glowing teal motes drifting upward.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Mote = {
      x: number;
      y: number;
      r: number;
      vy: number;
      vx: number;
      alpha: number;
      twinkle: number;
    };
    let motes: Mote[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(110, Math.floor((width * height) / 14000));
      motes = Array.from({ length: count }, () => makeMote(true));
    };

    const makeMote = (initial = false): Mote => ({
      x: Math.random() * width,
      y: initial ? Math.random() * height : height + Math.random() * 40,
      r: 0.6 + Math.random() * 1.8,
      vy: 0.15 + Math.random() * 0.45,
      vx: (Math.random() - 0.5) * 0.18,
      alpha: 0.25 + Math.random() * 0.55,
      twinkle: Math.random() * Math.PI * 2,
    });

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        m.y -= m.vy;
        m.x += m.vx;
        m.twinkle += 0.02;
        if (m.y < -10) {
          motes[i] = makeMote(false);
          continue;
        }
        if (m.x < -10) m.x = width + 10;
        if (m.x > width + 10) m.x = -10;

        const flicker = 0.7 + 0.3 * Math.sin(m.twinkle);
        const a = m.alpha * flicker;
        const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 6);
        grad.addColorStop(0, `rgba(140, 240, 255, ${a})`);
        grad.addColorStop(0.4, `rgba(80, 200, 230, ${a * 0.45})`);
        grad.addColorStop(1, "rgba(0, 60, 80, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(220, 250, 255, ${Math.min(1, a + 0.2)})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const goToApp = () => navigate(isSignedIn ? "/dashboard" : "/sign-in");

  return (
    <>
      <style>{styles}</style>
      <main
        ref={sceneRef}
        className="landing-scene"
        data-testid="landing-page"
      >
        {/* Background gradient + atmospheric haze */}
        <div className="landing-bg" aria-hidden />
        <div className="landing-haze" aria-hidden />

        {/* Particle field (canvas) — sits between bg and brain */}
        <div ref={particleLayerRef} className="landing-particles" aria-hidden>
          <canvas ref={canvasRef} />
        </div>

        {/* Stacked content — brain on top, copy below */}
        <div className={`landing-stack ${mounted ? "is-mounted" : ""}`}>
          <div className="landing-brain-slot" aria-hidden>
            <div ref={brainRef} className="landing-brain">
              <div className="landing-brain-aura" />
              <img src={brainSmoke} alt="" className="landing-brain-img" />
            </div>
          </div>

          <div className="landing-copy">
            <h1 className="landing-headline" style={{ "--delay": "120ms" } as React.CSSProperties}>
              Unlock the Neural Horizon.
            </h1>
            <p className="landing-sub" style={{ "--delay": "320ms" } as React.CSSProperties}>
              The next evolution of cognitive computing, engineered for absolute clarity.
            </p>
            <div className="landing-cta-wrap" style={{ "--delay": "520ms" } as React.CSSProperties}>
              <button
                type="button"
                onClick={goToApp}
                className="landing-cta"
                data-testid="cta-enter-core"
              >
                <span className="landing-cta-glow" aria-hidden />
                <span className="landing-cta-label">Enter the Core</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom vignette for legibility */}
        <div className="landing-vignette" aria-hidden />
      </main>
    </>
  );
}

const styles = `
.landing-scene {
  position: relative;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
  font-family: "Inter", "Plus Jakarta Sans", system-ui, -apple-system, sans-serif;
  color: #E6FBFF;
  isolation: isolate;
  cursor: default;
}

/* Layered background — radial vignette on top of vertical gradient */
.landing-bg {
  position: absolute;
  inset: 0;
  z-index: -3;
  background:
    radial-gradient(ellipse 80% 60% at 50% 40%, rgba(8, 80, 100, 0.55) 0%, rgba(3, 22, 28, 0) 60%),
    linear-gradient(180deg, #03161c 0%, #021014 55%, #01080a 100%);
}

/* Soft drifting haze using two large blurred radial blobs */
.landing-haze {
  position: absolute;
  inset: -10%;
  z-index: -2;
  background:
    radial-gradient(circle at 20% 80%, rgba(0, 180, 220, 0.10) 0%, transparent 45%),
    radial-gradient(circle at 80% 20%, rgba(0, 200, 240, 0.08) 0%, transparent 50%);
  filter: blur(40px);
  animation: hazeDrift 18s ease-in-out infinite alternate;
}

.landing-particles {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  will-change: transform;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.landing-particles canvas {
  display: block;
  width: 100%;
  height: 100%;
}

/* Stacked layout — brain above copy */
.landing-stack {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(0px, 1vh, 16px);
  padding: clamp(24px, 4vh, 56px) 1.5rem clamp(40px, 6vh, 80px);
  text-align: center;
}

.landing-brain-slot {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex: 0 0 auto;
}
.landing-brain {
  --mx: 0;
  --my: 0;
  position: relative;
  width: min(560px, 78vw);
  height: min(420px, 50vh);
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translate3d(calc(var(--mx) * 18px), calc(var(--my) * 14px), 0)
             rotateX(calc(var(--my) * -4deg)) rotateY(calc(var(--mx) * 6deg));
  transform-style: preserve-3d;
  animation: brainFloat 7s ease-in-out infinite;
  will-change: transform;
}
.landing-brain-img {
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Radial mask — fades the square image edges into the page bg
     so the brain reads as floating, not framed. */
  -webkit-mask-image: radial-gradient(ellipse 62% 60% at 50% 50%,
    rgba(0,0,0,1) 0%,
    rgba(0,0,0,0.95) 40%,
    rgba(0,0,0,0.55) 65%,
    rgba(0,0,0,0) 88%);
  mask-image: radial-gradient(ellipse 62% 60% at 50% 50%,
    rgba(0,0,0,1) 0%,
    rgba(0,0,0,0.95) 40%,
    rgba(0,0,0,0.55) 65%,
    rgba(0,0,0,0) 88%);
  filter:
    drop-shadow(0 0 30px rgba(60, 220, 255, 0.40))
    drop-shadow(0 0 80px rgba(0, 180, 220, 0.30));
  animation: brainPulse 4.2s ease-in-out infinite;
}
.landing-brain-aura {
  position: absolute;
  inset: 12%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(80, 230, 255, 0.30) 0%, rgba(0, 180, 220, 0.10) 35%, transparent 70%);
  filter: blur(40px);
  animation: auraPulse 4.2s ease-in-out infinite;
  z-index: -1;
}

.landing-copy {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: clamp(8px, 2vh, 28px);
}
.landing-copy > * {
  opacity: 0;
  transform: translateY(28px);
  transition:
    opacity 900ms cubic-bezier(0.16, 1, 0.3, 1) var(--delay, 0ms),
    transform 900ms cubic-bezier(0.16, 1, 0.3, 1) var(--delay, 0ms);
}
.landing-stack.is-mounted .landing-copy > * {
  opacity: 1;
  transform: translateY(0);
}

.landing-headline {
  font-size: clamp(2.25rem, 6vw, 4.5rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.05;
  margin: 0;
  max-width: 18ch;
  background: linear-gradient(180deg, #FFFFFF 0%, #C8F4FF 60%, #7FD8EC 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 40px rgba(120, 220, 255, 0.15);
}
.landing-sub {
  margin: 1.25rem 0 0;
  font-size: clamp(1rem, 1.6vw, 1.2rem);
  font-weight: 400;
  letter-spacing: 0.005em;
  line-height: 1.5;
  max-width: 36ch;
  color: rgba(220, 245, 255, 0.78);
}
.landing-cta-wrap {
  margin-top: 2.5rem;
}

/* CTA */
.landing-cta {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2.25rem;
  border: 1px solid rgba(140, 230, 255, 0.55);
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(10, 60, 80, 0.55), rgba(4, 28, 38, 0.75));
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #EAFCFF;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
  isolation: isolate;
  transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 320ms ease,
              border-color 320ms ease;
  box-shadow:
    0 0 0 1px rgba(140, 230, 255, 0.12) inset,
    0 0 22px rgba(60, 200, 240, 0.25),
    0 0 0 0 rgba(80, 220, 255, 0);
}
.landing-cta-label {
  position: relative;
  z-index: 1;
}
.landing-cta-glow {
  position: absolute;
  inset: -2px;
  border-radius: 999px;
  background: radial-gradient(circle at 50% 50%, rgba(120, 230, 255, 0.45) 0%, rgba(0, 160, 200, 0) 65%);
  opacity: 0.55;
  transition: opacity 320ms ease, filter 320ms ease;
  filter: blur(12px);
  z-index: 0;
}
.landing-cta:hover {
  transform: translateY(-1px) scale(1.04);
  border-color: rgba(180, 245, 255, 0.85);
  box-shadow:
    0 0 0 1px rgba(180, 245, 255, 0.2) inset,
    0 0 36px rgba(80, 220, 255, 0.55),
    0 0 80px rgba(40, 180, 220, 0.35);
}
.landing-cta:hover .landing-cta-glow {
  opacity: 1;
  filter: blur(18px);
}
.landing-cta:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px rgba(180, 245, 255, 0.85),
    0 0 40px rgba(80, 220, 255, 0.55);
}
.landing-cta:active {
  transform: translateY(0) scale(1.0);
}

.landing-vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(ellipse 90% 70% at 50% 45%, transparent 55%, rgba(1, 8, 10, 0.55) 100%),
    linear-gradient(180deg, rgba(1, 8, 10, 0.3) 0%, transparent 20%, transparent 70%, rgba(1, 8, 10, 0.65) 100%);
}

/* Animations */
@keyframes brainFloat {
  0%, 100% {
    transform: translate3d(calc(var(--mx) * 18px), calc(var(--my) * 14px), 0)
               rotateX(calc(var(--my) * -4deg)) rotateY(calc(var(--mx) * 6deg));
  }
  50% {
    transform: translate3d(calc(var(--mx) * 18px), calc(var(--my) * 14px - 14px), 0)
               rotateX(calc(var(--my) * -4deg)) rotateY(calc(var(--mx) * 6deg));
  }
}
@keyframes brainPulse {
  0%, 100% {
    filter:
      drop-shadow(0 0 28px rgba(60, 220, 255, 0.40))
      drop-shadow(0 0 70px rgba(0, 180, 220, 0.30));
  }
  50% {
    filter:
      drop-shadow(0 0 44px rgba(120, 240, 255, 0.65))
      drop-shadow(0 0 110px rgba(40, 210, 245, 0.50));
  }
}
@keyframes auraPulse {
  0%, 100% { opacity: 0.75; transform: scale(1); }
  50%      { opacity: 1;    transform: scale(1.06); }
}
@keyframes hazeDrift {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(40px, -30px, 0); }
}

/* Mobile tuning */
@media (max-width: 640px) {
  .landing-brain { width: min(420px, 88vw); }
  .landing-content { padding-bottom: 56px; justify-content: flex-end; }
  .landing-headline { max-width: 16ch; }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .landing-brain,
  .landing-brain-img,
  .landing-brain-aura,
  .landing-haze {
    animation: none !important;
  }
  .landing-content > * {
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
`;
