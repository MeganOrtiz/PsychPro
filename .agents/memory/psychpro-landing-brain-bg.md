---
name: PsychPro landing brain background
description: Owner's baked-brain portrait artwork was installed as a landing-only backdrop, then REJECTED on desktop; landing is back on the shared hq smoke bg.
---

Attempt (July 8, 2026): owner supplied a portrait composite (glowing brain baked in near the top) and asked for it as the landing-only background. Installed via a `.landing-root.study-page-bg::before` override, top-anchored. Owner REJECTED the result and it was fully reverted (CSS, drift guardrail, lock doc) — landing inherits the shared backdrop again.

- **Why it failed:** desktop cover-crop shows only the top ~40% of a 3:4 portrait image, so a subject baked near the top renders huge and collides with the hero headline. Mobile looked fine.
- **How to apply:** any future landing artwork with a focal subject should be LANDSCAPE (~16:9, e.g. 5120x2880) with the subject composed where it should sit relative to the hero text, or keep the subject as a separate element instead of baking it into the bg. Always simulate the desktop 16:9 crop AND check headline overlap before installing.
- The unused assets remain: `src/assets/bg/psychpro-landing-brain-bg.jpg` (rejected composite, unreferenced) and `src/assets/brain-views/lateral-glow.png` (brain cutout).
- The guardrail ban on landing backdrop overrides is RESTORED — a future sanctioned exception must update check-design-drift.mjs + docs/design-system-lock.md in the same commit again.
