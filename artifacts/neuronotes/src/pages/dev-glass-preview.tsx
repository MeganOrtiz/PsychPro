import { ChevronRight } from "lucide-react";

// Two locked tones the owner likes: lighter blue (Courses) + darker (Dashboard).
const lightBase =
  "linear-gradient(160deg, hsl(var(--surf-hue) 52% 28% / 0.60), hsl(var(--surf-hue) 54% 18% / 0.72))";
const darkBase =
  "linear-gradient(160deg, hsl(var(--surf-hue) 50% 15% / 0.74), hsl(var(--surf-hue) 55% 8% / 0.84))";

// B + D blend: specular bright rim (B) + inner cyan bloom & deep base (D).
const bloomGloss =
  "radial-gradient(120% 72% at 50% 0%, rgba(118,228,247,0.14) 0%, rgba(118,228,247,0.00) 60%), linear-gradient(180deg, rgba(255,255,255,0.17) 0%, rgba(255,255,255,0.02) 22%, rgba(255,255,255,0.00) 50%)";
const streak =
  "linear-gradient(115deg, transparent 34%, rgba(255,255,255,0.06) 47%, transparent 57%)";

const blendBorder = "rgba(118,228,247,0.32)";
const blendShadow =
  "inset 0 1px 0 rgba(255,255,255,0.22), 0 0 24px -8px rgba(118,228,247,0.26), inset 0 -22px 44px -30px rgba(0,0,0,0.55), 0 20px 46px -26px rgba(0,0,0,0.70)";
const blendBlur = "blur(18px) saturate(122%)";

function GlassCard({ overlay, base }: { overlay: string; base: string }) {
  return (
    <div
      className="rounded-xl p-4 border"
      style={{
        background: `${overlay}, ${base}`,
        borderColor: blendBorder,
        boxShadow: blendShadow,
        backdropFilter: blendBlur,
        WebkitBackdropFilter: blendBlur,
      }}
    >
      <span
        className="block text-[10px] mb-0.5 uppercase tracking-[0.14em]"
        style={{ color: "#76E4F7" }}
      >
        Subjective Measures
      </span>
      <h3 className="font-semibold leading-tight text-white">Objective Measures</h3>
      <p className="text-[12.5px] mt-1 text-white/80 leading-relaxed">
        Standardized, performance-based instruments used in neuropsychological assessment.
      </p>
      <button
        type="button"
        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-white border"
        style={{
          background: `${overlay}, ${base}`,
          borderColor: blendBorder,
          boxShadow: blendShadow,
        }}
      >
        Continue <ChevronRight className="w-3.5 h-3.5" style={{ color: "#76E4F7" }} />
      </button>
    </div>
  );
}

export default function DevGlassPreview() {
  const noStreak = bloomGloss;
  const withStreak = `${streak}, ${bloomGloss}`;
  return (
    <div className="study-page-bg min-h-screen w-full p-8 text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-1">Blend B + D — streak check</h1>
        <p className="text-sm text-white/70 mb-8">
          Specular rim + inner cyan bloom. Top row has NO streak, bottom row adds the diagonal light streak. Left = lighter (Courses), right = darker (Dashboard).
        </p>

        <div className="grid grid-cols-[150px_1fr_1fr] gap-x-5 gap-y-7 items-center">
          <div />
          <div className="text-xs uppercase tracking-wider text-white/60">Light · Courses</div>
          <div className="text-xs uppercase tracking-wider text-white/60">Dark · Dashboard</div>

          <div className="text-sm">
            <div className="font-semibold text-white">Without streak</div>
            <div className="text-[11px] text-white/55 mt-1 leading-snug">Clean bloom + bright rim.</div>
          </div>
          <GlassCard overlay={noStreak} base={lightBase} />
          <GlassCard overlay={noStreak} base={darkBase} />

          <div className="text-sm">
            <div className="font-semibold text-white">With streak</div>
            <div className="text-[11px] text-white/55 mt-1 leading-snug">Adds a diagonal reflection sweep.</div>
          </div>
          <GlassCard overlay={withStreak} base={lightBase} />
          <GlassCard overlay={withStreak} base={darkBase} />
        </div>
      </div>
    </div>
  );
}
