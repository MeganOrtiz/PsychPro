---
name: PsychPro auth is Replit Auth (OIDC), migrated off Clerk
description: PsychPro fully migrated FROM Clerk TO Replit Auth; how auth works now and what old Clerk memories no longer apply.
---

PsychPro was fully migrated off Clerk onto **Replit Auth (OIDC)** (web-only, clean swap — no user
migration). Clerk is entirely gone: no `@clerk/*` deps, no `<ClerkProvider>`, no token bridge, no
`clerkMiddleware`, no Clerk secrets.

**How auth works now:**
- Backend: `openid-client` in `artifacts/api-server/src/lib/auth.ts`; server-side sessions persisted
  in `sessionsTable` (Postgres) referenced by an httpOnly `sid` cookie. `authMiddleware`
  (`middlewares/authMiddleware.ts`) is mounted globally after `cookieParser()` and populates
  `req.user`. Routes: `GET /api/login` (PKCE), `/api/callback`, `/api/logout`, `/api/auth/user`
  (`{ user | null }`). MCP-scoped paths bypass the session middleware (own bearer tokens).
- Frontend: no auth provider component; the same-origin `sid` cookie is sent automatically.
  `useAuth()` from `@workspace/replit-auth-web` reads `/api/auth/user` → `{ user, isLoading,
  isAuthenticated, login, logout }`. `login()`→`/api/login?returnTo=…`, `logout()`→`/api/logout`.
  **No in-app login form**; `/sign-in` + `/sign-up` hand off to the hosted flow. Protected pages
  under `<RequireSignedIn>`.
- Identity resolution: caller id is `req.user.id` via `lib/userId.ts` (`requireUserId`/
  `getOptionalUserId`). No client-supplied identity header is trusted.

**Platform env vars (auto-provisioned dev + deploy):** `REPLIT_DOMAINS`, `ISSUER_URL`, `REPL_ID`,
`SESSION_SECRET`. No third-party auth keys anywhere. To invalidate all live sessions, rotate
`SESSION_SECRET`.

**UI rule (owner):** never show the words "Replit"/"Replit Auth" in the auth UI; never build a
custom login form.

**Stale Clerk memories now superseded** (kept only as history): `psychpro-clerk-dev-keys` (no
dev/prod key split anymore) and `psychpro-clerk-account-deletion` (deletion no longer calls a Clerk
backend SDK — the identity-provider-confirmation lesson now applies to whatever Replit Auth deletion
path the app uses; profile UI renamed `clerkDeleted`→`identityDeleted`).
