---
name: PsychPro site-wide backdrop artwork
description: Current rule — the owner's cyan liquid-swirl artwork is the canonical page background on landing, main app, and EPPP suite via the shared .study-page-bg::before layer; hero brain was removed.
---

# Site-wide backdrop: owner's liquid-swirl artwork

**Current durable rule (owner-directed, 2026-07-12):**
- The owner WANTS the cyan liquid-swirl artwork as the canonical page
  background on all three surfaces (landing, main app, EPPP suite), but it is
  TEMPORARILY REMOVED: the 1672×941 source looked soft and the owner is
  resizing it ("remove this ill resize now"). Floors are pure black again
  until the resized asset arrives.
- When it returns, place it on the single shared `.study-page-bg::before`
  fixed layer: cover/center/no-repeat, `background-attachment: scroll`
  (fixed-on-fixed draws a HiDPI seam — see the seam memory), pure `#000` base
  underneath — and repoint the drift-guardrail backdrop locks + the
  "no images in index.css" whitelist in the same commit (currently locked back
  to no-wallpaper).
- The former hero brain was removed the same day; the guardrail FAILS if
  `landing-hero-brain` reappears in landing.tsx. The wordmark/text stack leads
  the landing hero.

**Why:** the owner supplied the swirl artwork with the explicit instruction to
use it as the background for landing, main site, and EPPP. Cyan artwork on the
gray app is intentional owner art — the hue guardrail only scans code
literals, not image files.

**How to apply:**
- Never re-add a per-page backdrop override; the canonical rule is shared.
- Owner-supplied AI art gotchas still apply: check for baked-in 1px bright
  borders against black; never cover-crop portrait art with a focal subject.
- Screenshot desktop and a narrow mobile viewport before calling backdrop
  changes done (landing is public; app pages need the temporary dev-route
  trick since they're auth-gated).
