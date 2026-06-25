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

export type CardRecipe = {
  background: string;
  border: string;
  borderRadius: number;
  backdropFilter: string;
  boxShadow: string;
};

export const LESSONS: { name: string; description: string; Icon: LucideIcon }[] = [
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

export const COURSES = [
  "Foundations",
  "Biological Bases",
  "Cognitive-Affective",
  "Social & Cultural",
  "Developmental",
  "Assessment",
];

const PAGE_BG =
  "radial-gradient(1100px 700px at 78% -8%, rgba(118,228,247,0.10), rgba(118,228,247,0) 60%), radial-gradient(900px 600px at 12% 8%, rgba(29,162,195,0.12), rgba(29,162,195,0) 58%), linear-gradient(180deg, #06303d 0%, #05252d 55%, #041d24 100%)";

export function CoursesShell({ recipe }: { recipe: CardRecipe }) {
  return (
    <div className="min-h-screen w-full" style={{ background: PAGE_BG }}>
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <div className="mb-6">
          <h1
            className="text-2xl md:text-3xl font-semibold tracking-tight"
            style={{ color: "#F4FBFF" }}
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
              const Icon = i === 0 ? GraduationCap : LibraryBig;
              return (
                <div
                  key={c}
                  className="relative w-full flex items-center gap-3 px-3 py-2.5 border"
                  style={{
                    borderRadius: 10,
                    background: active ? recipe.background : "rgba(118,228,247,0.04)",
                    borderColor: active ? "rgba(118,228,247,0.55)" : "rgba(118,228,247,0.16)",
                    boxShadow: active ? recipe.boxShadow : "none",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <span
                    className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center border"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 40%, rgba(118,228,247,0.18), hsl(192 88% 31% / 0.55) 70%)",
                      borderColor: "rgba(118,228,247,0.28)",
                    }}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{
                        color: "#76E4F7",
                        filter: "drop-shadow(0 0 3px rgba(118,228,247,0.5))",
                      }}
                    />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-medium text-sm leading-snug"
                      style={{ color: active ? "#F4FBFF" : "rgba(244,251,255,0.9)" }}
                    >
                      {c}
                    </div>
                  </div>
                  {active && (
                    <ChevronRight className="w-4 h-4 shrink-0" style={{ color: "#76E4F7" }} />
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
                className="relative w-full flex items-start gap-3 px-4 py-4 border text-left"
                style={{
                  background: recipe.background,
                  borderColor: recipe.border,
                  borderRadius: recipe.borderRadius,
                  backdropFilter: recipe.backdropFilter,
                  WebkitBackdropFilter: recipe.backdropFilter,
                  boxShadow: recipe.boxShadow,
                  borderWidth: 1,
                  borderStyle: "solid",
                }}
              >
                <span
                  className="w-11 h-11 shrink-0 rounded-lg flex items-center justify-center border"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 40%, rgba(118,228,247,0.18), hsl(192 88% 31% / 0.55) 70%)",
                    borderColor: "rgba(118,228,247,0.28)",
                  }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{
                      color: "#76E4F7",
                      filter: "drop-shadow(0 0 5px rgba(118,228,247,0.7))",
                    }}
                  />
                </span>
                <div className="flex-1 min-w-0">
                  <div
                    className="font-semibold text-[15px] leading-snug"
                    style={{ color: "#F4FBFF" }}
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
                    className="text-[11px] mt-2"
                    style={{ color: "rgba(159,206,220,0.85)" }}
                  >
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
