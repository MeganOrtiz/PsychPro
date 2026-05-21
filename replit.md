# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Claude Desktop (MCP) content uploader

PsychPro exposes an admin-only MCP server at `${ORIGIN}/api/mcp` so the owner can add topics, flashcards, quiz questions, study guides, and practice exams directly from Claude Desktop.

One-time setup:
1. Generate a strong random string (e.g. `openssl rand -base64 32`).
2. Save it as the **secret** `MCP_ADMIN_SECRET` in the Replit Secrets pane (must be at least 16 characters). Never commit it.
3. Restart the `artifacts/api-server: API Server` workflow so the env var is picked up.
4. Visit `/admin/tokens` in the app, paste the secret to unlock, then click **Create** to mint a Claude bearer token. Copy it immediately — it is shown only once.
5. In Claude Desktop: **Settings → Connectors → Add custom connector**. Set the URL to `https://<your-domain>/api/mcp`, auth type to **Bearer Token**, and paste the `ppmcp_…` token. Restart Claude Desktop.

Security model: the admin-token CRUD routes (`/api/admin/tokens`) require `Authorization: Bearer <MCP_ADMIN_SECRET>` — a server-side shared secret that cannot be forged from the network. The browser keeps the secret in session storage only (no localStorage, no cookies, never sent to logs). The MCP route itself (`/api/mcp`) requires its own per-Claude bearer token; tokens are 32 random bytes prefixed `ppmcp_`, stored as SHA-256 hashes, owner-bound to a sentinel row so unrelated `isAdmin=true` flips elsewhere in the codebase cannot grant MCP write access. Per-token rate limit: 60 requests/minute. Revoking a token is immediate.

### Claude.ai web custom connector (OAuth 2.1 + PKCE)

Claude.ai's web "Add custom connector" dialog only supports OAuth, so `/api/mcp` also accepts short-lived OAuth access tokens prefixed `ppmcp_oauth_` (1hr access, 30d refresh with rotation). Discovery is published at `https://psychprosuite.com/.well-known/oauth-authorization-server` (and an `/api/.well-known/...` alias). To pair: in Claude.ai, **Settings → Connectors → Add custom connector**, paste the MCP URL `https://psychprosuite.com/api/mcp`, choose OAuth, and click Connect — the flow auto-approves (single-user deployment, no consent screen) and Claude lands on "Connected".

OAuth security: PKCE S256 + exact-match `redirect_uri` + single-use 60-second auth codes mean a passive observer who sees the redirect URL cannot exchange the code without the verifier. Auth codes, access tokens, and refresh tokens live in process memory (in-memory `Map`s) — acceptable for the declared single-user, single-instance use; a server restart forces Claude.ai to re-pair.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Auth**: **Clerk identity, header-trust transport** (re-introduced May 2026). The frontend wraps the app in `<ClerkProvider>` (see `artifacts/neuronotes/src/App.tsx`) and the `ClerkTokenBridge` component pushes the Clerk session token into the generated API client as `Authorization: Bearer <token>` and the Clerk user id as `X-User-Id` (via `setClerkUserId` in `artifacts/neuronotes/src/lib/user-id.ts`). The API server mounts `@clerk/express` `clerkMiddleware()` so MCP and any future Clerk-gated routes can call `getAuth(req)`, but most existing `/api/**` routes still derive identity by reading the `X-User-Id` header verbatim (`artifacts/api-server/src/lib/userId.ts`). For pre-onboarding visits and pages that read profile data before Clerk hydrates, the frontend falls back to a browser-scoped anonymous UUID stored in `localStorage` (`artifacts/neuronotes/src/lib/anonymous-user.ts`); the helper `getCurrentUserId()` returns the Clerk id when signed in and the anon UUID otherwise — every component must call it instead of `getOrCreateAnonymousUserId()` directly so signed-in identity reaches the API. Tightening the existing routes to verify the bearer token server-side is tracked as a follow-up; do not assume `X-User-Id` is authenticated today.
- **Payments**: Stripe (API version: 2026-03-25.dahlia)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (non-interactive; safe on fresh and drifted DBs). Wrapper at `lib/db/scripts/push.ts` backfills the `topics_name_unique` constraint when missing, then runs `drizzle-kit push --force`. See PUBLISHING.md §4 for fresh-environment provisioning.
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/db run seed` — seed neuroscience content
- `pnpm --filter @workspace/db run test:seed-idempotency` — verify the seed preserves users/progress/quiz_attempts/exam_attempts on re-run
- `pnpm --filter @workspace/db run test:push-fresh-db` — provision a temp DB, run `push` against it (twice, for idempotency), and assert all tables/indexes/`topics_name_unique` exist; locks in the fresh-environment provisioning contract documented in PUBLISHING.md §4. Requires `CREATE DATABASE` privilege.
- `pnpm --filter @workspace/db run test:push-then-seed-fresh-db` — provision a temp DB, run `push` then `seed` against it (the documented "first publish" sequence), and assert every content table is populated with no orphan FK rows. Requires `CREATE DATABASE` privilege.
- `pnpm --filter @workspace/db exec tsx ../../scripts/seed-stripe-products.ts` — seed Stripe products

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

### TypeScript references

Artifact tsconfigs (`artifacts/*/tsconfig.json`) intentionally do **not** list `lib/*` packages in `references`. Lib packages publish their `exports` field directly to source (`./src/index.ts`), so artifact typechecks resolve types from source via the package `exports`. Listing them as references would tie typechecking to each lib's `dist/` declarations and cause `TS6305` whenever a sibling lib hadn't been rebuilt. Lib build orchestration still happens at the root tsconfig via `tsc --build` (`pnpm run typecheck:libs`).

## PsychPro App

A mobile-responsive neuroscience/neuropsychology study app.

### Artifacts
- **API Server** (`artifacts/api-server`) — Express server on port 8080
- **PsychPro Web** (`artifacts/neuronotes`) — React/Vite SPA (teal/navy theme)

### Key Files
- `artifacts/api-server/src/app.ts` — Express app with Stripe webhook + Clerk middleware
- `artifacts/api-server/src/lib/userId.ts` — `getUserId(req)` / `requireUserId(req,res)` — prefers Clerk auth, falls back to the `X-User-Id` header for the anonymous flow
- `artifacts/api-server/src/lib/mcpEnabled.ts` — gates `/api/mcp`, `/api/oauth/*`, and `/.well-known/oauth-authorization-server` on `MCP_ENABLED` (default on)
- `artifacts/api-server/src/middlewares/feedbackRateLimit.ts` — per-IP throttle on `POST /api/feedback` (default 5/hour, env-tunable)
- `artifacts/api-server/src/routes/` — Route handlers (topics, flashcards, quizzes, study guides, practice exams, users, progress, subscription)
- `artifacts/api-server/src/stripeClient.ts` — Stripe client (API version: 2026-03-25.dahlia)
- `artifacts/neuronotes/src/App.tsx` — wouter routes wrapped in `<ClerkProvider>`; calls `setUserIdProvider(() => getCurrentUserId())` at module load
- `artifacts/neuronotes/src/lib/user-id.ts` — shared `getCurrentUserId()` / `setClerkUserId()` helper (Clerk id when signed in, anon UUID fallback)
- `artifacts/neuronotes/src/lib/anonymous-user.ts` — `getOrCreateAnonymousUserId()` localStorage-backed UUID
- `artifacts/neuronotes/src/pages/` — All 11 pages
- `lib/db/src/schema/index.ts` — DB schema (users, topics, flashcards, quiz_questions, study_guides, progress)
- `lib/db/src/seed.ts` — Neuroscience content seed (94 flashcards, 42 quiz questions, 9 study guides, 29 topics)

### Auth Pattern
- **Clerk is the identity provider; the API still trusts `X-User-Id`.**
  - Frontend: `<ClerkProvider>` wraps the app in `App.tsx`. `ClerkTokenBridge` (`src/components/auth/clerk-token-bridge.tsx`) listens to `useAuth()` and pushes the Clerk session token into the generated API client (`Authorization: Bearer <token>`) plus the Clerk user id into the shared user-id store (`src/lib/user-id.ts`). `setUserIdProvider(() => getCurrentUserId())` in `App.tsx` makes every `@workspace/api-client-react` request carry the right `X-User-Id`.
  - Backend: `clerkMiddleware()` is mounted globally in `artifacts/api-server/src/app.ts` (so MCP and any future Clerk-gated routes can call `getAuth(req)`), but the existing `/api/**` routes call `getUserId(req)` / `requireUserId(req,res)` from `artifacts/api-server/src/lib/userId.ts`, which **reads `X-User-Id` verbatim without verifying the bearer token**. In production the frontend sends the Clerk user id in that header, but a malicious client can forge it. Hardening these routes to derive identity from `getAuth(req)` is a tracked follow-up — do not rely on `X-User-Id` being authenticated.
- **Anonymous fallback:** when no Clerk session is loaded, the frontend mints a browser-scoped UUID at first visit (stored in `localStorage` under `psychpro.anonymous-user-id`). `getCurrentUserId()` in `src/lib/user-id.ts` returns the Clerk id when signed in and the anon UUID otherwise — components must call this helper instead of `getOrCreateAnonymousUserId()` directly so signed-in identity actually reaches the API.
- Sidebar and dashboard show the Clerk-derived display name when signed in. Sign In / Sign Up buttons on the landing page open the Clerk-hosted flow.
- Public routes (no identifier needed): `/api/healthz`, `/api/topics/**`, `/api/stripe/**`, `/api/subscription/plans`, `/api/leaderboard`, `/api/client-errors`, `/api/feedback/is-admin`

### Features
- Landing page with CTAs that go straight to the dashboard (no sign-up gate)
- 4-step onboarding (role → goal → degree → referral)
- Dashboard with progress summary
- Topics browser (39 topics) with search/filter
- Flashcards with flip animation (click to reveal)
- **Study Lab** (`/study-lab`) — four evidence-based learning components:
  - `BrainDump` (active recall, amber)
  - `SpacedRepetitionScheduler` (1/3/7/14-day timeline, localStorage)
  - `InterleavingMode` (mixed vs blocked toggle, color-coded topic pills)
  - `ElaborationPanel` (rotating prompts, local notes)
  - Components live in `src/components/learning/` and are reusable in any page
- **Brain Lab** (`/brain-lab`) — interactive 3D brain explorer
  - React Three Fiber + drei + three.js
  - 8 anatomical regions as separate clickable meshes (frontal, parietal, temporal L/R, occipital, cerebellum, brainstem, limbic) — built procedurally from displaced IcosahedronGeometry, no external GLB
  - OrbitControls (rotate + zoom, no pan), gentle auto-spin until a region is selected
  - Click a region → side panel with summary, key functions, common clinical findings, related topic hints, and CTA to `/topics`
  - Aqua Nebula palette (matches landing); reduced-motion gating via `prefers-reduced-motion`
  - Page: `src/pages/brain-lab.tsx`; nav added in `src/components/layout/app-layout.tsx` (Brain icon)
- Multiple-choice quizzes with explanations
- Scrollable study guides (custom Markdown renderer)
- Practice exams (timed 90s/question or untimed)
- Progress tracker
- Subscription page with Stripe ($9.99/mo, $79.99/yr Pro; $19.99/mo, $159.99/yr Scholar)
- Freemium: 10 free interactions, then upgrade prompt
- Feedback form (any logged-in user) + admin-only inbox (`/admin/feedback`)
- **Scholar tier** — custom study decks from user-uploaded PDF/DOCX/TXT or pasted text:
  - AI generates flashcards, quiz, study guide, and practice exam strictly from source content
  - `/my-decks` list, `/my-decks/new` upload/paste, `/my-decks/:id` tabbed detail view
  - `custom_decks`, `custom_flashcards`, `custom_quiz_questions` DB tables
  - `isAdmin` flag on users; admin-only feedback inbox
  - Scholar subscription status gates custom decks; Pro features work for scholar too

### Topic Catalogue
39 neuroscience/neuropsychology topics across the major categories
(see `topicsTable` seed for the authoritative list). The landing page
TRUST_STATS and TOPIC_CATEGORIES reflect the same count.

Content totals (matches DB seed):
- 39 topics
- 1,612 flashcards
- 935 quiz questions
- 738 practice exam questions

### Production Publishing
See `PUBLISHING.md` at the repo root for the full checklist (production secrets,
Stripe live mode + connector, DB seeding, smoke test, rollback). Production
requires Clerk live keys (`CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`,
`VITE_CLERK_PUBLISHABLE_KEY`); see `PUBLISHING.md` §1–§2.
Stripe credentials come from the Replit Stripe **connector** — the API server
auto-selects the `production` connector when `REPLIT_DEPLOYMENT=1`. Price IDs are
fetched dynamically (no hard-coded IDs). Run
`STRIPE_ENV=production pnpm --filter @workspace/db exec tsx ../../scripts/seed-stripe-products.ts`
once to seed Pro + Scholar products in live Stripe.

### DB Schema
- `usersTable` — user profile, usage count, subscription status
- `topicsTable` — 39 neuroscience/neuropsychology topics
- `flashcardsTable` — 1,612 flashcards across topics
- `quizQuestionsTable` — 935 quiz questions with explanations
- `studyGuidesTable` — study guides with markdown content (one per topic)
- `practiceExamsTable` — practice exams (one per topic)
- `practiceExamQuestionsTable` — 738 join rows linking exams to questions
- `progressTable` — practice exam scores per user/topic
- `clientErrorRateHitsTable` / `clientErrorRateWarningsTable` — back the per-IP rate limit on `POST /api/client-errors` so the limit is enforced globally and survives restarts/scale-out

### Operator tuning knobs
- `CLIENT_ERRORS_RATE_LIMIT_WINDOW_MS` (default `60000`) and
  `CLIENT_ERRORS_RATE_LIMIT_MAX` (default `30`) override the per-IP throttle on
  `POST /api/client-errors` without a code change. Read at API server startup;
  invalid values fail fast with a clear error. The resolved values are logged
  once at boot (`"Resolved client-error rate limit"`) and returned in the
  `config.clientErrorsRateLimit` field of `GET /api/healthz`, so operators can
  confirm an override took effect without triggering 429s. See PUBLISHING.md
  for details.
