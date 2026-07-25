---
name: PsychPro dashboard backdrop artwork
description: Owner liquid-frame backdrop on the two dashboards + wordmark-under-brain placement rules
---
Owner-supplied liquid-frame artwork (white ground, teal edges, chrome brain top-center) backs ONLY the main + EPPP dashboards via a `.dashboard-artwork::before` fixed viewport layer (z -1 over the white floor). Locked in check-design-drift.mjs; do not extend to other pages or edit the image.

**Wordmark placement:** the old top-bar hero wordmark banners (PSYCHPRO / EPPP MASTERY SUITE) were REMOVED from both layout headers; the brand title now lives in page content (`.dashboard-brand`) right under the baked-in brain. Don't resurrect the header banners.

**Centering math (why offsets exist):** the fixed backdrop centers on the VIEWPORT, but dashboard content sits right of a 288px sidebar (w-64 + m-4) inside an overflow-y-auto main — so `.dashboard-brand` pulls itself back to viewport width via `--dash-x-offset` (+ EPPP page padding) and clears the brain with `padding-top: max(23vh, 12.95vw) - header offset` (brain bottom ≈23% of displayed cover height).

**Dev verification:** dashboards are Clerk-gated; use the DEV route `/__dashboard-preview` (`?view=main` for the main mimic) — it fakes the sidebar+topbar geometry. Dev-only lazy routes must gate the import itself on `import.meta.env.DEV` or the chunk ships in prod builds.
