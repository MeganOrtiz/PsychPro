import React, { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { STUDY_PALETTE as P } from "@neuronotes/lib/study-theme";

const NAV = [
  { label: "HOME", active: true },
  { label: "COURSES" },
  { label: "RESOURCES" },
  { label: "COMMUNITY" },
  { label: "ABOUT" },
];

export function Landing() {
  const [email, setEmail] = useState("");

  return (
    <div
      className="relative min-h-[100dvh] w-full overflow-x-hidden font-sans"
      style={{
        fontFamily: '"Outfit", "Inter", system-ui, sans-serif',
        backgroundColor: P.ink,
        color: P.cloud,
      }}
    >
      {/* ============ Keyframes ============ */}
      <style>{`
        @keyframes pp-breathe {
          0%, 100% { transform: scale(1) translateY(0); filter: drop-shadow(0 0 60px ${P.surf}55) brightness(1) saturate(1.05); }
          50%      { transform: scale(1.035) translateY(-6px); filter: drop-shadow(0 0 110px ${P.surf}88) brightness(1.08) saturate(1.18); }
        }
        @keyframes pp-aura {
          0%, 100% { opacity: 0.55; transform: translate(-50%, -50%) scale(1); }
          50%      { opacity: 0.85; transform: translate(-50%, -50%) scale(1.08); }
        }
        @keyframes pp-swirl-a {
          0%   { transform: translate3d(0,0,0) rotate(0deg) scale(1.05); }
          50%  { transform: translate3d(-2%, 1.2%, 0) rotate(2.5deg) scale(1.08); }
          100% { transform: translate3d(0,0,0) rotate(0deg) scale(1.05); }
        }
        @keyframes pp-swirl-b {
          0%   { transform: translate3d(0,0,0) rotate(0deg) scale(1.15); }
          50%  { transform: translate3d(2%, -1.5%, 0) rotate(-3deg) scale(1.18); }
          100% { transform: translate3d(0,0,0) rotate(0deg) scale(1.15); }
        }
        @keyframes pp-drift {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-3%); }
        }
        @keyframes pp-tagline-shimmer {
          0%, 100% { opacity: 0.85; letter-spacing: 0.42em; }
          50%      { opacity: 1;    letter-spacing: 0.46em; }
        }
        @keyframes pp-fadein {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pp-fadein-1 { animation: pp-fadein 1s 0.1s both ease-out; }
        .pp-fadein-2 { animation: pp-fadein 1s 0.35s both ease-out; }
        .pp-fadein-3 { animation: pp-fadein 1s 0.6s both ease-out; }
        .pp-fadein-4 { animation: pp-fadein 1s 0.85s both ease-out; }
        .pp-selection::selection { background: ${P.surf}; color: ${P.ink}; }
      `}</style>

      {/* ============ Background floor ============ */}
      <div
        className="fixed inset-0 z-[-50]"
        style={{
          background: `radial-gradient(ellipse at 50% 8%, ${P.bgSoft} 0%, ${P.bg} 38%, ${P.ink} 78%)`,
        }}
      />

      {/* ============ Swirling cloud layer A (large, slow) ============ */}
      <div
        className="fixed inset-0 z-[-40] will-change-transform"
        style={{
          backgroundImage: "url(/__mockup/images/cerulean-clouds-tile.png)",
          backgroundRepeat: "repeat",
          backgroundSize: "1500px 1500px",
          filter: "brightness(0.62) saturate(1.35) hue-rotate(-4deg) contrast(1.08) blur(0.5px)",
          opacity: 0.95,
          animation: "pp-swirl-a 42s ease-in-out infinite",
          transformOrigin: "50% 30%",
        }}
      />

      {/* ============ Swirling cloud layer B (medium, counter-rotate) ============ */}
      <div
        className="fixed inset-0 z-[-39] will-change-transform pointer-events-none"
        style={{
          backgroundImage: "url(/__mockup/images/cerulean-clouds-tile.png)",
          backgroundRepeat: "repeat",
          backgroundSize: "950px 950px",
          filter: "brightness(0.85) saturate(1.6) hue-rotate(2deg) blur(1.5px)",
          opacity: 0.5,
          mixBlendMode: "screen",
          animation: "pp-swirl-b 58s ease-in-out infinite",
          transformOrigin: "60% 40%",
        }}
      />

      {/* ============ Slow horizontal drift fog ============ */}
      <div
        className="fixed inset-y-0 -inset-x-[10%] z-[-38] will-change-transform pointer-events-none"
        style={{
          backgroundImage: "url(/__mockup/images/cerulean-clouds-tile.png)",
          backgroundRepeat: "repeat-x",
          backgroundSize: "2200px 1200px",
          backgroundPosition: "center 60%",
          filter: "brightness(0.55) saturate(1.4) blur(8px)",
          opacity: 0.45,
          animation: "pp-drift 90s linear infinite alternate",
        }}
      />

      {/* ============ Vignette ============ */}
      <div
        className="fixed inset-0 z-[-30] pointer-events-none"
        style={{
          background: `
            radial-gradient(60% 45% at 50% 6%, transparent 0%, ${P.ink}66 70%, ${P.ink}cc 100%),
            linear-gradient(180deg, transparent 50%, ${P.ink} 100%)
          `,
        }}
      />

      {/* ============ Foreground content ============ */}
      <div className="relative z-10">
        {/* Nav */}
        <header className="px-8 lg:px-14 pt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 pp-fadein-1">
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                style={{ filter: `drop-shadow(0 0 6px ${P.surf}99)` }}
              >
                <path
                  d="M14 4c-3 0-5 2-5 4.5 0 1 .3 1.8.8 2.5C8 12 7 13.5 7 15.5c0 2.4 1.6 4 3.5 4.5 0 2.2 1.5 4 3.5 4s3.5-1.8 3.5-4c1.9-.5 3.5-2.1 3.5-4.5 0-2-1-3.5-2.8-4.5.5-.7.8-1.5.8-2.5C19 6 17 4 14 4z"
                  stroke={P.surf}
                  strokeWidth="1.4"
                  fill="none"
                />
                <path d="M14 4v20M9 11h10M9 17h10" stroke={P.teal} strokeWidth="0.9" />
              </svg>
              <span
                className="font-light text-[15px]"
                style={{
                  color: P.cloud,
                  letterSpacing: "0.36em",
                  textShadow: `0 0 14px ${P.surf}55`,
                }}
              >
                PSYCHPRO
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-9 pp-fadein-1">
              {NAV.map((item) => (
                <a
                  key={item.label}
                  href="#"
                  className="relative text-[12px] font-medium transition-colors"
                  style={{
                    color: item.active ? P.surf : `${P.cloud}b3`,
                    letterSpacing: "0.22em",
                  }}
                >
                  {item.label}
                  {item.active && (
                    <span
                      className="absolute left-0 right-0 -bottom-1.5 h-px"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${P.surf}, transparent)`,
                      }}
                    />
                  )}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3 pp-fadein-1">
              <button
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                style={{
                  border: `1px solid ${P.teal}66`,
                  background: `${P.bg}80`,
                  backdropFilter: "blur(8px)",
                }}
                aria-label="Search"
              >
                <Search className="w-4 h-4" style={{ color: P.surf }} />
              </button>
              <button
                className="px-5 py-2 rounded-full text-[11px] font-semibold transition-all"
                style={{
                  color: P.cloud,
                  letterSpacing: "0.22em",
                  border: `1px solid ${P.teal}80`,
                  background: `${P.surface}90`,
                  backdropFilter: "blur(8px)",
                  boxShadow: `inset 0 0 14px ${P.surf}30, 0 0 22px ${P.surf}25`,
                }}
              >
                LOG IN
              </button>
            </div>
          </div>
        </header>

        {/* Hero section — brain breathes at top, wordmark below */}
        <section className="px-6 text-center relative">
          {/* Brain aura (pulsing) */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "min(360px, 42vw)",
              left: "50%",
              width: "min(1100px, 95vw)",
              height: "min(900px, 80vw)",
              background: `radial-gradient(ellipse at center, ${P.surf}55 0%, ${P.teal}30 20%, transparent 55%)`,
              filter: "blur(60px)",
              animation: "pp-aura 7s ease-in-out infinite",
              transform: "translate(-50%, -50%)",
              zIndex: -1,
            }}
          />

          {/* Breathing brain */}
          <div
            className="relative mx-auto"
            style={{
              width: "min(900px, 90vw)",
              height: "min(560px, 56vw)",
              marginTop: "min(40px, 4vw)",
              marginBottom: "min(-80px, -6vw)",
            }}
          >
            <img
              src="/__mockup/images/hero_brain.png"
              alt=""
              draggable={false}
              className="pointer-events-none select-none"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                transformOrigin: "50% 50%",
                animation: "pp-breathe 6.5s ease-in-out infinite",
                mixBlendMode: "screen",
                WebkitMaskImage: `radial-gradient(ellipse 60% 65% at 50% 48%, #000 35%, rgba(0,0,0,0.6) 60%, transparent 88%)`,
                maskImage: `radial-gradient(ellipse 60% 65% at 50% 48%, #000 35%, rgba(0,0,0,0.6) 60%, transparent 88%)`,
              }}
            />
          </div>

          <h1
            className="pp-fadein-2 pp-selection"
            style={{
              fontWeight: 200,
              fontSize: "clamp(56px, 9vw, 132px)",
              letterSpacing: "0.18em",
              lineHeight: 1,
              color: P.cloud,
              textShadow: `0 0 38px ${P.surf}80, 0 0 90px ${P.teal}55`,
              marginBottom: 24,
            }}
          >
            PSYCHPRO
          </h1>

          <p
            className="pp-fadein-3 mx-auto"
            style={{
              fontSize: "clamp(13px, 1.1vw, 16px)",
              color: P.mist,
              letterSpacing: "0.44em",
              fontWeight: 300,
              animation: "pp-tagline-shimmer 5s ease-in-out infinite",
              marginBottom: 28,
            }}
          >
            LEARN. EXPAND. CONNECT.
          </p>

          <p
            className="pp-fadein-3 mx-auto leading-relaxed"
            style={{
              maxWidth: 620,
              fontSize: 15,
              color: `${P.cloud}cc`,
              fontWeight: 300,
              marginBottom: 44,
            }}
          >
            Your all-in-one platform for mastering clinical psychology —
            cut study time in half and actually retain it with clinically
            grounded tools built for students and professionals.
          </p>

          {/* CTAs */}
          <div className="pp-fadein-4 flex flex-wrap items-center justify-center gap-4 mb-20">
            <button
              className="group px-8 py-3.5 rounded-full text-sm font-semibold flex items-center gap-2.5 transition-all"
              style={{
                background: `linear-gradient(135deg, ${P.teal}, ${P.surf})`,
                color: P.ink,
                letterSpacing: "0.16em",
                boxShadow: `0 14px 44px -8px ${P.surf}66, inset 0 0 18px ${P.cloud}40`,
              }}
            >
              EXPLORE COURSES
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              className="px-8 py-3.5 rounded-full text-sm font-semibold flex items-center gap-2.5 transition-all"
              style={{
                color: P.cloud,
                letterSpacing: "0.16em",
                border: `1px solid ${P.teal}80`,
                background: `${P.surface}70`,
                backdropFilter: "blur(10px)",
                boxShadow: `inset 0 0 18px ${P.surf}25, 0 0 28px ${P.surf}25`,
              }}
            >
              JOIN COMMUNITY
            </button>
          </div>

          {/* Hairline */}
          <div
            className="pp-fadein-4 mx-auto mb-16"
            style={{
              maxWidth: 640,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${P.surf}66, transparent)`,
            }}
          />

          {/* Stats strip */}
          <div className="pp-fadein-4 mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 max-w-3xl mb-24">
            {[
              { n: "25K+", l: "MEMBERS" },
              { n: "150+", l: "COURSES" },
              { n: "10K+", l: "CERTIFICATIONS" },
              { n: "85+", l: "COUNTRIES" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div
                  className="font-light"
                  style={{
                    fontSize: 32,
                    color: P.cloud,
                    textShadow: `0 0 18px ${P.surf}55`,
                  }}
                >
                  {s.n}
                </div>
                <div
                  className="text-[10px] mt-1.5"
                  style={{
                    color: `${P.mist}aa`,
                    letterSpacing: "0.28em",
                  }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Email subscribe */}
        <section className="px-6 pb-24">
          <div
            className="mx-auto p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5"
            style={{
              maxWidth: 720,
              borderRadius: 24,
              background: `${P.surface}66`,
              border: `1px solid ${P.teal}55`,
              backdropFilter: "blur(20px)",
              boxShadow: `0 24px 70px -20px ${P.ink}, inset 0 0 22px ${P.surf}1a`,
            }}
          >
            <div className="flex-1 text-center sm:text-left">
              <div
                className="text-[11px] mb-1"
                style={{ color: P.surf, letterSpacing: "0.28em" }}
              >
                STAY INSPIRED
              </div>
              <div
                className="text-sm font-light"
                style={{ color: `${P.cloud}cc` }}
              >
                Get expert insights and weekly updates.
              </div>
            </div>
            <div className="flex w-full sm:w-auto items-center gap-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="px-4 py-3 rounded-full text-sm flex-1 outline-none"
                style={{
                  minWidth: 220,
                  background: `${P.ink}80`,
                  border: `1px solid ${P.teal}55`,
                  color: P.cloud,
                }}
              />
              <button
                className="px-5 py-3 rounded-full text-xs font-semibold"
                style={{
                  background: `linear-gradient(135deg, ${P.teal}, ${P.surf})`,
                  color: P.ink,
                  letterSpacing: "0.18em",
                }}
              >
                SUBSCRIBE
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Landing;
