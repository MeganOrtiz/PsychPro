---
name: PsychPro canonical billing/EPPP model
description: The decision that all tier/EPPP mapping has ONE home, why, and the one path that's allowed to diverge.
---

# Canonical billing / entitlement model

**Rule:** all "is this a paid tier / which tier / is this EPPP" logic has exactly one home —
a single tier-mapping module in api-server, locked by a regression suite that also fails if
any billing file re-declares the allowlist/status sets inline. New code imports from it; never
write a fresh `new Set([...])` or `if (status === ...)` tier check.

**Why:** an external agent's risky rebase once created "two competing EPPP access models."
The root cause was duplicated inline mappings — each route/webhook kept its own copy. Centralizing
+ a structural test makes a second model hard to reintroduce.

**Key model facts that aren't obvious from a single file:**
- `master` is only a DISPLAY alias for the internal `pro`; both store as `active`. `pro`/`trialing`
  are tolerated legacy read aliases for Master.
- EPPP is a SEPARATE, expiry-driven level. It never writes the general subscription status, and
  Master/Scholar never grant EPPP. These two dimensions must stay decoupled.

**How to apply:** when touching billing/entitlement gating, route through the canonical module
and add/extend the regression suite rather than branching on tier strings locally.

**Known divergence (intentionally NOT fixed during the lock-in):** mastery-exams' own tier helper
treats only literal `pro`/`scholar` as paid, so a Master subscriber stored as `active` reads as
free there. Reconciling it to the canonical mapping changes access behavior, so it's a separate
change, not part of a no-behavior-change lock-in. (No live users were affected when noted.)
