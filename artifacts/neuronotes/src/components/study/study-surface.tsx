import { type ReactNode, type CSSProperties, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { STUDY_PALETTE as P, type StudyTone } from "@/lib/study-theme";

interface StudySurfaceProps {
  tone?: StudyTone;
  glow?: boolean;
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

function surfaceStyles(tone: StudyTone): CSSProperties {
  switch (tone) {
    case "dark":
      // Prominent translucent cerulean glass — slightly brighter base than
      // "light" so it reads as a lifted/feature surface, with the same cyan
      // top-bloom + outer corona radiance over the brain backdrop.
      return {
        background:
          "radial-gradient(125% 80% at 50% 0%, rgba(118,228,247,0.09) 0%, rgba(118,228,247,0.00) 58%), linear-gradient(145deg, hsl(var(--surf-hue) 85% 22% / 0.80), hsl(var(--surf-hue) 91% 15% / 0.90))",
        borderColor: "rgba(118,228,247,0.24)",
        backdropFilter: "blur(20px) saturate(135%)",
        WebkitBackdropFilter: "blur(20px) saturate(135%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.10), inset 0 0 44px -24px rgba(118,228,247,0.36), 0 0 30px -12px rgba(118,228,247,0.28), 0 22px 52px -26px rgba(0,0,0,0.74)",
        color: "#FFFFFF",
      };
    case "accent":
      // Translucent directional cerulean glass — brighter, more saturated than
      // the card front so the flashcard back stays visually distinct while
      // sharing the same incandescent bloom + radiant corona.
      return {
        background:
          "radial-gradient(140% 92% at 50% 0%, rgba(118,228,247,0.18) 0%, rgba(118,228,247,0.00) 60%), linear-gradient(135deg, hsl(var(--surf-hue) 81% 41% / 0.64), hsl(var(--surf-hue) 85% 30% / 0.76))",
        borderColor: "rgba(118,228,247,0.32)",
        backdropFilter: "blur(20px) saturate(140%)",
        WebkitBackdropFilter: "blur(20px) saturate(140%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.16), inset 0 0 50px -24px rgba(118,228,247,0.56), 0 0 36px -10px rgba(118,228,247,0.44), 0 22px 54px -26px rgba(0,0,0,0.66)",
        color: "#FFFFFF",
      };
    case "card-front":
      // Centered radial bloom — lighter in the middle, deeper at the edges —
      // pairs with the directional "accent" back of the flashcard. Translucent
      // glass so the brain backdrop glows through; white body text throughout.
      return {
        background:
          "radial-gradient(120% 104% at 50% 38%, rgba(118,228,247,0.22) 0%, hsl(var(--surf-hue) 74% 43% / 0.52) 42%, hsl(var(--surf-hue) 85% 25% / 0.76) 100%)",
        borderColor: "rgba(118,228,247,0.32)",
        backdropFilter: "blur(20px) saturate(140%)",
        WebkitBackdropFilter: "blur(20px) saturate(140%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.16), inset 0 0 54px -24px rgba(118,228,247,0.56), 0 0 36px -10px rgba(118,228,247,0.44), 0 22px 54px -26px rgba(0,0,0,0.66)",
        color: "#FFFFFF",
      };
    case "panel":
      // CONTAINER backing — a DEEPER/stronger version of the standard tile so
      // the nested standard tiles (lighter + cyan halo) read as lifted above
      // it. Restrained outer halo keeps the radiance on the tiles inside, not
      // on the wrapper. (One family, one-step elevation.)
      return {
        background:
          "linear-gradient(180deg, hsl(var(--surf-hue) 88% 12% / 0.92), hsl(var(--surf-hue) 88% 7% / 0.96))",
        borderColor: "rgba(118,228,247,0.28)",
        backdropFilter: "blur(16px) saturate(130%)",
        WebkitBackdropFilter: "blur(16px) saturate(130%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.08), 0 24px 54px -28px rgba(0,0,0,0.85), 0 0 20px -8px rgba(118,228,247,0.12)",
        color: P.mist,
      };
    case "light":
    default:
      // STANDARD TILE = the landing feature-card glass recipe: a translucent
      // deep-cerulean gradient (lighter at top → deeper at bottom), a soft
      // cerulean hairline, an inner cyan ring, a dark drop shadow and a cyan
      // outer halo so the tile reads as lifted glass over the backdrop.
      return {
        background:
          "linear-gradient(180deg, hsl(var(--surf-hue) 88% 19% / 0.82), hsl(var(--surf-hue) 88% 14% / 0.90))",
        borderColor: "rgba(118,228,247,0.36)",
        backdropFilter: "blur(10px) saturate(140%)",
        WebkitBackdropFilter: "blur(10px) saturate(140%)",
        boxShadow:
          "inset 0 0 0 1px rgba(118,228,247,0.14), 0 18px 36px -22px rgba(0,0,0,0.60), 0 0 26px rgba(118,228,247,0.24)",
        color: P.mist,
      };
  }
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
          style={surfaceStyles(tone)}
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
