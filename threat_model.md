# Threat Model

## Project Overview

PsychPro is a TypeScript pnpm monorepo with an Express 5 API (`artifacts/api-server`), a React/Vite SPA (`artifacts/neuronotes`), PostgreSQL via Drizzle (`lib/db`), Clerk authentication, Stripe subscriptions, and an OpenAI-backed custom study deck feature for uploaded user content. Production users are students and staff; regular users access study content and paid features, while admins can review feedback submissions.

Production assumption for this scan: the deployed app runs with `NODE_ENV=production`, TLS is terminated by the platform, and `artifacts/mockup-sandbox` is dev-only unless production reachability is later demonstrated.

## Assets

- **User accounts and sessions** — Clerk identities, bearer tokens, and the mapping from Clerk user IDs to local user rows. Compromise would allow impersonation and unauthorized access to paid or personal data.
- **User learning data** — progress, quiz attempts, exam attempts, usage counts, and subscription state. This is user-specific application data and must stay scoped to the owning account.
- **Billing state** — Stripe customer IDs, subscription IDs, checkout sessions, billing portal sessions, and the local subscription tier. Tampering here can grant paid access without payment or expose billing metadata.
- **Uploaded study material** — scholar users can upload PDF/DOCX/TXT or paste text, which is stored in `custom_decks.source_text` and partially sent to OpenAI. This can contain private course notes or other sensitive user material.
- **Feedback and admin inbox data** — user-submitted messages, associated email/role metadata, and admin-only workflow state.
- **Application secrets** — Clerk secret key, Stripe secret/webhook secret, OpenAI credentials, database credentials, and Replit connector identity tokens.

## Trust Boundaries

- **Browser to API** — all client input crosses from an untrusted browser into Express routes. Every protected route must authenticate and authorize server-side; client routing and UI gating are not security controls.
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

The main spoofing risk is accepting requests on protected API routes without a valid Clerk-authenticated user. All non-public `/api/**` routes must continue to derive identity from `getAuth(req)` server-side, and no route may trust client-supplied user IDs, role flags, or subscription state. Stripe webhooks must only mutate billing state after signature verification with `STRIPE_WEBHOOK_SECRET`.

### Tampering

Client-controlled inputs include route params, JSON bodies, multipart uploads, and selected Stripe `priceId` values. The service must validate these inputs before they influence billing actions, database writes, or expensive AI generation. Billing tier changes must be derived from trusted Stripe objects, and uploaded content must not let attackers crash or exhaust the server.

### Information Disclosure

The application stores account data, learning progress, billing identifiers, feedback, and raw uploaded study material. Responses must be scoped to the authenticated owner or an admin, logs must avoid leaking secrets or unnecessary sensitive content, and public/authenticated features such as leaderboards must not reveal more user identity data than intended.

### Denial of Service

The highest DoS risks are multipart upload handling on `/api/custom-decks`, expensive AI generation triggered from uploaded or pasted content, and any public endpoint that can be spammed. Upload parsing must be robust against malformed inputs, request sizes must stay bounded, and externally triggered work must not allow low-cost resource exhaustion.

### Elevation of Privilege

The most relevant privilege escalation risks are broken object-level authorization on custom deck data, broken function-level authorization on admin feedback routes, and payment/business-logic flaws that let a normal user obtain scholar/pro access without a matching Stripe product. All owner/admin checks must be enforced in the API, not just in the SPA.
