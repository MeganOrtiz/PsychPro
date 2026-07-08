---
name: PsychPro landing brain background
description: Current rule — landing shows the owner's glass-brain artwork unstretched (contain) on a #000 letterbox; earlier cover-crop portrait attempt was rejected. Never stretch/crop landing art.
---

# Landing background: glass-brain artwork, unstretched

**Current durable rule (since July 8, 2026, owner-directed):**
- The LANDING page alone shows the owner's 3D glass-brain artwork
  (`src/assets/bg/landing-glass-brain.jpeg`, portrait, pure-black surround) via a
  `.landing-root.study-page-bg::before` override: `background-size: contain`
  (owner: "don't stretch"), centered, `#000` letterbox floor matching the art's
  black edges. All other pages keep the solid `#030d24` floor.
- The old hero brain cutout (`hero-brain-glow.webp` <img> above the wordmark) was
  REMOVED at owner request ("remove the non glass brain") — hero text now sits
  directly over the background artwork. Don't reintroduce a second brain.
- The drift guardrail (check-design-drift.mjs section 1b) now REQUIRES this landing
  override (asset + contain + #000 + no filters). Any future landing-art change
  must update the guardrail in the same commit.

**Why:** an earlier same-week attempt baked a portrait composite in with
`cover` — desktop crop showed only the top ~40%, the brain rendered huge behind
the headline, and the owner rejected it. `contain` avoids that entire failure
class: never crops, never stretches, letterboxes instead.

**How to apply:** for any future landing artwork, never use `cover` on portrait
art with a focal subject; use `contain` + a floor color matching the art's edges,
and screenshot desktop 16:9 for headline overlap before calling it done.

**Gotcha:** AI-generated JPEGs can carry a bright 1px baked-in border (this one
had a mean-brightness-85 right edge column) that renders as a visible seam line
against the letterbox — check edge rows/columns with numpy and crop 2px if needed.
