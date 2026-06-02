---
name: Replit secrets vs env vars quirks
description: Non-obvious behavior when trying to programmatically fix/replace a value that is stored as a Secret (not a plain env var).
---

# Replit secrets vs env vars quirks

When a key is stored as a **Secret** (created via `requestEnvVar`), you generally cannot fix a bad value yourself:

- `setEnvVars` refuses: "already set up as secrets and setting them may cause conflicts." It will not overwrite a secret-namespaced key.
- `deleteEnvVars` **reports success but does NOT remove the secret** — it only deletes plain env vars of that name. A follow-up `viewEnvVars` still shows the secret present.
- There is no exposed "set secret value" / "delete secret" callback. The only ways to correct a secret value are: (a) `requestEnvVar` again (user re-pastes), or (b) the user edits it in the Secrets tab.
- `process.env` is **not** available inside the `code_execution` sandbox (throws on access). Read env values via bash instead, or use `viewEnvVars` (existence/classification only — never values).

**Workaround when the user keeps mis-pasting a non-secret value** (e.g. a Clerk *publishable* key, which is safe to handle): normalize defensively in code instead of fighting the secret store. Users commonly paste the whole dashboard "Quick copy" line including the `NAME=` prefix (e.g. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...`). Extract the bare token in code (for Clerk: regex `pk_(?:test|live)_[^\s"']+`). Note Clerk keys contain base64 chars like `=` and `_`, so an alphanumeric-only regex truncates them.

**Why:** spent multiple round-trips because two dev Clerk keys were pasted swapped and with the `NAME=` prefix, and neither `deleteEnvVars` nor `setEnvVars` could correct the secret-stored value. The code-level normalize self-heals and is origin-agnostic.
