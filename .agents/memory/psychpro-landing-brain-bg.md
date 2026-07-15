---
name: PsychPro backdrop artwork (site-wide)
description: Current rule — ONE owner-supplied liquid-flare artwork backs the ENTIRE site (landing + app + EPPP) on the shared .study-page-bg::before layer over a pure-black base; the earlier brain/waves two-image pair is superseded.
---

# Backdrop artwork: single site-wide liquid-flare image

**Current durable rule (owner-directed, 2026-07-15):**
- ONE image site-wide: the owner's liquid-flare artwork (teal liquid flames
  on both edges, dark center) backs landing, app, and EPPP alike on the
  canonical `.study-page-bg::before` rule. NO per-page override exists —
  the guardrail now FAILS if a `.landing-root.study-page-bg::before`
  override reappears.
- This supersedes the 2026-07-12 two-image pair (landing liquid-brain +
  app/EPPP liquid-waves). Owner iterates fast on backdrops; expect churn.
- The layer recipe is unchanged: `position: fixed; inset: 0; z-index: -2`,
  cover/center/no-repeat, `background-attachment: scroll` (`fixed` on the
  fixed layer draws a HiDPI seam), `background-color: #000000`. Viewport-
  pinned so artwork backs the page to the bottom at every scroll depth;
  never stretch over document height (magnifies and blurs).
- The drift guardrail REQUIRES the site-liquid-flare url on the canonical
  backdrop and whitelists exactly that one image in index.css. Any future
  backdrop change must update the guardrail locks in the same commit.
- Owner supplies backdrop assets themselves; resolution matters (a 1672×941
  cut looked soft) — always use their highest-res source. Convert owner
  PNGs → JPEG q90 via PIL (~3800×2160 class assets land ~700KB).
- The former hero brain <img> stays removed; the guardrail FAILS if
  `landing-hero-brain` reappears in landing.tsx. The wordmark/text stack
  leads the landing hero, with large top padding so the headline sits in
  the artwork's dark center.

**Why:** owner order 2026-07-15: "use this as the background across the
entire site" with a single attached artwork. Cyan artwork on the gray app
is intentional owner art — the hue guardrail only scans code literals, not
image files.

**How to apply:**
- Never add a per-page backdrop override; the canonical rule is shared.
- Owner-supplied AI art gotchas still apply: check for baked-in 1px bright
  borders against black; never cover-crop portrait art with a focal subject.
- Screenshot desktop and a narrow mobile viewport before calling backdrop
  changes done (landing is public; app pages need the temporary dev-route
  trick since they're auth-gated).
