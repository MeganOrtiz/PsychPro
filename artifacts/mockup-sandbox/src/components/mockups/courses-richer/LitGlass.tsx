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

export function LitGlass() {
  return (
    <div className="lg-root min-h-screen w-full" style={{ background: PAGE_BG }}>
      <style>{`
        /* Thick lit glass — fine grain texture via fractal noise data-uri */
        .lg-root {
          --lg-noise: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
        }

        .lg-card {
          position: relative;
          isolation: isolate;
          border-radius: 20px;
          /* the glass body: layered cyan tint with a top-lit gradient */
          background:
            linear-gradient(180deg, rgba(118,228,247,0.16) 0%, rgba(118,228,247,0.02) 18%, rgba(8,55,68,0.0) 46%),
            radial-gradient(120% 90% at 86% 6%, rgba(118,228,247,0.22), rgba(118,228,247,0) 52%),
            linear-gradient(160deg, hsl(192 86% 22% / 0.78), hsl(192 90% 13% / 0.9));
          border: 1px solid rgba(196,232,242,0.16);
          backdrop-filter: blur(22px) saturate(150%);
          -webkit-backdrop-filter: blur(22px) saturate(150%);
          /* thickness: bright top specular inner-line, bright cyan rim on left, dark crisp inner shadow at bottom, soft outer corona + deep drop */
          box-shadow:
            inset 0 1.5px 0 rgba(244,251,255,0.55),
            inset 1.5px 0 0 rgba(118,228,247,0.45),
            inset 0 -18px 26px -20px rgba(0,8,12,0.95),
            inset 0 -1.5px 0 rgba(3,18,24,0.7),
            inset 0 0 50px -26px rgba(118,228,247,0.5),
            0 0 34px -8px rgba(118,228,247,0.34),
            0 30px 60px -38px rgba(0,0,0,0.85);
          transition: transform 280ms cubic-bezier(.2,.7,.2,1), box-shadow 280ms cubic-bezier(.2,.7,.2,1);
        }

        /* sweeping specular highlight across the TOP edge */
        .lg-card::before {
          content: "";
          position: absolute;
          inset: 1px 1px auto 1px;
          height: 46%;
          border-radius: 19px 19px 40% 40% / 19px 19px 100% 100%;
          background: linear-gradient(180deg, rgba(244,251,255,0.22) 0%, rgba(150,235,250,0.07) 38%, rgba(255,255,255,0) 100%);
          pointer-events: none;
          z-index: 1;
          mix-blend-mode: screen;
        }

        /* grain texture overlay for material life */
        .lg-card::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 20px;
          background-image: var(--lg-noise);
          background-size: 160px 160px;
          opacity: 0.05;
          mix-blend-mode: overlay;
          pointer-events: none;
          z-index: 2;
        }

        .lg-card:hover {
          transform: translateY(-4px);
          box-shadow:
            inset 0 1.5px 0 rgba(244,251,255,0.7),
            inset 1.5px 0 0 rgba(118,228,247,0.6),
            inset 0 -18px 26px -20px rgba(0,8,12,0.95),
            inset 0 -1.5px 0 rgba(3,18,24,0.7),
            inset 0 0 56px -22px rgba(118,228,247,0.62),
            0 0 48px -6px rgba(118,228,247,0.5),
            0 40px 72px -36px rgba(0,0,0,0.9);
        }

        .lg-card-content { position: relative; z-index: 3; }

        /* icon medallion: domed glass chip */
        .lg-chip {
          position: relative;
          background:
            radial-gradient(circle at 50% 28%, rgba(244,251,255,0.4), rgba(118,228,247,0.22) 40%, hsl(192 88% 26% / 0.6) 78%);
          border: 1px solid rgba(118,228,247,0.4);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.55),
            inset 0 -6px 10px -6px rgba(0,10,14,0.8),
            0 4px 12px -4px rgba(118,228,247,0.4);
        }

        /* rail items */
        .lg-rail-item {
          position: relative;
          border-radius: 11px;
          border: 1px solid rgba(118,228,247,0.14);
          background: rgba(118,228,247,0.035);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease, background 220ms ease;
        }
        .lg-rail-item:hover {
          transform: translateX(2px);
          border-color: rgba(118,228,247,0.3);
          background: rgba(118,228,247,0.07);
        }
        .lg-rail-item.is-active {
          border-color: rgba(118,228,247,0.55);
          background:
            linear-gradient(180deg, rgba(118,228,247,0.14) 0%, rgba(118,228,247,0.0) 40%),
            linear-gradient(160deg, hsl(192 86% 24% / 0.8), hsl(192 90% 14% / 0.9));
          box-shadow:
            inset 0 1.5px 0 rgba(244,251,255,0.5),
            inset 1.5px 0 0 rgba(118,228,247,0.45),
            inset 0 -10px 16px -14px rgba(0,8,12,0.9),
            inset 0 0 32px -18px rgba(118,228,247,0.55),
            0 0 24px -8px rgba(118,228,247,0.32),
            0 16px 36px -26px rgba(0,0,0,0.8);
        }
        .lg-rail-item.is-active::before {
          content: "";
          position: absolute;
          inset: 1px 1px auto 1px;
          height: 50%;
          border-radius: 10px 10px 50% 50% / 10px 10px 100% 100%;
          background: linear-gradient(180deg, rgba(244,251,255,0.16), rgba(255,255,255,0) 100%);
          pointer-events: none;
          mix-blend-mode: screen;
        }
      `}</style>

      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <div className="mb-6">
          <h1
            className="text-2xl md:text-3xl font-semibold tracking-tight"
            style={{
              color: "#F4FBFF",
              textShadow: "0 0 22px rgba(118,228,247,0.28)",
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
                  className={`lg-rail-item w-full flex items-center gap-3 px-3 py-2.5 ${
                    active ? "is-active" : ""
                  }`}
                >
                  <span className="lg-chip w-9 h-9 shrink-0 rounded-lg flex items-center justify-center">
                    <Icon
                      className="w-4 h-4"
                      style={{
                        color: "#CFF6FF",
                        filter: "drop-shadow(0 0 4px rgba(118,228,247,0.7))",
                      }}
                    />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-medium text-sm leading-snug"
                      style={{
                        color: active ? "#F4FBFF" : "rgba(244,251,255,0.88)",
                      }}
                    >
                      {c}
                    </div>
                  </div>
                  {active && (
                    <ChevronRight
                      className="w-4 h-4 shrink-0"
                      style={{
                        color: "#76E4F7",
                        filter: "drop-shadow(0 0 4px rgba(118,228,247,0.7))",
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
              <div key={name} className="lg-card">
                <div className="lg-card-content flex items-start gap-3.5 px-4 py-4 text-left">
                  <span className="lg-chip w-11 h-11 shrink-0 rounded-xl flex items-center justify-center">
                    <Icon
                      className="w-5 h-5"
                      style={{
                        color: "#E2FAFF",
                        filter: "drop-shadow(0 0 6px rgba(118,228,247,0.85))",
                      }}
                    />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-semibold text-[15px] leading-snug"
                      style={{
                        color: "#F4FBFF",
                        textShadow: "0 1px 8px rgba(0,12,16,0.5)",
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
                      className="flex items-center gap-2 text-[11px] mt-2.5 pt-2.5"
                      style={{
                        color: "rgba(159,206,220,0.85)",
                        borderTop: "1px solid rgba(118,228,247,0.12)",
                      }}
                    >
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full"
                        style={{
                          background: "#76E4F7",
                          boxShadow: "0 0 6px rgba(118,228,247,0.9)",
                        }}
                      />
                      Practice exam · 90% to pass
                    </div>
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
