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
- `pnpm --filter @workspace/db exec tsx ../../scripts/seed-stripe-products.ts` — seed Stripe products

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## NeuroNotes App

A mobile-responsive neuroscience/neuropsychology study app.

### Artifacts
- **API Server** (`artifacts/api-server`) — Express server on port 8080
- **NeuroNotes Web** (`artifacts/neuronotes`) — React/Vite SPA (teal/navy theme)

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
- Topics browser (29 topics) with search/filter
- Flashcards with flip animation (click to reveal)
- Multiple-choice quizzes with explanations
- Scrollable study guides (custom Markdown renderer)
- Practice exams (timed 90s/question or untimed)
- Progress tracker
- Subscription page with Stripe ($9.99/mo, $79.99/yr)
- Freemium: 10 free interactions, then upgrade prompt

### DB Schema
- `usersTable` — user profile, usage count, subscription status
- `topicsTable` — 29 neuroscience topics
- `flashcardsTable` — 94 flashcards across topics
- `quizQuestionsTable` — 42 quiz questions with explanations
- `studyGuidesTable` — 9 study guides with markdown content
- `progressTable` — practice exam scores per user/topic
