---
name: Claims discipline — don't assert what you haven't verified
description: Rule for how to talk about completed work when you can't actually observe the result.
---

**Rule:** Never state that a change is "done", "sitewide", "fixed", "applied everywhere", or "will look like X" unless you have observed the result (screenshot, test run, log line, grep showing zero remaining offenders, etc.). If you cannot observe it, describe what you changed and what you expect, and explicitly say you haven't verified.

**Why:** A user once shipped a "sitewide button restyle" based on my claim that swapping the shared `<Button>` component covered every page. It didn't — several pages hard-coded a competing class that overrode it. They saw the broken result in production and lost trust. The mistake wasn't the missed override; it was promising "sitewide" without grepping for competing class names or screenshotting the pages first.

**How to apply:**
- Before saying "sitewide" / "everywhere" / "all pages": `rg` for any class, prop, or pattern that could override the shared change. List the hits. Verify each one.
- Before saying "fixed" on a UI change you couldn't screenshot (auth-gated, env-blocked, etc.): say "I changed X. Expected behavior is Y. I could not screenshot it from this environment — please confirm on the deployed site, or wire a dev key so I can verify."
- Before saying "tested": run the test. If you ran it and it failed, say so.
- Distinguish three states clearly in user-facing language:
  1. **Verified** — "I checked, it works." (you have evidence)
  2. **Applied, unverified** — "I made the change. I haven't been able to confirm visually."
  3. **Intended** — "Here's the plan." (no code written yet)
- When something blocks verification (auth, prod-only feature, missing key), say so up front rather than burying it after a confident-sounding summary.
