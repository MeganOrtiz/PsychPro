---
name: PsychPro backdrop artwork (landing + app/EPPP)
description: Current rule — owner's liquid-brain artwork is the landing backdrop; owner's liquid-waves artwork (waves only, no brain) is the app/EPPP backdrop; both live on the shared .study-page-bg::before layer over a pure-black base.
---

# Backdrop artwork: liquid-brain (landing) + liquid-waves (app/EPPP)

**Current durable rule (owner-directed, 2026-07-12, latest same-day iteration):**
- LANDING carries the owner's liquid-brain artwork (chrome brain hovering
  over cyan liquid waves) via the `.landing-root.study-page-bg::before`
  override. The logged-in app + EPPP suite carry a companion liquid-waves
  artwork (same chrome-wave style, NO brain) on the canonical
  `.study-page-bg::before` rule. Both are owner-supplied high-res
  (3841×2144) JPEGs over a pure `#000` base.
- Earlier the same day: a site-wide liquid-swirl wallpaper was tried, then
  landing-only brain + pure-black app, then the owner added the waves-only
  image for app/EPPP. Owner iterates fast on backdrops.
- The shared `.study-page-bg::before` layer is `position: fixed; inset: 0` —
  PINNED to the viewport so the artwork backs the page all the way to the
  bottom at every scroll depth (owner, 2026-07-12: "the background image
  needs to go down to the bottom of the page across the entire site"; this
  SUPERSEDES the earlier same-day scroll-away order). Never stretch the
  layer over the document height instead — cover-scaling a landscape asset
  over a multi-screen page magnifies and blurs it (verified visually).
  cover/center/no-repeat, `background-attachment: scroll` (`fixed` on the
  fixed layer draws a HiDPI seam — see the seam memory).
- The drift guardrail REQUIRES the waves url on the canonical backdrop and
  the brain url on the landing override, and whitelists exactly these two
  images in index.css. Any future backdrop change must update the guardrail
  locks in the same commit.
- Owner supplies backdrop assets themselves; resolution matters (a 1672×941
  cut looked soft) — always ask for / use their highest-res source.
- The former hero brain <img> was removed; the guardrail FAILS if
  `landing-hero-brain` reappears in landing.tsx. The wordmark/text stack leads
  the landing hero.

**Why:** the owner supplied both artworks with explicit placement
instructions ("use this for the main and eppp sites"). Cyan artwork on the
gray app is intentional owner art — the hue guardrail only scans code
literals, not image files.

**How to apply:**
- Never re-add a per-page backdrop override beyond the landing one; the
  canonical rule is shared.
- Owner-supplied AI art gotchas still apply: check for baked-in 1px bright
  borders against black; never cover-crop portrait art with a focal subject.
- Screenshot desktop and a narrow mobile viewport before calling backdrop
  changes done (landing is public; app pages need the temporary dev-route
  trick since they're auth-gated).
