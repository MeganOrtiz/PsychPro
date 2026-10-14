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
Hover and click should have a clear turquoise glow, with click stronger.
Use the owner's supplied blank aqua-glass artwork rather than a CSS-only
approximation. Preserve its rounded refractive edges when resizing, and put
existing live site text and icons over it. Keep the translucent center and
glass reflections without a residual blue strip below the resting button.

**Why:** The owner requested “the same richness at the design at the top,
glassy and glassmorphic and with a slight glow when hovering and clicking.”
They then rejected that rendition and supplied a smoother aqua-glass reference,
saying “ok no try something like this.”
The owner reinforced the desired finish: “shiny, vibrant, glassy,” then supplied
the text-free artwork after repeated CSS approximations failed to match.

**Current interaction rule:** The owner now requests visible lift and stronger
glow on hover and click for all matching aqua-glass buttons, including the promo
page actions. Remove the residual blue haze below the resting glass rim.

**Why:** The owner said the residual blue “needs to go for all buttons like that”
and the buttons “need to raise and glow better when hovering and clicking.”
This supersedes the earlier stationary-only interaction preference.

The outer white trim should also be removed from matching aqua-glass buttons;
the bright reflections within the glass itself may remain.
**Why:** the owner asked whether the white trim could go, then supplied a close-up
of the landing EPPP action to identify the edge.

The lower landing-page trial and plan actions should match the top aqua-glass
CTA's finish and font, rather than retaining a separate silver, tracked type style.
**Why:** the owner requested the bottom buttons be “the same style and font as
the ones at the top.”
**How to apply:** keep the existing labels, destinations and trial handlers.
This expands the aqua-button scope, not the plan-card palette or content.

**How to apply:** Preserve the artwork, live typography, links, placement, and
compact corners. Keep a stable hit-area buffer to avoid hover flicker and
disable movement for reduced-motion users. Other primary buttons remain silver
chrome; do not apply interactive effects to the plan cards.

All four aqua-glass buttons should be more square like the other buttons,
not capsule-shaped, while retaining the supplied glass finish.

**Why:** The owner requested smaller corners on the EPPP Mastery Suite and
PsychPro Suite buttons, then extended the same treatment to both landing CTAs.
**How to apply:** Keep compact rectangular corners on all four actions
and preserve their existing typography, artwork, links, and interactive glow.

The Free, Master, and Scholar landing cards may share the buttons' aqua-glass
appearance, but the boxes and their content must remain as they are.

**Why:** The owner clarified “by treatment i mean just allowing the design and
aethetic like the buttons. keep the boxes and content in them as they are.”
**How to apply:** Change only these three cards' visual surface. Preserve their
dimensions, shape, layout, typography, content, and non-button behavior; do not
extend this aqua exception to other cards.

The separate EPPP Mastery Suite landing plan box uses the same glossy-glass
appearance in pale, clear yellow, never olive/green or muted mustard.
Yellow applies only to that box; Free/Master/Scholar
remain aqua and the buttons retain their existing finish.

**Why:** The owner requested “the same look and feel of the other tiers just in
yellow. only the yellow for the EPPP mastery suite box.”
**How to apply:** Tint only the decorative glass layer of that plan card, leaving
its layout, text, icons, typography, and behavior unchanged.

**Why pale yellow:** After rejecting the olive-green cast and trying bright
yellow, the owner requested “maybe more like a pale yellow?” Keep the softer
yellow finish without reintroducing green or olive tones.
