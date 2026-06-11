// =============================================================================
// BrandBanner — the canonical PsychPro page header.
//
// PROTECTED COMPONENT. Use this on every authenticated page that needs a
// branded header (dashboard, topics, progress, etc.). DO NOT:
//   - Re-render an inline <h1>PSYCHPRO</h1> wordmark in a page.
//   - Hardcode brand hex codes here (use STUDY_PALETTE tokens).
//   - Change "Welcome back, ${firstName}." / "Welcome back." copy.
//
// Greeting rule (also enforced where this is consumed):
//   - With a name: "Welcome back, ${firstName}."
//   - Without:     "Welcome back."  (NEVER "Welcome back, there.")
//   - Pass greeting={undefined} while the profile is loading so only the
//     wordmark + tagline render — never flashes a placeholder name.
// =============================================================================
import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { STUDY_PALETTE as P } from "@/lib/study-theme";

interface BrandBannerProps {
  size?: "lg" | "sm";
  showIcon?: boolean;
  greeting?: string;
  tagline?: string;
  className?: string;
}

export function BrandBanner({
  size = "lg",
  showIcon = true,
  greeting,
  tagline = "learn. expand. connect.",
  className,
}: BrandBannerProps) {
  const isLg = size === "lg";
  return (
    <div
      className={cn("relative flex flex-col items-center text-center", className)}
      data-testid="brand-banner"
    >
      <div className={cn("flex items-center justify-center", isLg ? "gap-3.5" : "gap-2.5")}>
        {showIcon && (
          <Brain
            className={isLg ? "w-7 h-7" : "w-5 h-5"}
            style={{
              color: P.surf,
              filter: `drop-shadow(0 0 6px ${P.surf}66)`,
            }}
          />
        )}
        <h1
          className="leading-none"
          style={{
            fontFamily: '"Outfit", "Inter", system-ui, sans-serif',
            fontWeight: 200,
            fontSize: isLg
              ? "clamp(28px, 4vw, 44px)"
              : "clamp(18px, 2.2vw, 24px)",
            letterSpacing: "0.42em",
            // Compensate the trailing letter-spacing so the all-caps wordmark
            // sits optically centered next to the icon instead of drifting left.
            textIndent: "0.42em",
            color: P.cloud,
            textShadow: `0 0 20px ${P.surf}3d`,
          }}
          data-testid="brand-banner-wordmark"
        >
          PSYCHPRO
        </h1>
      </div>
      <p
        className={cn("font-light", isLg ? "mt-2.5 text-xs" : "mt-1 text-[10px]")}
        style={{
          letterSpacing: "0.34em",
          textIndent: "0.34em",
          color: P.mist,
        }}
        data-testid="brand-banner-tagline"
      >
        {tagline}
      </p>
      {greeting !== undefined && (
        <div className={cn("flex flex-col items-center", isLg ? "mt-3.5" : "mt-1.5")}>
          {isLg && (
            <span
              aria-hidden
              className="block h-px w-9 mb-3"
              style={{
                background: `linear-gradient(90deg, transparent, ${P.surf}59, transparent)`,
              }}
            />
          )}
          <p
            className={cn("font-light", isLg ? "text-sm" : "text-xs")}
            style={{ color: P.mistSoft, letterSpacing: "0.02em" }}
            data-testid="brand-banner-greeting"
          >
            {greeting}
          </p>
        </div>
      )}
    </div>
  );
}
