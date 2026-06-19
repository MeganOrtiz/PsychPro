---
name: PsychPro main-site EPPP visual adoption
description: Scope boundary for "make the main site adopt the EPPP card recipe" — what's already done and what must NOT be converted.
---

The main site already adopted the canonical EPPP card recipe (radial cyan
top-bloom + 145° cerulean glass, mist hairline rgba(196,232,242,0.22), blur(20px)
saturate(135%), cyan inner-glow + outer-corona shadow). The shared layers
(`.study-page-bg .bg-card` in index.css, StudySurface `tone="light"`) and the
per-page card surfaces (dashboard banners, progress Needs Work/Strong Areas,
reflections cards, topics course rail + topic cards + mastery CTA, brain-lab main
panels) all carry it.

**Rule:** Do NOT "convert" the remaining inline gradients in brain-lab.tsx /
dashboard.tsx to the card recipe. They are intentionally non-card elements:
active-toggle pills, icon/achievement badges (135° teal→surf), progress-bar fills
(90°), and page-header/toolbar scrim fades (180° surface→transparent). Converting
them is overreach and breaks their UX affordance.

**Why:** A pasted session plan (T001–T004) asked to apply the recipe site-wide,
but most of it was already implemented by a prior merged retheme; the only real
gap was that idle topic-card / locked mastery-button used a cyan border + a shadow
missing the EPPP corona. Aligned just those to `.epd-card` while preserving the
deliberate brighter-cyan hover / unlocked "selected" variants.

**How to apply:** For interactive card buttons, align the IDLE/locked state to the
canonical recipe but keep the brighter hover/active variant in the
onMouseEnter/onMouseLeave handlers (and update onMouseLeave to restore the new idle
values, or hover leaves stale styling).
