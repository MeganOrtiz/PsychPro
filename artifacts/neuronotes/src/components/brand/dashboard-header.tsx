// =============================================================================
// DashboardHeader — main PsychPro dashboard masthead.
// -----------------------------------------------------------------------------
// Title-only, centered, and visually aligned with the EPPP Suite dashboard.
// =============================================================================
import { STUDY_PALETTE as P } from "@/lib/study-theme";
import dashboardBrain from "@/assets/hero/dashboard-lateral-brain.png";

interface DashboardHeaderProps {
  greeting?: string;
}

export function DashboardHeader({ greeting: _greeting }: DashboardHeaderProps) {
  return (
    <header className="relative mb-4 pt-3 md:mb-5" data-testid="dashboard-header">
      <div
        className="relative flex min-h-[92px] items-center justify-center overflow-hidden rounded-xl border px-4 py-6 text-center md:min-h-[112px] md:px-8"
        style={{
          background: `linear-gradient(135deg, ${P.ink}f2, ${P.surface}f5)`,
          borderColor: `${P.surf}44`,
          boxShadow: `0 18px 54px -42px ${P.surf}cc, inset 0 1px 0 rgba(255,255,255,0.08)`,
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: `url(${dashboardBrain})`,
            backgroundPosition: "center 57%",
            opacity: 0.62,
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 52%, ${P.ink}1f 0%, ${P.ink}9a 55%, ${P.ink}f0 100%), linear-gradient(90deg, ${P.ink}f5, transparent 48%, ${P.ink}f5)`,
          }}
        />
        <h1
          className="relative z-10 font-light leading-none"
          style={{
            fontFamily: '"Outfit", "Inter", system-ui, sans-serif',
            fontSize: "clamp(28px, 3.8vw, 38px)",
            letterSpacing: "0",
            color: P.cloud,
            textShadow: `0 0 18px ${P.ink}, 0 0 28px ${P.surf}42`,
          }}
        >
          PsychPro
        </h1>
      </div>
    </header>
  );
}
