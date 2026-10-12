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
dashboard suite-switch buttons share the owner's glossy aqua-glass reference:
a gradient aqua center that blends softly into the reflective turquoise rim, bright edge glints,
and a turquoise glow that strengthens on hover. The reference replaces the
earlier simple saturated gradient. Preserve each button's existing site font,
font size, weight, and letter spacing; the reference image's typography is not
part of the requested change.

**Why:** The owner supplied a glossy aqua-glass button image and said “just make
them like this,” explicitly asking to “keep the font the same as how it is in
the sight just changing the design of the buttons.” The scope remains those
four actions. Earlier hover flickering was also explicitly rejected.
The owner then refined the inside: “more of a gradient rather than having the
hard border.” Avoid sharp concentric inner rings; retain glass reflections
with a gradual transition into the center.
The owner further clarified: “more glossy and transparent.” Use a translucent
face rather than an opaque aqua fill, with brighter, sharper reflections.
Keep the turquoise as rich as the top artwork, not washed-out pale glass.
Hover and click should have only a slight glow, with click a little stronger.
Use the owner's supplied blank aqua-glass artwork rather than a CSS-only
approximation. Preserve its rounded refractive edges when resizing, and put
existing live site text and icons over it. Keep the translucent center and
included glow, with only a slight additional glow on hover/click.

**Why:** The owner requested “the same richness at the design at the top,
glassy and glassmorphic and with a slight glow when hovering and clicking.”
They then rejected that rendition and supplied a smoother aqua-glass reference,
saying “ok no try something like this.”
The owner reinforced the desired finish: “shiny, vibrant, glassy,” then supplied
the text-free artwork after repeated CSS approximations failed to match.

**How to apply:** Keep this treatment scoped to these four actions. Keep their
hit targets stationary while the border/glow changes; do not reintroduce hover
lift or label movement. Preserve links, labels, icons, and desktop/mobile
placements. Other primary buttons remain silver chrome.

All four aqua-glass buttons should be more square like the other buttons,
not capsule-shaped, while retaining the supplied glass finish.

**Why:** The owner requested smaller corners on the EPPP Mastery Suite and
PsychPro Suite buttons, then extended the same treatment to both landing CTAs.
**How to apply:** Keep compact rectangular corners on all four actions
and preserve their existing typography, artwork, links, and stationary glow.
