// =============================================================================
// DashboardHeader — main PsychPro dashboard masthead.
// -----------------------------------------------------------------------------
// Title-only, centered. Black-foundation reset (2026-07-09): flat neutral
// panel, no artwork, no glow.
// =============================================================================
import { STUDY_PALETTE as P } from "@/lib/study-theme";

interface DashboardHeaderProps {
  greeting?: string;
}

export function DashboardHeader({ greeting: _greeting }: DashboardHeaderProps) {
  return (
    <header className="relative mb-4 pt-3 md:mb-5" data-testid="dashboard-header">
      <div
        className="relative flex min-h-[92px] items-center justify-center overflow-hidden rounded-xl border px-4 py-6 text-center md:min-h-[112px] md:px-8"
        style={{
          background: P.surface,
          borderColor: "var(--pp-line)",
        }}
      >
        <h1
          className="relative z-10 font-light leading-none"
          style={{
            fontFamily: '"Outfit", "Inter", system-ui, sans-serif',
            fontSize: "clamp(28px, 3.8vw, 38px)",
            letterSpacing: "0",
            color: P.cloud,
          }}
        >
          PsychPro
        </h1>
      </div>
    </header>
  );
}
