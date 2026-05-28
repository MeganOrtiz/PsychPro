---
name: PsychPro Clerk browser flows & account deletion
description: Why account deletion is app-owned server-side instead of Clerk's built-in self-serve, and the rule for reporting deletion success.
---

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
