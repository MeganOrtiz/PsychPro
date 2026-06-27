---
name: PsychPro pigment-over-glow correction
description: The "flat/bland/foggy" complaint is a glow+blur desaturation problem, not a hue/darkness problem; fix with pigment (saturate+contrast up, brightness down) and LESS glow, never more light.
---

# Pigment over glow

When the owner says the site looks "flat", "bland", or "foggy", the root cause is
**stacked cyan glow + layered backdrop-blur desaturating and flattening contrast**, NOT
the wrong hue and NOT that surfaces are too dark.

**The fix (owner-confirmed "yes exactly"):**
- Increase **saturation** and **contrast**, and **lower brightness** (deepen blacks) so the
  cerulean reads as *pigment*, not a milky wash.
- **Reduce** the glow: fewer/weaker cyan coronas (outer + the doubled inset corona), and pull
  back the ~25 `backdrop-filter: blur() saturate()` layers that compound into haze across nested
  surfaces (page bg → panel → card → inner tile).
- Do NOT "add more light/glow" to fix flatness — that is the cause, not the cure.

**Why:** Owner edited the landing hero in their own photo editor (saturation+contrast up,
brightness down) and showed a side-by-side; the more-pigmented version killed the fog. Confirmed
the diagnosis directly.

**How to apply:**
- Hero/backdrop images live on `.study-page-bg::before` (in-app = `app-smoke.jpg`) and
  `.landing-root.study-page-bg::before` (landing = `brain-clouds.jpg`). Correct them with a CSS
  `filter: saturate() contrast() brightness()` on the `::before` (started landing-only at
  saturate(1.32) contrast(1.12) brightness(0.9) as an apples-to-apples test before site-wide).
- Roll out in two phases: (1) backdrop image filter, (2) reduce surface glow/blur on
  cards/buttons/panels. Keep hue locked (--surf-hue 192) so check-surface-hue + check-design-drift
  stay green — a filter adds no color literals, so guardrails are unaffected.

## Phase 2 done: shared CARD recipe de-fogged (EPPP included)
Owner explicitly chose (over "leave EPPP as template") to de-fog the SHARED card
recipe, accepting that it changes EPPP cards too. The canonical card recipe lives in
THREE mirrored places — EPPP `.epd-card` (source, in eppp-dashboard.tsx `<style>`),
`.study-page-bg .bg-card` (index.css), and StudySurface `tone="light"` — edit all three
in lockstep. The de-fog = cut backdrop blur hard, slash the two cyan coronas (inset +
outer), dim the top bloom, and make the fill MORE opaque + saturated (pigment, not haze).
The design-drift lock pins the card blur + both corona alphas, so any card-recipe change
must update `scripts/check-design-drift.mjs` in the same commit or the guardrail fails.

**Why:** this supersedes the old "EPPP is the untouched template / adopt .epd-card glow
verbatim" stance (see psychpro-eppp-unified-cards.md) — do NOT "restore" the heavy glow
thinking EPPP is sacred. The brighter SELECTED/active variants + flashcard accent/card-front
tones were NOT touched in this pass; revisit only if owner says they still read foggy.
