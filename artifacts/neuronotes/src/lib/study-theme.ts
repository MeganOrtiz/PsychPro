// =============================================================================
// SINGLE SOURCE OF TRUTH for the PsychPro color palette.
//
// Canonical palette = the LANDING PAGE reference (cinematic neuroscience UI):
// deep cerulean bg, vivid turquoise/cerulean mid-tones, bright cyan accents, soft icy text.
// All other pages must mirror this exactly — no royal blue, no flat navy,
// no purple, no green-teal drift.
//
// Locked hue band: 188–198 (clean cyan-teal, slightly cool).
// Do NOT shift accents toward 180 (reads green) or beyond 210 (reads cobalt).
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
  // Backgrounds — deep cerulean/turquoise stack. CANONICAL SURFACE HUE = 192
  // (set 2026-06-12). Pendulum history: hue 191 read green, 196 read navy; 192
  // sits just off the locked #76E4F7 accent (hue 189) on the anti-navy side.
  // The lever for "too navy" is HUE, never lightness — keep surfaces near 192.
  ink: "#042f3a",         // deepest anchor (sidebar / page floor)
  bg: "#044352",          // page bg primary (deep cerulean)
  bgSoft: "#054f61",      // page bg secondary
  surface: "#086178",     // card surface (glass base)
  surfaceElev: "#0c6b83", // card hover / lifted

  // Mid-cerulean — borders, dividers, structural lines
  steel: "#1da2c3",       // cerulean

  // Cyan accents — hue ~188–195, locked
  tealDeep: "#1da2c3",    // cerulean (alias)
  teal: "#5ad7ed",        // cyan
  surf: "#76E4F7",        // bright-cyan (primary glow)
  mist: "#A7F3FF",        // soft-cyan (icy text)
  mistSoft: "#7FBFD0",    // dimmer soft-cyan (muted icy text on dark surfaces)

  // Neutrals
  cloud: "#F4FBFF",       // brightest text (text-main)
  paper: "#F4FBFF",       // alias
  paperSoft: "#CCE5EC",   // softer light-card text
  inkSoft: "#A9C6CF",     // muted text (text-muted)
} as const;

export type StudyTone = "light" | "dark" | "accent" | "card-front";
