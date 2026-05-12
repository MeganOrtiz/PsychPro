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
  // Backgrounds — deep blue-black stack matching the cinematic
  // smoke-diffusion reference. Pulled from the locked color directive:
  //   #01070B / #020B12 / #04131B / #071C26 (page blacks)
  //   #082330 / #0A2A39 / #0B3445 (midnight blue depth)
  ink: "#04131B",          // deepest anchor (sidebar / page floor)
  bg: "#071C26",           // page bg primary
  bgSoft: "#082330",       // page bg secondary
  surface: "#0A2A39",      // card surface (glass mid)
  surfaceElev: "#0B3445",  // card hover / lifted

  // Deep teal shadows — borders, dividers, structural lines.
  steel: "#124A5B",

  // Cerulean accents — muted, atmospheric (NOT neon). Hue band 188–195.
  tealDeep: "#124A5B",     // deep teal shadow
  teal: "#34AAC7",         // primary cerulean (CTAs, focal accents)
  surf: "#6FD9EA",         // muted cerulean glow (icons, highlights)
  mist: "#BDE5FF",         // icy soft text / accent text

  // Neutrals — kept for body copy readability on dark surfaces.
  cloud: "#E4F4F6",
  paper: "#E4F4F6",
  paperSoft: "#B7D5DC",
  inkSoft: "#7FA4AD",
} as const;

export type StudyTone = "light" | "dark" | "accent" | "card-front";
