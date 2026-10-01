---
name: Clerk verification diagnosis
description: Distinguishing repeated code generation from duplicate email delivery without speculative auth changes.
---

Different OTPs in otherwise identical emails indicate distinct code generation, not simple redelivery of one email. A single user submission can still trigger multiple preparations inside Clerk's prebuilt UI.

**Why:** Public Clerk reports describe automatic preparation after an already-prepared password/security-check transition, as well as preparation on remount. Moving to a newer SDK does not necessarily fix both paths.

**How to apply:** Inspect the sign-in response's verification state and the following factor-preparation requests before attributing duplicate messages to app mounts or user resends. Do not disable device protection, change auth providers, or claim a fix based solely on matching reports. Check the actually loaded browser SDK, not just the installed React wrapper, when comparing affected versions.