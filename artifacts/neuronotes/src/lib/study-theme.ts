// =============================================================================
// SINGLE SOURCE OF TRUTH for the PsychPro color palette.
//
// Every page (landing, dashboard, brain-lab, topics, study-lab, quiz, etc.)
// must import from THIS file. Do NOT define a local `PALETTE` constant in
// any page — it will silently fork the brand and drift greener/lighter
// over time (which is exactly what happened before this consolidation).
//
// Locked hue band: 198–205 (clean cyan-blue). Do NOT shift accents toward
// 180–194 (reads green/teal) or beyond 215 (reads cold cobalt).
//
// Consumers (last audited 2026-05-10):
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
  // Backgrounds — deep cyan-navy stack
  ink: "#041520",         // deepest anchor (sidebar)
  bg: "#061826",          // page bg primary
  bgSoft: "#0E2C40",      // page bg secondary
  surface: "#0C2538",     // card surface
  surfaceElev: "#11324D", // card hover / lifted

  // Mid-blue — borders, dividers, structural lines
  steel: "#1C4E75",

  // Cyan accents — locked at hue ~200 (cerulean), no green cast
  tealDeep: "#2A7E97",    // dark cerulean
  teal: "#2FA0C6",        // primary cerulean
  surf: "#58C9F3",        // bright cerulean (icons, highlights)
  mist: "#BDE5FF",        // icy soft text / accent text

  // Neutrals
  cloud: "#E4F4F6",       // brightest white-ish (body copy on dark)
  paper: "#E4F4F6",       // alias for `cloud` — light-card text
  paperSoft: "#B7D5DC",   // secondary text
  inkSoft: "#7FA4AD",     // muted text
} as const;

export type StudyTone = "light" | "dark" | "accent" | "card-front";
