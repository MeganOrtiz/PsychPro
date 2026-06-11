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
      return {
        background: `linear-gradient(180deg, ${P.surfaceElev}, ${P.surface})`,
        borderColor: `${P.surf}55`,
        boxShadow: `0 20px 60px -20px ${P.teal}77`,
        color: "#FFFFFF",
      };
    case "accent":
      // Deep navy → teal-deep keeps white body text at >= AA contrast across the gradient.
      return {
        background: `linear-gradient(135deg, #1F4F66, ${P.tealDeep})`,
        borderColor: P.tealDeep,
        boxShadow: `0 20px 50px -18px ${P.tealDeep}cc`,
        color: "#FFFFFF",
      };
    case "card-front":
      // Radial gradient — darker on the outside edge, lighter in the
      // center — pairs with the "accent" back of the flashcard. Same
      // white body text so question/answer typography is consistent.
      return {
        background: `radial-gradient(ellipse at center, ${P.tealDeep} 0%, #1F4F66 55%, #133544 100%)`,
        borderColor: P.tealDeep,
        boxShadow: `0 20px 50px -18px ${P.tealDeep}cc`,
        color: "#FFFFFF",
      };
    case "light":
    default:
      // Refined translucent frosted glass matching the IMG_2548 reference:
      // a dark-teal fill that lets the page's brain-clouds backdrop show
      // through, a faint cerulean hairline, and a soft drop shadow (no heavy
      // cyan halo). A real backdrop blur makes it read as frosted glass
      // rather than a flat opaque box.
      return {
        background:
          "radial-gradient(125% 80% at 50% 0%, rgba(118,228,247,0.12) 0%, rgba(118,228,247,0.00) 58%), linear-gradient(145deg, rgba(20,90,116,0.40), rgba(11,62,82,0.52))",
        borderColor: "rgba(118,228,247,0.22)",
        backdropFilter: "blur(20px) saturate(135%)",
        WebkitBackdropFilter: "blur(20px) saturate(135%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 40px -22px rgba(118,228,247,0.42), 0 0 26px -6px rgba(118,228,247,0.30), 0 18px 40px -24px rgba(0,0,0,0.6)",
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
        background: "rgba(94,176,200,0.14)",
        color: P.surf,
        borderColor: "rgba(94,176,200,0.30)",
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
