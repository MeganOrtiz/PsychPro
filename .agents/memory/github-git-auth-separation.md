---
name: GitHub connector versus Git authentication
description: An active GitHub connector does not establish working Git CLI push credentials.
---

Treat GitHub connector authorization and Git CLI authentication as separate paths.

**Why:** An authenticated connector request confirmed repository push permissions while Git CLI pushes still failed with invalid-credential errors. Attaching the working connector did not repair Git authentication.

**How to apply:** Verify repository permissions through the connector before blaming an Active connection. Do not delete or reauthorize a working connector to repair a failing Git push. Consult current Replit documentation for Git Providers credential recovery; do not claim recovery until a push succeeds.

Git-provider connections can appear as `not_added` in integration search even
though their detail view says they are active and automatically authenticate
workspace Git commands. Do not attach them just to reconcile that status label.

**Why:** The source-control detail view explicitly distinguishes these providers
from ordinary app connectors. A provider marked healthy still produced an
invalid-token error in a no-write push test.

**How to apply:** Read the source-control connection detail, reproduce with
`git push --dry-run`, and use its own authorization-recovery flow when the
credential fails. A successful read of a public remote does not prove push
authentication works.

For PsychPro, the owner approved a repository-restricted personal access token
as the Git authentication fallback. Keep it in Replit Secrets and apply it only
to this repository, never embed it in a remote URL or tracked file.

**Why:** Refreshing the built-in authorization did not resolve Git's
invalid-token rejection; the repository-scoped fallback passed a no-write push
test.

**How to apply:** Preserve the repository-local credential helper when
troubleshooting. Replacing the saved token should not require changing the
remote. Distinguish a successful dry run from an actual push: the former
confirms authentication without validating uploaded objects or server hooks.