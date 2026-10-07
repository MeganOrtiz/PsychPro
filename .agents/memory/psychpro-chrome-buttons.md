---
name: PsychPro silver-chrome buttons
description: Canonical primary-button recipe since 2026-07-19 — silver chrome gradient, dark ink, 10px radius, site-wide incl. EPPP.
---
Owner rejected the black gloss primary buttons ("look already clicked") and picked **Silver Chrome** from three canvas mockups (turquoise / steel-blue / chrome).

The rule: primary/gloss buttons use the `--pp-chrome-*` token ramp in `:root` of index.css (hi/mid/lo gradient, hover + press variants, border trio), `color: var(--pp-text)` (dark ink), and **10px** border-radius. Applies to `.btn-glass-strong`, `.pp-btn-gloss`, `.landing-cta-primary`, `.eps-save-btn`, `.epd-exam-save`. Secondary/tile buttons keep the light `--pp-tile` fill but also moved to 10px radius; the shared `.eppp-launch-btn` recipe keeps its tile fill except for the suite-switch actions described below. Its hover/active/is-active text must stay `var(--pp-text)` (white labels on light fills was a legibility bug) and its icon uses `currentColor`.

**Why:** consistency mandate — one button system across main site + EPPP; dark ink on chrome, never white.
**How to apply:** any new primary button references `var(--pp-chrome-*)` (never re-declared hexes; token lock forbids raw literals in TSX). Guardrail locks in check-design-drift.mjs cover button classes — update locks in the same commit for intentional changes.

The “EPPP Mastery Suite” and “PsychPro Suite” navigation buttons are a scoped visual exception. Their former opaque silver-chrome treatment has been superseded by the richer turquoise glass finish described below. This applies to desktop and mobile versions, not unrelated buttons.

**Why:** On 2026-10-02 the owner requested both suite-switch buttons be “glossy and opaque and have a faint teal/turqoise glow” that gets brighter on hover and click.

**How to apply:** Keep the accent scoped to suite switching; preserve dark text, existing destinations and unrelated filter/exam/print button treatments. Do not expand this exception site-wide.

Suite-switch labels must be just “PsychPro Suite” and “EPPP Mastery Suite,” without “Back to.”

**Why:** The owner explicitly requested those two names only.

**How to apply:** Use these exact labels for desktop and mobile suite-switch actions; keep their existing navigation destinations.

The landing EPPP free-week button, landing Amazon textbook button, and both
dashboard suite-switch buttons share a rounded glass finish with a rich
turquoise hue inspired by the hero artwork, dark readable lettering, and a
turquoise border glow on hover. Preserve the rounded bevel of the owner's
silver-button references rather than returning to the heavy dark-bottom stripe
or the washed-out pale glass fill.

**Why:** The owner reported that the free-trial button “tweaks out” on hover,
requested a more glassmorphic finish with turquoise border glow, then supplied
the hero artwork as a richer hue reference and the textbook/suite buttons as
shape references. They explicitly expanded the scope to those four actions.

**How to apply:** Keep this treatment scoped to these four actions. Keep their
hit targets stationary while the border/glow changes; do not reintroduce hover
lift or label movement. Preserve links, labels, icons, and desktop/mobile
placements. Other primary buttons remain silver chrome.
