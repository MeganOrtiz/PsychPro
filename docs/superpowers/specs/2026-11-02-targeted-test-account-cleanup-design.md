# Targeted Test-Account Cleanup Design

## Goal

Provide a safe, owner-only way to remove the three specifically identified tester accounts while preserving `admin@psychprosuite.com`. The cleanup must work separately in Development and Production and must not affect future accounts that reuse these email addresses.

## Scope and targeting

- Pin the current matching account IDs in separate Development and Production inventories after a read-only inventory check.
- Each target is bound to its expected email; the server must verify both values before previewing or deleting.
- Never select accounts dynamically by email at execution time. Future signups with the same email addresses are outside this one-time cleanup.
- Preserve the protected admin account and any account with admin privileges.

## Owner-only Profile flow

Add a dedicated cleanup section to the existing Profile page. The API will require the verified owner identity (`admin@psychprosuite.com`) and operate only on the current server environment.

1. Preview shows each pinned target’s email, whether its app profile and Clerk identity exist, and any deletion blocker. It does not expose internal account IDs.
2. Block accounts with Stripe customer/subscription or paid-conversion references, or uploaded source files; do not cancel billing or erase uploads as part of this cleanup.
3. Deletion requires a typed confirmation and a fingerprint from the latest preview. The server rechecks the owner, environment-specific ID/email pairs, admin protection, blockers, and fingerprint immediately before acting.
4. Delete the Clerk identity first, verifying its email matches the expected target. If identity verification/deletion fails, retain app data. Once the identity is removed or confirmed absent, delete only that account’s app-owned rows in a transaction.
5. Report identity and app-data outcomes separately. If identity deletion succeeds but local cleanup fails, leave a retryable local profile and report the partial result; never claim full removal unless both are verified.

The user performs the preview and confirmation once in each environment. Previewing or executing in one environment never mutates the other.

## Failure handling and privacy

- Fail closed if owner verification, Clerk lookup, environment selection, or blocker checks fail.
- Reject stale previews and changed target inventories; require a new preview.
- Return only the target emails, blocker/result states, counts, and current environment. Do not log emails, IDs, auth tokens, or user study data.
- Check the app profile and Clerk identity independently. Report a target as already absent only when both are verified absent; if the app row is missing but its Clerk identity remains, keep it eligible for safe identity cleanup.

## Verification

- Unit-test target ID/email binding, protected-admin exclusion, billing/upload blockers, environment separation, and stale-fingerprint rejection.
- Test API owner authorization and confirmation validation.
- Test identity deletion failure retains app data, local transaction failure reports partial completion, and successful removal verifies both stores.
- Test that a later account reusing one of the same email addresses is never selected.
- Build and run the existing API, type, and UI checks. No account is deleted by implementation or test setup.

## Self-review

- The target is limited to a pinned account inventory, not a persistent email-based deletion rule.
- Admin, billing-linked, and uploaded-source accounts are explicitly protected.
- The current app deletion helper removes app data before Clerk identity deletion; this design avoids that unsafe order for this cleanup.
- Production database writes remain inside the authenticated application flow; no direct production SQL writes are used.
