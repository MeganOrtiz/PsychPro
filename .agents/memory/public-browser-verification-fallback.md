---
name: Public browser verification fallback
description: Verify public pages when the managed browser tester fails because of infrastructure rather than app errors.
---

If the managed browser tester repeatedly fails with infrastructure errors, public-page behavior can still be verified using the installed headless Chromium and its DevTools protocol. Do not change authentication or install replacement browser packages just to test an anonymous landing page.

**Why:** The tester can fail before returning any evidence even though the public page and screenshot browser work. Native Chromium can verify clicks, viewport geometry, reduced-motion settings, and keyboard focus independently.

**How to apply:** Check for the installed browser executable, launch an isolated temporary browser profile, and use Node's built-in WebSocket client to issue DevTools commands. Close that browser when finished. Test keyboard focus with actual Tab events; programmatic focus after a mouse click does not necessarily activate `:focus-visible`.

For isolated component checks through Vite, select the CDP target with
`type === "page"` rather than the first target (Chromium includes extension/UI
targets). Match the existing optimized-dependency version query when importing
React; optimized CommonJS modules may expose their APIs on `default`.

**Why:** Browser-only harness imports otherwise run in an extension context,
trigger a dependency reload, or fail with misleading missing-export errors.

**How to apply:** Inspect the live Vite-transformed module imports and CDP
target inventory before mounting real components in an isolated browser DOM.