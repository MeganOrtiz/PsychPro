---
name: api-server route-auth matrix
description: Adding any api-server route requires classifying it in routeAuthMatrix.test.ts, and the test hides later drift behind its first failed check.
---

# api-server route-auth matrix test

`artifacts/api-server/test/routeAuthMatrix.test.ts` enumerates every registered
Express route and asserts its unauthenticated behavior against a manual
classification: `PROTECTED` (must 401), `ANONYMOUS`/`ROOT_ANONYMOUS` (must NOT
401), or `SPECIAL` (out-of-band auth, e.g. Stripe webhook → 400).

**Rule:** any new route you register MUST be added to one of those sets in the
same change, or the suite fails with "Registered but NOT classified". Routes
using `requireUserId` or `requireAdminCaller` go in `PROTECTED`.

**Gotcha — it stops at the first failed check.** The test runs checks in order:
(1) unclassified-route discovery, then (2) PROTECTED return-401, then (3)
ANONYMOUS must-not-401. It throws at the first failing stage, so fixing stage 1
can suddenly surface long-latent stage-3 drift. Don't assume "one fix = green";
re-run after each reconciliation.

**Why this matters:** the whole app is auth-gated and free-tier entitlement
gates sit behind `requireUserId`, so routes that read "public catalog"
(e.g. `GET /topics/:topicId/flashcards|quizzes|practice-exam`) are actually
PROTECTED now. If the matrix still lists them as ANONYMOUS, the classification
is stale — trust the live 401, move them to PROTECTED.
