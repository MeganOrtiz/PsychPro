---
name: PsychPro dashboard glow removal
description: Where cyan "glow" actually lives on the dashboards, so a "remove glow" sweep doesn't miss sources.
---

# Dashboard glow lives in MANY places

When asked to "remove glow from the dashboards but keep it on the buttons", glow is
NOT just card box-shadows. It hides in several independent spots — a grep for one
pattern misses the others. Check ALL of these:

1. **StudySurface box-shadow** — the shared surface has cyan inner/outer corona in its
   tone shadow. Use the `noGlow` prop (added to StudySurface) on every dashboard usage;
   it swaps in a shadow with the cyan layers removed but keeps the white top inset + deep
   black drop shadow.
2. **Nested child components** — surfaces rendered by children (e.g. TodayReviews) have
   their OWN `<StudySurface>` and need `noGlow` too. Auditing only the page file misses them.
3. **Inline text-shadows** — section `<h2>` headers, streak count, spotlight labels carry
   `0 0 Npx rgba(118,228,247,...)` text-shadows. Keep any dark `0 2px 8px rgba(0,0,0,...)`.
4. **SVG filters** — the streak sparkline used a `<filter><feGaussianBlur>` applied via
   `filter="url(#...Glow)"`. That's glow too; a CSS-only grep won't find it.
5. **Decorative nebula divs** — aria-hidden radial-gradient blur blobs behind avatars/cards.
6. **Page ::after nebula** — the shared `.study-page-bg::after` cerulean wash. Kill per-page
   with `.study-page-bg:has(.dashboard-page)::after { content: none; }` (main) and
   `.study-page-bg.epd-page::after { content: none; }` (EPPP).

**Keep (NOT glow):** borders, gradient/pigment background fills, white inset highlights,
dark drop shadows, and all real action buttons (Button/.btn-glass/.epd-next/.eppp-launch-btn).

**Button policy:** recommended tiles / today-review rows are semantically `<button>` but are
treated as content cards → de-glowed. Only literal action buttons keep glow.

**How to apply:** after edits, grep `dashboard.tsx eppp-dashboard.tsx today-reviews.tsx` for
`url(#.*Glow|drop-shadow(0 0|118,228,247` — the only expected residual is `.epd-next` (a button).
Guardrails check-surface-hue + check-design-drift stay green (edits touch none of the locked
`.bg-card`/token/mint entries).
