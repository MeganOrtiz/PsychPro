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

## Phase 3 done: per-page inline surfaces de-fogged
Swept every main-site page's INLINE-styled boxes/panels (not the shared recipe) to the
same de-fogged values: idle/base fill = `linear-gradient(145deg, hsl(--surf-hue 90% 17%/0.95),
hsl(--surf-hue 90% 11%/0.99))` + top-bloom radial 0.05; active/selected = brighter (L28/20 @
0.96/0.99, bloom 0.12); backdrop `blur(18-20px) saturate(135%)` -> `blur(5px) saturate(140%)`;
box-shadow coronas cut to inner 0.16 / outer 0.10. Pages: dashboard banners, progress
Needs-Work/Strong pair, reflections, topics tiles, brain-lab panels, and (extended for study-flow
consistency) quiz, flashcards, practice-exam, subscription, plus index.css `.lesson-header-box`.

**Two gotchas that bit here:**
1. The pasted session plan's `.epd-card` numbers were the OLD FOGGY recipe (blur20/0.74-0.85/
   coronas 0.42/0.30). The plan STRUCTURE was right but its VALUES are stale — apply de-fogged
   values, never the plan's literal numbers.
2. An `edit` `replace_all` on a multi-line backdropFilter block only matches ONE indentation
   variant. brain-lab.tsx had the same `blur(20px) saturate(135%)` block at 4 different indents;
   replace_all missed 3 of them. Use a file-wide `sed 's/blur(20px) saturate(135%)/.../g'` for
   literal CSS-value sweeps, then grep to confirm zero remain.

**Left alone (intentional):** study-surface tone=accent/card-front/dark (flashcard faces +
Spotlight atmosphere), nav rails (.nav-glass*/.eps-kb-rail*), icon discs, toggles/badges/header
fades, dimming scrims (blur 6-8px on PALETTE.bg), terms/privacy legal pages, onboarding plan
cards, dev-glass-preview. Revisit only if owner flags them.
