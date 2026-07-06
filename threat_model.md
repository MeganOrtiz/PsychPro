# Threat Model

## Project Overview

PsychPro is a TypeScript pnpm monorepo with an Express 5 API (`artifacts/api-server`), a React/Vite SPA (`artifacts/neuronotes`), PostgreSQL via Drizzle (`lib/db`), Clerk for client-side identity, Stripe subscriptions, and an OpenAI-backed custom study deck feature for uploaded user content. Production users are students and staff; regular users access study content and paid features, while admins can review feedback submissions.

**Authentication posture:** Clerk is the identity provider on both ends. The frontend wraps the app in `<ClerkProvider>` + `ClerkTokenBridge`, and the API server mounts `@clerk/express` `clerkMiddleware()` globally. Every protected `/api/**` route derives the caller's user id from `getAuth(req).userId` via the helpers in `artifacts/api-server/src/lib/userId.ts` (`requireUserId` → `401 Unauthorized` when the Clerk session is missing or invalid; `getOptionalUserId` for the small enumerated whitelist of anonymous-tolerant routes). The legacy `X-User-Id` request header is no longer consulted for any authorization decision; a forged value cannot impersonate another user. Admin gating (`users.isAdmin`) is re-read from the database keyed on the verified Clerk user id, and the admin-token issuer at `/api/admin/tokens` uses a separate `MCP_ADMIN_SECRET` shared secret.

Production assumption for this scan: the deployed app runs with `NODE_ENV=production`, TLS is terminated by the platform, and `artifacts/mockup-sandbox` is dev-only unless production reachability is later demonstrated.

## Assets

- **User accounts and sessions** — Clerk identities (session JWTs verified by `clerkMiddleware()` on every request) and the mapping from Clerk user ids to local user rows. Compromise of a session token would allow impersonation; forging the legacy `X-User-Id` header has no effect because the server ignores it.
- **User learning data** — progress, quiz attempts, exam attempts, usage counts, and subscription state. This is user-specific application data and must stay scoped to the owning account.
- **Billing state** — Stripe customer IDs, subscription IDs, checkout sessions, billing portal sessions, and the local subscription tier. Tampering here can grant paid access without payment or expose billing metadata.
- **Uploaded study material** — scholar users can upload PDF/DOCX/TXT or paste text, which is stored in `custom_decks.source_text` and partially sent to OpenAI. This can contain private course notes or other sensitive user material.
- **Feedback and admin inbox data** — user-submitted messages, associated email/role metadata, and admin-only workflow state.
- **Application secrets** — Clerk secret key, Stripe secret/webhook secret, OpenAI credentials, database credentials, and Replit connector identity tokens.

## Trust Boundaries

- **Browser to API** — all client input crosses from an untrusted browser into Express routes. Identity on every protected `/api/**` route is derived from the verified Clerk session (`getAuth(req).userId`); client routing and UI gating are not security controls but the Clerk bearer token verification is. An enumerated whitelist of routes intentionally accepts anonymous callers (health check, `/admin/status`, public topic reads, Stripe webhook, subscription plans listing, leaderboard, client-error reports, `feedback/is-admin`, public object reads, public profile lookups gated by the `pref_show_on_featured_work` opt-in, the approved-only featured-work list/spotlight, featured-work item GET, and OAuth protocol/discovery endpoints); every other route rejects unauthenticated requests with `401`. The `/api/admin/tokens*` router and `/api/mcp` use separate non-Clerk auth (`MCP_ADMIN_SECRET` shared secret and per-token bearer respectively).
- **API to PostgreSQL** — the API has broad database access. Query scoping errors, broken authorization, or unsafe writes can expose or corrupt multi-user data.
- **API to Stripe** — the server creates checkout and portal sessions and accepts Stripe webhooks. Billing state must be derived from trusted Stripe data and verified webhook events, not from client input.
- **API to OpenAI** — uploaded or pasted user content is sent to an external model provider. Only intended content should cross this boundary, and abusive uploads must not degrade service availability.
- **Authenticated user to admin boundary** — normal users can submit feedback, but only admins should access the inbox or mutate feedback status.
- **Production to dev-only boundary** — `artifacts/mockup-sandbox`, tests, scripts, and local provisioning helpers are out of production scope unless a production code path imports or serves them.

## Scan Anchors

- **Production entry points:** `artifacts/api-server/src/app.ts`, `artifacts/api-server/src/routes/**`, `artifacts/neuronotes/src/App.tsx`
- **Highest-risk code areas:** `artifacts/api-server/src/routes/custom-decks.ts`, `artifacts/api-server/src/routes/subscription.ts`, `artifacts/api-server/src/webhookHandlers.ts`, `artifacts/api-server/src/routes/feedback.ts`, `artifacts/api-server/src/routes/users.ts`
- **Public surfaces:** `/api/healthz`, `/api/topics`, `/api/topics/:id`, `/api/stripe/**`, `POST /api/client-errors`
- **Authenticated surfaces:** most `/api/**` routes including user profile, progress, subscription status/checkout/portal, feedback submission, custom decks, leaderboard
- **Admin surfaces:** `GET /api/feedback`, `PATCH /api/feedback/:id/status`, `/admin/feedback`
- **Usually dev-only:** `artifacts/mockup-sandbox/**`, tests under `artifacts/api-server/test` and `lib/db/test`, CLI scripts under `scripts/**` and `lib/db/scripts/**`

## Threat Categories

### Spoofing

Caller identity on every protected `/api/**` route is derived from the Clerk session token verified by `@clerk/express` `clerkMiddleware()` — the legacy `X-User-Id` request header is no longer consulted, so forging it has no effect. Residual spoofing risks therefore reduce to: (a) Clerk session token theft (mitigated by TLS termination at the platform, short-lived tokens, and Clerk's session revocation), (b) trusting any client-supplied role/tier flag in a request body (forbidden — admin/`isAdmin` is always re-read from the DB keyed on the verified Clerk user id, and Stripe-derived billing state only mutates after webhook signature verification with `STRIPE_WEBHOOK_SECRET`), and (c) the small enumerated whitelist of anonymous-tolerant routes where a caller may legitimately have no Clerk session — those routes must not perform user-scoped writes, must not surface any other user's data, and must not grant any privilege based on `getOptionalUserId` returning `null`.

### Tampering

Client-controlled inputs include route params, JSON bodies, multipart uploads, and selected Stripe `priceId` values. The service must validate these inputs before they influence billing actions, database writes, or expensive AI generation. Billing tier changes must be derived from trusted Stripe objects, and uploaded content must not let attackers crash or exhaust the server.

### Information Disclosure

The application stores account data, learning progress, billing identifiers, feedback, and raw uploaded study material. Responses must be scoped to the authenticated owner or an admin, logs must avoid leaking secrets or unnecessary sensitive content, and public/authenticated features such as leaderboards must not reveal more user identity data than intended.

### Denial of Service

The highest DoS risks are multipart upload handling on `/api/custom-decks`, expensive AI generation triggered from uploaded or pasted content, and any public endpoint that can be spammed. Upload parsing must be robust against malformed inputs, request sizes must stay bounded, and externally triggered work must not allow low-cost resource exhaustion.

### Elevation of Privilege

The most relevant privilege escalation risks are broken object-level authorization on custom deck data, broken function-level authorization on admin feedback routes, and payment/business-logic flaws that let a normal user obtain scholar/pro access without a matching Stripe product. All owner/admin checks must be enforced in the API, not just in the SPA.
