import React from "react";
import {
  Brain,
  Bell,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  BookOpen,
  ChevronRight,
  Star,
  Medal,
  Award,
  ShieldCheck,
  Flame,
  Trophy,
  Activity,
  CheckCircle2,
  Clock,
} from "lucide-react";

import { STUDY_PALETTE as P } from "@neuronotes/lib/study-theme";
import { LightCard, LIGHT_CARD_STYLE as CARD_LIGHT } from "./_shared/LightCard";

const BRAND_GRADIENT = `linear-gradient(135deg, ${P.teal}, ${P.surf})`;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 ml-1">
      <h3
        className="text-[11px] font-bold uppercase"
        style={{ color: P.tealDeep, letterSpacing: "0.18em" }}
      >
        {children}
      </h3>
    </div>
  );
}

export function Dashboard() {
  return (
    <div
      className="min-h-screen relative font-sans overflow-x-hidden"
      style={{
        backgroundColor: P.ink,
        fontFamily: '"Outfit", "Inter", system-ui, sans-serif',
      }}
    >
      {/* Background layers (matches landing) */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url(/__mockup/images/cerulean-clouds-tile.png)",
          backgroundRepeat: "repeat",
          backgroundSize:
            "clamp(640px, 95vw, 1400px) clamp(640px, 95vw, 1400px)",
          filter:
            "brightness(0.78) saturate(1.15) hue-rotate(0deg) contrast(1.05)",
        }}
      />
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(120% 80% at 80% 0%, rgba(118,228,247,0.10) 0%, transparent 60%),
            linear-gradient(to bottom, rgba(6,32,44,0.15) 0%, rgba(6,32,44,0.35) 100%),
            rgba(3,21,29,0.18)
          `,
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto p-6 lg:p-8">
        {/* Editorial Header */}
        <header className="relative flex flex-col items-center justify-center mb-10 pt-4">
          <div className="absolute right-0 top-4">
            <button
              className="w-12 h-12 rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
              style={{
                background: "rgba(10,45,61,0.6)",
                border: `1px solid rgba(42,115,135,0.5)`,
              }}
            >
              <Bell className="w-5 h-5" style={{ color: P.surf }} />
            </button>
          </div>

          <div className="flex flex-col items-center text-center">
            <Brain
              className="w-7 h-7 mb-3"
              style={{
                color: P.surf,
                filter: "drop-shadow(0 0 8px rgba(118,228,247,0.6))",
              }}
            />
            <h1
              className="font-light leading-none m-0 pb-1"
              style={{
                color: P.cloud,
                fontSize: "clamp(28px, 4vw, 44px)",
                letterSpacing: "0.42em",
                marginLeft: "0.42em",
                textShadow: "0 0 20px rgba(118,228,247,0.4)",
              }}
            >
              PSYCHPRO
            </h1>
            <p
              className="text-xs font-light mt-2"
              style={{
                color: P.mist,
                letterSpacing: "0.32em",
                marginLeft: "0.32em",
              }}
            >
              ADVANCE YOUR MIND. ELEVATE CARE.
            </p>
          </div>
        </header>

        {/* Above-the-fold: Continue + Streak/Banner stack */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-10">
          {/* Continue */}
          <div className="p-6 lg:p-8 flex flex-col relative" style={CARD_LIGHT}>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: P.paperSoft }}
              >
                <TrendingUp className="w-5 h-5" style={{ color: P.tealDeep }} />
              </div>
              <h2
                className="font-semibold text-xl"
                style={{ color: P.surface }}
              >
                Continue Your Journey
              </h2>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-end mb-3">
                <h3
                  className="font-bold text-2xl tracking-tight"
                  style={{ color: P.surface }}
                >
                  Neuropsychology Overview
                </h3>
                <span
                  className="font-semibold text-lg"
                  style={{ color: P.tealDeep }}
                >
                  72%
                </span>
              </div>
              <div
                className="h-2 w-full rounded-full overflow-hidden"
                style={{ background: P.paperSoft }}
              >
                <div
                  className="h-full rounded-full w-[72%]"
                  style={{ background: BRAND_GRADIENT }}
                />
              </div>
            </div>

            <div
              className="flex justify-between items-center pt-6 mt-auto"
              style={{ borderTop: "1px solid rgba(42,115,135,0.18)" }}
            >
              <div className="flex gap-8">
                <div>
                  <p
                    className="text-xs font-medium uppercase tracking-wider mb-1"
                    style={{ color: P.tealDeep }}
                  >
                    Time Today
                  </p>
                  <p
                    className="font-bold text-lg"
                    style={{ color: P.surface }}
                  >
                    42 min
                  </p>
                </div>
                <div>
                  <p
                    className="text-xs font-medium uppercase tracking-wider mb-1"
                    style={{ color: P.tealDeep }}
                  >
                    Cards Reviewed
                  </p>
                  <p
                    className="font-bold text-lg"
                    style={{ color: P.surface }}
                  >
                    18
                  </p>
                </div>
              </div>

              <button
                className="px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-colors"
                style={{
                  background: P.tealDeep,
                  color: P.cloud,
                  boxShadow: `0 8px 24px -8px ${P.tealDeep}aa`,
                }}
              >
                Continue Studying
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stack */}
          <div className="flex flex-col gap-6">
            <div className="p-6" style={CARD_LIGHT}>
              <div className="flex justify-between items-start mb-6">
                <h3
                  className="font-semibold text-lg flex items-center gap-2"
                  style={{ color: P.surface }}
                >
                  Your Streak
                </h3>
                <div
                  className="flex items-baseline gap-1"
                  style={{ color: P.tealDeep }}
                >
                  <span className="text-3xl font-bold leading-none">5</span>
                  <span className="text-sm font-medium">days</span>
                </div>
              </div>

              <div className="flex justify-between items-center px-2">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => {
                  const isLit = i >= 1 && i <= 5;
                  return (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-2"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                        style={
                          isLit
                            ? {
                                background: `${P.surf}22`,
                                color: P.tealDeep,
                              }
                            : {
                                background: "rgba(10,45,61,0.06)",
                                color: "rgba(10,45,61,0.4)",
                              }
                        }
                      >
                        {isLit ? (
                          <Flame
                            className="w-4 h-4"
                            style={{ color: P.tealDeep }}
                            fill="currentColor"
                          />
                        ) : (
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ background: "rgba(10,45,61,0.2)" }}
                          />
                        )}
                      </div>
                      <span
                        className="text-[10px] font-bold uppercase"
                        style={{
                          color: isLit
                            ? P.surface
                            : "rgba(10,45,61,0.4)",
                        }}
                      >
                        {day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Banner */}
            <LightCard className="p-5 flex flex-col gap-4">
              <div className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `${P.surf}33` }}
                >
                  <Sparkles className="w-4 h-4" style={{ color: P.tealDeep }} />
                </div>
                <div>
                  <h4
                    className="font-medium mb-1"
                    style={{ color: P.surface }}
                  >
                    You're close to your free limit
                  </h4>
                  <p
                    className="text-sm font-light"
                    style={{ color: P.tealDeep }}
                  >
                    8 of 10 free interactions used
                  </p>
                </div>
              </div>
              <button
                className="w-full py-2.5 rounded-full font-medium text-sm transition-colors"
                style={{
                  background: BRAND_GRADIENT,
                  color: P.cloud,
                }}
              >
                Upgrade to Unlimited
              </button>
            </LightCard>
          </div>
        </div>

        {/* Recommended — horizontal-scroll carousel */}
        <div className="mb-10">
          <SectionLabel>Recommended For You</SectionLabel>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:overflow-visible overflow-x-auto pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: "thin" }}
          >
            {[
              {
                title: "Executive Function",
                desc: "Strengthen your foundation",
                icon: Brain,
              },
              {
                title: "Cognitive Therapy & CBT",
                desc: "Build on what you reviewed",
                icon: BookOpen,
              },
              {
                title: "Neurophysiology",
                desc: "Sharpen your weak area",
                icon: Sparkles,
              },
            ].map((item, i) => (
              <LightCard
                key={i}
                className="p-5 flex items-center gap-4 cursor-pointer hover:-translate-y-0.5 transition-transform duration-300 group snap-start"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: BRAND_GRADIENT }}
                >
                  <item.icon
                    className="w-5 h-5"
                    style={{ color: P.cloud }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className="font-bold truncate"
                    style={{ color: P.surface }}
                  >
                    {item.title}
                  </h4>
                  <p
                    className="text-xs truncate"
                    style={{ color: P.tealDeep }}
                  >
                    {item.desc}
                  </p>
                </div>
                <ChevronRight
                  className="w-5 h-5 transition-colors"
                  style={{ color: `${P.tealDeep}99` }}
                />
              </LightCard>
            ))}
          </div>
        </div>

        {/* Spotlight + Featured Work — horizontal editorial strip */}
        <div className="mb-10">
          <SectionLabel>Spotlight &amp; Featured Work</SectionLabel>
          <div
            className="flex gap-5 overflow-x-auto pb-4 -mx-1 px-1 snap-x snap-mandatory"
            style={{ scrollbarWidth: "thin" }}
          >
            {/* Card 1: Spotlight person */}
            <LightCard
              className="relative overflow-hidden shrink-0 snap-start"
              style={{ width: 380 }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-28 opacity-70"
                style={{
                  backgroundImage:
                    "url(/__mockup/images/spotlight_cloud.png)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  maskImage:
                    "linear-gradient(to bottom, #000, transparent)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, #000, transparent)",
                }}
              />
              <div className="relative z-10 p-6 flex flex-col items-center text-center">
                <Star
                  className="w-6 h-6 mb-3"
                  style={{
                    color: P.tealDeep,
                    filter: "drop-shadow(0 0 8px rgba(94,176,200,.5))",
                  }}
                />
                <h4
                  className="text-sm font-light uppercase mb-1"
                  style={{ color: P.surface, letterSpacing: "0.18em" }}
                >
                  PsychPro Spotlight
                </h4>
                <p
                  className="text-[10px] mb-5"
                  style={{ color: P.tealDeep, letterSpacing: "0.22em" }}
                >
                  LEARN. EXPAND. CONNECT.
                </p>
                <div
                  className="w-24 h-24 rounded-full overflow-hidden mb-4"
                  style={{
                    boxShadow: `0 0 0 3px ${P.teal}, 0 0 28px rgba(94,176,200,.4)`,
                  }}
                >
                  <img
                    src="/__mockup/images/spotlight_avatar.png"
                    alt="Sarah K."
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3
                  className="text-xl font-bold mb-1"
                  style={{ color: P.surface }}
                >
                  Sarah K.
                </h3>
                <p
                  className="text-sm"
                  style={{ color: P.tealDeep }}
                >
                  PsyD Candidate
                  <br />
                  Clinical Neuropsychology
                </p>
              </div>
            </LightCard>

            {/* Card 2: Featured Work */}
            <LightCard
              className="relative overflow-hidden shrink-0 snap-start"
              style={{ width: 520 }}
            >
              <div
                className="absolute inset-0 z-0 opacity-40"
                style={{
                  backgroundImage:
                    "url(/__mockup/images/spotlight_neuron.png)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div
                className="absolute inset-0 z-0"
                style={{
                  background: `linear-gradient(to right, ${P.cloud}f5, ${P.cloud}e0 40%, ${P.cloud}80)`,
                }}
              />
              <div className="relative z-10 p-7 flex flex-col justify-between h-full min-h-[300px]">
                <div>
                  <span
                    className="inline-block text-[10px] font-bold uppercase px-2.5 py-1 rounded mb-4"
                    style={{
                      color: P.tealDeep,
                      background: `${P.surf}33`,
                      border: `1px solid ${P.teal}66`,
                      letterSpacing: "0.2em",
                    }}
                  >
                    FEATURED WORK
                  </span>
                  <h3
                    className="text-2xl font-bold mb-3 leading-tight max-w-md"
                    style={{ color: P.surface }}
                  >
                    SOCIAL COGNITION IN CHILDREN WITH AUTISM SPECTRUM DISORDER
                  </h3>
                  <p
                    className="text-sm max-w-md leading-relaxed mb-6"
                    style={{ color: P.tealDeep }}
                  >
                    A comprehensive review of the neurological underpinnings of
                    social cognitive deficits in ASD, focusing on the default
                    mode network and mirror neuron systems.
                  </p>
                </div>
                <button
                  className="self-start px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-all"
                  style={{
                    background: BRAND_GRADIENT,
                    color: P.cloud,
                  }}
                >
                  View Feature
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </LightCard>

            {/* Card 3: Editor's Pick */}
            <LightCard
              className="relative overflow-hidden shrink-0 snap-start p-7"
              style={{ width: 380 }}
            >
              <span
                className="inline-block text-[10px] font-bold uppercase px-2.5 py-1 rounded mb-4"
                style={{
                  color: P.tealDeep,
                  background: `${P.surf}33`,
                  border: `1px solid ${P.teal}66`,
                  letterSpacing: "0.2em",
                }}
              >
                EDITOR'S PICK
              </span>
              <h3
                className="text-xl font-bold mb-3 leading-tight"
                style={{ color: P.surface }}
              >
                Reframing CBT for Complex Trauma Survivors
              </h3>
              <p
                className="text-sm mb-6 leading-relaxed"
                style={{ color: P.tealDeep }}
              >
                Dr. Mara Chen on integrating somatic regulation into traditional
                cognitive therapy. Watch the 18-minute interview and download
                the clinical worksheet.
              </p>
              <div
                className="flex items-center gap-3 pt-4"
                style={{ borderTop: `1px solid ${P.teal}40` }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: BRAND_GRADIENT }}
                >
                  <BookOpen
                    className="w-5 h-5"
                    style={{ color: P.cloud }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-semibold truncate"
                    style={{ color: P.surface }}
                  >
                    Trauma-Focused Approaches
                  </p>
                  <p
                    className="text-[11px] truncate"
                    style={{ color: P.tealDeep }}
                  >
                    Interview · 18 min · Updated this week
                  </p>
                </div>
              </div>
            </LightCard>
          </div>
        </div>

        {/* Analytics (full width) + Recent + Achievements (2-col) */}
        <div className="space-y-6">
          {/* Analytics */}
          <div className="p-6" style={CARD_LIGHT}>
            <div className="flex justify-between items-center mb-6">
              <h3
                className="font-bold text-xl"
                style={{ color: P.surface }}
              >
                Study Analytics
              </h3>
              <span
                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{
                  background: `${P.tealDeep}1a`,
                  color: P.tealDeep,
                }}
              >
                This Week
              </span>
            </div>

            <div className="h-48 w-full relative mb-6">
              <svg
                className="w-full h-full"
                viewBox="0 0 1000 100"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="ppLineGrad"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor={P.tealDeep} />
                    <stop offset="100%" stopColor={P.surf} />
                  </linearGradient>
                  <linearGradient
                    id="ppFillGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={P.surf}
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="100%"
                      stopColor={P.surf}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <path
                  d="M0,80 Q100,50 200,60 T400,30 T600,40 T800,20 T1000,40"
                  fill="none"
                  stroke="url(#ppLineGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M0,80 Q100,50 200,60 T400,30 T600,40 T800,20 T1000,40 L1000,100 L0,100 Z"
                  fill="url(#ppFillGrad)"
                />
                {[
                  { x: 0, y: 80 },
                  { x: 200, y: 60 },
                  { x: 400, y: 30 },
                  { x: 600, y: 40 },
                  { x: 800, y: 20 },
                  { x: 1000, y: 40 },
                ].map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r="6"
                    fill={P.cloud}
                    stroke={P.surf}
                    strokeWidth="3"
                  />
                ))}
              </svg>
            </div>

            <div
              className="flex gap-8 pt-6"
              style={{ borderTop: "1px solid rgba(42,115,135,0.18)" }}
            >
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-wider mb-1"
                  style={{ color: P.tealDeep }}
                >
                  Average Score
                </p>
                <p
                  className="font-bold text-2xl"
                  style={{ color: P.surface }}
                >
                  78%
                </p>
              </div>
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-wider mb-1"
                  style={{ color: P.tealDeep }}
                >
                  Topics Studied
                </p>
                <p
                  className="font-bold text-2xl"
                  style={{ color: P.surface }}
                >
                  14
                  <span
                    className="text-lg"
                    style={{ color: `${P.tealDeep}80` }}
                  >
                    /39
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="p-6" style={CARD_LIGHT}>
              <h3
                className="font-bold text-xl mb-6"
                style={{ color: P.surface }}
              >
                Recent Activity
              </h3>
              <div className="space-y-4">
                {[
                  {
                    topic: "Neural Pathways",
                    status: "Completed Quiz",
                    time: "2h ago",
                    icon: Activity,
                  },
                  {
                    topic: "Cognitive Assessment",
                    status: "Reviewed 20 cards",
                    time: "5h ago",
                    icon: BookOpen,
                  },
                  {
                    topic: "Dementia Types",
                    status: "Mastered Topic",
                    time: "1d ago",
                    icon: CheckCircle2,
                  },
                ].map((item, i, arr) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 pb-4"
                    style={
                      i === arr.length - 1
                        ? undefined
                        : {
                            borderBottom: "1px solid rgba(42,115,135,0.15)",
                          }
                    }
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: P.paperSoft }}
                    >
                      <item.icon
                        className="w-5 h-5"
                        style={{ color: P.tealDeep }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4
                        className="font-semibold text-sm"
                        style={{ color: P.surface }}
                      >
                        {item.topic}
                      </h4>
                      <p
                        className="text-xs"
                        style={{ color: P.tealDeep }}
                      >
                        {item.status}
                      </p>
                    </div>
                    <div
                      className="flex items-center gap-1 text-xs font-medium"
                      style={{ color: `${P.tealDeep}99` }}
                    >
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="p-6" style={CARD_LIGHT}>
              <div className="flex justify-between items-center mb-6">
                <h3
                  className="font-bold text-xl"
                  style={{ color: P.surface }}
                >
                  Achievements
                </h3>
                <span
                  className="text-sm font-semibold"
                  style={{ color: P.tealDeep }}
                >
                  3/6 Unlocked
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "First Steps",
                    hint: "Complete a topic",
                    icon: Medal,
                    unlocked: true,
                  },
                  {
                    label: "Scholar",
                    hint: "Review 100 cards",
                    icon: BookOpen,
                    unlocked: true,
                  },
                  {
                    label: "Hot Streak",
                    hint: "5 day streak",
                    icon: Flame,
                    unlocked: true,
                  },
                  {
                    label: "Master",
                    hint: "100% on a quiz",
                    icon: Award,
                    unlocked: false,
                  },
                  {
                    label: "Defender",
                    hint: "No wrong answers",
                    icon: ShieldCheck,
                    unlocked: false,
                  },
                  {
                    label: "Champion",
                    hint: "Finish all topics",
                    icon: Trophy,
                    unlocked: false,
                  },
                ].map((achieve, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={
                      achieve.unlocked
                        ? {
                            background: P.cloud,
                            border: `1px solid ${P.teal}55`,
                            boxShadow:
                              "0 4px 12px -8px rgba(42,115,135,0.4)",
                          }
                        : {
                            background: "transparent",
                            border: `1px dashed ${P.tealDeep}33`,
                            opacity: 0.6,
                          }
                    }
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: achieve.unlocked
                          ? P.paperSoft
                          : "rgba(10,45,61,0.05)",
                      }}
                    >
                      <achieve.icon
                        className="w-4 h-4"
                        style={{
                          color: achieve.unlocked
                            ? P.tealDeep
                            : "rgba(10,45,61,0.4)",
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-bold truncate"
                        style={{
                          color: achieve.unlocked
                            ? P.surface
                            : "rgba(10,45,61,0.55)",
                        }}
                      >
                        {achieve.label}
                      </p>
                      <p
                        className="text-[10px] truncate"
                        style={{ color: P.tealDeep }}
                      >
                        {achieve.hint}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
