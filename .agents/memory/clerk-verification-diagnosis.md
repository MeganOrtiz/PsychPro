---
name: Clerk verification diagnosis
description: Distinguishing repeated code generation from duplicate email delivery without speculative auth changes.
---

Different OTPs in otherwise identical emails indicate distinct code generation, not simple redelivery of one email. A single user submission can still trigger multiple preparations inside Clerk's prebuilt UI.

**Why:** Public Clerk reports describe automatic preparation after an already-prepared password/security-check transition, as well as preparation on remount. Moving to a newer SDK does not necessarily fix both paths.

**How to apply:** Inspect the sign-in response's verification state and the following factor-preparation requests before attributing duplicate messages to app mounts or user resends. Do not disable device protection, change auth providers, or claim a fix based solely on matching reports. Check the actually loaded browser SDK, not just the installed React wrapper, when comparing affected versions.

Prefer fixing an identified router-integration gap before replacing Clerk's prebuilt authentication flow.

**Why:** A controlled authentication rewrite broadens the change to recovery, provider redirects, and security-factor handling. Correcting internal navigation preserves those existing Clerk behaviors and addresses a known remount risk with a smaller change.

The owner reported that the published routing correction worked on 2026-10-01 after the duplicate-email investigation.

**Why:** This is user-reported confirmation of the narrow approach, not a captured Clerk request trace establishing the exact mechanism.

**How to apply:** Preserve SPA navigation during verification. If duplicate emails recur, investigate the new attempt rather than assuming every duplicate has the same cause.

**How to apply:** Keep external redirects as real browser navigation and validate internal push/replace behavior. A screenshot showing a verification route as a new document establishes a reload, not the number of emails it caused; keep the production email outcome unconfirmed until observed after publishing.