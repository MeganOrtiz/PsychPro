// =============================================================================
// SINGLE SOURCE OF TRUTH for the PsychPro color palette.
//
// Canonical palette = the LANDING PAGE reference (cinematic neuroscience UI):
// deep midnight-teal bg, cerulean mid-tones, bright cyan accents, soft icy text.
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
  // Backgrounds — deep midnight-teal stack
  ink: "#03151D",         // deepest anchor (sidebar / page floor)
  bg: "#061F2B",          // page bg primary (bg-midnight)
  bgSoft: "#083240",      // page bg secondary (bg-teal)
  surface: "#0A2D3D",     // card surface (glass-strong)
  surfaceElev: "#0E3C50", // card hover / lifted

  // Mid-cerulean — borders, dividers, structural lines
  steel: "#2A7387",       // cerulean

  // Cyan accents — hue ~188–195, locked
  tealDeep: "#2A7387",    // cerulean (alias)
  teal: "#5EB0C8",        // cyan
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
