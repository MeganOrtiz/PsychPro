import { ChevronRight } from "lucide-react";

// Two locked tones the owner likes: lighter blue (Courses) + darker (Dashboard).
const lightBase =
  "linear-gradient(160deg, hsl(var(--surf-hue) 52% 28% / 0.60), hsl(var(--surf-hue) 54% 18% / 0.72))";
const darkBase =
  "linear-gradient(160deg, hsl(var(--surf-hue) 50% 15% / 0.74), hsl(var(--surf-hue) 55% 8% / 0.84))";

type Treatment = {
  name: string;
  desc: string;
  overlay: string;
  border: string;
  shadow: string;
  blur: string;
};

// Four ways to "upgrade the flatness" — all kept readable (opaque enough).
const treatments: Treatment[] = [
  {
    name: "A · Frosted Sheen",
    desc: "Subtle top gloss + soft lift. Clean, understated.",
    overlay:
      "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.00) 42%)",
    border: "rgba(118,228,247,0.20)",
    shadow:
      "inset 0 1px 0 rgba(255,255,255,0.14), 0 14px 32px -22px rgba(0,0,0,0.62)",
    blur: "blur(16px) saturate(115%)",
  },
  {
    name: "B · Specular Edge",
    desc: "Bright rim + a diagonal light streak. Shiny, premium.",
    overlay:
      "linear-gradient(115deg, transparent 32%, rgba(255,255,255,0.07) 46%, transparent 56%), linear-gradient(180deg, rgba(255,255,255,0.17) 0%, rgba(255,255,255,0.02) 22%, rgba(255,255,255,0.00) 50%)",
    border: "rgba(118,228,247,0.34)",
    shadow:
      "inset 0 1px 0 rgba(255,255,255,0.24), 0 0 24px -8px rgba(118,228,247,0.28), 0 16px 36px -22px rgba(0,0,0,0.66)",
    blur: "blur(18px) saturate(125%)",
  },
  {
    name: "C · Beveled Glass",
    desc: "Raised, tactile edges (light top, shadow bottom).",
    overlay:
      "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.00) 40%)",
    border: "rgba(118,228,247,0.24)",
    shadow:
      "inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.38), inset 1px 0 0 rgba(255,255,255,0.06), inset -1px 0 0 rgba(0,0,0,0.22), 0 18px 38px -24px rgba(0,0,0,0.70)",
    blur: "blur(16px) saturate(118%)",
  },
  {
    name: "D · Inner Bloom",
    desc: "Luminous cyan top fading to a deep base. Dimensional.",
    overlay:
      "radial-gradient(120% 72% at 50% 0%, rgba(118,228,247,0.13) 0%, rgba(118,228,247,0.00) 60%), linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.00) 44%)",
    border: "rgba(118,228,247,0.26)",
    shadow:
      "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -22px 44px -30px rgba(0,0,0,0.60), 0 20px 46px -26px rgba(0,0,0,0.72)",
    blur: "blur(18px) saturate(120%)",
  },
];

function GlassCard({ t, base }: { t: Treatment; base: string }) {
  return (
    <div
      className="rounded-xl p-4 border"
      style={{
        background: `${t.overlay}, ${base}`,
        borderColor: t.border,
        boxShadow: t.shadow,
        backdropFilter: t.blur,
        WebkitBackdropFilter: t.blur,
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
          background: `${t.overlay}, ${base}`,
          borderColor: t.border,
          boxShadow: t.shadow,
        }}
      >
        Continue <ChevronRight className="w-3.5 h-3.5" style={{ color: "#76E4F7" }} />
      </button>
    </div>
  );
}

export default function DevGlassPreview() {
  return (
    <div className="study-page-bg min-h-screen w-full p-8 text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-1">Glass treatments — pick one</h1>
        <p className="text-sm text-white/70 mb-8">
          Same content, four ways to add depth. Left column = lighter blue (Courses), right = darker (Dashboard).
        </p>

        <div className="grid grid-cols-[120px_1fr_1fr] gap-x-5 gap-y-6 items-center">
          <div />
          <div className="text-xs uppercase tracking-wider text-white/60">Light · Courses</div>
          <div className="text-xs uppercase tracking-wider text-white/60">Dark · Dashboard</div>

          {treatments.map((t) => (
            <FragmentRow key={t.name} t={t} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FragmentRow({ t }: { t: Treatment }) {
  return (
    <>
      <div className="text-sm">
        <div className="font-semibold text-white">{t.name}</div>
        <div className="text-[11px] text-white/55 mt-1 leading-snug">{t.desc}</div>
      </div>
      <GlassCard t={t} base={lightBase} />
      <GlassCard t={t} base={darkBase} />
    </>
  );
}
