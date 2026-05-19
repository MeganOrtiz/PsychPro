import React, { useState } from "react";
import {
  Brain,
  BookOpen,
  Users,
  GraduationCap,
  Wrench,
  Award,
  Globe,
  Search,
  Mail,
  ArrowRight,
} from "lucide-react";

import { STUDY_PALETTE as P } from "@neuronotes/lib/study-theme";

const GLASS_DARK = {
  background: `rgba(6,32,44,.58)`,
  border: `1px solid rgba(118,228,247,.38)`,
  backdropFilter: "blur(18px) saturate(140%)",
  WebkitBackdropFilter: "blur(18px) saturate(140%)",
} as const;

const PILL_GLASS = {
  background: `rgba(10,45,61,.62)`,
  border: `1px solid rgba(118,228,247,.45)`,
  boxShadow: `inset 0 0 15px rgba(118,228,247,.3), 0 0 20px rgba(118,228,247,.2)`,
} as const;

const HAIRLINE = {
  background: `linear-gradient(90deg, transparent, rgba(118,228,247,.35), transparent)`,
} as const;

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
      <style>{`
        :root { --hero-bg-h: clamp(220px, 35.5vw, 70vh); }
        .pp-selection::selection { background: ${P.surf}; color: ${P.ink}; }
      `}</style>

      {/* Layer 0: solid floor */}
      <div className="fixed inset-0 z-[-50]" style={{ background: P.ink }} />

      {/* Layer 1: cloud tile */}
      <div
        className="fixed inset-0 z-[-40]"
        style={{
          backgroundImage: "url(/__mockup/images/cerulean-clouds-tile.png)",
          backgroundRepeat: "repeat",
          backgroundSize:
            "clamp(640px, 95vw, 1400px) clamp(640px, 95vw, 1400px)",
          filter:
            "brightness(0.78) saturate(1.15) hue-rotate(0deg) contrast(1.05)",
          maskImage:
            "linear-gradient(180deg, transparent 0, transparent calc(var(--hero-bg-h) * 0.35), #000 calc(var(--hero-bg-h) + 30vh), #000 50%, transparent 92%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0, transparent calc(var(--hero-bg-h) * 0.35), #000 calc(var(--hero-bg-h) + 30vh), #000 50%, transparent 92%)",
        }}
      />

      {/* Layer 2: top hero brain */}
      <div
        className="fixed top-0 left-0 w-full z-[-30]"
        style={{
          backgroundImage: "url(/__mockup/images/hero_brain.png)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          height: "var(--hero-bg-h)",
          maskImage:
            "linear-gradient(180deg, #000 0, #000 70%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, #000 0, #000 70%, transparent 100%)",
        }}
      />

      {/* Top Nav */}
      <nav className="relative z-20 w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group">
            <Brain
              className="w-7 h-7"
              style={{
                color: P.surf,
                filter: "drop-shadow(0 0 8px rgba(118,228,247,0.6))",
              }}
            />
            <span
              className="font-light text-base transition-colors group-hover:opacity-80"
              style={{ color: P.cloud, letterSpacing: "0.28em" }}
            >
              PSYCHPRO
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {["HOME", "COURSES", "RESOURCES", "COMMUNITY", "ABOUT"].map(
              (link, i) => (
                <a
                  key={link}
                  href="#"
                  className="text-xs font-light transition-all relative py-2"
                  style={{
                    color: i === 0 ? P.cloud : P.inkSoft,
                    letterSpacing: "0.28em",
                  }}
                >
                  {link}
                  {i === 0 && (
                    <span
                      className="absolute bottom-0 left-0 w-full h-[1px]"
                      style={{
                        background: P.surf,
                        boxShadow: `0 0 8px ${P.surf}`,
                      }}
                    />
                  )}
                </a>
              ),
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-105"
              style={PILL_GLASS}
            >
              <Search className="w-4 h-4" style={{ color: P.surf }} />
            </button>
            <button
              className="h-10 px-6 rounded-full flex items-center justify-center text-xs font-light transition-transform hover:scale-105"
              style={{
                ...PILL_GLASS,
                color: P.surf,
                letterSpacing: "0.28em",
              }}
            >
              LOG IN
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 w-full pb-24">
        {/* Hero */}
        <div
          className="w-full flex flex-col items-center text-center px-4"
          style={{ marginTop: "calc(var(--hero-bg-h) * 0.4)" }}
        >
          <h1
            className="font-light leading-tight mb-4"
            style={{
              fontSize: "clamp(44px,7.5vw,88px)",
              color: P.cloud,
              letterSpacing: "0.42em",
              textShadow:
                "0 0 40px rgba(118,228,247,0.4), 0 0 80px rgba(118,228,247,0.2)",
            }}
          >
            PSYCHPRO
          </h1>
          <p
            className="text-sm md:text-base font-light mb-8"
            style={{
              color: P.mist,
              letterSpacing: "0.32em",
              textShadow: "0 2px 4px rgba(0,0,0,0.8)",
            }}
          >
            LEARN. EXPAND. CONNECT.
          </p>
          <p
            className="max-w-2xl text-[17px] leading-relaxed font-light mb-12"
            style={{
              color: P.inkSoft,
              textShadow: "0 2px 6px rgba(0,0,0,0.9)",
            }}
          >
            Your all-in-one platform for mastering clinical psychology — cut
            study time in half and actually retain it with clinically grounded
            tools built for students and professionals.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <button
              className="h-12 px-8 rounded-full flex items-center gap-3 text-xs font-light transition-all hover:scale-105"
              style={{
                ...PILL_GLASS,
                color: P.surf,
                letterSpacing: "0.28em",
              }}
            >
              <BookOpen className="w-4 h-4" />
              EXPLORE COURSES
            </button>
            <button
              className="h-12 px-8 rounded-full flex items-center gap-3 text-xs font-light transition-all hover:scale-105"
              style={{
                ...PILL_GLASS,
                color: P.surf,
                letterSpacing: "0.28em",
              }}
            >
              <Users className="w-4 h-4" />
              JOIN COMMUNITY
            </button>
          </div>
        </div>

        <div
          className="max-w-7xl mx-auto mt-24 mb-16 h-[1px]"
          style={HAIRLINE}
        />

        {/* Feature Cards — 4-up frosted glass */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: GraduationCap,
                title: "EXPERT-LED COURSES",
                desc: "Curated by leading professionals in the field.",
              },
              {
                icon: Brain,
                title: "EVIDENCE-BASED",
                desc: "Rooted in the latest psychological research.",
              },
              {
                icon: Wrench,
                title: "PRACTICAL TOOLS",
                desc: "Resources you can apply immediately.",
              },
              {
                icon: Users,
                title: "PROFESSIONAL COMMUNITY",
                desc: "Connect with peers and mentors worldwide.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative rounded-[22px] p-7 transition-all duration-300 hover:-translate-y-1"
                style={{
                  ...GLASS_DARK,
                  boxShadow:
                    "0 24px 50px rgba(0,0,0,.45), inset 0 0 0 1px rgba(118,228,247,.05)",
                }}
              >
                <feature.icon
                  className="w-10 h-10 mb-6"
                  strokeWidth={1.25}
                  style={{
                    color: P.surf,
                    filter: "drop-shadow(0 0 10px rgba(118,228,247,0.6))",
                  }}
                />
                <h3
                  className="text-xs font-light uppercase mb-3"
                  style={{ color: P.cloud, letterSpacing: "0.28em" }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: P.inkSoft }}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="max-w-7xl mx-auto mt-20 mb-20 h-[1px]"
          style={HAIRLINE}
        />

        {/* Trust Stats Band */}
        <div className="max-w-6xl mx-auto px-6">
          <div
            className="rounded-[22px] overflow-hidden"
            style={{
              background: "rgba(6,32,44,.4)",
              border: "1px solid rgba(118,228,247,.2)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x"
              style={{ borderColor: "rgba(118,228,247,.22)" }}
            >
              {[
                { icon: BookOpen, num: "39+", label: "TOPICS" },
                { icon: GraduationCap, num: "1,612+", label: "FLASHCARDS" },
                { icon: Award, num: "935+", label: "QUIZ QUESTIONS" },
                { icon: Globe, num: "738+", label: "EXAM QUESTIONS" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center p-8 text-center"
                  style={{
                    borderColor: "rgba(118,228,247,.22)",
                  }}
                >
                  <stat.icon
                    className="w-6 h-6 mb-4 opacity-70"
                    style={{ color: P.surf }}
                  />
                  <div
                    className="font-light text-3xl mb-2"
                    style={{ color: P.cloud }}
                  >
                    {stat.num}
                  </div>
                  <div
                    className="text-[10px] uppercase"
                    style={{ color: P.inkSoft, letterSpacing: "0.32em" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="max-w-7xl mx-auto mt-20 mb-20 h-[1px]"
          style={HAIRLINE}
        />

        {/* Upgraded Testimonial */}
        <div className="max-w-4xl mx-auto px-6">
          <div
            className="rounded-[22px] p-8 md:p-10 relative overflow-hidden"
            style={{
              ...GLASS_DARK,
              boxShadow:
                "0 0 60px rgba(118,228,247,.22), 0 24px 60px rgba(0,0,0,.5), inset 0 0 0 1px rgba(118,228,247,.05)",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-center">
              <div className="md:col-span-2 flex justify-center md:justify-end">
                <div
                  className="w-[160px] h-[160px] rounded-full overflow-hidden shrink-0"
                  style={{
                    boxShadow:
                      "0 0 0 3px rgba(118,228,247,.7), 0 0 28px rgba(118,228,247,.45)",
                  }}
                >
                  <img
                    src="/__mockup/images/spotlight_avatar.png"
                    alt="Sarah K."
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="md:col-span-3 text-center md:text-left">
                <blockquote
                  className="text-xl leading-relaxed italic mb-6"
                  style={{ color: P.cloud, fontFamily: "Georgia, serif" }}
                >
                  "PsychPro changed how I prepare. The spaced repetition and
                  clinical framing made my EPPP prep feel effortless."
                </blockquote>
                <div
                  className="text-sm uppercase"
                  style={{ color: P.mist, letterSpacing: "0.18em" }}
                >
                  — Sarah K., PsyD Candidate · Clinical Neuropsychology
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="max-w-7xl mx-auto mt-20 mb-20 h-[1px]"
          style={HAIRLINE}
        />

        {/* Email Signup */}
        <div className="max-w-3xl mx-auto px-6">
          <div
            className="rounded-[22px] p-8 md:p-10 text-center"
            style={{
              ...GLASS_DARK,
              boxShadow:
                "0 0 48px rgba(118,228,247,.18), 0 18px 50px rgba(0,0,0,.45)",
            }}
          >
            <Mail
              className="w-7 h-7 mx-auto mb-4"
              strokeWidth={1.25}
              style={{
                color: P.surf,
                filter: "drop-shadow(0 0 10px rgba(118,228,247,.6))",
              }}
            />
            <h3
              className="text-xs font-light uppercase mb-3"
              style={{ color: P.cloud, letterSpacing: "0.32em" }}
            >
              STAY IN THE LOOP
            </h3>
            <p
              className="text-sm md:text-base font-light max-w-md mx-auto mb-6"
              style={{ color: P.inkSoft }}
            >
              New study guides, clinical case breakdowns, and product updates —
              once a week, no noise.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row items-stretch gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-11 px-4 rounded-full text-sm outline-none font-light"
                style={{
                  background: "rgba(3,21,29,.55)",
                  border: "1px solid rgba(118,228,247,.35)",
                  color: P.cloud,
                }}
              />
              <button
                type="submit"
                className="h-11 px-6 rounded-full flex items-center justify-center gap-2 text-xs font-light transition-transform hover:scale-105"
                style={{
                  ...PILL_GLASS,
                  color: P.surf,
                  letterSpacing: "0.28em",
                }}
              >
                SUBSCRIBE
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <p
              className="text-[10px] mt-4"
              style={{ color: P.inkSoft, letterSpacing: "0.18em" }}
            >
              UNSUBSCRIBE ANYTIME. WE NEVER SHARE YOUR EMAIL.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="relative z-10 w-full pt-16 pb-8"
        style={{
          borderTop: "1px solid rgba(118,228,247,.15)",
          background: "rgba(3,21,29,.8)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Brain className="w-6 h-6" style={{ color: P.surf }} />
                <span
                  className="font-light text-sm"
                  style={{ color: P.cloud, letterSpacing: "0.28em" }}
                >
                  PSYCHPRO
                </span>
              </div>
              <p
                className="text-sm leading-relaxed max-w-xs"
                style={{ color: P.inkSoft }}
              >
                Empowering the next generation of clinical psychologists with
                evidence-based study tools.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                {["Courses", "Study Tools", "Pricing"].map((l, i) => (
                  <a
                    key={l}
                    href="#"
                    className="text-xs transition-colors"
                    style={{
                      color: i === 0 ? P.cloud : P.inkSoft,
                      letterSpacing: "0.1em",
                    }}
                  >
                    {l}
                  </a>
                ))}
              </div>
              <div className="flex flex-col gap-4">
                {["About", "Contact", "Blog"].map((l, i) => (
                  <a
                    key={l}
                    href="#"
                    className="text-xs transition-colors"
                    style={{
                      color: i === 0 ? P.cloud : P.inkSoft,
                      letterSpacing: "0.1em",
                    }}
                  >
                    {l}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end">
              <div
                className="text-xs mb-4"
                style={{ color: P.cloud, letterSpacing: "0.1em" }}
              >
                CONNECT
              </div>
              <div className="flex gap-4">
                {["X", "in", "@"].map((s) => (
                  <div
                    key={s}
                    className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                    style={{
                      border: "1px solid rgba(118,228,247,.3)",
                      color: P.surf,
                    }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ borderTop: "1px solid rgba(118,228,247,.08)" }}
          >
            <div
              className="text-[10px]"
              style={{ color: P.inkSoft, letterSpacing: "0.1em" }}
            >
              © {new Date().getFullYear()} PSYCHPRO. ALL RIGHTS RESERVED.
            </div>
            <div className="flex gap-6">
              {["PRIVACY POLICY", "TERMS OF SERVICE"].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="text-[10px]"
                  style={{ color: P.inkSoft, letterSpacing: "0.1em" }}
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
