import { BookOpen, Compass } from "lucide-react";
import { styles } from "@/pages/landing";

const COLS = [
  { label: "Idle", cls: "" },
  { label: "Hover", cls: "is-hover" },
  { label: "Active (pressed)", cls: "is-active" },
];

export default function DevCtaPreview() {
  return (
    <div className="study-page-bg min-h-screen w-full p-10 text-white">
      <style>{styles}</style>
      <div className="max-w-5xl mx-auto landing-root" style={{ minHeight: 0 }}>
        <h1 className="text-2xl font-semibold mb-1">Landing CTA Glow — state review</h1>
        <p className="text-sm text-white/70 mb-10">
          Idle / hover / pressed for both CTAs. Hover &amp; active are forced via classes
          so the glow is visible in a static screenshot.
        </p>

        <div className="grid grid-cols-[150px_1fr_1fr_1fr] gap-x-6 gap-y-10 items-center">
          <div />
          {COLS.map((c) => (
            <div
              key={c.label}
              className="text-xs uppercase tracking-wider text-white/60"
            >
              {c.label}
            </div>
          ))}

          <div className="text-sm font-semibold">Primary · JOIN NOW</div>
          {COLS.map((c) => (
            <div key={c.label}>
              <button
                type="button"
                className={`landing-cta landing-cta-primary ${c.cls}`}
              >
                <BookOpen className="landing-cta-icon" aria-hidden />
                <span>JOIN NOW</span>
              </button>
            </div>
          ))}

          <div className="text-sm font-semibold">Ghost · BROWSE COURSES</div>
          {COLS.map((c) => (
            <div key={c.label}>
              <button
                type="button"
                className={`landing-cta landing-cta-ghost ${c.cls}`}
              >
                <Compass className="landing-cta-icon" aria-hidden />
                <span>BROWSE COURSES</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
