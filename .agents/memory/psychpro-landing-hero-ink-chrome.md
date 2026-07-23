---
name: PsychPro landing hero — chrome brain only (blue ink cloud removed)
description: Current landing hero composition (2026-07-23) and its guardrail lock; blue ink-cloud design removed on owner order.
---

- CURRENT hero (2026-07-23): owner ordered "remove the blue design from the landing page" — the full-bleed blue ink-cloud band (`ink-cloud-band-cutout.webp`) was REMOVED from the hero and the asset deleted from src/assets. The silver chrome brain cutout (`chrome-brain-cutout.webp`) now renders alone in normal flow, centered between the tagline and headline, `width: clamp(180px, 24vw, 340px)`. Guardrail now FAILS if `.landing-hero-ink` returns and still requires `.landing-hero-chrome` + hero-art-after-wordmark ordering.
- Historical (2026-07-22, one day only): ink-cloud + chrome brain "thought-cloud" composition. During that day the owner angrily rejected every crop/fade/mask attempt to force above-the-fold fit; the next day the whole blue design was removed. Do NOT reintroduce the blue ink cloud.
- Brain drop-shadow must stay OFF during the entrance animation (filter:none at rest, drop-shadow only under `.is-mounted` with a ~1.15s delayed filter transition) — filtering the img while the ancestor's opacity transition composites flashes the rasterized layer's rectangular bounds as a faint box around the brain on first load.
- Entrance animation lists use `.landing-hero-art` (both the opacity-0 list and the `.is-mounted` list — always update BOTH when renaming hero classes).
- Brain Lab promo keeps its grayscale lateral brain image (owner restored it 2026-07-22 after a brief removal — "remove brain images" applied to the hero designs only, NOT the Brain Lab section).
- **Why:** owner iterated through splash brain → ink cloud + chrome brain → chrome brain alone; each step was an explicit owner order. The chrome brain is the surviving hero motif.
