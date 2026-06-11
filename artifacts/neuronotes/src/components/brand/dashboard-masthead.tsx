// =============================================================================
// DashboardMasthead — cinematic brand banner for the main-site dashboard.
// -----------------------------------------------------------------------------
// Renders the PsychPro artwork (wordmark + "learn. expand. connect." + glowing
// brain) as a slim, centered masthead whose smoke edges feather into the
// deep-cerulean page so there is no hard rectangle/seam. The personalized
// greeting sits just beneath it.
//
// NOTES / GUARDRAILS:
//   - This is a CONTAINED masthead, not a full-page wallpaper — it does not
//     violate the dashboard's "no competing wallpaper" rule.
//   - The wordmark here is baked into the image (pixels), so this is NOT an
//     inline <h1>PSYCHPRO</h1> and does not conflict with BrandBanner.
//   - Greeting rule (mirrors BrandBanner): with a name -> "Welcome back, {name}."
//     without a name -> "Welcome back."  While loading, pass greeting={undefined}
//     so only the artwork renders (never "Welcome back, there.").
// =============================================================================
import { STUDY_PALETTE as P } from "@/lib/study-theme";
import { cn } from "@/lib/utils";
import banner from "@/assets/hero/dashboard-brand-banner.webp";

interface DashboardMastheadProps {
  greeting?: string;
  className?: string;
}

// Soft vignette: fade all four edges, with a stronger bottom fade so the
// artwork melts into the greeting/content below. The two mask layers are
// intersected so the fade applies to every edge at once.
const EDGE_FADE = [
  "linear-gradient(to bottom, transparent 0%, #000 11%, #000 80%, transparent 100%)",
  "linear-gradient(to right, transparent 0%, #000 9%, #000 91%, transparent 100%)",
].join(", ");

export function DashboardMasthead({ greeting, className }: DashboardMastheadProps) {
  return (
    <header
      className={cn("relative w-full text-center", className)}
      data-testid="dashboard-masthead"
    >
      <div className="relative mx-auto w-full max-w-[700px]">
        <img
          src={banner}
          alt="PsychPro — learn. expand. connect."
          className="block w-full h-auto select-none pointer-events-none"
          draggable={false}
          style={{
            WebkitMaskImage: EDGE_FADE,
            maskImage: EDGE_FADE,
            WebkitMaskComposite: "source-in",
            maskComposite: "intersect",
          }}
          data-testid="dashboard-masthead-image"
        />
      </div>
      {greeting !== undefined && (
        <div className="-mt-1 flex flex-col items-center md:-mt-2">
          <span
            aria-hidden
            className="mb-2.5 block h-px w-9"
            style={{
              background: `linear-gradient(90deg, transparent, ${P.surf}59, transparent)`,
            }}
          />
          <p
            className="text-sm font-light"
            style={{ color: P.mistSoft, letterSpacing: "0.02em" }}
            data-testid="dashboard-masthead-greeting"
          >
            {greeting}
          </p>
        </div>
      )}
    </header>
  );
}
