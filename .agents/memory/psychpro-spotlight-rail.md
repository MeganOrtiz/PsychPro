---
name: PsychPro Spotlight rail full-height
description: The signed-in dashboard's right Spotlight rail must be a full-height box matching the target comp, not content-height.
---

# PsychPro dashboard Spotlight rail

The right "Spotlight" rail on the signed-in dashboard (`artifacts/neuronotes/src/pages/dashboard.tsx`) is intended to be **full column height**: its top edge aligns with the left column's "Begin Your Journey" card and its footer aligns with the bottom of the Streak/Leaderboard row.

**Why:** This matches the approved design comp. A previous pass marked the alignment "done" but the rail was still only content-height — the recurring complaint. The fix that actually works:
- parent grid uses `items-stretch` (not `items-start`)
- the `<aside>` must NOT use `lg:sticky`/`self-start` (either makes it content-height)
- the Spotlight `StudySurface` uses the `fillHeight` prop (adds `h-full` to outer + inner) plus a `flex flex-col` inner
- internal vertical distribution: content wrapper `flex flex-1 flex-col`, person block `flex-1 ... justify-center` (centers portrait, pins footer to bottom)

**How to apply:** If asked to touch this rail again, preserve the full-height stretch chain above. Don't reintroduce `sticky`/`self-start`.

**Verification trick:** The signed-in dashboard cannot be screenshotted (external Clerk blocks the test browser/harness). To verify layout, build a throwaway surrogate in the mockup-sandbox that reproduces the exact grid + flex classes, screenshot it, then delete it.
