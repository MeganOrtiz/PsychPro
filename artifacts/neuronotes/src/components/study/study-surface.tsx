import { type ReactNode, type CSSProperties, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { STUDY_PALETTE as P, type StudyTone } from "@/lib/study-theme";

interface StudySurfaceProps {
  tone?: StudyTone;
  glow?: boolean;
  noGlow?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  pill?: { text: string; tone?: "muted" | "brand" };
  onClick?: () => void;
  as?: "div" | "button";
  type?: "button" | "submit";
  ariaLabel?: string;
  ariaPressed?: boolean;
  testId?: string;
  innerClassName?: string;
  fillHeight?: boolean;
}

// Black-foundation reset (2026-07-09): every tone is a flat dark-gray panel
// with a neutral border — no glass, no blur, no glow, no gradients. The tone
// keys are preserved so all call sites keep working; they now map to a small
// neutral elevation ladder.
function baseSurfaceStyles(tone: StudyTone): CSSProperties {
  switch (tone) {
    case "dark":
      return {
        background: "var(--pp-deep)",
        borderColor: "var(--pp-navy-bright)",
        color: "rgba(var(--pp-white-rgb), 1)",
      };
    case "accent":
      return {
        background: P.surfaceElev,
        borderColor: "var(--pp-navy-bright)",
        color: "rgba(var(--pp-white-rgb), 1)",
      };
    case "card-front":
      return {
        background: P.surfaceElev,
        borderColor: "var(--pp-navy-bright)",
        color: "rgba(var(--pp-white-rgb), 1)",
      };
    case "light":
    default:
      return {
        background: "var(--pp-surface)",
        borderColor: "var(--pp-navy-bright)",
        color: P.mist,
      };
  }
}

function surfaceStyles(tone: StudyTone, _noGlow = false): CSSProperties {
  return baseSurfaceStyles(tone);
}

function pillStyles(tone: StudyTone, brand?: boolean): CSSProperties {
  if (tone === "dark") {
    return {
      background: `${P.bg}99`,
      color: P.mist,
      borderColor: `${P.surf}44`,
    };
  }
  if (tone === "accent" || tone === "card-front") {
    return {
      background: "var(--pp-tile-strong)",
      color: "rgba(var(--pp-white-rgb), 1)",
      borderColor: "rgba(var(--pp-cyan-rgb), 0.55)",
    };
  }
  return brand
    ? { background: P.teal, color: "rgba(var(--pp-white-rgb), 1)", borderColor: P.tealDeep }
    : {
        background: "var(--pp-tile)",
        color: P.surf,
        borderColor: "rgba(var(--pp-cyan-rgb), 0.40)",
      };
}

export const StudySurface = forwardRef<HTMLElement, StudySurfaceProps>(
  function StudySurface(
    {
      tone = "light",
      glow = false,
      noGlow = false,
      className,
      style,
      children,
      pill,
      onClick,
      as = "div",
      type,
      ariaLabel,
      ariaPressed,
      testId,
      innerClassName,
      fillHeight = false,
    },
    ref,
  ) {
    const Comp: any = as;
    const isButton = as === "button";
    void glow;
    void noGlow;
    return (
      <Comp
        ref={ref as any}
        type={isButton ? (type ?? "button") : undefined}
        onClick={onClick}
        aria-label={ariaLabel}
        aria-pressed={ariaPressed}
        data-testid={testId}
        className={cn(
          "relative rounded-2xl text-left",
          fillHeight && "h-full",
          isButton &&
            "select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 group",
          className,
        )}
        style={{
          ["--tw-ring-color" as any]: P.teal,
          ["--tw-ring-offset-color" as any]: P.ink,
          ...style,
        }}
      >
        <div
          className={cn(
            "relative rounded-2xl border transition-all",
            fillHeight && "h-full",
            isButton && "group-hover:-translate-y-0.5",
            innerClassName,
          )}
          style={surfaceStyles(tone, noGlow)}
        >
          {pill && (
            <div
              className="absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border tracking-wide"
              style={pillStyles(tone, pill.tone === "brand")}
            >
              {pill.text}
            </div>
          )}
          {children}
        </div>
      </Comp>
    );
  },
);
