// =============================================================================
// DashboardHeader — dashboard-LOCAL styled banner around the protected
// BrandBanner wordmark.
//
// Concept: "Synaptic Aurora". A compact, living header — slow-drifting cyan
// auroras, a field of twinkling synapse dots, and a periodic light-sweep — that
// turns the static glass card into something that quietly breathes. It renders
// the canonical, protected <BrandBanner/> untouched, so the wordmark, the
// "learn. expand. connect." tagline, and the "Welcome back, {name}." /
// "Welcome back." greeting rules are preserved exactly (pass greeting={undefined}
// while the profile loads so only the wordmark + tagline show).
//
// All brand colors come from STUDY_PALETTE — locked cerulean #76E4F7 family,
// never mint. Every decorative layer is pointer-events-none and sits behind
// the BrandBanner (z-10). Animations are scoped under .dashhdr-* in index.css
// and disabled under prefers-reduced-motion.
// =============================================================================
import { BrandBanner } from "@/components/brand/brand-banner";
import { STUDY_PALETTE as P } from "@/lib/study-theme";

interface DashboardHeaderProps {
  greeting?: string;
}

// Hand-placed synapse positions (% of the banner box). Staggered delays/durations
// keep the twinkle from looking like a synced grid.
const SYNAPSE_DOTS: Array<{ left: string; top: string; delay: string; dur: string }> = [
  { left: "9%", top: "30%", delay: "0s", dur: "3.2s" },
  { left: "19%", top: "68%", delay: "1.1s", dur: "4.1s" },
  { left: "31%", top: "22%", delay: "2.0s", dur: "3.6s" },
  { left: "73%", top: "26%", delay: "0.6s", dur: "3.9s" },
  { left: "84%", top: "64%", delay: "1.7s", dur: "3.3s" },
  { left: "92%", top: "38%", delay: "2.4s", dur: "4.3s" },
];

export function DashboardHeader({ greeting }: DashboardHeaderProps) {
  return (
    <header className="relative mb-5 md:mb-6" data-testid="dashboard-header">
      <div
        className="dashhdr-card relative mx-auto max-w-2xl overflow-hidden px-6 pt-1 pb-3 md:px-10 md:pt-2 md:pb-4"
      >
        {/* Aurora field — two slow, independently drifting cyan blooms that bleed
            in from the top corners. Reads as ambient, shifting depth. */}
        <div
          aria-hidden
          className="dashhdr-aurora dashhdr-aurora-a pointer-events-none absolute"
          style={{ background: `radial-gradient(circle, ${P.surf}33 0%, transparent 68%)` }}
        />
        <div
          aria-hidden
          className="dashhdr-aurora dashhdr-aurora-b pointer-events-none absolute"
          style={{ background: `radial-gradient(circle, ${P.teal}2b 0%, transparent 70%)` }}
        />

        {/* Synapse dots — tiny cyan nodes that twinkle on staggered timers, a
            subtle nod to the neural / "connect" theme without being literal. */}
        {SYNAPSE_DOTS.map((d, i) => (
          <span
            key={i}
            aria-hidden
            className="dashhdr-dot pointer-events-none"
            style={{ left: d.left, top: d.top, animationDelay: d.delay, animationDuration: d.dur }}
          />
        ))}

        {/* Light-sweep — a soft sheen that crosses the banner on a long loop,
            catching the wordmark like a passing reflection on glass. */}
        <span aria-hidden className="dashhdr-sweep pointer-events-none absolute inset-0" />

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
