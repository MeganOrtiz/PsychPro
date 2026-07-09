---
name: PsychPro design token lock
description: Token discipline rules — where color literals may live, the scoped pp-* classes, and how the drift guardrail enforces it all.
---

# PsychPro design token lock (2026-07-09, Task-era "edit-safety foundation")

The rule: **no raw color literals (hex / rgba / hsla) anywhere in TS/TSX except three whitelisted files**: `src/lib/palette.ts` (the sanctioned TS literal source: `PP` constants + `alpha()`), `src/data/brain-structures.ts`, `src/pages/dev-glass-preview.tsx`. In `index.css`, palette (blue-family) literals may live only inside `:root`/`.dark` token blocks; neutral grays and semantic red/amber/green are allowed elsewhere.

**Why:** repeated visual regressions came from scattered literals and over-broad recipes silently restyling unrelated elements; the owner mandated an edit-safety foundation so changes are made in one place.

**How to apply:**
- CSS/inline styles → `var(--pp-*)` or `rgba(var(--pp-*-rgb), a)` (channel triplets exist for all pp colors; `--pp-ink` added).
- SVG attrs, Recharts, three.js, print-window HTML (separate doc — CSS vars won't resolve) → `PP.x` / `alpha(PP.x, a)` from `@/lib/palette`.
- `palette.ts` and `index.css` tokens must stay in sync — guardrail section checks hex + triplet equality; add both in the same commit.
- Broad recipes are banned: no `[class*=...]` selectors, no bare-element descendant recipes under page scopes (e.g. `.study-page-bg button`). Instead the shared primitives EMIT scoped classes: `ui/card` → `.pp-card-opaque`, `ui/input`+`ui/textarea` → `.pp-input-well`, `ui/select` trigger + `ui/toggle` outline → `.pp-btn-outline`; `.pp-btn-gloss`/`.pp-btn-glass` are opt-in for raw buttons. The guardrail verifies both the class definitions and the primitive emission.
- Known intentional delta: Radix-portaled dialog inputs now get `.pp-input-well` (old descendant recipe missed portals).
- Recharts attribute selectors in `ui/chart.tsx` use CSS-escaped hex (`#\63_cc`) — semantically identical, don't "fix" it back.
- `replit.md` has a "Making a Safe Design Change" section describing the workflow.
