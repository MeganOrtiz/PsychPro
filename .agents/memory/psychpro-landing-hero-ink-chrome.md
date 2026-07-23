---
name: PsychPro landing hero — ink cloud + chrome brain
description: Current landing hero composition (2026-07-22) and its guardrail lock; old splash-brain assets deleted.
---

- CURRENT hero (2026-07-22, owner mockup): full-bleed blue ink-cloud band (`ink-cloud-band-cutout.webp` — background REMOVED per owner, transparent alpha so it blends with the silver page; 100vw via `margin-left: calc(50% - 50vw)`) + silver chrome brain cutout (`chrome-brain-cutout.webp`) absolutely centered on the band's bottom edge, overhanging 48% below (`translate(-50%, 48%)`); `.landing-hero-art` reserves overhang room via margin-bottom.
- Entrance animation lists use `.landing-hero-art` (both the opacity-0 list and the `.is-mounted` list — always update BOTH when renaming hero classes).
- Brain Lab promo keeps its grayscale lateral brain image (owner restored it 2026-07-22 after a brief removal — "remove brain images" applied to the hero designs only, NOT the Brain Lab section).
- Design-drift guardrail pins `.landing-hero-ink` + `.landing-hero-chrome` presence and hero art ordering (after wordmark). Old splash/white-brain hero assets deleted from src/assets.
- **Why:** owner supplied a specific reference mockup; the previous chrome splash brain is retired.
