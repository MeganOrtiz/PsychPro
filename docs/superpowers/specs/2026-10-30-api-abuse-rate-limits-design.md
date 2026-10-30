# API abuse rate limits

## Goal

Reduce automated abuse of expensive or state-changing API actions without
CAPTCHA, while leaving public browsing, normal study reads, and the sign-in /
sign-up experience unchanged.

## Design

Add a reusable PostgreSQL-backed sliding-window limiter for a small set of
authenticated write actions. Each accepted request is checked against both an
account-specific key and an IP-specific key. Identifiers are HMAC-hashed before
storage; raw IP addresses, email addresses, passwords, and request bodies are
not stored in the limiter table.

The check and insert run in one database transaction. Per-key advisory locks
prevent simultaneous requests from passing the same remaining allowance across
multiple API instances. Requests over a limit receive HTTP 429 with a
`Retry-After` header and a generic response. If the limiter database check
fails, the protected action returns HTTP 503 instead of bypassing the guard.

The limiter table retains accepted-request hashes and timestamps for up to 24
hours. A background cleanup removes older rows. It does not store application
content or modify user, trial, subscription, or payment records.

## Initial route coverage

Use separate one-hour windows per action. A request is limited when either its
account or IP bucket has reached its cap:

| Action | Account cap | IP cap |
| --- | ---: | ---: |
| AI custom-deck generation | 10 requests/hour | 30 requests/hour |
| Upload URL creation | 20 requests/hour | 60 requests/hour |
| PsychPro or EPPP checkout session creation | 5 requests/hour | 20 requests/hour |
| Study-trial activation | 5 requests/hour | 20 requests/hour |

The custom-deck limit is applied after the existing subscription/authorization
check and before multipart file parsing. Other limits run after authentication
and before their route handlers. Existing feedback, client-error, OAuth
registration, and MCP limits remain unchanged.

## Explicit non-goals

- No CAPTCHA or visible human-verification step.
- No site-wide block, public-page limit, or limit on normal study reads.
- No changes to Clerk sign-in/sign-up behavior, onboarding, entitlements,
  existing AI quotas, Stripe billing, trial eligibility, or payment handling.
- No automatic changes to Clerk dashboard settings. A separate checklist will
  identify the settings to review in both Development and Production.

## Verification

- Unit tests cover allowed requests, account/IP caps, concurrent-safe
  accounting, rolling-window expiry, `Retry-After`, database failure behavior,
  and cleanup.
- Route tests confirm protected endpoints still return 401 when unauthenticated
  and that the limiter is mounted on the intended routes.
- Run API typecheck and the relevant API test suites; restart the API workflow
  and inspect its logs.
