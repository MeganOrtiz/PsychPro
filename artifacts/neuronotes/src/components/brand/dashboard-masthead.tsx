// =============================================================================
// DashboardMasthead — reusable cinematic brand banner.
// -----------------------------------------------------------------------------
// Renders a brand artwork (baked-in wordmark + "learn. expand. connect." +
// glowing brain on cyan smoke) as a slim, centered masthead whose smoke edges
// feather into the page so there is no hard rectangle/seam. An optional
// personalized greeting sits just beneath it.
//
// Used on the main-site dashboard (PsychPro banner + greeting) and the EPPP
// Mastery Suite (EPPP Mastery Suite banner, no greeting). Pass `image`/`alt`
// to swap the artwork; defaults to the PsychPro dashboard banner.
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
import dashboardBanner from "@/assets/hero/dashboard-brand-banner.webp";

interface DashboardMastheadProps {
  greeting?: string;
  className?: string;
  /** Brand artwork to display. Defaults to the PsychPro dashboard banner. */
  image?: string;
  /** Accessible label describing the artwork's baked-in wordmark + tagline. */
  alt?: string;
  /** Max rendered width of the centered band in px. Defaults to 700. */
  maxWidth?: number;
}

// Soft vignette: fade all four edges, with a stronger bottom fade so the
// artwork melts into the greeting/content below. The two mask layers are
// intersected so the fade applies to every edge at once.
const EDGE_FADE = [
  "linear-gradient(to bottom, transparent 0%, #000 11%, #000 80%, transparent 100%)",
  "linear-gradient(to right, transparent 0%, #000 9%, #000 91%, transparent 100%)",
].join(", ");

export function DashboardMasthead({
  greeting,
  className,
  image = dashboardBanner,
  alt = "PsychPro — learn. expand. connect.",
  maxWidth = 700,
}: DashboardMastheadProps) {
  return (
    <header
      className={cn("relative w-full text-center", className)}
      data-testid="dashboard-masthead"
    >
      <div className="relative mx-auto w-full" style={{ maxWidth }}>
        <img
          src={image}
          alt={alt}
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
