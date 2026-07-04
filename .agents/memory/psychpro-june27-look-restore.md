---
name: PsychPro June-27 look restore
description: The owner reverted the later "darkening" pass back to the June 27 reference look; do not re-darken.
---

The visual drift the owner cares about lives almost entirely in `artifacts/neuronotes/src/index.css`
plus the CSS-in-JS `styles` block of `src/pages/eppp-dashboard.tsx`. `src/lib/study-theme.ts` was not involved.

**Decision:** The owner RETRACTED the heavier "darkening / glow-removal" iteration and chose the
June 27 reference look (deep near-black cerulean with GLOWING glass cards + the shared nebula ::after wash).
This supersedes the aggressive-darkening direction. Do NOT re-apply the darker/less-glow pass on the
EPPP dashboard or global surfaces unless the owner explicitly asks again.

**Why:** Owner said they preferred the recovered reference image (EPPP Mastery Suite dashboard) and
explicitly distrusted an eyeball copy — so the fix was a git-EXACT byte restore, not a hand-edit.

**How to apply:** To reproduce a past visual state, `git show <commit>:<path> > <path>` for the exact
files (never hand-edit CSS to "match"). Then confirm BOTH guardrails still pass — the June 27 CSS
predates the design lock but happens to match the locked `.bg-card` recipe / --surf-hue 193 exactly,
so no lock update is needed. Verify the look with a throwaway DEV wouter route rendering the real
auth-gated component (Clerk blocks the test browser), screenshot, then remove the route.
