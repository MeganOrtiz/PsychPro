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
  // Backgrounds — deep cerulean/turquoise stack (RETONED 2026-06-11 per owner:
  // nudged off the green-leaning ~191 up to cerulean hue ~196 so surfaces read
  // turquoise+cerulean, not green and not navy; accents stay locked at #76E4F7).
  ink: "#062935",         // deepest anchor (sidebar / page floor)
  bg: "#083b4d",          // page bg primary (deep cerulean)
  bgSoft: "#0a495e",      // page bg secondary
  surface: "#11556c",     // card surface (glass base)
  surfaceElev: "#186078", // card hover / lifted

  // Mid-cerulean — borders, dividers, structural lines
  steel: "#3196AF",       // cerulean

  // Cyan accents — hue ~188–195, locked
  tealDeep: "#3196AF",    // cerulean (alias)
  teal: "#68CCDE",        // cyan
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
