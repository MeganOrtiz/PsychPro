---
name: Public browser verification fallback
description: Verify public pages when the managed browser tester fails because of infrastructure rather than app errors.
---

If the managed browser tester repeatedly fails with infrastructure errors, public-page behavior can still be verified using the installed headless Chromium and its DevTools protocol. Do not change authentication or install replacement browser packages just to test an anonymous landing page.

**Why:** The tester can fail before returning any evidence even though the public page and screenshot browser work. Native Chromium can verify clicks, viewport geometry, reduced-motion settings, and keyboard focus independently.

**How to apply:** Check for the installed browser executable, launch an isolated temporary browser profile, and use Node's built-in WebSocket client to issue DevTools commands. Close that browser when finished. Test keyboard focus with actual Tab events; programmatic focus after a mouse click does not necessarily activate `:focus-visible`.