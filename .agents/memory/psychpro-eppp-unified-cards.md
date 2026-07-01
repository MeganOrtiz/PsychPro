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

**Update (CURRENT — both families now on the launch-pill signature glass):** the
"boost color up, keep depth, saturate190/S100, fill alpha 0.95/0.99" specifics
above are SUPERSEDED. Owner then asked to make every tile+button match the
top-right launch pills (`.eppp-launch-btn`). So BOTH `.bg-card` (index.css) and
`.epd-card` (eppp-dashboard.tsx template CSS) now use the identical signature
glass: `linear-gradient(145deg, hsl(var(--surf-hue) 80% 30% /0.58), hsl(var(--surf-hue) 86% 18% /0.70))`,
border `rgba(118,228,247,0.45)`, `blur(16px) saturate(140%)`, glow
`0 0 26px -6px rgba(118,228,247,0.42)` + inset ring. The two live in DIFFERENT
files, so keep them in lockstep by hand — they silently diverged once. The drift
lock still only parses index.css `.bg-card`; treat `.epd-card` as its manual twin.
See `psychpro-glass-sweep-reverted.md` Update 3.
