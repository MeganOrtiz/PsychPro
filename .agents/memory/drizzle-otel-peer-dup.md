---
name: drizzle-orm + @opentelemetry/api peer duplication
description: Adding any dep that pulls @opentelemetry/api splits drizzle-orm into two pnpm instances and breaks api-server typecheck.
---

Adding a dependency that transitively pulls `@opentelemetry/api` (e.g. `@sentry/node`)
into the monorepo causes pnpm to create a SECOND `drizzle-orm` instance: one keyed
`drizzle-orm@<v>_@opentelemetry+api@<v>_...` (with otel) and the original without it.
`drizzle-orm` declares `@opentelemetry/api` as an optional peer, so its resolution
hash changes once otel is present in a consumer's tree.

**Symptom:** `pnpm --filter @workspace/api-server run typecheck` fails with
"Types have separate declarations of a private property 'shouldInlineParams'" /
"Property 'config' is protected" on drizzle calls like `eq(...)` — because
`@workspace/db` resolves the no-otel variant while `api-server` resolves the
with-otel variant, and api-server code mixes types from both. esbuild build still
passes (it ignores types), so only typecheck/validation catches it.

**Fix:** make every drizzle consumer resolve the SAME variant. Add
`@opentelemetry/api` (pinned to the exact version otel resolved to, e.g. `1.9.1`)
as a dependency of `@workspace/db` so its drizzle resolves the with-otel variant
matching api-server. Two `.pnpm` variants may still exist for other consumers —
that's fine as long as db + api-server align.

**Why:** drizzle's optional-peer resolution is position-dependent; aligning the
peer across the db lib and its consumer collapses the type mismatch.

**How to apply:** any time typecheck suddenly fails on drizzle private/protected
property errors right after adding a new dependency, check `ls node_modules/.pnpm |
rg '^drizzle-orm@'` for multiple variants and align the otel peer in lib/db.
