import React, { type CSSProperties, type ReactNode } from "react";
import { STUDY_PALETTE as P } from "@neuronotes/lib/study-theme";

/**
 * Single shared light-glass surface for the psychpro-polished dashboard
 * preview. One recipe (22px radius, frosted paper background, soft
 * cerulean hairline + drop shadow) used by every "light" tile so the
 * dashboard reads as one normalized card system.
 *
 * Palette comes exclusively from STUDY_PALETTE (see
 * artifacts/neuronotes/src/lib/study-theme.ts) — no locally redefined
 * hex values.
 */
export const LIGHT_CARD_STYLE: CSSProperties = {
  background: `${P.cloud}f0`,
  border: `1px solid ${P.teal}59`,
  boxShadow: `0 20px 60px -20px ${P.tealDeep}73, 0 0 0 1px ${P.surf}26`,
  borderRadius: 22,
};

export function LightCard({
  className = "",
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative ${className}`}
      style={{ ...LIGHT_CARD_STYLE, ...style }}
    >
      {children}
    </div>
  );
}
