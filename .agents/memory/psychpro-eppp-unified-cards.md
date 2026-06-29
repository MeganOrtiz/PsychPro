---
name: PsychPro main + EPPP share ONE boosted card family
description: Main site and EPPP cards now share a deliberately boosted cerulean glass recipe. The "EPPP is the untouched template" framing is retracted.
---

# Main + EPPP cards share one boosted glass family

**Retracted framing:** older notes (and re-pasted session plans) say "EPPP is the
TEMPLATE, stays untouched, main must match the old `.epd-card`." That is no longer
true. The owner iteratively asked for *more color, not more brightness, same depth*,
then "boost even more," then "match them and boost EPPP." So the card recipe was
deliberately boosted across BOTH main site and EPPP. Do not treat EPPP as sacred.

**The boost (color up, brightness/depth unchanged):** cyan top-bloom 0.05→0.14,
glass `saturate` 140%→190% (blur5 base recipe), inner cyan glow 0.16→0.28, outer
corona 0.10→0.18, white inset highlight 0.10→0.03, fill saturation 90%→100% — while
keeping fill lightness (17%/11%) and alpha (0.95/0.99) so perceived depth is the
same. This lives in the shared recipe (`.bg-card` in index.css + StudySurface
`tone="light"`) and was swept across the main-site pages + dashboard banners. The
`check-design-drift.mjs` RECIPE lock was updated in lockstep (saturate190 / glow0.28
/ corona0.18) — any future recipe change must update that lock in the same commit.

**EPPP boost was surgical, NOT a blanket bump — preserve its hierarchy.** EPPP has
two families: the base `.epd-card` (was the old dull recipe identical to old main →
full-boosted to match the new base) and a bright/elevated translucent family
(`blur(20px)`, fill alpha ~0.74, big glows 0.40–0.45). For the elevated family only
the **card-background fills** were pushed to S100 and the **card glass** `saturate`
135%→170%. Its white insets (0.12) and existing glows were left alone.
**Why:** EPPP intentionally uses ~12 different hsl saturations (S 78–92) for text,
borders, and sub-tiles. Blanket-bumping every fill to S100 oversaturates text and
collapses the elevation hierarchy. So "match" here is *perceptual* (shared boosted
color character), not literal recipe parity.

**How to apply / verify:** edit the shared recipe + drift lock together; for EPPP
target the specific card-background two-stop strings, never a global S→100 sweep.
Clerk blocks the test browser, so visual confirmation needs an owner screenshot or a
mockup-extract of the real composition — never a synthetic route.
