// =============================================================================
// SINGLE SOURCE OF TRUTH for the PsychPro color palette (TS mirror).
//
// BLUE THREE-MATERIAL SYSTEM (owner-approved 2026-07-09): values mirror the
// --pp-* token block in src/index.css. If you change a value here, change the
// matching CSS token in the same commit — the guardrail scripts
// (check-surface-hue.mjs / check-design-drift.mjs) enforce the locked palette.
//
// Palette: floor #000; tinted surfaces #04101f–#071c33; navy #052a58/#0e4e71;
// ocean #0b669a/#0d58a2; cyan #08a5d1/#0bd4df; icy #aaedf0; grays
// #e5e5e5/#a3a3a3. The KEYS are legacy names kept so every consumer compiles.
// =============================================================================

export const STUDY_PALETTE = {
  // Backgrounds — pure-black floor to tinted navy surface ladder.
  ink: "#000000",         // deepest anchor (page floor)
  bg: "#04101f",          // page bg primary (deepest tinted surface)
  bgSoft: "#05172b",      // page bg secondary
  surface: "#071c33",     // card surface (standard tint)
  surfaceElev: "#092642", // card hover / lifted

  // Structural lines — borders, dividers
  steel: "#0e4e71",

  // Accent ladder (legacy key names, blue values)
  tealDeep: "#0b669a",    // mid ocean
  teal: "#08a5d1",        // primary action cyan
  surf: "#0bd4df",        // luminous cyan accent
  mist: "#aaedf0",        // icy highlight text
  mistSoft: "#a3a3a3",    // dimmer muted text (locked gray)

  // Neutrals (locked grays)
  cloud: "#e5e5e5",       // brightest text (text-main)
  paper: "#e5e5e5",       // alias
  paperSoft: "#cfcfcf",   // softer light-card text
  inkSoft: "#a3a3a3",     // muted text (text-muted)
} as const;

export type StudyTone = "light" | "dark" | "accent" | "card-front";
