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

function baseSurfaceStyles(tone: StudyTone): CSSProperties {
  switch (tone) {
    case "dark":
      // Prominent translucent cerulean glass — slightly brighter base than
      // "light" so it reads as a lifted/feature surface, with the same cyan
      // top-bloom + outer corona radiance over the brain backdrop.
      return {
        background:
          "linear-gradient(145deg, hsl(var(--surf-hue) 85% 12% / 0.80), hsl(var(--surf-hue) 91% 8% / 0.90))",
        borderColor: "rgba(118,228,247,0.24)",
        backdropFilter: "blur(20px) saturate(135%)",
        WebkitBackdropFilter: "blur(20px) saturate(135%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.10), 0 22px 52px -26px rgba(0,0,0,0.74)",
        color: "#FFFFFF",
      };
    case "accent":
      // Translucent directional cerulean glass — brighter, more saturated than
      // the card front so the flashcard back stays visually distinct while
      // sharing the same incandescent bloom + radiant corona.
      return {
        background:
          "linear-gradient(135deg, hsl(var(--surf-hue) 81% 26% / 0.64), hsl(var(--surf-hue) 85% 18% / 0.76))",
        borderColor: "rgba(118,228,247,0.32)",
        backdropFilter: "blur(20px) saturate(140%)",
        WebkitBackdropFilter: "blur(20px) saturate(140%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.16), 0 22px 54px -26px rgba(0,0,0,0.66)",
        color: "#FFFFFF",
      };
    case "card-front":
      // Centered radial pigment — lighter in the middle, deeper at the edges —
      // pairs with the directional "accent" back of the flashcard. Translucent
      // glass so the brain backdrop glows through; white body text throughout.
      return {
        background:
          "radial-gradient(120% 104% at 50% 38%, hsl(var(--surf-hue) 78% 30% / 0.52) 0%, hsl(var(--surf-hue) 82% 21% / 0.62) 42%, hsl(var(--surf-hue) 85% 15% / 0.76) 100%)",
        borderColor: "rgba(118,228,247,0.32)",
        backdropFilter: "blur(20px) saturate(140%)",
        WebkitBackdropFilter: "blur(20px) saturate(140%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.16), 0 22px 54px -26px rgba(0,0,0,0.66)",
        color: "#FFFFFF",
      };
    case "light":
    default:
      // Unified with the EPPP card system (.epd-card): a radial cyan top-bloom
      // over a 145° diagonal cerulean glass with a cyan inner glow + outer
      // corona and a deep drop shadow, so the main-site surfaces read as the
      // same translucent bloom glass as the EPPP domain tiles.
      return {
        background:
          "linear-gradient(145deg, hsl(var(--surf-hue) 88% 10% / 0.74), hsl(var(--surf-hue) 88% 6% / 0.85))",
        borderColor: "rgba(196,232,242,0.22)",
        backdropFilter: "blur(20px) saturate(135%)",
        WebkitBackdropFilter: "blur(20px) saturate(135%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.12), 0 24px 60px -42px rgba(0,0,0,0.72)",
        color: P.mist,
      };
  }
}

// Same glass surface with the cyan corona/inner-glow halos stripped out —
// keeps the white top highlight and the deep drop shadow so the card still
// reads as a lifted surface, just without the "glow". Used on the dashboards.
const NOGLOW_SHADOW: Partial<Record<StudyTone, string>> = {
  light: "inset 0 1px 0 rgba(255,255,255,0.12), 0 24px 60px -42px rgba(0,0,0,0.72)",
  dark: "inset 0 1px 0 rgba(255,255,255,0.10), 0 22px 52px -26px rgba(0,0,0,0.74)",
};

function surfaceStyles(tone: StudyTone, noGlow = false): CSSProperties {
  const s = baseSurfaceStyles(tone);
  if (noGlow && NOGLOW_SHADOW[tone]) s.boxShadow = NOGLOW_SHADOW[tone];
  return s;
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
      background: "rgba(255,255,255,0.22)",
      color: "#FFFFFF",
      borderColor: "rgba(255,255,255,0.45)",
    };
  }
  return brand
    ? { background: P.teal, color: "#FFFFFF", borderColor: P.tealDeep }
    : {
        background: "hsl(var(--surf-hue) 69% 58% / 0.14)",
        color: P.surf,
        borderColor: "hsl(var(--surf-hue) 69% 58% / 0.30)",
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
          ["--tw-ring-offset-color" as any]: P.paperSoft,
          ...style,
        }}
      >
        {glow && (
          <div
            aria-hidden
            className={cn(
              "absolute -inset-4 rounded-3xl opacity-60 transition-opacity blur-2xl pointer-events-none",
              isButton && "group-hover:opacity-100",
            )}
            style={{
              background: `radial-gradient(circle at 50% 50%, ${P.teal}, transparent 65%)`,
            }}
          />
        )}
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
