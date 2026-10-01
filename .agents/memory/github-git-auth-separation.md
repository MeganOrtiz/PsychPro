---
name: GitHub connector versus Git authentication
description: An active GitHub connector does not establish working Git CLI push credentials.
---

Treat GitHub connector authorization and Git CLI authentication as separate paths.

**Why:** An authenticated connector request confirmed repository push permissions while Git CLI pushes still failed with invalid-credential errors. Attaching the working connector did not repair Git authentication.

**How to apply:** Verify repository permissions through the connector before blaming an Active connection. Do not delete or reauthorize a working connector to repair a failing Git push. Consult current Replit documentation for Git Providers credential recovery; do not claim recovery until a push succeeds.