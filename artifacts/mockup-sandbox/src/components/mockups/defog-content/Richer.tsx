import { TrendingUp, Sparkles, BookOpen, Brain, ChevronRight, ArrowUpRight, Trophy } from "lucide-react";

const MIST = "#e2f4fa";
const MIST_SOFT = "rgba(200,236,246,0.70)";
const TEAL_DEEP = "#76E4F7";

const sectionStyle: React.CSSProperties = {
  background:
    "radial-gradient(125% 88% at 50% -6%, rgba(118,228,247,0.18) 0%, rgba(118,228,247,0.00) 60%), linear-gradient(150deg, hsl(var(--surf-hue) 96% 19% / 0.97), hsl(193 97% 9% / 0.995))",
  borderColor: "rgba(150,224,247,0.34)",
  backdropFilter: "blur(5px) saturate(155%)",
  WebkitBackdropFilter: "blur(5px) saturate(155%)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.16), inset 0 0 52px -24px rgba(118,228,247,0.42), 0 0 26px -8px rgba(118,228,247,0.26), 0 24px 56px -40px rgba(0,0,0,0.82)",
};

const tileStyle: React.CSSProperties = {
  background:
    "radial-gradient(125% 90% at 50% -8%, rgba(118,228,247,0.22) 0%, rgba(118,228,247,0.00) 62%), linear-gradient(150deg, hsl(var(--surf-hue) 95% 26% / 0.96), hsl(193 96% 15% / 0.99))",
  borderColor: "rgba(150,224,247,0.40)",
  backdropFilter: "blur(5px) saturate(155%)",
  WebkitBackdropFilter: "blur(5px) saturate(155%)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.18), inset 0 0 46px -22px rgba(118,228,247,0.46), 0 0 24px -8px rgba(118,228,247,0.30), 0 16px 42px -30px rgba(0,0,0,0.76)",
};

export function Richer() {
  return (
    <div
      style={{ ["--surf-hue" as any]: "192" }}
      className="relative min-h-screen w-full overflow-hidden p-7"
    >
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: -2,
          backgroundColor: "#05252d",
          backgroundImage:
            "radial-gradient(ellipse 130% 100% at 50% 34%, hsl(var(--surf-hue) 90% 7% / 0.00) 60%, hsl(var(--surf-hue) 93% 5% / 0.55) 100%), url('/__mockup/images/app-smoke.jpg')",
          backgroundSize: "cover, cover",
          backgroundPosition: "center top, center top",
          backgroundRepeat: "no-repeat, no-repeat",
          filter: "saturate(1.32) contrast(1.12) brightness(0.9)",
        }}
      />
      <p className="mb-4 text-xs font-semibold tracking-[0.2em]" style={{ color: MIST_SOFT }}>
        RICHER PIGMENT — LUMINOUS GLASS
      </p>
      <div className="space-y-5">
        <section className="relative rounded-2xl border p-5" style={sectionStyle}>
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" style={{ color: TEAL_DEEP }} />
            <h2 className="font-semibold" style={{ color: MIST }}>Continue Your Journey</h2>
          </div>
          <div className="mb-2 flex items-center justify-between">
            <p className="font-medium" style={{ color: MIST }}>Objective Measures</p>
            <span className="text-sm font-semibold" style={{ color: TEAL_DEEP }}>8%</span>
          </div>
          <div className="mb-4 h-2 overflow-hidden rounded-full" style={{ background: "hsl(var(--surf-hue) 78% 48% / 0.18)" }}>
            <div className="h-full" style={{ width: "8%", background: `linear-gradient(90deg, ${TEAL_DEEP}, #b8f1fb)` }} />
          </div>
          <button className="inline-flex items-center gap-1 rounded-md px-5 py-2 text-sm font-semibold" style={{ background: "rgba(118,228,247,0.20)", color: MIST, border: "1px solid rgba(118,228,247,0.42)" }}>
            Continue Studying <ArrowUpRight className="h-4 w-4" />
          </button>
        </section>

        <section className="relative rounded-2xl border p-5" style={sectionStyle}>
          <div className="mb-4">
            <h2 className="font-semibold" style={{ color: MIST }}>Recommended for You</h2>
            <p className="mt-1 text-xs" style={{ color: MIST_SOFT }}>Based on your goals and progress</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Sparkles, name: "Objective Measures", hint: "Expand your knowledge" },
              { icon: BookOpen, name: "Apraxia & Agnosia", hint: "Strengthen your foundation" },
              { icon: Brain, name: "Acceptance & Mindfulness", hint: "Sharpen your skills" },
              { icon: TrendingUp, name: "ADHD & Medications", hint: "Level up next" },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.name} className="flex items-center gap-3 rounded-md border p-3" style={tileStyle}>
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border" style={{ background: "rgba(118,228,247,0.16)", borderColor: "rgba(118,228,247,0.36)" }}>
                    <Icon className="h-4 w-4" style={{ color: TEAL_DEEP }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold" style={{ color: MIST }}>{t.name}</p>
                    <p className="truncate text-xs" style={{ color: MIST_SOFT }}>{t.hint}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 flex-shrink-0" style={{ color: TEAL_DEEP }} />
                </div>
              );
            })}
          </div>
        </section>

        <section className="relative rounded-2xl border p-5" style={sectionStyle}>
          <div className="mb-3 flex items-center gap-2">
            <Trophy className="h-4 w-4" style={{ color: TEAL_DEEP }} />
            <h2 className="font-semibold" style={{ color: MIST }}>Leaderboard</h2>
          </div>
          <div className="space-y-2">
            {["Scholar 0749", "Scholar 1785", "Scholar 5789", "Scholar 7135"].map((s, i) => (
              <div key={s} className="flex items-center gap-3 text-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: "rgba(118,228,247,0.20)", color: TEAL_DEEP }}>{i + 1}</span>
                <span style={{ color: MIST }}>{s}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
