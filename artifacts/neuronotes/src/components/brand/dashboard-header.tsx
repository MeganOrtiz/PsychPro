// =============================================================================
// DashboardHeader — main PsychPro dashboard title block.
// -----------------------------------------------------------------------------
// The dashboard needs a clear product title at the top. The previous decorative
// banner made the page feel busy but flat; this version keeps the brand present
// while letting the actual study surfaces do the work.
// =============================================================================
import { STUDY_PALETTE as P } from "@/lib/study-theme";

interface DashboardHeaderProps {
  greeting?: string;
}

export function DashboardHeader({ greeting }: DashboardHeaderProps) {
  return (
    <header className="relative mb-5 pt-5 md:mb-6" data-testid="dashboard-header">
      <div
        className="relative overflow-hidden rounded-xl border px-5 py-4 md:px-6 md:py-5"
        style={{
          background: `linear-gradient(135deg, ${P.surfaceElev}d9, ${P.surface}f2)`,
          borderColor: `${P.surf}29`,
          boxShadow: `0 24px 70px -46px ${P.surf}99, inset 0 1px 0 rgba(255,255,255,0.06)`,
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1"
          style={{ background: `linear-gradient(180deg, ${P.surf}, ${P.teal})` }}
        />
        <p
          className="mb-1 text-[11px] font-semibold uppercase tracking-[0.22em]"
          style={{ color: `${P.surf}cc` }}
        >
          Main Dashboard
        </p>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1
              className="font-light leading-none"
              style={{
                fontFamily: '"Outfit", "Inter", system-ui, sans-serif',
                fontSize: "clamp(34px, 5vw, 58px)",
                letterSpacing: "0",
                color: P.cloud,
                textShadow: `0 0 28px ${P.surf}24`,
              }}
            >
              PsychPro
            </h1>
            <p className="mt-2 text-sm" style={{ color: `${P.mist}c7` }}>
              {greeting ?? "Welcome back."}
            </p>
          </div>
          <p
            className="max-w-md text-sm leading-relaxed md:text-right"
            style={{ color: `${P.mist}a8` }}
          >
            Your study hub for progress, practice, custom tools, and clinical
            learning.
          </p>
        </div>
      </div>
      <span
        aria-hidden
        className="pointer-events-none mt-4 block h-px w-full"
        style={{
          background: `linear-gradient(90deg, ${P.surf}33, transparent)`,
        }}
      />
    </header>
  );
}
