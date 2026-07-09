// =============================================================================
// SINGLE SOURCE OF TRUTH for the PsychPro color palette.
//
// Canonical palette = the LANDING PAGE reference (liquid neuroglass UI):
// near-black stage, glossy cyan edge light, bright cyan accents, soft icy text.
// All other pages must mirror this exactly — no royal blue, no flat navy,
// no purple, no green-teal drift.
//
// Locked hue band: 186–194 (clean cyan, slightly cool).
// Do NOT shift accents toward 180 (reads green) or beyond 200 (reads blue/navy).
//
// Consumers (last audited 2026-05-13):
//   - src/pages/landing.tsx
//   - src/pages/brain-lab.tsx
//   - src/pages/dashboard.tsx
//   - src/pages/quiz.tsx
//   - src/pages/flashcards.tsx
//   - src/pages/topics.tsx
//   - src/pages/topic-detail.tsx
//   - src/pages/study-guide.tsx
//   - src/pages/practice-exam.tsx
//   - src/pages/reflections.tsx
//   - src/components/study/study-surface.tsx
//   - src/components/layout/app-layout.tsx
//   - src/index.css `.study-page-bg` HSL overrides (mirror these hex values)
// =============================================================================

export const STUDY_PALETTE = {
  // Backgrounds — near-black liquid neuroglass stack. CANONICAL SURFACE HUE =
  // 190. The app should read black first, cyan second.
  ink: "#02090c",         // deepest anchor (sidebar / page floor)
  bg: "#031418",          // page bg primary (black-cyan)
  bgSoft: "#04242b",      // page bg secondary
  surface: "#05333d",     // card surface (glass base)
  surfaceElev: "#084b59", // card hover / lifted

  // Mid-cerulean — borders, dividers, structural lines
  steel: "#1da2c3",       // cerulean

  // Cyan accents — hue ~188–195, locked
  tealDeep: "#1da2c3",    // cerulean (alias)
  teal: "#5ad7ed",        // cyan
  surf: "#76E4F7",        // bright-cyan (primary glow)
  mist: "#A7F3FF",        // soft-cyan (icy text)
  mistSoft: "#9FCEDC",    // dimmer soft-cyan (muted icy text on dark surfaces)

  // Neutrals
  cloud: "#F4FBFF",       // brightest text (text-main)
  paper: "#F4FBFF",       // alias
  paperSoft: "#CCE5EC",   // softer light-card text
  inkSoft: "#A9C6CF",     // muted text (text-muted)
} as const;

export type StudyTone = "light" | "dark" | "accent" | "card-front";
