---
name: PsychPro custom-deck subscription gate
description: Why "upload is broken" reports in PsychPro are almost always the paid-tier 403, not a real upload bug.
---

POST `/api/custom-decks` is protected by a `requireScholar` middleware that 403s any user whose `users.subscription_status` is not in `{scholar, active, pro, trialing}`. The frontend handles 403 by showing a "Scholar subscription required" toast and redirecting to `/subscription`.

**Why:** When a free-tier user uploads a file, the request flows correctly through multer, parses fine, and is rejected only at the subscription check. From the user's POV this looks indistinguishable from "upload is broken" — especially if they were also blocked earlier by the web workflow being down.

**How to apply:** Before diagnosing "upload" issues in PsychPro, first ask the user what message they actually see. If it's the subscription toast, the upload pipeline is healthy — bump their `users.subscription_status` to `scholar` in dev (`UPDATE users SET subscription_status='scholar' WHERE email='...'`) and retest. Only dig into multer / pdf-parse / mammoth / OpenAI if the user reports a different error AFTER getting past the gate.
