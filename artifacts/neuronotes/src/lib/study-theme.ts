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
  // COSMIC NEBULA palette (2026-05-13 redesign). Keys preserved so all
  // existing consumers stay intact; only hex values shift toward a deeper
  // navy-black base with brighter electric-cyan accents and ethereal
  // blue cloud tones.
  //   #050B14 / #0A1628 / #0F2138 (page blacks → space depth)
  //   #1B4D7A / #0D2540 (nebula cloud blues)
  //   #4DE4FF / #7FF0FF / #A8E8F0 (electric cyan → soft glow → ice mist)
  ink: "#050B14",          // deepest anchor (sidebar / page floor)
  bg: "#0A1628",           // page bg primary
  bgSoft: "#0D1E36",       // page bg secondary
  surface: "#0F2138",      // card surface (glass mid)
  surfaceElev: "#152B45",  // card hover / lifted

  // Cloud-blue depth — borders, dividers, structural lines.
  steel: "#1B4D7A",

  // Cyan accents — luminous, electric (cosmic redesign). Hue ~188–192.
  tealDeep: "#1B4D7A",     // deep cloud blue
  teal: "#4DE4FF",         // primary electric cyan (CTAs, focal accents)
  surf: "#7FF0FF",         // bright cyan glow (icons, highlights)
  mist: "#A8E8F0",         // soft cyan text / accent text

  // Neutrals — kept for body copy readability on dark surfaces.
  cloud: "#E8F4F8",
  paper: "#E8F4F8",
  paperSoft: "#8FA8B8",
  inkSoft: "#5A7388",
} as const;

export type StudyTone = "light" | "dark" | "accent" | "card-front";
