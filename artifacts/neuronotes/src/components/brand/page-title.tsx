// =============================================================================
// PageTitle — the canonical header for every main-tab page (Courses, Study
// Lab, Brain Lab, Progress, Resources, Reflections, My Tools, etc.).
//
// Mirrors the dashboard wordmark voice (BrandBanner):
//   - Outfit, font-light (300), wide tracking (0.32em), cyan textShadow glow
//   - Centered on the page
//   - Optional small icon above, optional subtitle below
//
// DO NOT re-add `text-2xl md:text-3xl font-bold text-foreground` page titles
// on these pages — they fight the brand and shipped before this unification.
// =============================================================================
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { STUDY_PALETTE as P } from "@/lib/study-theme";

interface PageTitleProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  className?: string;
}

export function PageTitle({ title, subtitle, icon: Icon, className }: PageTitleProps) {
  return (
    <div
      className={cn("relative flex flex-col items-center text-center mb-6", className)}
      data-testid="page-title"
    >
      {Icon ? (
        <Icon
          aria-hidden="true"
          className="w-6 h-6 mb-2"
          style={{
            color: P.surf,
            filter: `drop-shadow(0 0 8px ${P.surf}aa)`,
          }}
        />
      ) : null}
      <h1
        className="font-light leading-none uppercase"
        style={{
          fontFamily: '"Outfit", "Inter", system-ui, sans-serif',
          fontSize: "clamp(22px, 3.2vw, 36px)",
          letterSpacing: "0.32em",
          color: P.cloud,
          textShadow: `0 0 24px ${P.surf}52`,
        }}
        data-testid="page-title-text"
      >
        {title}
      </h1>
      {subtitle ? (
        <p
          className="mt-3 text-sm font-light"
          style={{
            color: `${P.mist}ee`,
            letterSpacing: "0.04em",
          }}
          data-testid="page-title-subtitle"
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
