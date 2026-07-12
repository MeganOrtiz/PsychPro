---
name: PsychPro site-wide backdrop artwork
description: Current rule — the owner's cyan liquid-swirl artwork is the canonical page background on landing, main app, and EPPP suite via the shared .study-page-bg::before layer; hero brain was removed.
---

# Site-wide backdrop: owner's liquid-swirl artwork

**Current durable rule (owner-directed, 2026-07-12, latest same-day iteration):**
- LANDING PAGE ONLY carries the owner's liquid-brain artwork (chrome brain
  hovering over cyan liquid waves) on the `.landing-root.study-page-bg::before`
  override; the logged-in app + EPPP floors are PURE BLACK (no wallpaper).
  Earlier the same day a site-wide liquid-swirl wallpaper was tried on all
  three surfaces, then replaced by this landing-only artwork.
- The shared `.study-page-bg::before` layer is `position: absolute` anchored
  to the page top and one viewport tall (`height: 100vh`) — the owner
  explicitly wants landing artwork to SCROLL AWAY with the content, never
  pinned to the viewport. cover/center/no-repeat,
  `background-attachment: scroll` (`fixed` re-pins it AND draws a HiDPI seam —
  see the seam memory), pure `#000` base underneath.
- The drift guardrail REQUIRES background-image none on the app backdrop, the
  liquid-brain url on the landing override, and whitelists it as the ONE image
  allowed in index.css. Any future backdrop change must update the guardrail
  locks in the same commit.
- Owner supplies backdrop assets themselves and iterates fast; resolution
  matters (a 1672×941 cut looked soft) — prefer their highest-res source,
  store as quality-88 JPEG (solid black base, no transparency needed).
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
