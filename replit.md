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
- **Auth**: **Server-verified Clerk session on every protected route.** The frontend wraps the app in `<ClerkProvider>` (see `artifacts/neuronotes/src/App.tsx`); `ClerkTokenBridge` pushes the Clerk session token into both the generated API client (`setAuthTokenGetter`) and the shared `authHeaders()` helper used by direct `fetch()` call sites (`artifacts/neuronotes/src/lib/auth-headers.ts`). Every API request therefore carries `Authorization: Bearer <token>`. The API server mounts `@clerk/express` `clerkMiddleware()` globally, and every `/api/**` route derives the caller's user id from `getAuth(req).userId` via the helpers in `artifacts/api-server/src/lib/userId.ts` (`requireUserId` rejects with `401 Unauthorized` on protected routes; `getOptionalUserId` returns `null` for anonymous-tolerant routes). The legacy `X-User-Id` request header is no longer sent by the frontend nor consulted by the server. Admin gating (`users.isAdmin`) is re-read from the database keyed on the verified Clerk user id; client-supplied role flags are never trusted.
- **Payments**: Stripe (API version: 2026-03-25.dahlia)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (non-interactive; safe on fresh and drifted DBs). Wrapper at `lib/db/scripts/push.ts` backfills the `topics_name_unique` constraint when missing, then runs `drizzle-kit push --force`. See PUBLISHING.md §4 for fresh-environment provisioning.
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/db run seed` — seed neuroscience content
- `pnpm --filter @workspace/db run seed:eppp` — seed the EPPP Mastery source content as 8 domain courses, 71 KN chapter topics, and starter study guides without truncating the existing neuroscience content
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
- `artifacts/api-server/src/lib/userId.ts` — `requireUserId(req,res)` / `getOptionalUserId(req)` — derive the caller's identity from the verified Clerk session via `getAuth(req)` (`@clerk/express`). `requireUserId` responds `401 Unauthorized` when no Clerk session is present; `getOptionalUserId` returns `null` for the small whitelist of anonymous-tolerant routes (see "Auth Pattern" below).
- `artifacts/api-server/src/lib/mcpEnabled.ts` — gates `/api/mcp`, `/api/oauth/*`, `/.well-known/oauth-authorization-server`, and the `/api/admin/tokens` admin router on `MCP_ENABLED` (default on). The flag applies in every environment, not just production, so it can also be used to disable MCP locally during development.
- `artifacts/api-server/src/middlewares/feedbackRateLimit.ts` — per-IP throttle on `POST /api/feedback` (default 5/hour, env-tunable)
- `artifacts/api-server/src/routes/` — Route handlers (topics, flashcards, quizzes, study guides, practice exams, users, progress, subscription)
- `artifacts/api-server/src/stripeClient.ts` — Stripe client (API version: 2026-03-25.dahlia)
- `artifacts/neuronotes/src/App.tsx` — wouter routes wrapped in `<ClerkProvider>`; `ClerkTokenBridge` rendered once near the top of the tree
- `artifacts/neuronotes/src/lib/auth-headers.ts` — `authHeaders()` / `jsonAuthHeaders()` helpers that direct `fetch()` call sites use to attach `Authorization: Bearer <clerk-token>`
- `artifacts/neuronotes/src/pages/` — All 11 pages
- `lib/db/src/schema/index.ts` — DB schema (users, topics, flashcards, quiz_questions, study_guides, progress)
- `lib/db/src/seed.ts` — PsychPro content seed (39 topics, 1,612 flashcards, 935 quiz questions, 39 study guides, 39 practice exams with 738 join rows)
- `lib/db/src/seed-eppp-master-content.ts` — EPPP Mastery starter content seed (8 domain courses, 71 KN chapter topics, starter study guides)

### Auth Pattern
- **Clerk is the identity provider, and every protected route verifies the Clerk session server-side.**
  - Frontend: `<ClerkProvider>` wraps the app in `App.tsx`. `ClerkTokenBridge` (`src/components/auth/clerk-token-bridge.tsx`) listens to `useAuth()` and pushes the Clerk session token into the generated API client (`Authorization: Bearer <token>`). The protected pages live under `<RequireSignedIn>` so the token is always present by the time a protected API call is made.
  - Backend: `clerkMiddleware()` is mounted globally in `artifacts/api-server/src/app.ts`. Every protected route calls `requireUserId(req, res)` from `artifacts/api-server/src/lib/userId.ts`, which reads `getAuth(req).userId` and responds `401 Unauthorized` when the Clerk session is missing or invalid. The legacy `X-User-Id` request header is neither sent by the frontend nor consulted by the server.
- **Admin gating:** `users.isAdmin` is always re-read from the database keyed on the verified Clerk user id (see `routes/feedback.ts` `requireAdmin`, `routes/featured-work.ts` `requireAdminCaller`, etc.). The admin-token issuer at `/api/admin/tokens` uses a separate `MCP_ADMIN_SECRET` shared secret — see `lib/requireAdmin.ts`.
- **Anonymous-tolerant / public routes (complete whitelist):** these intentionally accept callers without a Clerk session — every other `/api/**` route rejects with `401`. Some read no caller identity at all; others use `getOptionalUserId(req)` to enrich the response when a verified Clerk session happens to be present:
  - `GET /api/healthz`, `GET /api/admin/status` (no user needed)
  - `GET /api/topics`, `GET /api/topics/:id`, `GET /api/topics/:id/flashcards`, `GET /api/topics/:id/quizzes`, `GET /api/topics/:id/practice-exam` (no user needed)
  - `POST /api/stripe/webhook` (Stripe signature verified)
  - `GET /api/subscription/plans`
  - `GET /api/leaderboard` (`currentUser` marker uses the verified Clerk id when present)
  - `POST /api/client-errors` (error reports from anonymous landing-page visitors; logs the verified Clerk id when present)
  - `GET /api/feedback/is-admin` (returns `{isAdmin: false}` when no session)
  - `GET /api/storage/public-objects/*`, `GET /api/storage/objects/*` (the ACL check itself decides whether to allow unauthenticated reads)
  - `GET /api/profile/public/:userId` (only returns rows where `pref_show_on_featured_work = true`; 404 otherwise)
  - `GET /api/featured-work`, `GET /api/featured-work/spotlight` (lists/spotlight of `status='approved'` submissions only)
  - `GET /api/featured-work/:id` (approved rows are public; non-approved rows require owner or admin — caller derived from `getOptionalUserId` + DB-keyed admin check)
  - `GET /.well-known/oauth-authorization-server`, OAuth discovery/protocol endpoints (not user-session routes)
- **Non-Clerk auth surfaces:** `/api/admin/tokens*` uses the `MCP_ADMIN_SECRET` shared-secret check in `lib/requireAdmin.ts` (separate from Clerk), and `/api/mcp` verifies its own bearer token. These do not call the Clerk helpers.

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
- Practice exams (per-exam time budget from `practice_exams.time_limit` in seconds — DB default 600s = 10 minutes; users can also opt into Untimed Mode)
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

### Canonical Billing / Entitlement Model (single source of truth)
**All** tier/EPPP mapping logic lives in **`artifacts/api-server/src/lib/tierMapping.ts`**.
Never re-implement these mappings inline anywhere else — duplicated copies are how a
"second competing model" gets reintroduced during a refactor/rebase. The invariants are
locked by `artifacts/api-server/test/billingModel.test.ts` (and a "no inline re-declaration"
guard in that suite).

Two **independent** access dimensions that never write to each other:
1. **General subscription (Master / Scholar)** — stored on `users.subscription_status`.
   - Stripe product tag `metadata.neuronotes_tier`: `"pro"`/`"master"` → internal Master,
     `"scholar"` → Scholar. `"master"` is a **display alias** for the internal `"pro"`.
   - Stored values: canonical `"free"` | `"active"` (= Master) | `"scholar"`; legacy aliases
     tolerated on read: `"pro"`, `"trialing"` (both == Master).
   - `getSubscriptionTier` (webhook) writes `"active"`/`"scholar"`/`"free"` only.
   - `tierFromStatus`: `active`/`pro`/`trialing` → `pro`; `scholar` → `scholar`; else → `free`.
   - `GET /api/subscription/status` shape: scholar → `{active, scholar}`,
     active/pro/trialing → `{active, pro}`, else → `{free, free}`.
2. **EPPP Mastery Suite** — a SEPARATE, expiry-driven level (`users.epppAccessUntil` /
   `epppSubscriptionId`), Stripe-tagged `neuronotes_tier="eppp"`. EPPP access NEVER writes
   `subscription_status`, and a Master/Scholar subscription NEVER grants EPPP access
   (`computeEpppAccess` / `hasEpppAccess` / `getEntitlements({eppp:true})`).

**Mastery exam access gate.** The *reachable* course mastery-exam system is `routes/course-mastery.ts`
(category-based: `GET /api/courses/:category/mastery-exam`, `POST /api/course-mastery-attempts`).
The `:courseId`-based handlers in `routes/mastery-exams.ts` are **shadowed/dead** — `courseMasteryRouter`
is mounted before `masteryExamsRouter` in `routes/index.ts`, and the frontend calls the category paths.
`course-mastery.ts` enforces the entitlement boundary via `resolveMasteryAccess`:
> **EPPP** courses require EPPP access (`hasEpppAccess`); **general/main-site** courses require a
> Master/Scholar subscription (`PAID_MASTERY_TIERS` + canonical `tierFromStatus`); **admins** bypass
> both. So a Master subscriber unlocks the main-site mastery exams but NOT the EPPP ones. Blocked
> callers get `402 {upgrade:true, eppp}`; the frontend renders `UpgradePrompt`. The (dead)
> `mastery-exams.ts` helper now also uses canonical `tierFromStatus`, so there is no remaining
> tier-mapping divergence.

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
