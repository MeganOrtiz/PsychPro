---
name: PsychPro signed-in page verification
description: How to visually verify auth-gated PsychPro (neuronotes) pages when external Clerk blocks the test browser.
---

# Verifying signed-in PsychPro (neuronotes) pages

The neuronotes app sits behind **external Clerk** auth. Auth-gated pages cannot be
exercised in this environment by EITHER path: the preview/manual browser Clerk flow
fails, AND the testing harness's programmatic helper (`runTest` with
`testClerkAuth: true`) fails with `Unprocessable Entity` from `signInClerkUser`.

**Consequence:** you cannot screenshot the live signed-in dashboard (or any logged-in
page) here. Don't keep retrying Clerk login — reach for the surrogate below.

**Verification path that works:** reproduce the exact edited CSS/markup in an isolated
`mockup-sandbox` component (copy the real glass classes + the JSX slice verbatim into a
`_group.css` + `.tsx`), restart the mockup workflow, and screenshot
`/__mockup/preview/<folder>/<Component>`. Delete the temp mockup after capture. This
gives pixel-accurate proof of styling without needing auth. Combine with `pnpm --filter
@workspace/neuronotes run typecheck`.

**When the user says a dashboard fix "did nothing" after many tries:** the most likely
cause is a **stale/cached or published build**, not the code. The fixes are usually
already correct in source. Advise hard-refresh / republish before re-editing.

**Dashboard layout note:** the dashboard grid uses `items-start` with exactly two
children (left column div + spotlight `<aside>`), so the columns are already
top-aligned in code — do not churn alignment.
