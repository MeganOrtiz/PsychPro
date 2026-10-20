---
name: Stripe sandbox authorization
description: Distinguishes Stripe dashboard switching, MCP authorization, and application runtime credentials.
---

Opening PsychPro sandbox in the Stripe Dashboard does not authorize the assistant's
Stripe connection for that sandbox. In the OAuth review screen, use **Add another
account** to add the sandbox while preserving the live account. Verify that the
connection lists a separate account with `livemode: false` before test operations.

**Why:** Reauthorizing only the existing live row repeatedly left the connection
live-only, even while the owner was viewing the sandbox dashboard. Stripe Connect's
“Connected accounts” screen is unrelated to this authorization.

**How to apply:** Check accessible accounts after authorization, not the dashboard
banner alone. MCP sandbox access also does not supply the application's runtime
API keys or endpoint signing secret. Keep test setup separate from live credentials
and never replace shared live keys merely to run a preview payment test.
