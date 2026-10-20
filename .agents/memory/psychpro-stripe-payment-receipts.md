---
name: Stripe one-time purchase receipts
description: Prevent duplicate payment notifications from granting additional EPPP access.
---

Credit a completed one-time EPPP purchase only once per Stripe Checkout Session,
while allowing genuinely separate purchases to extend remaining access.
Receipt deduplication and the access update must be persistent and atomic.

**Why:** Replaying a sandbox payment notification for a six-month pass extended
the same test customer's entitlement to twelve months without another purchase.
Stripe legitimately retries event deliveries.

**How to apply:** Protect against sequential retries, concurrent deliveries, and
process restarts. An in-memory set is insufficient for Autoscale. Do not treat
delivery success or a checkout redirect as proof that repeat deliveries are safe.
