# Subscription tier-selection audit (Bulletproof tier selection)

This audit traces the full path a user takes from the pricing catalog to an
enforced entitlement, and documents the guarantees that make tier selection
"bulletproof": each plan lands the user on exactly that entitlement, the two
paid access dimensions (Master/Scholar vs EPPP) never overwrite each other, and
a misconfigured Stripe plan fails safe to Free instead of granting accidental
access.

All "is this paid / which tier / is this EPPP" logic routes through one module —
`artifacts/api-server/src/lib/tierMapping.ts` — locked by
`test/billingModel.test.ts` (the "no second model" guard). The behaviors below
are additionally locked by `test/billingFlows.test.ts`, which exercises the real
`getEntitlements` path against the real database.

## The path

```
Stripe catalog ──► pricing UI ──► checkout ──► webhook finalization ──► entitlements
(neuronotes_tier)  (card tier)    (Stripe)     (stored status / EPPP)    (getEntitlements)
```

1. **Catalog → pricing UI.** `GET /subscription/plans` reads each active Stripe
   product's `metadata.neuronotes_tier` and returns a server-derived canonical
   `tier` field (`tierFromTierMetadata`). The onboarding and subscription pages
   bucket each card by `plan.tier`, **never** by the product's display name — so
   renaming a Stripe product can never move a card under the wrong heading or
   cross-wire a tier. EPPP options come from `GET /eppp/plans` separately.

2. **Checkout.** The user is sent to Stripe Checkout for the price tied to the
   plan they picked. `POST /eppp/checkout` additionally validates that the
   submitted price actually belongs to the EPPP product, so a user can't supply
   an arbitrary price id and obtain EPPP at the wrong price.

3. **Webhook finalization.** `webhookHandlers.ts` resolves the purchased
   product and:
   - For an approved Master/Scholar product, stores the canonical
     `subscriptionStatusFromTierMetadata(...)` result in `subscription_status`
     (`scholar` → `scholar`; `pro`/`master` → `active`).
   - For the EPPP product, writes `eppp_access_until` / `eppp_subscription_id`
     and **never** touches `subscription_status`.

4. **Entitlements.** `getEntitlements` maps the stored status to a tier
   (`tierFromStatus`) and computes EPPP access from `eppp_access_until`
   independently. General content gates on the subscription tier; EPPP content
   gates on EPPP access; admins bypass both.

## Findings (each confirmed by an automated test)

| Guarantee | Evidence | Test |
| --- | --- | --- |
| Picking Free lands on the permanent capped Free tier; the first quiz/exam are available, then the account locks at the cap (1 quiz, 1 exam, 10 flashcards/topic). The lock is the signal the client turns into an upgrade prompt. | `getEntitlements` returns `quizLocked`/`examLocked` true once the lifetime attempt counts reach the caps. | `billingFlows.test.ts` (free-cap exhaustion); `billingModel.test.ts` (`computeEntitlementFlags`) |
| Picking Scholar lands on Scholar and Master lands on Master (`pro`) — never cross-wired. | The chosen plan's tier metadata finalizes to the stored status via `subscriptionStatusFromTierMetadata`, then reads back as the matching tier; the two never collapse to one. | `billingFlows.test.ts` (Scholar/Master landing) |
| Buying EPPP grants EPPP access only and never the general subscription; conversely a Master/Scholar subscription never grants EPPP. | EPPP access is driven solely by `eppp_access_until`; the general tier is driven solely by `subscription_status`; the webhook writes only the relevant column. | `billingFlows.test.ts` (EPPP isolation, both directions); `billingModel.test.ts` (EPPP separation invariants) |
| A misconfigured / untagged Stripe plan fails safe to Free instead of granting accidental access. | `subscriptionStatusFromTierMetadata` returns `null` for unknown/missing tags; the webhook stores `free`; the catalog never lists the product. | `billingFlows.test.ts` (unknown-plan fail-safe); `billingModel.test.ts` |

## Misconfiguration is surfaced, not silent

- `GET /subscription/plans` warns (and drops the product) when a product's
  `neuronotes_tier` is **missing/blank or unrecognized** and it isn't the EPPP
  product (`isUnclassifiedPlanMetadata`).
- `GET /eppp/plans` warns when an EPPP one-time price lacks a valid
  `eppp_months`.
- The webhook warns when an active subscription/checkout can't map to an
  approved tier (and falls back to Free), and when a one-time EPPP purchase
  would grant 0 months.

## Note on the previously-suspected stale check

Both mastery-exam systems (`course-mastery.ts`, the reachable one, and
`mastery-exams.ts`) already route through the canonical `tierFromStatus` and the
shared paid sets, so a Master subscriber stored as `active` is correctly treated
as paid everywhere. No reconciliation was required.

## Coverage boundary

The Stripe network call that turns a `priceId` into a product (inside the
webhook) has no injection seam and is not exercised by the integration suite.
The decision it feeds — metadata → stored status — is covered directly through
the canonical `subscriptionStatusFromTierMetadata` helper the webhook itself
calls, so the full metadata → status → tier → entitlement chain is validated.
