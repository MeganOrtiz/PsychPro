// =============================================================================
// DashboardHeader — dashboard-LOCAL styled banner around the protected
// BrandBanner wordmark.
//
// This component owns ONLY the decorative framing for the dashboard's top
// header: a contained glass banner, a refined cyan bloom, a hairline top
// accent, and a soft separator beneath. It renders the canonical, protected
// <BrandBanner/> untouched, so the wordmark, the "learn. expand. connect."
// tagline, and the "Welcome back, {name}." / "Welcome back." greeting rules
// are preserved exactly (pass greeting={undefined} while the profile loads so
// only the wordmark + tagline show).
//
// All brand colors come from STUDY_PALETTE — locked cerulean #76E4F7 family,
// never mint. Every decorative layer is pointer-events-none and sits behind
// the BrandBanner (z-10).
// =============================================================================
import { BrandBanner } from "@/components/brand/brand-banner";
import { STUDY_PALETTE as P } from "@/lib/study-theme";

interface DashboardHeaderProps {
  greeting?: string;
}

export function DashboardHeader({ greeting }: DashboardHeaderProps) {
  return (
    <header className="relative mb-6 md:mb-8" data-testid="dashboard-header">
      <div
        className="relative mx-auto max-w-2xl overflow-hidden rounded-[26px] px-6 py-8 md:px-12 md:py-10"
        style={{
          background: `linear-gradient(160deg, rgba(10,45,61,0.50) 0%, rgba(6,28,40,0.60) 100%)`,
          border: `1px solid ${P.surf}24`,
          backdropFilter: "blur(20px) saturate(130%)",
          WebkitBackdropFilter: "blur(20px) saturate(130%)",
          boxShadow: `inset 0 1px 0 rgba(167,243,255,0.08), 0 26px 60px -34px rgba(0,0,0,0.7), 0 0 44px -14px ${P.surf}1f`,
        }}
      >
        {/* Top hairline accent — a thin cyan rule that catches the eye and
            gives the banner a crafted, finished edge. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-10 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${P.surf}73, transparent)`,
          }}
        />
        {/* Refined bloom — a single soft cyan core centered on the wordmark.
            Reads as ambient depth rather than a flat wash or hard spotlight. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "min(540px, 92%)",
            height: "220px",
            background: `radial-gradient(58% 60% at 50% 44%, ${P.surf}24 0%, ${P.teal}10 42%, transparent 74%)`,
            filter: "blur(8px)",
          }}
        />
        <BrandBanner size="lg" greeting={greeting} className="relative z-10" />
      </div>
      {/* Separator — a faint cyan-to-transparent rule that closes the banner
          off from the content grid below so the header feels deliberate. */}
      <span
        aria-hidden
        className="pointer-events-none mx-auto mt-5 block h-px w-40 md:w-56"
        style={{
          background: `linear-gradient(90deg, transparent, ${P.surf}3d, transparent)`,
        }}
      />
    </header>
  );
}
