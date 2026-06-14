import { GraduationCap, Lock, LibraryBig, ChevronRight } from "lucide-react";

const cardBg =
  "linear-gradient(180deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.035) 22%, rgba(255,255,255,0.00) 55%), linear-gradient(160deg, hsl(var(--surf-hue) 46% 16% / 0.48), hsl(var(--surf-hue) 52% 9% / 0.66))";
const cardBorder = "rgba(118,228,247,0.22)";
const cardShadow =
  "inset 0 1px 0 0 rgba(255,255,255,0.16), 0 18px 44px -26px rgba(0,0,0,0.70)";
const glassFilter = "blur(18px) saturate(118%)";
const activeBg =
  "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 22%, rgba(255,255,255,0.00) 55%), linear-gradient(160deg, hsl(var(--surf-hue) 58% 24% / 0.58), hsl(var(--surf-hue) 56% 14% / 0.70))";
const unlockedBg = activeBg;

export default function DevGlassPreview() {
  return (
    <div className="study-page-bg min-h-screen w-full p-8 text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-1">Dark Glossy Glass — preview</h1>
        <p className="text-sm text-white/70 mb-8">
          Representative Courses cards &amp; buttons using the new recipe.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* idle category button */}
          <button
            type="button"
            className="group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left border backdrop-blur-md"
            style={{ background: cardBg, borderColor: cardBorder, boxShadow: cardShadow, backdropFilter: glassFilter, WebkitBackdropFilter: glassFilter }}
          >
            <span
              className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center border"
              style={{
                background:
                  "radial-gradient(circle at 50% 40%, rgba(118,228,247,0.18), hsl(var(--surf-hue) 88% 31% / 0.55) 70%)",
                borderColor: "rgba(118,228,247,0.28)",
              }}
            >
              <LibraryBig className="w-4 h-4" style={{ color: "#76E4F7" }} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm" style={{ color: "rgba(244,251,255,0.92)" }}>
                Neuropsychology
              </div>
              <div className="text-[11px] mt-0.5 text-white/60">12 lessons</div>
            </div>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-60" style={{ color: "#76E4F7" }} />
          </button>

          {/* active category button */}
          <button
            type="button"
            className="group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left border backdrop-blur-md"
            style={{
              background: activeBg,
              borderColor: "rgba(118,228,247,0.55)",
              boxShadow:
                "0 14px 34px -14px rgba(118,228,247,0.50), inset 0 1px 0 0 rgba(255,255,255,0.20)",
              backdropFilter: glassFilter,
              WebkitBackdropFilter: glassFilter,
            }}
          >
            <span
              className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center border"
              style={{
                background:
                  "radial-gradient(circle at 50% 40%, rgba(118,228,247,0.18), hsl(var(--surf-hue) 88% 31% / 0.55) 70%)",
                borderColor: "rgba(118,228,247,0.28)",
              }}
            >
              <LibraryBig className="w-4 h-4" style={{ color: "#76E4F7" }} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-white">Assessment (active)</div>
              <div className="text-[11px] mt-0.5 text-white/70">8 lessons</div>
            </div>
            <ChevronRight className="w-4 h-4 opacity-90" style={{ color: "#76E4F7" }} />
          </button>

          {/* shadcn-style bg-card */}
          <div
            className="bg-card rounded-md p-4 border"
            style={{ borderColor: cardBorder }}
          >
            <div className="text-sm font-medium mb-1">.bg-card surface</div>
            <div className="text-[13px] text-white/75 leading-relaxed">
              Shared card recipe used across the app and on the public Terms/Privacy pages.
            </div>
          </div>
        </div>

        {/* lesson cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-md p-4 border backdrop-blur-md"
              style={{ background: cardBg, borderColor: cardBorder, boxShadow: cardShadow, backdropFilter: glassFilter, WebkitBackdropFilter: glassFilter }}
            >
              <span className="block text-[11px] mb-0.5 uppercase tracking-wider" style={{ color: "#76E4F7" }}>
                Subjective Measures
              </span>
              <h3 className="font-semibold leading-tight">Personality Inventories</h3>
              <p className="text-[13px] line-clamp-2 mt-1 text-white/80 leading-relaxed">
                MMPI, MCMI, and projective techniques — administration, scoring, and interpretation.
              </p>
            </div>
          ))}
        </div>

        {/* mastery buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            className="group relative w-full flex items-center gap-4 px-4 py-4 rounded-md text-left border backdrop-blur-md"
            style={{
              background: cardBg,
              borderColor: cardBorder,
              boxShadow: cardShadow,
              opacity: 0.85,
            }}
          >
            <span
              className="w-11 h-11 shrink-0 rounded-lg flex items-center justify-center border"
              style={{
                background:
                  "radial-gradient(circle at 50% 40%, rgba(118,228,247,0.18), hsl(var(--surf-hue) 88% 31% / 0.55) 70%)",
                borderColor: "rgba(118,228,247,0.28)",
              }}
            >
              <Lock className="w-5 h-5" style={{ color: "#76E4F7" }} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm md:text-base">Course Mastery Exam (locked)</div>
              <div className="text-[11px] md:text-xs mt-0.5 text-white/60">Pass every lesson to unlock</div>
            </div>
          </button>

          <button
            type="button"
            className="group relative w-full flex items-center gap-4 px-4 py-4 rounded-md text-left border backdrop-blur-md"
            style={{
              background: unlockedBg,
              borderColor: "rgba(118,228,247,0.55)",
              boxShadow:
                "0 16px 38px -14px rgba(118,228,247,0.50), inset 0 1px 0 0 rgba(255,255,255,0.20)",
              backdropFilter: glassFilter,
              WebkitBackdropFilter: glassFilter,
            }}
          >
            <span
              className="w-11 h-11 shrink-0 rounded-lg flex items-center justify-center border"
              style={{
                background:
                  "radial-gradient(circle at 50% 40%, rgba(118,228,247,0.18), hsl(var(--surf-hue) 88% 31% / 0.55) 70%)",
                borderColor: "rgba(118,228,247,0.28)",
              }}
            >
              <GraduationCap className="w-5 h-5" style={{ color: "#76E4F7" }} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm md:text-base text-white">Course Mastery Exam (unlocked)</div>
              <div className="text-[11px] md:text-xs mt-0.5 text-white/70">Ready — take the exam</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
