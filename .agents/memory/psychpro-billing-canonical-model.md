---
name: PsychPro canonical billing/EPPP model
description: The decision that all tier/EPPP mapping has ONE home, why, and the one path that's allowed to diverge.
---

# Canonical billing / entitlement model

New-customer offerings now follow the [two-plan pricing and trial decision](psychpro-two-plan-trials.md). Master/Scholar mappings below remain compatibility rules for existing subscribers, not public plan choices.

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

**Trial-aware gating:** a raw legacy billing status alone cannot describe study access now that
trials are separate from payment. Always use shared effective-access logic for study gates.
**Why:** starting a free week must not create a subscription, and expiry must never erase the
account's saved materials or accidentally revoke legacy paid access.

**Billing portal policy:** allow payment-method updates, invoice history, and cancellation at
the end of the paid period. Keep self-service plan switching disabled.
**Why:** the owner approved the portal configuration while preserving existing subscribers'
prices and access; unrestricted switching could move grandfathered customers onto new terms.
**How to apply:** keep this policy when updating Stripe portal settings. Add required subscription
lifecycle webhook events without removing existing events or rotating the signing secret.
