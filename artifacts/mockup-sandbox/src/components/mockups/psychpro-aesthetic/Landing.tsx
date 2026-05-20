import React, { useState } from "react";
import {
  Search,
  ArrowRight,
  BookOpen,
  Users,
  GraduationCap,
  Brain,
  Briefcase,
  Mail,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Quote,
} from "lucide-react";
import { STUDY_PALETTE as P } from "@neuronotes/lib/study-theme";

const NAV = [
  { label: "HOME", active: true },
  { label: "COURSES" },
  { label: "RESOURCES" },
  { label: "COMMUNITY" },
  { label: "ABOUT" },
];

const FEATURES = [
  {
    icon: GraduationCap,
    title: "EXPERT-LED COURSES",
    desc: "Learn from leading professionals in clinical psychology.",
  },
  {
    icon: Brain,
    title: "EVIDENCE-BASED",
    desc: "Content grounded in the latest research and best practices.",
  },
  {
    icon: Briefcase,
    title: "PRACTICAL TOOLS",
    desc: "Resources and tools you can use in real-world settings.",
  },
  {
    icon: Users,
    title: "PROFESSIONAL COMMUNITY",
    desc: "Connect, collaborate, and grow with peers worldwide.",
  },
];

const STATS = [
  { n: "25K+", l: "MEMBERS" },
  { n: "150+", l: "COURSES" },
  { n: "10K+", l: "CERTIFICATIONS" },
  { n: "85+", l: "COUNTRIES" },
];

export function Landing() {
  const [email, setEmail] = useState("");

  return (
    <div
      className="relative w-full overflow-x-hidden font-sans"
      style={{
        fontFamily: '"Outfit", "Inter", system-ui, sans-serif',
        backgroundColor: P.ink,
        color: P.cloud,
      }}
    >
      {/* ============ Keyframes ============ */}
      <style>{`
        @keyframes pp-breathe {
          0%, 100% { transform: scale(1) translateY(0); filter: drop-shadow(0 0 70px ${P.surf}66) brightness(1) saturate(1.05); }
          50%      { transform: scale(1.035) translateY(-6px); filter: drop-shadow(0 0 130px ${P.surf}aa) brightness(1.08) saturate(1.2); }
        }
        @keyframes pp-aura {
          0%, 100% { opacity: 0.55; transform: translate(-50%, -50%) scale(1); }
          50%      { opacity: 0.9;  transform: translate(-50%, -50%) scale(1.08); }
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
        .pp-fadein-5 { animation: pp-fadein 1s 1.1s both ease-out; }
        .pp-card { transition: transform .35s ease, border-color .35s ease, box-shadow .35s ease; }
        .pp-card:hover { transform: translateY(-3px); }
        .pp-link:hover { color: ${P.surf} !important; }
        .pp-selection::selection { background: ${P.surf}; color: ${P.ink}; }
      `}</style>

      {/* =================================================
          HERO  — full-bleed brain + clouds composition
          ================================================= */}
      <section
        className="relative w-full"
        style={{
          minHeight: "min(1020px, 110vw)",
          background: `radial-gradient(ellipse 75% 60% at 50% 35%, ${P.bgSoft} 0%, ${P.bg} 50%, ${P.ink} 88%)`,
          isolation: "isolate",
        }}
      >
        {/* Cloud swirl layer A */}
        <div
          className="absolute inset-0 will-change-transform pointer-events-none"
          style={{
            backgroundImage: "url(/__mockup/images/cerulean-clouds-tile.png)",
            backgroundRepeat: "repeat",
            backgroundSize: "1500px 1500px",
            filter:
              "brightness(0.45) saturate(1.5) hue-rotate(-4deg) contrast(1.1) blur(1px)",
            opacity: 0.7,
            animation: "pp-swirl-a 42s ease-in-out infinite",
            transformOrigin: "50% 30%",
            zIndex: 0,
          }}
        />
        {/* Cloud swirl layer B */}
        <div
          className="absolute inset-0 will-change-transform pointer-events-none"
          style={{
            backgroundImage: "url(/__mockup/images/cerulean-clouds-tile.png)",
            backgroundRepeat: "repeat",
            backgroundSize: "950px 950px",
            filter: "brightness(0.8) saturate(1.7) hue-rotate(2deg) blur(2px)",
            opacity: 0.4,
            mixBlendMode: "screen",
            animation: "pp-swirl-b 58s ease-in-out infinite",
            transformOrigin: "60% 40%",
            zIndex: 0,
          }}
        />
        {/* Slow horizontal drift fog */}
        <div
          className="absolute inset-y-0 -left-[10%] -right-[10%] will-change-transform pointer-events-none"
          style={{
            backgroundImage: "url(/__mockup/images/cerulean-clouds-tile.png)",
            backgroundRepeat: "repeat-x",
            backgroundSize: "2200px 1200px",
            backgroundPosition: "center 55%",
            filter: "brightness(0.7) saturate(1.4) blur(10px)",
            opacity: 0.5,
            animation: "pp-drift 90s linear infinite alternate",
            zIndex: 0,
          }}
        />
        {/* Side vignette to frame the brain */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 55% 50% at 50% 28%, transparent 0%, ${P.ink}55 70%, ${P.ink}cc 100%),
              linear-gradient(180deg, transparent 65%, ${P.ink} 100%)
            `,
            zIndex: 1,
          }}
        />

        {/* Brain aura */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "min(440px, 48vw)",
            left: "50%",
            width: "min(1200px, 95vw)",
            height: "min(1000px, 80vw)",
            background: `radial-gradient(ellipse at center, ${P.surf}55 0%, ${P.teal}33 22%, transparent 58%)`,
            filter: "blur(70px)",
            animation: "pp-aura 7s ease-in-out infinite",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
          }}
        />

        {/* Breathing brain — full-bleed, mix-blend over clouds */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: 0,
            right: 0,
            top: "min(60px, 4vw)",
            display: "flex",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          <img
            src="/__mockup/images/hero_brain.png"
            alt=""
            draggable={false}
            className="pointer-events-none select-none"
            style={{
              width: "min(1180px, 96vw)",
              height: "auto",
              maxHeight: "min(820px, 75vw)",
              objectFit: "contain",
              transformOrigin: "50% 50%",
              animation: "pp-breathe 6.5s ease-in-out infinite",
              mixBlendMode: "screen",
              WebkitMaskImage: `radial-gradient(ellipse 55% 60% at 50% 45%, #000 25%, rgba(0,0,0,0.7) 55%, transparent 78%)`,
              maskImage: `radial-gradient(ellipse 55% 60% at 50% 45%, #000 25%, rgba(0,0,0,0.7) 55%, transparent 78%)`,
            }}
          />
        </div>

        {/* Hero foreground (nav + text + CTAs) */}
        <div className="relative z-[3]">
          {/* Nav */}
          <header className="px-8 lg:px-14 pt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 pp-fadein-1">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 28 28"
                  fill="none"
                  style={{ filter: `drop-shadow(0 0 8px ${P.surf}cc)` }}
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
                    textShadow: `0 0 14px ${P.surf}88`,
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
                    className="pp-link relative text-[12px] font-medium transition-colors"
                    style={{
                      color: item.active ? P.surf : `${P.cloud}cc`,
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
                    background: `${P.bg}66`,
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
                    border: `1px solid ${P.teal}88`,
                    background: `${P.surface}88`,
                    backdropFilter: "blur(8px)",
                    boxShadow: `inset 0 0 14px ${P.surf}30, 0 0 22px ${P.surf}28`,
                  }}
                >
                  LOG IN
                </button>
              </div>
            </div>
          </header>

          {/* Hero text — sits below the brain composition */}
          <div
            className="px-6 text-center"
            style={{ paddingTop: "min(440px, 40vw)" }}
          >
            <h1
              className="pp-fadein-2 pp-selection"
              style={{
                fontWeight: 200,
                fontSize: "clamp(56px, 8.5vw, 128px)",
                letterSpacing: "0.18em",
                lineHeight: 1,
                color: P.cloud,
                textShadow: `0 0 38px ${P.surf}80, 0 0 90px ${P.teal}55`,
                marginBottom: 22,
              }}
            >
              PSYCHPRO
            </h1>

            <p
              className="pp-fadein-3 mx-auto"
              style={{
                fontSize: "clamp(13px, 1.05vw, 16px)",
                color: P.mist,
                letterSpacing: "0.44em",
                fontWeight: 300,
                animation: "pp-tagline-shimmer 5s ease-in-out infinite",
                marginBottom: 26,
              }}
            >
              LEARN. EXPAND. CONNECT.
            </p>

            <p
              className="pp-fadein-3 mx-auto leading-relaxed"
              style={{
                maxWidth: 560,
                fontSize: 15,
                color: `${P.cloud}d9`,
                fontWeight: 300,
                marginBottom: 38,
              }}
            >
              Your all-in-one platform for mastering clinical psychology
              through expert-led courses, practical tools, and a supportive
              professional community.
            </p>

            <div className="pp-fadein-4 flex flex-wrap items-center justify-center gap-4">
              <button
                className="group px-7 py-3.5 rounded-full text-sm font-semibold flex items-center gap-2.5 transition-all"
                style={{
                  background: `${P.surface}80`,
                  color: P.cloud,
                  letterSpacing: "0.18em",
                  border: `1px solid ${P.surf}aa`,
                  backdropFilter: "blur(10px)",
                  boxShadow: `inset 0 0 18px ${P.surf}30, 0 10px 30px -10px ${P.surf}66`,
                }}
              >
                <BookOpen className="w-4 h-4" style={{ color: P.surf }} />
                EXPLORE COURSES
              </button>
              <button
                className="px-7 py-3.5 rounded-full text-sm font-semibold flex items-center gap-2.5 transition-all"
                style={{
                  color: P.cloud,
                  letterSpacing: "0.18em",
                  border: `1px solid ${P.teal}88`,
                  background: `${P.surface}66`,
                  backdropFilter: "blur(10px)",
                  boxShadow: `inset 0 0 18px ${P.surf}1f`,
                }}
              >
                <Users className="w-4 h-4" style={{ color: P.surf }} />
                JOIN COMMUNITY
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          CONTENT  — cards & trust strip
          ================================================= */}
      <div
        className="relative px-6 lg:px-10"
        style={{
          background: `linear-gradient(180deg, ${P.ink} 0%, ${P.bg} 100%)`,
        }}
      >
        {/* Subtle cloud wash behind content */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url(/__mockup/images/cerulean-clouds-tile.png)",
            backgroundSize: "1400px 1400px",
            filter: "brightness(0.5) saturate(1.4) blur(2px)",
            opacity: 0.18,
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto pt-16 pb-12">
          {/* Feature cards */}
          <div className="pp-fadein-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="pp-card p-6 text-center"
                  style={{
                    borderRadius: 18,
                    background: `${P.surface}55`,
                    border: `1px solid ${P.teal}55`,
                    backdropFilter: "blur(14px)",
                    boxShadow: `inset 0 0 22px ${P.surf}14, 0 20px 50px -28px ${P.ink}`,
                  }}
                >
                  <div
                    className="mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      background: `${P.bg}aa`,
                      border: `1px solid ${P.surf}66`,
                      boxShadow: `inset 0 0 12px ${P.surf}33, 0 0 20px ${P.surf}33`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: P.surf }} />
                  </div>
                  <div
                    className="text-[11px] font-semibold mb-3"
                    style={{
                      color: P.cloud,
                      letterSpacing: "0.18em",
                    }}
                  >
                    {f.title}
                  </div>
                  <div
                    className="text-[13px] leading-relaxed font-light"
                    style={{ color: `${P.mist}cc` }}
                  >
                    {f.desc}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust strip + testimonial */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {/* Trust / stats */}
            <div
              className="p-6 sm:p-7"
              style={{
                borderRadius: 18,
                background: `${P.surface}55`,
                border: `1px solid ${P.teal}55`,
                backdropFilter: "blur(14px)",
                boxShadow: `inset 0 0 22px ${P.surf}14`,
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <Users className="w-4 h-4" style={{ color: P.surf }} />
                <div
                  className="text-[11px] font-semibold"
                  style={{ color: P.cloud, letterSpacing: "0.22em" }}
                >
                  TRUSTED BY
                  <br />
                  PSYCHOLOGY PROFESSIONALS
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 pt-2">
                {STATS.map((s) => (
                  <div key={s.l} className="text-center">
                    <div
                      className="font-light"
                      style={{
                        fontSize: 26,
                        color: P.cloud,
                        textShadow: `0 0 18px ${P.surf}66`,
                      }}
                    >
                      {s.n}
                    </div>
                    <div
                      className="text-[9px] mt-1"
                      style={{
                        color: `${P.mist}aa`,
                        letterSpacing: "0.22em",
                      }}
                    >
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            <div
              className="p-6 sm:p-7 relative"
              style={{
                borderRadius: 18,
                background: `${P.surface}55`,
                border: `1px solid ${P.teal}55`,
                backdropFilter: "blur(14px)",
                boxShadow: `inset 0 0 22px ${P.surf}14`,
              }}
            >
              <Quote
                className="absolute top-5 left-5 w-5 h-5"
                style={{ color: P.surf, opacity: 0.8 }}
              />
              <div className="pl-9 pr-2">
                <p
                  className="text-[13px] leading-relaxed font-light mb-4"
                  style={{ color: `${P.cloud}d9` }}
                >
                  PsychPro has transformed the way I learn and apply clinical
                  knowledge. The community and resources are unmatched.
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold"
                    style={{
                      background: `linear-gradient(135deg, ${P.teal}, ${P.surf})`,
                      color: P.ink,
                      boxShadow: `0 0 16px ${P.surf}66`,
                    }}
                  >
                    SM
                  </div>
                  <div>
                    <div
                      className="text-[13px] font-medium"
                      style={{ color: P.cloud }}
                    >
                      Dr. Sarah Mitchell
                    </div>
                    <div
                      className="text-[11px]"
                      style={{ color: `${P.mist}aa`, letterSpacing: "0.06em" }}
                    >
                      Clinical Psychologist
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subscribe */}
          <div
            className="mt-6 p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-4"
            style={{
              borderRadius: 18,
              background: `${P.surface}55`,
              border: `1px solid ${P.teal}55`,
              backdropFilter: "blur(14px)",
              boxShadow: `inset 0 0 22px ${P.surf}14`,
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: `${P.bg}aa`,
                border: `1px solid ${P.surf}66`,
                boxShadow: `inset 0 0 10px ${P.surf}33`,
              }}
            >
              <Mail className="w-4 h-4" style={{ color: P.surf }} />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div
                className="text-[12px] font-semibold mb-0.5"
                style={{ color: P.cloud, letterSpacing: "0.2em" }}
              >
                STAY INSPIRED.
              </div>
              <div className="text-[12px]" style={{ color: `${P.mist}cc` }}>
                Get expert insights and updates.
              </div>
            </div>
            <div className="flex w-full sm:w-auto items-center gap-2">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="px-4 py-2.5 rounded-full text-sm flex-1 outline-none"
                style={{
                  minWidth: 240,
                  background: `${P.ink}99`,
                  border: `1px solid ${P.teal}66`,
                  color: P.cloud,
                }}
              />
              <button
                className="px-6 py-2.5 rounded-full text-xs font-semibold"
                style={{
                  background: `linear-gradient(135deg, ${P.teal}, ${P.surf})`,
                  color: P.ink,
                  letterSpacing: "0.2em",
                  boxShadow: `0 8px 26px -10px ${P.surf}cc`,
                }}
              >
                SUBSCRIBE
              </button>
            </div>
          </div>

          {/* Footer */}
          <div
            className="mt-10 pt-6 pb-2 flex flex-wrap items-center justify-between gap-4 border-t"
            style={{ borderColor: `${P.teal}33` }}
          >
            <div className="flex items-center gap-2">
              <svg
                width="22"
                height="22"
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
              </svg>
              <span
                className="text-[12px] font-light"
                style={{ color: P.cloud, letterSpacing: "0.3em" }}
              >
                PSYCHPRO
              </span>
            </div>
            <div className="flex items-center gap-8">
              {["PRIVACY POLICY", "TERMS OF SERVICE", "CONTACT"].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="pp-link text-[11px]"
                  style={{
                    color: `${P.mist}b3`,
                    letterSpacing: "0.2em",
                  }}
                >
                  {l}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              {[Linkedin, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                  style={{
                    border: `1px solid ${P.teal}66`,
                    background: `${P.surface}66`,
                  }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: P.surf }} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
