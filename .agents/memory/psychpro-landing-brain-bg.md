---
name: PsychPro landing brain background
description: Landing page has its own sanctioned backdrop (owner portrait artwork with baked-in brain); rest of site stays on the shared landscape hq smoke bg.
---

The landing page is the ONE sanctioned exception to the "single shared backdrop" rule.

- Landing renders owner-supplied portrait artwork (glowing brain baked in near the top) via `.landing-root.study-page-bg::before`, anchored `top center` — a centered cover-crop cuts the brain off on wide desktop viewports.
- All other surfaces (app, dashboards, EPPP) keep the shared landscape hq smoke background.
- The design-drift guardrail REQUIRES the landing rule (exact asset + top-center + no filters); it previously forbade any landing override — don't "restore" the old ban.
- **Why:** owner rejected placing a brain cutout inside page content (Brain Lab promo incident) but explicitly wanted their baked-brain composite as the landing backdrop only.
- **How to apply:** background changes are cover-scaled (cropped, never stretched); simulate desktop 16:9 center vs top crops before installing any portrait art with a focal subject near an edge.
