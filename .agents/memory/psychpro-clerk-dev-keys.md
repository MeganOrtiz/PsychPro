---
name: PsychPro Clerk dev vs prod keys
description: How Clerk auth is keyed across the Replit preview (dev) vs the live psychprosuite.com deployment.
---

# PsychPro Clerk dev vs prod keys

PsychPro uses an **external** Clerk tenant with a custom production domain (`auth.psychprosuite.com`). Production publishable keys are `pk_live_…` and are domain-locked — they reject any origin other than the production domain, so on the Replit dev/preview URL a `pk_live` key throws *"Production Keys are only allowed for domain auth.psychprosuite.com"* and the app error-boundaries.

**Fix for the preview:** use a Clerk **Development** instance key pair, dev-gated so production is untouched:
- `VITE_CLERK_PUBLISHABLE_KEY_DEV` = the dev **publishable** key (`pk_test_…`) — frontend, read only when `import.meta.env.DEV`.
- `CLERK_SK_OVERRIDE` = the dev **secret** key (`sk_test_…`) — api-server, read only when `isDev` (see `artifacts/api-server/src/app.ts`).

Production deploy keeps using `VITE_CLERK_PUBLISHABLE_KEY` (`pk_live`) + `CLERK_SECRET_KEY` (`sk_live`); the dev overrides are never read in a prod build, so adding them is safe and needs no redeploy.

**Why:** the dev-key resolution in `App.tsx` falls back to the prod key when the dev override is unset — so if `VITE_CLERK_PUBLISHABLE_KEY_DEV` is missing, the preview silently runs the production instance and gets blocked. If the preview shows a Clerk domain/origin error, the dev override is missing or malformed.
