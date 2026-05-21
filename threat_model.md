# Threat Model

## Project Overview

PsychPro is a TypeScript pnpm monorepo with an Express 5 API (`artifacts/api-server`), a React/Vite SPA (`artifacts/neuronotes`), PostgreSQL via Drizzle (`lib/db`), Clerk for client-side identity, Stripe subscriptions, and an OpenAI-backed custom study deck feature for uploaded user content. Production users are students and staff; regular users access study content and paid features, while admins can review feedback submissions.

**Authentication posture (current runtime reality):** Clerk is mounted on the frontend (`<ClerkProvider>` + `ClerkTokenBridge`) and the API server mounts `@clerk/express` `clerkMiddleware()` globally so MCP routes can call `getAuth(req)`. However, the existing `/api/**` routes derive identity from `getUserId(req)` / `requireUserId(req, res)` in `artifacts/api-server/src/lib/userId.ts`, which reads the `X-User-Id` request header verbatim with **no token verification**. The signed-in frontend writes the Clerk user id into that header (via `setClerkUserId` → `getCurrentUserId`), so in normal use the value matches the Clerk session, but any client can forge it. This is header-trust, not server-verified authentication; hardening these routes to derive identity from `getAuth(req)` is a tracked follow-up and the threats below assume the current header-trust posture.

Production assumption for this scan: the deployed app runs with `NODE_ENV=production`, TLS is terminated by the platform, and `artifacts/mockup-sandbox` is dev-only unless production reachability is later demonstrated.

## Assets

- **User accounts and sessions** — Clerk identities, the user-id value sent in the `X-User-Id` header (which the API currently trusts without verification), and the mapping from those IDs to local user rows. Compromise — or simply forging the header — would allow impersonation and unauthorized access to paid or personal data.
- **User learning data** — progress, quiz attempts, exam attempts, usage counts, and subscription state. This is user-specific application data and must stay scoped to the owning account.
- **Billing state** — Stripe customer IDs, subscription IDs, checkout sessions, billing portal sessions, and the local subscription tier. Tampering here can grant paid access without payment or expose billing metadata.
- **Uploaded study material** — scholar users can upload PDF/DOCX/TXT or paste text, which is stored in `custom_decks.source_text` and partially sent to OpenAI. This can contain private course notes or other sensitive user material.
- **Feedback and admin inbox data** — user-submitted messages, associated email/role metadata, and admin-only workflow state.
- **Application secrets** — Clerk secret key, Stripe secret/webhook secret, OpenAI credentials, database credentials, and Replit connector identity tokens.

## Trust Boundaries

- **Browser to API** — all client input crosses from an untrusted browser into Express routes. Today most `/api/**` routes identify the caller by the client-supplied `X-User-Id` header (header-trust), not by a server-verified Clerk session; client routing and UI gating are not security controls and the header itself is not a security control either. Routes that handle billing, admin actions, or cross-user data should not assume the header is authentic until the planned `getAuth(req)`-based hardening lands.
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

The dominant spoofing risk today is that `/api/**` routes accept the caller's identity from the `X-User-Id` request header without verifying the accompanying Clerk bearer token. Any client can substitute another user's id and the server will treat the request as that user for non-billing reads/writes. Mitigations that must already hold: no route may trust client-supplied role flags or subscription state (admin/tier must be re-read from the DB or from trusted Stripe data), and Stripe webhooks must only mutate billing state after signature verification with `STRIPE_WEBHOOK_SECRET`. The planned remediation is to move identity derivation to `getAuth(req)` server-side on every non-public route; until that ships, treat `X-User-Id` as an untrusted client input for threat-modeling purposes.

### Tampering

Client-controlled inputs include route params, JSON bodies, multipart uploads, and selected Stripe `priceId` values. The service must validate these inputs before they influence billing actions, database writes, or expensive AI generation. Billing tier changes must be derived from trusted Stripe objects, and uploaded content must not let attackers crash or exhaust the server.

### Information Disclosure

The application stores account data, learning progress, billing identifiers, feedback, and raw uploaded study material. Responses must be scoped to the authenticated owner or an admin, logs must avoid leaking secrets or unnecessary sensitive content, and public/authenticated features such as leaderboards must not reveal more user identity data than intended.

### Denial of Service

The highest DoS risks are multipart upload handling on `/api/custom-decks`, expensive AI generation triggered from uploaded or pasted content, and any public endpoint that can be spammed. Upload parsing must be robust against malformed inputs, request sizes must stay bounded, and externally triggered work must not allow low-cost resource exhaustion.

### Elevation of Privilege

The most relevant privilege escalation risks are broken object-level authorization on custom deck data, broken function-level authorization on admin feedback routes, and payment/business-logic flaws that let a normal user obtain scholar/pro access without a matching Stripe product. All owner/admin checks must be enforced in the API, not just in the SPA.
