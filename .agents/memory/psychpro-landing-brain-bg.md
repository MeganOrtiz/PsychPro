---
name: PsychPro site-wide backdrop artwork
description: Current rule — the owner's cyan liquid-swirl artwork is the canonical page background on landing, main app, and EPPP suite via the shared .study-page-bg::before layer; hero brain was removed.
---

# Site-wide backdrop: owner's liquid-swirl artwork

**Current durable rule (owner-directed, 2026-07-12):**
- The cyan liquid-swirl artwork is THE canonical page background on all three
  surfaces (landing, main app, EPPP suite). Owner supplied a resized
  3135×1764 source (first 1672×941 cut looked soft — resolution matters, see
  the smoke-bg memory); stored as an ~88-quality JPEG (solid black base, no
  transparency needed, ~700KB vs 4.5MB PNG).
- It lives on the single shared `.study-page-bg::before` layer, which is
  `position: absolute` anchored to the page top and one viewport tall
  (`height: 100vh`) — the owner explicitly wants the artwork to SCROLL AWAY
  with the content, never stay pinned to the viewport. cover/center/no-repeat,
  `background-attachment: scroll` (`fixed` re-pins it AND draws a HiDPI seam —
  see the seam memory), pure `#000` base underneath.
- Note: in the logged-in app layout the shell doesn't body-scroll (inner
  `main` has overflow-y-auto), so the artwork effectively fills the shell
  there; the scroll-away behavior applies where the document scrolls
  (landing/marketing pages).
- The drift guardrail REQUIRES this url on both backdrop rules (app + landing
  override) and whitelists it as the ONE image allowed in index.css. Any
  future backdrop change must update the guardrail locks in the same commit.
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
