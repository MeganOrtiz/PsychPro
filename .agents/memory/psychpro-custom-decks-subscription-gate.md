---
name: PsychPro custom-deck subscription gate
description: Why "upload is broken" reports in PsychPro are almost always the paid-tier 403, not a real upload bug.
---

POST `/api/custom-decks` is protected by a `requireScholar` middleware that 403s any user who is neither an admin nor has `users.subscription_status` in `{scholar, active, pro, trialing}`. The frontend handles 403 by showing a "Scholar subscription required" toast and redirecting to `/subscription`.

**Why:** When a free-tier user uploads a file, the request flows correctly through multer, parses fine, and is rejected only at the subscription check. From the user's POV this looks indistinguishable from "upload is broken" — especially if they were also blocked earlier by the web workflow being down.

**Admin exemption:** `requireScholar` honors `isCallerAdmin(req)` (DB `isAdmin` flag OR verified email in the `admin@psychprosuite.com` allowlist). Admins pass regardless of tier — every paid gate in this app should follow `unrestricted = isAdmin || isSubscribed` (see `entitlements.ts`); custom-decks was the one that didn't until this was fixed. `isCallerAdmin` self-heals the users row, so re-fetch after calling it before relying on the row.

**Prod vs dev DB gotcha:** Production and development are SEPARATE databases. "I upgraded my account to scholar" confirmations done via dev SQL never affect the published app. Worse, the same email can exist under multiple Clerk identities in prod (admin@psychprosuite.com had two: one `free`, one `active`). The admin exemption sidesteps all of this for admins.

**How to apply:** Before diagnosing "upload" issues in PsychPro, first ask the user what message they actually see. If it's the subscription toast and they're the owner/admin, the admin exemption should cover them — verify isAdmin is resolving. For real non-admin users, bump `users.subscription_status` in the CORRECT database (prod for the published app, via Stripe/publish flow, not read-only tooling). Only dig into multer / pdf-parse / mammoth / OpenAI if the user reports a different error AFTER getting past the gate.
