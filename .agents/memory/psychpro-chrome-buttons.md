---
name: PsychPro silver-chrome buttons
description: Canonical primary-button recipe since 2026-07-19 — silver chrome gradient, dark ink, 10px radius, site-wide incl. EPPP.
---
Owner rejected the black gloss primary buttons ("look already clicked") and picked **Silver Chrome** from three canvas mockups (turquoise / steel-blue / chrome).

The rule: primary/gloss buttons use the `--pp-chrome-*` token ramp in `:root` of index.css (hi/mid/lo gradient, hover + press variants, border trio), `color: var(--pp-text)` (dark ink), and **10px** border-radius. Applies to `.btn-glass-strong`, `.pp-btn-gloss`, `.landing-cta-primary`, `.eps-save-btn`, `.epd-exam-save`. Secondary/tile buttons keep the light `--pp-tile` fill but also moved to 10px radius; `.eppp-launch-btn` keeps its tile fill but its hover/active/is-active text must stay `var(--pp-text)` (white labels on light fills was a legibility bug) and its icon uses `currentColor`.

**Why:** consistency mandate — one button system across main site + EPPP; dark ink on chrome, never white.
**How to apply:** any new primary button references `var(--pp-chrome-*)` (never re-declared hexes; token lock forbids raw literals in TSX). Guardrail locks in check-design-drift.mjs cover button classes — update locks in the same commit for intentional changes.
