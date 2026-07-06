---
name: PsychPro account deletion (Clerk specifics SUPERSEDED — history only)
description: SUPERSEDED by the Replit Auth migration (see psychpro-replit-auth-migration.md). The durable lesson (report deletion success only when the identity provider confirms) still holds; the Clerk-specific mechanics below are historical.
---

> **SUPERSEDED (Clerk mechanics only):** PsychPro migrated off Clerk onto Replit Auth. The
> DURABLE lesson survives — never claim an account/duplicate was fully removed unless the
> identity provider confirms the identity itself was deleted (UI field renamed
> `clerkDeleted`→`identityDeleted`). The Clerk-SDK-specific details below are historical.


This Clerk instance is external / self-managed on a custom domain. Its browser-side flows
(self-serve "Delete account" in the UserProfile modal, and even the hosted sign-in page)
fail intermittently — requests to the Clerk frontend API error out. Symptom users report:
the built-in Delete account button "does nothing." Testing-skill programmatic Clerk sign-in
also fails here, so real-auth e2e against this app cannot be exercised in the build env.

**Decision:** account deletion is owned by the app server-side (Clerk backend SDK with the
secret key, which works even when browser flows don't). It cancels Stripe, wipes app data
in FK-safe order, then deletes the Clerk identity. Self-serve via DELETE /api/users/me;
admin duplicate cleanup via GET /api/users/duplicates + DELETE /api/users/:userId.

**Why the Clerk-delete outcome must be authoritative:** a surviving Clerk identity can
recreate local rows via the profile/feedback auto-upsert paths on next sign-in. So a
"duplicate removed" that only deleted DB rows is temporary. The deletion helper returns
`clerkDeleted` / `stripeCancelFailed`; UI must surface partial failures rather than
unconditionally claiming success.

**How to apply:** never tell the user a duplicate/account was fully removed unless
`clerkDeleted === true`. Production duplicate cleanup can only be executed by the user in
the deployed app (build env uses Clerk TEST keys; prod DB is read-only from tooling).
