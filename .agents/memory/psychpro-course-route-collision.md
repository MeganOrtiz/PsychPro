---
name: PsychPro two course systems share the /courses/:x/mastery-exam path
description: Why the new courseId mastery-exam GET route is unreachable, and the constraint to fix before frontend wiring.
---

# /courses/:x/mastery-exam path collision

Two routers both define `GET /courses/:x/mastery-exam`:
- LEGACY `routes/course-mastery.ts` → `/courses/:category/mastery-exam` (string category)
- NEW `routes/mastery-exams.ts` → `/courses/:courseId/mastery-exam` (numeric id)

`courseMasteryRouter` is mounted BEFORE `masteryExamsRouter` in `routes/index.ts`,
so Express matches the legacy handler for ANY value (including numeric ids). The
new GET mastery-exam route is therefore unreachable in practice.

**The frontend uses the LEGACY category system.** `mastery-exams.ts` (`:courseId`)
is effectively DEAD CODE. So any mastery-exam behavior (gating, scoring, question
pooling) must be implemented in `course-mastery.ts`, NOT `mastery-exams.ts`.
Editing `mastery-exams.ts` is a no-op in production.

**Access gating lives in `course-mastery.ts` (`resolveMasteryAccess`).** Both the
main site AND the EPPP site call the SAME category endpoints (`GET
/courses/:category/mastery-exam`, `POST /course-mastery-attempts`) — they differ
only by the frontend route prefix (`/eppp/...` vs `/courses/...`). So the gate must
branch on `isEpppTopic(category's topics)`, not on the URL prefix:
- EPPP course → require `hasEpppAccess` (the separate expiry-driven level)
- general/main-site course → require Master/Scholar (`tierFromStatus` → pro/scholar)
- admin bypasses both
Blocked → `402 {upgrade:true, eppp}`; frontend renders `UpgradePrompt`.

**Why this mattered:** the collision had silently DROPPED both paywalls — for a
while anyone who aced the free practice exams could open main-site AND EPPP mastery
exams. Restoring the gate in the reachable handler is what fixed it.

Swapping mount order is NOT a fix — the new handler does `parseInt(category)` → NaN.
Note: `routeAuthMatrix.test.ts` gives false confidence — both routes are classified
protected, so it never reveals which handler actually runs.
