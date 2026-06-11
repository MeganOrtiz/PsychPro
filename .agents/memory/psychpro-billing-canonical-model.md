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

**Plan categorization:** classify subscription plans by SERVER-derived canonical tier metadata
(`tierFromTierMetadata`, surfaced as the `tier` field on `/subscription/plans`), never by the
Stripe product DISPLAY NAME. Renaming a product in the Stripe dashboard must not cross-wire tiers.
A product whose `neuronotes_tier` is missing/unrecognized (and not EPPP) is flagged via
`isUnclassifiedPlanMetadata` and dropped from the pricing page instead of silently mis-listed.

**Divergence is RESOLVED (was: mastery-exams treated only literal `pro`/`scholar` as paid):** both
mastery-exam systems now route through canonical `tierFromStatus` + the {pro,scholar} sets, so a
Master subscriber stored as `active` correctly reads as paid everywhere. No remaining known divergence.
