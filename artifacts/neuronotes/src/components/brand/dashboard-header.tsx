// =============================================================================
// DashboardHeader — main PsychPro dashboard masthead.
// -----------------------------------------------------------------------------
// Title-only, centered, and visually aligned with the EPPP Suite dashboard.
// =============================================================================
import { STUDY_PALETTE as P } from "@/lib/study-theme";
import dashboardBrain from "@/assets/hero/dashboard-superior-brain.png";

interface DashboardHeaderProps {
  greeting?: string;
}

export function DashboardHeader({ greeting: _greeting }: DashboardHeaderProps) {
  return (
    <header className="relative mb-6 pt-5 md:mb-8" data-testid="dashboard-header">
      <div
        className="relative flex min-h-[260px] items-center justify-center overflow-hidden rounded-2xl border px-6 py-12 text-center md:min-h-[330px] md:px-10"
        style={{
          background: `linear-gradient(135deg, ${P.ink}f2, ${P.surface}f5)`,
          borderColor: `${P.surf}55`,
          boxShadow: `0 30px 90px -54px ${P.surf}cc, inset 0 1px 0 rgba(255,255,255,0.08)`,
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{ backgroundImage: `url(${dashboardBrain})` }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${P.ink}2e 0%, ${P.ink}a6 52%, ${P.ink}ee 100%), linear-gradient(90deg, ${P.ink}f2, transparent 48%, ${P.ink}f2)`,
          }}
        />
        <h1
          className="relative z-10 font-light leading-none"
          style={{
            fontFamily: '"Outfit", "Inter", system-ui, sans-serif',
            fontSize: "clamp(48px, 8vw, 96px)",
            letterSpacing: "0",
            color: P.cloud,
            textShadow: `0 0 22px ${P.ink}, 0 0 38px ${P.surf}55`,
          }}
        >
          PsychPro
        </h1>
      </div>
    </header>
  );
}
