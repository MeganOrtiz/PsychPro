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
  className?: string;
}

export function BrandBanner({
  size = "lg",
  showIcon = true,
  greeting,
  className,
}: BrandBannerProps) {
  const isLg = size === "lg";
  return (
    <div
      className={cn("relative flex flex-col items-center text-center", className)}
      data-testid="brand-banner"
    >
      <div className="flex items-center justify-center gap-3">
        {showIcon && (
          <Brain
            className={isLg ? "w-7 h-7" : "w-5 h-5"}
            style={{
              color: P.surf,
              filter: `drop-shadow(0 0 8px ${P.surf}aa)`,
            }}
          />
        )}
        <h1
          className="font-light leading-none"
          style={{
            fontFamily: '"Outfit", "Inter", system-ui, sans-serif',
            fontSize: isLg
              ? "clamp(28px, 4vw, 44px)"
              : "clamp(18px, 2.2vw, 24px)",
            letterSpacing: "0.42em",
            color: P.cloud,
            textShadow: `0 0 24px ${P.surf}52`,
          }}
          data-testid="brand-banner-wordmark"
        >
          PSYCHPRO
        </h1>
      </div>
      <p
        className={cn("mt-2 font-light", isLg ? "text-xs" : "text-[10px]")}
        style={{
          letterSpacing: "0.32em",
          color: P.mist,
        }}
        data-testid="brand-banner-tagline"
      >
        learn. expand. connect.
      </p>
      {greeting !== undefined && (
        <p
          className={cn("mt-3 font-light", isLg ? "text-sm" : "text-xs")}
          style={{ color: P.mistSoft }}
          data-testid="brand-banner-greeting"
        >
          {greeting}
        </p>
      )}
    </div>
  );
}
