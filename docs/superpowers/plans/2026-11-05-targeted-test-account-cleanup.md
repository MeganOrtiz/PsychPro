# Targeted Test-Account Cleanup Implementation Plan

> **For Replit Agent:** Execute this plan task by task in the existing workspace. Do not delete account records during implementation or tests. Production changes must be initiated only through the authenticated owner-only application flow.

**Goal:** Add an owner-only Profile tool to safely remove the three approved tester accounts in Development and Production while preserving the admin account and future signups that reuse those emails.

**Architecture:** Keep this cleanup separate from the existing historical 28-account cleanup. Pin account ID/email pairs per environment, expose a preview and fingerprint-confirmed execution API, remove a verified Clerk identity before deleting that account’s app-owned rows, and report identity and app-data outcomes independently.

**Tech Stack:** React, TypeScript, Express, Clerk, Drizzle ORM, PostgreSQL, Zod/OpenAPI, Orval, Node test runner.

**Spec:** `docs/superpowers/specs/2026-11-02-targeted-test-account-cleanup-design.md`

## Implementation and verification report

- Implemented the owner-only Profile preview/confirmation panel and protected targeted-cleanup API. Internal files use `pinned-test-cleanup` / `targetedTestCleanup` naming; public endpoint paths match this plan.
- Read-only inventory found three approved Production profiles; one is blocked by a Stripe customer reference. Development had no matching profiles or Clerk identities, so its pinned inventory is empty. No target set was widened.
- Automated checks passed for policy, identity verification, identity-before-data ordering, retryable partial completion, route authorization/validation, sanitized errors, and Development-only transactional rollback. Synthetic fixture records were rolled back; no tester accounts were deleted.
- API/web type checks, production web build, and route-auth matrix passed. Both application workflows restarted successfully.
- The capture browser reaches the expected sign-in gate at Profile. The signed-in owner panel has not been browser-verified; the owner must preview the current inventory before any destructive confirmation.
- Tests were added alongside implementation rather than following the original test-first ordering below. The original checklist is retained as the approved implementation specification, not a claim of an authenticated deletion rehearsal.

## Global Constraints

- Pin the current matching account IDs in separate Development and Production inventories after a read-only inventory check.
- Each target is bound to its expected email; the server must verify both values before previewing or deleting.
- Never select accounts dynamically by email at execution time. Future signups with the same email addresses are outside this one-time cleanup.
- Preserve the protected admin account and any account with admin privileges.
- Block accounts with Stripe customer/subscription or paid-conversion references, or uploaded source files; do not cancel billing or erase uploads as part of this cleanup.
- The user performs the preview and confirmation once in each environment. Previewing or executing in one environment never mutates the other.
- Return only target emails, blocker/result states, counts, and current environment. Do not log emails, IDs, auth tokens, or user study data.
- Report a target as already absent only after both its app profile and Clerk identity are independently verified absent.
- Production database writes remain inside the authenticated application flow; no direct production SQL writes are used.
- Leave the existing historical test-account cleanup behavior and its fixed 28-account inventory unchanged.

## Review Focus

- A new account reuses a target email: ID-pinned selection excludes it; cover in the inventory-policy test.
- An app profile is absent while its Clerk identity remains: preview and execution still expose and safely clean up the identity; cover in service tests.
- Clerk returns a different email, an unexpected status, or an unavailable response: fail closed before app-data deletion; cover in Clerk verification tests.
- Billing references or uploaded source files appear after preview: stale preview or blocker prevents deletion; cover in fingerprint/blocker tests.
- Clerk deletion succeeds but local cleanup fails: report identity deletion and retryable app cleanup separately; cover in transaction-failure tests.

---

### Task 1: Pin the environment-specific target inventory

**Files:**
- Create: `artifacts/api-server/src/lib/targetedTestCleanupPolicy.ts`
- Create: `artifacts/api-server/test/targetedTestCleanupPolicy.test.ts`

**Interfaces:**
- Produces: Development and Production target inventories containing only `{ id: string; email: string }` pairs; environment selection; normalized email and protected-admin checks; deterministic cleanup fingerprint.

- [ ] **Step 1: Perform read-only inventory checks in both environments**

Query only the approved tester email addresses and the minimal account fields needed to bind each account to its ID and check admin/billing status. Pin each environment’s exact ID/email pairs separately. Exclude `admin@psychprosuite.com`; if the current results do not match the previously approved tester inventory, stop and report the discrepancy rather than widening the target set.

- [ ] **Step 2: Add policy tests before implementation**

Test that only the pinned IDs for the selected environment can be targeted; email must match after normalization; the protected admin and any admin account are rejected; a new ID reusing a target email is rejected; fingerprints change when environment, target identity, email, or blocker state changes.

- [ ] **Step 3: Implement the fixed inventories and pure policy helpers**

Use separate Development and Production constants. Do not query for target IDs by email during preview or deletion. Keep target IDs out of API responses and logs.

- [ ] **Step 4: Run the policy test**

Run: `pnpm --filter @workspace/api-server test targetedTestCleanupPolicy`
Expected: PASS; fixtures use synthetic emails and IDs.

### Task 2: Implement fail-closed identity and app-data cleanup

**Files:**
- Create: `artifacts/api-server/src/lib/targetedTestAccountCleanup.ts`
- Create: `artifacts/api-server/test/targetedTestAccountCleanup.test.ts`
- Create: `artifacts/api-server/test/targetedTestAccountCleanupTransaction.test.ts`

**Interfaces:**
- Consumes: Task 1’s environment-selected target pairs and fingerprint helpers.
- Produces: `previewTargetedTestCleanup(callerId)` returning environment, per-target email/profile/identity/blocker states, counts, protected-admin status, and fingerprint; `executeTargetedTestCleanup(callerId, confirmation, fingerprint)` returning per-target identity and app-data outcomes without IDs. Mark a target already absent only when both stores were verified absent.

- [ ] **Step 1: Test preview state and blockers**

Cover app profile and Clerk identity presence independently, expected-email mismatch, admin protection, Stripe customer/subscription references, paid receipt references, uploaded source paths, identity-lookup failure, and no internal IDs in the public result.

- [ ] **Step 2: Implement environment-specific identity verification**

Use the correct Clerk server key for the current environment. Fetch each pinned Clerk identity and verify its primary email matches the expected email before deletion. Treat verified `404` as absent; treat key misconfiguration, mismatched email, timeouts, and other unexpected responses as blockers. Never delete an identity based on email search alone.

- [ ] **Step 3: Test execute ordering and partial outcomes**

Verify that Clerk identity deletion is attempted first; if it fails, app data remains. If the identity is already absent or is successfully deleted, clean only that user’s app-owned rows in a database transaction. Simulate transaction failure after identity deletion and assert the result reports identity removal while leaving app cleanup retryable.

- [ ] **Step 4: Implement confirmation-time rechecks and deletion**

Immediately before acting, revalidate the owner’s verified primary email and admin row, current environment, pinned ID/email pairs, admin protection, billing/upload blockers, and preview fingerprint. Use a distinct typed confirmation string for this targeted cleanup. Delete each account’s non-cascading owned rows in FK-safe order and rely only on verified user-owned cascades for the remainder; preserve shared courses, topics, and book catalog data. Never cancel subscriptions or erase uploaded files.

- [ ] **Step 5: Verify transaction behavior without removing accounts**

Run the new transaction test only in Development with synthetic IDs and an intentional rollback. Assert owner and fresh-signup fixtures remain, shared content is unchanged, stale confirmations fail, and repeated cleanup is harmless.

### Task 3: Add owner-only API contracts and routes

**Files:**
- Modify: `lib/api-spec/openapi.yaml`
- Modify: generated `lib/api-zod/src/generated/**` and `lib/api-client-react/src/generated/**` through code generation only
- Create: `artifacts/api-server/src/routes/targeted-test-cleanup.ts`
- Modify: `artifacts/api-server/src/routes/index.ts`
- Modify: `artifacts/api-server/test/routeAuthMatrix.test.ts`
- Create: `artifacts/api-server/test/targetedTestCleanupRoutes.test.ts`

**Interfaces:**
- Consumes: Task 2 preview/execute service functions.
- Produces: `GET /api/users/targeted-test-cleanup/preview` and `POST /api/users/targeted-test-cleanup`; generated `previewTargetedTestCleanup` and `executeTargetedTestCleanup` client functions.

- [ ] **Step 1: Define preview, confirmation, and per-target result schemas in OpenAPI**

Preview returns email and status/blocker fields, counts, environment, protected-admin status, and fingerprint; execution accepts confirmation and fingerprint and returns separate identity/app-data outcomes. Neither schema includes account IDs.

- [ ] **Step 2: Generate the Zod schemas and React API client**

Run: `pnpm --filter @workspace/api-spec codegen`
Expected: generated API files expose the new request/response types and client functions; generated files are not edited by hand.

- [ ] **Step 3: Add routes with strict owner authorization**

Require the verified `admin@psychprosuite.com` owner identity on both routes. Set `Cache-Control: no-store` on preview. Return safe structured errors and avoid logging raw Clerk errors, emails, IDs, credentials, or user data.

- [ ] **Step 4: Add API and route-auth tests**

Test anonymous and non-owner rejection, owner success, malformed confirmation rejection, stale fingerprint rejection, sanitized failure responses, and required `PROTECTED` classification in `routeAuthMatrix.test.ts`.

- [ ] **Step 5: Run API checks**

Run: `pnpm --filter @workspace/api-server test targetedTestCleanup`
Expected: new policy, service, transaction, and route tests pass.

### Task 4: Add the targeted cleanup section to Profile

**Files:**
- Create: `artifacts/neuronotes/src/components/targeted-test-account-cleanup.tsx`
- Modify: `artifacts/neuronotes/src/pages/profile.tsx`

**Interfaces:**
- Consumes: generated preview and execute functions from Task 3.
- Produces: Owner-only Profile UI for preview, typed confirmation, execution, and per-account outcome display.

- [ ] **Step 1: Build the preview and confirmation UI**

Show the current environment, each approved target email, whether its app profile and sign-in exist, blockers, and eligible/blocked/already-absent counts. Do not show IDs. Require the typed confirmation and latest preview fingerprint; clear both when the preview refreshes or the signed-in user changes.

- [ ] **Step 2: Show execution states separately**

Disable duplicate submissions. Display Clerk identity and app-data results independently, including partial completion and the safe retry path. Never say an account was fully removed unless both stores were verified.

- [ ] **Step 3: Mount only for the verified owner**

Add this as a distinct section in the existing Profile danger zone, gated in the UI to the verified owner email. Keep server authorization authoritative and leave the historical 28-account cleanup section unchanged.

- [ ] **Step 4: Run frontend checks**

Run: `pnpm --filter @workspace/neuronotes typecheck`
Expected: PASS with generated API types and the new Profile section.

### Task 5: Verify the whole feature and safe environment isolation

**Files:**
- Modify only tests or implementation files identified above if verification reveals a gap.

- [ ] **Step 1: Run targeted API tests and route-auth matrix**

Run: `pnpm --filter @workspace/api-server test targetedTestCleanup`
Run: `pnpm --filter @workspace/api-server test routeAuthMatrix`
Expected: all cleanup tests pass and both new endpoints are classified as protected.

- [ ] **Step 2: Run workspace type and web build checks**

Run: `pnpm --filter @workspace/api-server typecheck`
Run: `pnpm --filter @workspace/neuronotes typecheck`
Run: `pnpm --filter @workspace/neuronotes build`
Expected: all commands pass.

- [ ] **Step 3: Verify the Development UI and API without executing deletion**

Use the owner-only preview flow in Development, confirm the target list and blockers, then stop before typed confirmation. Verify Production is labeled separately and no Production mutation is initiated. No accounts are deleted by implementation or test setup.
