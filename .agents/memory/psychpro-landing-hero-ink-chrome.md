---
name: PsychPro landing hero — full-bleed splash artwork
description: Current landing hero (2026-07-23 PM): owner-supplied full-bleed blue-splash + chrome-brain image as hero background; earlier ink-cloud and chrome-only compositions retired.
---

- CURRENT hero (2026-07-23, owner-supplied image + explicit spec): one full-bleed background image (`hero-ink-splash.png` — blue ink splashes framing a silver chrome brain, baked into ONE image) rendered edge-to-edge directly beneath the sticky nav. Owner's exact constraints: NO card/box/framed container, NO padding/margins/border-radius/borders/shadows around the image, NO max-width on the image or any parent, `object-fit: cover` (never contain), NO gray fallback background. Implementation: `.landing-hero` is full-width (max-width:none) with `min-height: calc(100svh - 58px)`; `.landing-hero-bg` is absolute inset:0 cover; text (wordmark/tagline up top, headline/blurb/CTAs pushed low by a flex spacer `clamp(320px,60vh,660px)`) overlays with z-index:1; text max-width applies to text only.
- Guardrail (check-design-drift.mjs) now pins: `.landing-hero-bg` <img> must exist AND its CSS must contain `object-fit: cover`.
- Hero history, all same-week owner orders: splash brain → ink-cloud band + chrome cutout (07-22) → chrome brain alone (07-23 AM, "remove the blue design") → this full-bleed image (07-23 PM, owner supplied the art). Retired assets deleted: ink-cloud-band-cutout.webp, chrome-brain-cutout.webp. Owner iterates fast — expect further hero changes; always update the guardrail lock in the SAME commit.
- Entrance animation: the bg image is NOT in the opacity-0 entrance lists (shows instantly); text elements keep the staggered --delay reveal. `.landing-hero-art`/`.landing-hero-chrome`/`.landing-hero-ink` classes no longer exist.
- Owner previously (07-23 AM) angrily rejected crop/fade/mask attempts on hero art; the current object-fit:cover crop was explicitly ORDERED by the owner for this image — that ban applied to the old cloud cutout, not to cover on this background.
- Brain Lab promo keeps its grayscale lateral brain image (owner restored it 2026-07-22 — "remove brain images" applied to hero designs only).
- **Why:** owner supplied the exact artwork and a precise no-container spec; deviations (boxes, contain, gray fills) are explicit violations.
