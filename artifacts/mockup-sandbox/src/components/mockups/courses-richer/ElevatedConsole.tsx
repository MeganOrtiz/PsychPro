import {
  GraduationCap,
  Landmark,
  HeartPulse,
  Users,
  Network,
  Briefcase,
  ChevronRight,
  LibraryBig,
  Layers,
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

const LESSONS: {
  eyebrow: string;
  name: string;
  description: string;
  progress: number;
  Icon: LucideIcon;
}[] = [
  {
    eyebrow: "Lesson 01 · Foundations",
    name: "History of Psychology",
    description:
      "From Wundt's 1879 Leipzig lab to the cognitive revolution — the schools, key figures, and turning points that shaped the field.",
    progress: 72,
    Icon: Landmark,
  },
  {
    eyebrow: "Lesson 02 · Foundations",
    name: "Social Determinants",
    description:
      "How social and economic conditions shape health — the SES gradient, ACEs, allostatic load, and fundamental-cause theory.",
    progress: 48,
    Icon: HeartPulse,
  },
  {
    eyebrow: "Lesson 03 · Foundations",
    name: "Social Psychology",
    description:
      "How situations shape behavior — attribution, conformity, obedience, attitudes, persuasion, and group and intergroup processes.",
    progress: 61,
    Icon: Users,
  },
  {
    eyebrow: "Lesson 04 · Foundations",
    name: "Community Psychology",
    description:
      "Prevention, empowerment, and ecological thinking — working at the community and systems level rather than the individual.",
    progress: 35,
    Icon: Network,
  },
  {
    eyebrow: "Lesson 05 · Foundations",
    name: "Organizational Psychology",
    description:
      "Psychology applied to the workplace — motivation, leadership, commitment, justice, culture, burnout, and selection.",
    progress: 22,
    Icon: Briefcase,
  },
];

const TITLE = "#F4FBFF";
const DESC = "rgba(167,243,255,0.78)";
const META = "rgba(159,206,220,0.85)";

export function ElevatedConsole() {
  return (
    <div className="ec-root min-h-screen w-full" style={{ background: PAGE_BG }}>
      <style>{`
        .ec-root {
          --ec-cyan: #76E4F7;
          --ec-cyan-rgb: 118,228,247;
        }
        .ec-grain {
          background-image:
            radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            radial-gradient(rgba(118,228,247,0.03) 1px, transparent 1px);
          background-size: 5px 5px, 7px 7px;
          background-position: 0 0, 2px 3px;
        }
        @keyframes ec-medallion-pulse {
          0%, 100% { box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.35),
            inset 0 -8px 18px -8px rgba(0,0,0,0.55),
            0 0 0 1px rgba(118,228,247,0.30),
            0 8px 22px -6px rgba(0,0,0,0.7),
            0 0 22px -2px rgba(118,228,247,0.45); }
          50% { box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.4),
            inset 0 -8px 18px -8px rgba(0,0,0,0.55),
            0 0 0 1px rgba(118,228,247,0.45),
            0 8px 22px -6px rgba(0,0,0,0.7),
            0 0 30px 1px rgba(118,228,247,0.62); }
        }
        .ec-card {
          transition: transform 220ms cubic-bezier(.2,.7,.3,1), box-shadow 220ms ease;
        }
        .ec-card:hover {
          transform: translateY(-3px);
        }
        .ec-card:hover .ec-medallion {
          animation: ec-medallion-pulse 2.4s ease-in-out infinite;
        }
        .ec-rail-item {
          transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
        }
        .ec-rail-item:hover {
          transform: translateX(2px);
        }
      `}</style>

      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <div
              className="text-[11px] font-semibold uppercase tracking-[0.22em] mb-1.5 flex items-center gap-2"
              style={{ color: "rgba(118,228,247,0.85)" }}
            >
              <Layers className="w-3.5 h-3.5" />
              Study Console
            </div>
            <h1
              className="text-2xl md:text-3xl font-bold tracking-tight"
              style={{ color: TITLE }}
            >
              Courses
            </h1>
            <p className="text-sm mt-1.5" style={{ color: DESC }}>
              Foundations · 5 lessons
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Course rail — stacked base + frosted inner */}
          <div
            className="relative h-fit p-3"
            style={{
              borderRadius: 20,
              background:
                "linear-gradient(180deg, rgba(7,40,52,0.92), rgba(4,24,30,0.96))",
              border: "1px solid rgba(118,228,247,0.10)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.05), 0 30px 60px -40px rgba(0,0,0,0.85)",
            }}
          >
            <div
              className="text-[10px] font-semibold uppercase tracking-[0.2em] px-2 pt-1 pb-2.5"
              style={{ color: META }}
            >
              Course Track
            </div>
            <div className="flex flex-col gap-2">
              {COURSES.map((c, i) => {
                const active = i === 0;
                const Icon = active ? GraduationCap : LibraryBig;
                return (
                  <div
                    key={c}
                    className="ec-rail-item relative w-full flex items-center gap-3 px-3 py-2.5 overflow-hidden"
                    style={{
                      borderRadius: 12,
                      background: active
                        ? "linear-gradient(180deg, rgba(118,228,247,0.16), rgba(29,162,195,0.10))"
                        : "rgba(118,228,247,0.035)",
                      border: active
                        ? "1px solid rgba(118,228,247,0.5)"
                        : "1px solid rgba(118,228,247,0.10)",
                      boxShadow: active
                        ? "inset 0 1px 0 rgba(255,255,255,0.14), 0 0 22px -8px rgba(118,228,247,0.5), 0 10px 24px -16px rgba(0,0,0,0.8)"
                        : "none",
                    }}
                  >
                    {active && (
                      <span
                        className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full"
                        style={{
                          background:
                            "linear-gradient(180deg, #76E4F7, rgba(118,228,247,0.2))",
                          boxShadow: "0 0 10px rgba(118,228,247,0.8)",
                        }}
                      />
                    )}
                    <span
                      className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center"
                      style={{
                        background:
                          "radial-gradient(circle at 50% 30%, rgba(118,228,247,0.30), hsl(192 80% 22% / 0.7) 75%)",
                        border: "1px solid rgba(118,228,247,0.3)",
                        boxShadow: active
                          ? "inset 0 1px 0 rgba(255,255,255,0.3), 0 0 16px -4px rgba(118,228,247,0.6)"
                          : "inset 0 1px 0 rgba(255,255,255,0.15)",
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
                    <div
                      className="flex-1 min-w-0 font-medium text-sm leading-snug"
                      style={{ color: active ? TITLE : "rgba(244,251,255,0.82)" }}
                    >
                      {c}
                    </div>
                    {active && (
                      <ChevronRight
                        className="w-4 h-4 shrink-0"
                        style={{ color: "#76E4F7" }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lesson grid — elevated console tiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {LESSONS.map(({ eyebrow, name, description, progress, Icon }) => (
              <div
                key={name}
                className="ec-card relative p-2"
                style={{
                  borderRadius: 22,
                  /* OUTER BASE SURFACE (darker) */
                  background:
                    "linear-gradient(180deg, rgba(6,34,44,0.96), rgba(3,20,26,0.98))",
                  border: "1px solid rgba(118,228,247,0.10)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.05), 0 36px 70px -44px rgba(0,0,0,0.9)",
                }}
              >
                {/* top accent bar bridging the two surfaces */}
                <div
                  className="absolute left-5 right-5 top-0 h-[2px] rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(118,228,247,0), #76E4F7 50%, rgba(118,228,247,0))",
                    boxShadow: "0 0 12px rgba(118,228,247,0.7)",
                  }}
                />

                {/* INNER FROSTED CONTENT PANEL (floating, lighter) */}
                <div
                  className="ec-grain relative flex flex-col h-full px-4 pt-4 pb-3.5 overflow-hidden"
                  style={{
                    borderRadius: 16,
                    background:
                      "linear-gradient(155deg, hsl(192 70% 24% / 0.55), hsl(192 78% 16% / 0.72))",
                    border: "1px solid rgba(196,232,242,0.16)",
                    backdropFilter: "blur(18px) saturate(140%)",
                    WebkitBackdropFilter: "blur(18px) saturate(140%)",
                    /* the elevation gap: drop shadow of inner panel onto base */
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.16), inset 0 0 40px -24px rgba(118,228,247,0.5), 0 14px 26px -12px rgba(0,0,0,0.75)",
                  }}
                >
                  {/* specular highlight sweep */}
                  <div
                    className="pointer-events-none absolute -top-10 -right-6 w-40 h-40 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(118,228,247,0.18), rgba(118,228,247,0) 70%)",
                    }}
                  />

                  <div className="relative flex items-start gap-3.5">
                    {/* glowing medallion */}
                    <span
                      className="ec-medallion w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center"
                      style={{
                        background:
                          "radial-gradient(circle at 50% 28%, rgba(118,228,247,0.42), hsl(192 80% 24% / 0.8) 72%)",
                        boxShadow:
                          "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -8px 18px -8px rgba(0,0,0,0.55), 0 0 0 1px rgba(118,228,247,0.3), 0 8px 22px -6px rgba(0,0,0,0.7), 0 0 22px -2px rgba(118,228,247,0.45)",
                      }}
                    >
                      <Icon
                        className="w-[22px] h-[22px]"
                        style={{
                          color: "#CDF6FF",
                          filter: "drop-shadow(0 0 6px rgba(118,228,247,0.85))",
                        }}
                      />
                    </span>

                    <div className="flex-1 min-w-0">
                      <div
                        className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-1"
                        style={{ color: "rgba(118,228,247,0.8)" }}
                      >
                        {eyebrow}
                      </div>
                      <div
                        className="font-bold text-[16px] leading-snug"
                        style={{ color: TITLE }}
                      >
                        {name}
                      </div>
                    </div>
                  </div>

                  <div
                    className="relative text-[12.5px] mt-2.5 leading-relaxed"
                    style={{
                      color: DESC,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {description}
                  </div>

                  {/* progress strip */}
                  <div className="relative mt-3.5 flex items-center gap-2.5">
                    <div
                      className="flex-1 h-[5px] rounded-full overflow-hidden"
                      style={{
                        background: "rgba(0,0,0,0.35)",
                        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)",
                      }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${progress}%`,
                          background:
                            "linear-gradient(90deg, rgba(29,162,195,0.8), #76E4F7)",
                          boxShadow: "0 0 10px rgba(118,228,247,0.7)",
                        }}
                      />
                    </div>
                    <span
                      className="text-[10px] font-semibold tabular-nums"
                      style={{ color: "rgba(118,228,247,0.9)" }}
                    >
                      {progress}%
                    </span>
                  </div>

                  {/* meta footer */}
                  <div
                    className="relative mt-3 pt-2.5 flex items-center gap-2 text-[11px]"
                    style={{
                      color: META,
                      borderTop: "1px solid rgba(118,228,247,0.10)",
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        background: "#76E4F7",
                        boxShadow: "0 0 6px rgba(118,228,247,0.9)",
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
