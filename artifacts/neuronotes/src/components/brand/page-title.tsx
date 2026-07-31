// =============================================================================
// PageTitle — the canonical header for every main-tab page (Courses, Study
// Lab, Brain Lab, Progress, Resources, Reflections, My Tools, etc.).
//
// Mirrors the dashboard wordmark voice (.dashboard-brand h1) — unified
// site-wide with the EPPP suite headers (owner, 2026-07-30):
//   - Montserrat (var(--app-font-sans)), weight 200, 0.22em tracking, uppercase
//   - Centered on the page, tight top spacing so content starts higher
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
      className={cn(
        // -mt pulls titles higher toward the top of every page (owner, 2026-07-19;
        // tightened 2026-07-30 to free vertical room for content).
        "relative flex flex-col items-center text-center -mt-2 md:-mt-4 lg:-mt-5 mb-4 text-scrim",
        className,
      )}
      data-testid="page-title"
    >
      {Icon ? (
        <Icon
          aria-hidden="true"
          className="w-6 h-6 mb-2"
          style={{
            color: P.surf,
          }}
        />
      ) : null}
      <h1
        className="leading-none uppercase"
        style={{
          fontFamily: "var(--app-font-sans)",
          fontWeight: 200,
          fontSize: "clamp(22px, 3.2vw, 36px)",
          letterSpacing: "0.22em",
          textIndent: "0.22em",
          color: P.cloud,
        }}
        data-testid="page-title-text"
      >
        {title}
      </h1>
      {subtitle ? (
        <p
          className="mt-2 text-sm font-light"
          style={{
            color: "rgb(var(--pp-white-rgb))",
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
