// =============================================================================
// SINGLE SOURCE OF TRUTH for the PsychPro color palette.
//
// BLACK FOUNDATION (owner reset, 2026-07-09): the entire visual layer was
// stripped to a neutral black/gray baseline before a new design system is
// built. No chroma anywhere — pure black pages, dark-gray surfaces, neutral
// gray borders, white/gray text. The palette KEYS are unchanged so every
// consumer keeps compiling; only the VALUES are neutral now.
//
// Do NOT reintroduce cyan/teal/cerulean (or any saturated hue) here — the
// guardrail scripts (check-surface-hue.mjs / check-design-drift.mjs) enforce
// the neutral baseline.
// =============================================================================

export const STUDY_PALETTE = {
  // Backgrounds — pure-black to dark-gray ladder.
  ink: "#000000",         // deepest anchor (sidebar / page floor)
  bg: "#0a0a0a",          // page bg primary
  bgSoft: "#111111",      // page bg secondary
  surface: "#141414",     // card surface
  surfaceElev: "#1c1c1c", // card hover / lifted

  // Mid-gray — borders, dividers, structural lines
  steel: "#3f3f3f",

  // Former cyan accent slots — now neutral grays (keys kept for consumers)
  tealDeep: "#6b6b6b",
  teal: "#8a8a8a",
  surf: "#a3a3a3",        // primary accent (neutral gray)
  mist: "#d4d4d4",        // soft text
  mistSoft: "#a8a8a8",    // dimmer muted text

  // Neutrals
  cloud: "#f5f5f5",       // brightest text (text-main)
  paper: "#f5f5f5",       // alias
  paperSoft: "#cfcfcf",   // softer light-card text
  inkSoft: "#9e9e9e",     // muted text (text-muted)
} as const;

export type StudyTone = "light" | "dark" | "accent" | "card-front";
