// =============================================================================
// SINGLE SOURCE OF TRUTH for the PsychPro color palette (TS mirror).
//
// BLUE THREE-MATERIAL SYSTEM (owner-approved 2026-07-09): every value here is
// consumed from the PP constants in src/lib/palette.ts, which themselves mirror
// the --pp-* token block in src/index.css. If you change a value, change it in
// palette.ts / index.css in the same commit — the guardrail scripts
// (check-surface-hue.mjs / check-design-drift.mjs) enforce the locked palette.
//
// Palette: black floor; tinted navy surfaces; navy structural lines; ocean and
// cyan accents; icy highlight; locked neutral grays. The KEYS are legacy names
// kept so every consumer compiles.
// =============================================================================

import { PP } from "@/lib/palette";

export const STUDY_PALETTE = {
  // Backgrounds — pure-black floor to tinted navy surface ladder.
  ink: PP.floor,          // deepest anchor (page floor)
  bg: PP.deep,            // page bg primary (deepest tinted surface)
  bgSoft: PP.deepSoft,    // page bg secondary
  surface: PP.surface,    // card surface (standard tint)
  surfaceElev: PP.raised, // card hover / lifted

  // Structural lines — borders, dividers
  steel: PP.navyBright,

  // Accent ladder (legacy key names, blue values)
  tealDeep: PP.ocean,     // mid ocean
  teal: PP.cyan,          // primary action cyan
  surf: PP.bright,        // luminous cyan accent
  mist: PP.icy,           // icy highlight text
  mistSoft: PP.textDim,   // dimmer muted text (locked gray)

  // Neutrals (locked grays)
  cloud: PP.text,         // brightest text (text-main)
  paper: PP.text,         // alias
  paperSoft: PP.textSoft, // softer light-card text
  inkSoft: PP.textDim,    // muted text (text-muted)
} as const;

export type StudyTone = "light" | "dark" | "accent" | "card-front";
