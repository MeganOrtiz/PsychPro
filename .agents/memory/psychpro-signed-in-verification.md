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

**Lighter alternative for whole-page chrome (not just one component):** add a
DEV-only wouter route that renders the real page inside its layout WITHOUT the auth
gates (e.g. `<AppLayout><DashboardPage/></AppLayout>` guarded by `import.meta.env.DEV`),
screenshot it, then delete the route. Data hooks 401 but the layout/chrome renders.
To locate a "faint line/seam" precisely, save the app-preview to disk and run per-row
brightness on a background-only column with ImageMagick — distinguishes a real
full-width seam from a localized button border or card-top highlight.

**"Faint line at top of dashboard" gotcha:** the desktop top bar is transparent/
borderless (no line); the mobile header (`md:hidden`) is the one that carries a visible
top seam. Check the mobile breakpoint, not desktop, for such reports.

**When the user says a dashboard fix "did nothing" after many tries:** the most likely
cause is a **stale/cached or published build**, not the code. The fixes are usually
already correct in source. Advise hard-refresh / republish before re-editing.

**Dashboard layout note:** the dashboard grid uses `items-start` with exactly two
children (left column div + spotlight `<aside>`), so the columns are already
top-aligned in code — do not churn alignment.
