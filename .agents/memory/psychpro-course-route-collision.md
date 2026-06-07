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

**Why it was left in place:** the infra-only task deployed the owner's provided
route file verbatim; no frontend consumes either route yet, so the collision is
latent. Swapping mount order is NOT a fix — it would shadow the live legacy
category system (new handler does `parseInt(category)` → NaN → fails).

**How to apply (before any frontend wires the new system):** disambiguate the
path shape (e.g. `/courses/by-id/:courseId/mastery-exam`, or a numeric-only param
constraint on one route), then add an integration test asserting a numeric
`/courses/<id>/mastery-exam` hits the NEW handler's response contract. The 5 other
new routes (GET /courses, /courses/:courseId, /courses/:courseId/mastery-state,
POST .../attempt, GET /users/me/course-mastery) do NOT collide and are reachable.
Note: `routeAuthMatrix.test.ts` gives false confidence here — both routes are
classified protected, so a legacy 401 passes even though the new handler never runs.
