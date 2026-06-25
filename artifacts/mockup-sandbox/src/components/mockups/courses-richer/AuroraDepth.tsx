import {
  GraduationCap,
  Users,
  Brain,
  HeartHandshake,
  Building2,
  ChevronRight,
  LibraryBig,
  type LucideIcon,
} from "lucide-react";

const PAGE_BG =
  "radial-gradient(1100px 700px at 78% -8%, rgba(118,228,247,0.10), rgba(118,228,247,0) 60%), radial-gradient(900px 600px at 12% 8%, rgba(29,162,195,0.12), rgba(29,162,195,0) 58%), linear-gradient(180deg, #06303d 0%, #05252d 55%, #041d24 100%)";

const COURSES = [
  "Foundations",
  "Biological Bases",
  "Cognitive-Affective",
  "Social & Cultural",
  "Developmental",
  "Assessment",
];

const LESSONS: { name: string; description: string; Icon: LucideIcon }[] = [
  {
    name: "History of Psychology",
    description:
      "From Wundt's 1879 Leipzig lab to the cognitive revolution — the schools, key figures, and turning points that shaped the field.",
    Icon: GraduationCap,
  },
  {
    name: "Social Determinants",
    description:
      "How social and economic conditions shape health — the SES gradient, ACEs, allostatic load, and fundamental-cause theory.",
    Icon: HeartHandshake,
  },
  {
    name: "Social Psychology",
    description:
      "How situations shape behavior — attribution, conformity, obedience, attitudes, persuasion, and group and intergroup processes.",
    Icon: Users,
  },
  {
    name: "Community Psychology",
    description:
      "Prevention, empowerment, and ecological thinking — working at the community and systems level rather than the individual.",
    Icon: Brain,
  },
  {
    name: "Organizational Psychology",
    description:
      "Psychology applied to the workplace — motivation, leadership, commitment, justice, culture, burnout, and selection.",
    Icon: Building2,
  },
];

// Inline fractal-noise grain as a data-URI so the surface is never dead-flat.
const GRAIN_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function AuroraDepth() {
  return (
    <div className="aurora-depth min-h-screen w-full" style={{ background: PAGE_BG }}>
      <style>{`
        @keyframes aurora-depth-drift {
          0%   { transform: translate3d(0,0,0) scale(1); opacity: 0.85; }
          50%  { transform: translate3d(3%, -4%, 0) scale(1.08); opacity: 1; }
          100% { transform: translate3d(0,0,0) scale(1); opacity: 0.85; }
        }
        @keyframes aurora-depth-drift2 {
          0%   { transform: translate3d(0,0,0) scale(1.05); opacity: 0.7; }
          50%  { transform: translate3d(-4%, 3%, 0) scale(1); opacity: 0.95; }
          100% { transform: translate3d(0,0,0) scale(1.05); opacity: 0.7; }
        }
        @keyframes aurora-depth-edge {
          0%   { opacity: 0.5; }
          50%  { opacity: 1; }
          100% { opacity: 0.5; }
        }
        .aurora-depth .ad-card { position: relative; isolation: isolate; overflow: hidden; }
        .aurora-depth .ad-bloom {
          position: absolute; inset: -30%; pointer-events: none; z-index: 0;
          mix-blend-mode: screen; filter: blur(14px);
        }
        .aurora-depth .ad-bloom-a { animation: aurora-depth-drift 14s ease-in-out infinite; }
        .aurora-depth .ad-bloom-b { animation: aurora-depth-drift2 18s ease-in-out infinite; }
        .aurora-depth .ad-grain {
          position: absolute; inset: 0; pointer-events: none; z-index: 1;
          opacity: 0.10; mix-blend-mode: overlay;
          background-image: ${GRAIN_URI}; background-size: 160px 160px;
        }
        .aurora-depth .ad-edge {
          position: absolute; left: 14%; right: 14%; top: 0; height: 1px; z-index: 3;
          background: linear-gradient(90deg, rgba(118,228,247,0) 0%, rgba(118,228,247,0.95) 50%, rgba(118,228,247,0) 100%);
          box-shadow: 0 0 10px 1px rgba(118,228,247,0.7);
          animation: aurora-depth-edge 6s ease-in-out infinite;
        }
        .aurora-depth .ad-content { position: relative; z-index: 2; }
      `}</style>

      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1
            className="text-2xl md:text-3xl font-semibold tracking-tight"
            style={{
              color: "#F4FBFF",
              textShadow: "0 0 26px rgba(118,228,247,0.30)",
            }}
          >
            Courses
          </h1>
          <p className="text-sm mt-1" style={{ color: "rgba(167,243,255,0.72)" }}>
            Foundations · 5 lessons
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
          {/* Course rail */}
          <div className="flex flex-col gap-2 h-fit">
            {COURSES.map((c, i) => {
              const active = i === 0;
              const Icon = active ? GraduationCap : LibraryBig;
              return (
                <div
                  key={c}
                  className="ad-card relative w-full flex items-center gap-3 px-3 py-2.5 border"
                  style={{
                    borderRadius: 12,
                    background: active
                      ? "linear-gradient(150deg, hsl(192 84% 22% / 0.82), hsl(192 88% 13% / 0.92))"
                      : "linear-gradient(150deg, hsl(192 70% 16% / 0.40), hsl(192 80% 11% / 0.55))",
                    borderColor: active
                      ? "rgba(118,228,247,0.55)"
                      : "rgba(118,228,247,0.16)",
                    boxShadow: active
                      ? "inset 0 1px 0 rgba(255,255,255,0.16), inset 0 0 34px -16px rgba(118,228,247,0.7), 0 0 22px -6px rgba(118,228,247,0.4), 0 16px 38px -28px rgba(0,0,0,0.8)"
                      : "inset 0 1px 0 rgba(255,255,255,0.05), 0 10px 24px -22px rgba(0,0,0,0.7)",
                  }}
                >
                  {active && (
                    <>
                      <div
                        className="ad-bloom ad-bloom-a"
                        style={{
                          background:
                            "radial-gradient(60% 70% at 24% 30%, rgba(118,228,247,0.42), rgba(118,228,247,0) 70%)",
                        }}
                      />
                      <div className="ad-grain" />
                      <div className="ad-edge" />
                    </>
                  )}
                  <span
                    className="ad-content w-9 h-9 shrink-0 rounded-lg flex items-center justify-center border"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 35%, rgba(118,228,247,0.30), hsl(192 86% 26% / 0.6) 72%)",
                      borderColor: "rgba(118,228,247,0.30)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
                    }}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{
                        color: "#76E4F7",
                        filter: "drop-shadow(0 0 4px rgba(118,228,247,0.6))",
                      }}
                    />
                  </span>
                  <div className="ad-content flex-1 min-w-0">
                    <div
                      className="font-medium text-sm leading-snug"
                      style={{ color: active ? "#F4FBFF" : "rgba(244,251,255,0.9)" }}
                    >
                      {c}
                    </div>
                  </div>
                  {active && (
                    <ChevronRight
                      className="ad-content w-4 h-4 shrink-0"
                      style={{
                        color: "#76E4F7",
                        filter: "drop-shadow(0 0 4px rgba(118,228,247,0.6))",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Lesson grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LESSONS.map(({ name, description, Icon }) => (
              <div
                key={name}
                className="ad-card relative w-full flex items-start gap-3.5 px-4 py-4 border text-left"
                style={{
                  borderRadius: 20,
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: "rgba(118,228,247,0.22)",
                  // base material: color that deepens across the card
                  background:
                    "linear-gradient(155deg, hsl(192 82% 24% / 0.78) 0%, hsl(192 88% 15% / 0.86) 48%, hsl(193 90% 10% / 0.94) 100%)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.14), inset 0 0 46px -20px rgba(118,228,247,0.50), 0 0 30px -8px rgba(118,228,247,0.32), 0 26px 64px -42px rgba(0,0,0,0.78)",
                }}
              >
                {/* Aurora blooms layered inside — lit from within */}
                <div
                  className="ad-bloom ad-bloom-a"
                  style={{
                    background:
                      "radial-gradient(55% 60% at 22% 18%, rgba(118,228,247,0.50), rgba(118,228,247,0) 68%)",
                  }}
                />
                <div
                  className="ad-bloom ad-bloom-b"
                  style={{
                    background:
                      "radial-gradient(60% 65% at 82% 88%, rgba(29,162,195,0.55), rgba(29,162,195,0) 70%)",
                  }}
                />
                <div
                  className="ad-bloom"
                  style={{
                    background:
                      "radial-gradient(45% 50% at 65% 35%, rgba(125,211,252,0.28), rgba(125,211,252,0) 72%)",
                    filter: "blur(20px)",
                  }}
                />
                {/* grain / noise texture */}
                <div className="ad-grain" />
                {/* glowing cyan accent edge */}
                <div className="ad-edge" />

                {/* Icon */}
                <span
                  className="ad-content w-11 h-11 shrink-0 rounded-xl flex items-center justify-center border"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 32%, rgba(118,228,247,0.34), hsl(192 86% 24% / 0.62) 72%)",
                    borderColor: "rgba(118,228,247,0.34)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.22), 0 0 18px -4px rgba(118,228,247,0.5)",
                  }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{
                      color: "#76E4F7",
                      filter: "drop-shadow(0 0 6px rgba(118,228,247,0.8))",
                    }}
                  />
                </span>

                {/* Text */}
                <div className="ad-content flex-1 min-w-0">
                  <div
                    className="font-semibold text-[15px] leading-snug"
                    style={{
                      color: "#F4FBFF",
                      textShadow: "0 0 18px rgba(118,228,247,0.20)",
                    }}
                  >
                    {name}
                  </div>
                  <div
                    className="text-[12.5px] mt-1 leading-relaxed"
                    style={{
                      color: "rgba(167,243,255,0.78)",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {description}
                  </div>
                  <div
                    className="text-[11px] mt-2.5 flex items-center gap-1.5"
                    style={{ color: "rgba(159,206,220,0.85)" }}
                  >
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{
                        background: "#76E4F7",
                        boxShadow: "0 0 6px 1px rgba(118,228,247,0.8)",
                      }}
                    />
                    Practice exam · 90% to pass
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
