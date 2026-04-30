# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

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
- **Auth**: Clerk (frontend: @clerk/react, backend: @clerk/express)
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
- `artifacts/api-server/src/app.ts` — Express app with Clerk middleware + Stripe webhook
- `artifacts/api-server/src/routes/` — Route handlers (topics, flashcards, quizzes, study guides, practice exams, users, progress, subscription)
- `artifacts/api-server/src/stripeClient.ts` — Stripe client (API version: 2026-03-25.dahlia)
- `artifacts/neuronotes/src/App.tsx` — ClerkProvider + wouter routes + ClerkTokenSetup
- `artifacts/neuronotes/src/pages/` — All 11 pages
- `lib/db/src/schema/index.ts` — DB schema (users, topics, flashcards, quiz_questions, study_guides, progress)
- `lib/db/src/seed.ts` — Neuroscience content seed (94 flashcards, 42 quiz questions, 9 study guides, 29 topics)

### Auth Pattern
- Frontend: `ClerkTokenSetup` component sets `setAuthTokenGetter` from `@clerk/react`'s `useAuth().getToken()`
- API calls automatically include `Authorization: Bearer <clerk-jwt>` header via custom-fetch
- Backend: uses `getAuth(req)` from `@clerk/express` (NOT `req.auth`)
- Public routes: `/api/healthz`, `/api/topics/**`, `/api/stripe/**`

### Features
- Landing page with inline Clerk sign-in/sign-up
- 4-step onboarding (role → goal → degree → referral)
- Dashboard with progress summary
- Topics browser (15 consolidated topics) with search/filter
- Flashcards with flip animation (click to reveal)
- **Study Lab** (`/study-lab`) — four evidence-based learning components:
  - `BrainDump` (active recall, amber)
  - `SpacedRepetitionScheduler` (1/3/7/14-day timeline, localStorage)
  - `InterleavingMode` (mixed vs blocked toggle, color-coded topic pills)
  - `ElaborationPanel` (rotating prompts, local notes)
  - Components live in `src/components/learning/` and are reusable in any page
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

### 15 Topics (Consolidated)
1. Neuropsychology Overview
2. Cell Biology & Neuron Anatomy
3. Neurotransmitters & Synaptic Transmission
4. Sensory Pathways
5. **Sensory Systems** (Vision, Hearing, Touch, Smell, Taste, Vestibular, Motor Control — combined)
6. Limbic System & Motivation
7. Sleep & Circadian Rhythms
8. Endocrine System & Reproduction
9. Psychopharmacology
10. **Psychological Disorders** (Psychopathology/Psychosis, Schizophrenia Spectrum/Bipolar/Depressive, Dissociative — combined)
11. Personality Disorders
12. ADHD & Medications
13. Language Processing & Aphasia
14. Apraxia & Agnosia
15. **Neurocognitive Disorders** (Huntington's, Parkinson's, Lewy Body, TBI, HIV, Delirium, Cortical Pain — combined)

### Production Publishing
See `PUBLISHING.md` at the repo root for the full checklist (production secrets,
Clerk live keys, Stripe live mode + connector, DB seeding, smoke test, rollback).
Stripe credentials come from the Replit Stripe **connector** — the API server
auto-selects the `production` connector when `REPLIT_DEPLOYMENT=1`. Price IDs are
fetched dynamically (no hard-coded IDs). Run
`STRIPE_ENV=production pnpm --filter @workspace/db exec tsx ../../scripts/seed-stripe-products.ts`
once to seed Pro + Scholar products in live Stripe.

### DB Schema
- `usersTable` — user profile, usage count, subscription status
- `topicsTable` — 15 consolidated neuroscience/neuropsychology topics
- `flashcardsTable` — 208 flashcards across topics
- `quizQuestionsTable` — 156 quiz questions with explanations
- `studyGuidesTable` — 15 study guides with markdown content
- `practiceExamsTable` — 15 practice exams (one per topic)
- `practiceExamQuestionsTable` — join table linking exams to 10 questions each
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
