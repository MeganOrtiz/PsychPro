---
name: Error monitoring choice
description: Owner requested removal of Sentry, not repair or reconnection.
---
Keep Sentry removed unless the owner explicitly asks to add it again.
**Why:** the owner requested disconnecting Sentry and confirmed removal of its app reporting code after being told that this is separate from the integration connection.
**How to apply:** preserve built-in error handling and logs; do not treat old Sentry-restoration suggestions as authorization to reintroduce it.
