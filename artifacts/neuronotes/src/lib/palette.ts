/**
 * PP PALETTE — token-mirroring constants (the ONLY TypeScript file that may
 * hold raw palette color literals; enforced by scripts/check-design-drift.mjs).
 *
 * These mirror the --pp-* CSS custom properties in src/index.css. They exist
 * for the contexts where CSS variables do not resolve:
 *   - SVG attributes (Recharts stroke/fill render hsl(var()) as black)
 *   - three.js / canvas materials
 *   - JS color math
 *
 * Everywhere else (inline styles, styled JSX) consume the CSS tokens directly:
 *   style={{ background: "var(--pp-surface)" }}
 *   style={{ borderColor: "rgba(var(--pp-cyan-rgb), 0.45)" }}
 *
 * To change the design: edit the token block in src/index.css AND the values
 * here in the same commit. Both guardrails verify the two stay in sync.
 */

export const PP = {
  floor: "#000000",
  deep: "#0a0a0a",
  surface: "#141414",
  raised: "#1a1a1a",
  navy: "#181818",
  navyBright: "#2e2e2e",
  ocean: "#3c3c3c",
  oceanDeep: "#4a4a4a",
  cyan: "#d6d6d6",
  bright: "#f0f0f0",
  icy: "#fafafa",
  text: "#e5e5e5",
  textDim: "#a3a3a3",
  ink: "#111111",
  white: "#ffffff",
  black: "#000000",
  /* Semantic status (match the guardrail's semantic hue windows). */
  red: "#ef4444",
  redDeep: "#b91c1c",
  green: "#22c55e",
  greenDeep: "#15803d",
  amber: "#f59e0b",
  /* Extended semantic + document shades (appended by token-discipline sweep;
     these have no --pp-* CSS-var equivalent and are consumed via PP/alpha()). */
  amberSoft: "#f4b462",
  coral: "#e07260",
  brick: "#b8453a",
  brickDeep: "#7a2c24",
  quizGreen: "#2ba866",
  quizGreenDeep: "#1e7a4e",
  cloudBright: "#fafafa",
  paperWhite: "#f4f4f4",
  chipInk: "#232323",
  earnedInk: "#222222",
  docInk: "#2a2a2a",
  docCode: "#f1f3f4",
  docBorder: "#c8d2d6",
  docQuote: "#4c636b",
  deepSoft: "#0d0d0d",
  textSoft: "#cfcfcf",
  neutral100: "#f5f5f5",
  neutral300: "#d4d4d4",
  neutral400: "#999999",
  neutral500: "#8a8a8a",
  neutral600: "#565656",
  nearBlack: "#0b0b0b",
  green400: "#34D399",
  greenText: "#7DD3A6",
  red400: "#F87171",
  redText: "#E89A92",
  redCoral: "#f47262",
  redToast: "#2a1216",
  inkOnGreen: "#171717",
  inkOnRed: "#3a0d0d",
  chipLight: "#dedede",
  chipGray: "#a5a5a5",
  skinLight: "#f0f0f0",
  skinSheen: "#e1e1e1",
  silver215: "#d7d7d7",
  panelWhite: "#efefef",
  gray180: "#b4b4b4",
  gray112: "#707070",
  gray178: "#b2b2b2",
  offWhite248: "#f8f8f8",
  mistWhite242: "#f2f2f2",
  neutralHi223: "#dfdfdf",
  red300: "#fca5a5",
  printInk: "#111111",
  printBorder: "#cccccc",
} as const;

export type PPColor = (typeof PP)[keyof typeof PP];

/** rgba() string from a #rrggbb hex — e.g. alpha(PP.cyan, 0.45). */
export function alpha(hex: string, a: number): string {
  const x = hex.replace("#", "");
  const r = parseInt(x.slice(0, 2), 16);
  const g = parseInt(x.slice(2, 4), 16);
  const b = parseInt(x.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/* LANDING EXCEPTION — the marketing landing page keeps the blue-window look
   while the logged-in app runs black/white/gray. These are the retained blue
   values, consumed ONLY by src/pages/landing.tsx (plus the scoped
   .landing-root --surf-hue/--surf-sat override in index.css). */
export const LANDING = {
  deep: "#04101f",
  surface: "#071c33",
  ocean: "#0b669a",
  cyan: "#08a5d1",
  bright: "#0bd4df",
  icy: "#aaedf0",
  ink: "#03131f",
} as const;
