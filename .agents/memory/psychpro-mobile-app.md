---
name: PsychPro mobile app
description: Expo mobile mirror of the web app — auth/key quirks, API conventions, and known v1 boundaries.
---

# PsychPro mobile (artifacts/psychpro-mobile)

- Expo SDK 54 + expo-router, previewPath `/mobile`, workflow `artifacts/psychpro-mobile: expo`. Full mirror: courses, flashcards, quizzes, practice exams, EPPP suite, Brain Lab 2D, progress, leaderboard.
- Auth: same external Clerk via `@clerk/clerk-expo`. The dev publishable key secret (`VITE_CLERK_PUBLISHABLE_KEY_DEV`) is a badly pasted blob — `app/_layout.tsx` extracts the `pk_test_...` with a regex (secrets can't be fixed programmatically). `scripts/build.js` injects the key for production bundles and fails loudly if absent.
- API: `@workspace/api-client-react` with `setBaseUrl` + `setAuthTokenGetter(Clerk getToken)`. Conventions mirrored from web: quiz/exam attempts record raw correct counts; topic progress records percent; full-length exams request `count: 250` via `/topic/[id]/exam?full=1`.
- Subscriptions are web-purchased in v1; mobile shows plan status and a paywall-aware ErrorView on 402/403 ("upgrade on the website"). Apple IAP (RevenueCat) is a later phase before store submission.
- `@clerk/clerk-expo` requires `expo-auth-session` + `expo-crypto` installed even if SSO isn't used (Metro resolves all hooks).

**Why:** these choices keep mobile and web attempt data compatible in the shared api-server and avoid a broken production bundle.
**How to apply:** any new mobile screen hitting the API must follow the same score conventions and pass `error` into ErrorView for paywall handling.
