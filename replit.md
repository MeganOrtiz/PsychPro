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
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/db run seed` — seed neuroscience content
- `pnpm --filter @workspace/db run test:seed-idempotency` — verify the seed preserves users/progress/quiz_attempts/exam_attempts on re-run
- `pnpm --filter @workspace/db exec tsx ../../scripts/seed-stripe-products.ts` — seed Stripe products

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

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
