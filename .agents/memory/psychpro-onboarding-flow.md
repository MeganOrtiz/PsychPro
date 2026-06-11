---
name: PsychPro onboarding flow
description: Route-guard + persistence gotchas for the multi-step onboarding wizard
---

# PsychPro onboarding flow

The signed-in-but-not-onboarded gate is `RequireOnboarded` (RequireSignedIn +
OnboardingGate). `/onboarding` itself must stay OUTSIDE that gate (wrap it in
plain RequireSignedIn) or you get a redirect loop.

**Fail CLOSED on profile fetch error.** The gate must NOT render protected
content when GET /users/profile errors — show a blocking retry screen instead.
**Why:** failing open lets an incomplete user bypass onboarding entirely.

**After finishing, update the cached profile** (`queryClient.setQueryData(
getGetUserProfileQueryKey(), updated)`) before navigating, or the gate still
sees onboardingComplete=false and bounces the user back to /onboarding.

**selectedPriceId is NOT persisted server-side** (only selectedTier /
selectedProduct are). When resuming a saved paid selection, re-derive the
Stripe priceId from the live catalog by matching the chosen tier before
starting checkout, or paid users silently skip checkout.

**Stripe success URLs are hardcoded server-side** (/subscription?success=true,
/eppp/suite?eppp_success=true) — don't try to override them from onboarding;
persist onboardingComplete=true before redirecting so the return trip passes
the gate.

**onboardingCompletedAt** is stamped server-side only on the false->true
transition (re-running onboarding to edit answers preserves the original).
