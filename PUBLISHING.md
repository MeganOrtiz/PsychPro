# Publishing PsychPro

This is the click-by-click checklist for taking PsychPro from a dev preview to a
working production deployment on `*.replit.app`. Follow it top-to-bottom on the
**main** version of the project (not a task agent / preview).

> **Heads up:** publishing geography is locked at first publish. If you need to
> deploy outside North America, choose the region in the **Advanced** section of
> the Publishing tool *before* the first publish.

---

## 1. Production secrets to set

Open the deployment's **Secrets** panel (Publishing → your deployment → Secrets)
and make sure every value below is set. Anything marked **production** must be
the live/production value — not the dev value used in this project.

| Secret | Used by | Notes |
| --- | --- | --- |
| `DATABASE_URL` | API server, seed scripts | Provisioned automatically when you add a Postgres database to the deployment. |
| `CLERK_SECRET_KEY` | API server (Clerk middleware) | **production** — `sk_live_…` from Clerk's production instance. |
| `CLERK_PUBLISHABLE_KEY` | API server (proxy) | **production** — `pk_live_…` from Clerk's production instance. |
| `VITE_CLERK_PUBLISHABLE_KEY` | Web frontend (build-time) | **production** — same `pk_live_…` value. The Vite build inlines this, so it must be present *before* the build runs. |
| `STRIPE_WEBHOOK_SECRET` | API server (`/api/stripe/webhook`) | **production** — `whsec_…` from the Stripe Dashboard's *Live mode* webhook endpoint pointed at `https://<your-app>.replit.app/api/stripe/webhook`. |
| `AI_INTEGRATIONS_OPENAI_API_KEY` | Custom-deck generation (Scholar tier) | Auto-managed by the Replit AI integration; copy the value from your dev secrets if it isn't auto-provisioned in production. |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | Custom-deck generation | Same — copy from dev. |
| `SESSION_SECRET` | Reserved (not currently read at runtime) | Optional. |

Auto-injected by Replit (you do **not** set these manually):
`REPLIT_DEPLOYMENT=1`, `REPLIT_DOMAINS`, `REPLIT_DEV_DOMAIN`, `REPL_ID`,
`REPLIT_CONNECTORS_HOSTNAME`, `WEB_REPL_RENEWAL`, `PORT`, `BASE_PATH`,
`NODE_ENV=production`, and the `PG*` family.

Stripe API keys are **not** stored as plain secrets — they come from the Replit
Stripe connector (see step 3).

### Optional tuning knobs

These are read at API server startup. They are **not required** — defaults
preserve the values previously hard-coded in the code. Set them in the
deployment Secrets panel (or in dev `.env`) to override per environment.
Invalid values (non-integer, zero, or negative) make the server fail fast at
startup with a clear error.

| Env var | Used by | Default | Notes |
| --- | --- | --- | --- |
| `CLIENT_ERRORS_RATE_LIMIT_WINDOW_MS` | API server (`POST /api/client-errors`) | `60000` (60s) | Sliding window length, in milliseconds, for the per-IP throttle on client error reports. |
| `CLIENT_ERRORS_RATE_LIMIT_MAX` | API server (`POST /api/client-errors`) | `30` | Max requests per IP per window before responding `429 Too Many Requests`. Lower it during an incident to clamp down on noisy clients without a redeploy. |
| `CLIENT_ERRORS_RATE_LIMIT_CLEANUP_INTERVAL_MS` | API server (background sweeper) | same value as `CLIENT_ERRORS_RATE_LIMIT_WINDOW_MS` | How often the API server sweeps `client_error_rate_hits` / `client_error_rate_warnings` for rows older than the sliding window. The sweep runs in-process on every API instance and is `unref()`ed, so it never blocks process shutdown. With the default an expired row sticks around at most ~2× the window length before being collected; raise it on quiet deployments to cut DB writes, lower it during an incident to keep the tables tighter. Setting it to a value larger than the window is supported (rows simply linger longer); zero or negative values are rejected at startup. |

Changes to these values take effect on the next deploy / API server restart.

To verify an override took effect:
- The API server logs the resolved values exactly once at boot, e.g.
  `INFO: Resolved client-error rate limit { clientErrorsRateLimit: { windowMs: 60000, limit: 30 } }`,
  followed by
  `INFO: Started client-error rate-limit cleanup sweeper { clientErrorsRateLimitCleanup: { intervalMs: 60000 } }`.
- `GET /api/healthz` returns the window/limit numbers under
  `config.clientErrorsRateLimit` and the resolved cleanup interval under
  `config.clientErrorsRateLimitCleanup.intervalMs`, so you can
  `curl https://<your-app>.replit.app/api/healthz` to check a deployed
  instance without exhausting the limit and watching for 429s — and without
  having to grep the boot log for the cleanup interval.

---

## 2. Switch Clerk to production mode

1. In your Clerk Dashboard, create / open the **Production** instance for this
   app.
2. Add `https://<your-app>.replit.app` as an allowed origin and as the
   application home / sign-in URL.
3. Copy `pk_live_…` → set both `VITE_CLERK_PUBLISHABLE_KEY` and
   `CLERK_PUBLISHABLE_KEY` in the deployment Secrets panel.
4. Copy `sk_live_…` → set `CLERK_SECRET_KEY`.
5. The dev banner (`@replit/vite-plugin-dev-banner`) is already gated on
   `NODE_ENV !== "production"`, so it disappears automatically in the live
   build. Confirm by loading the site after publish.
6. (Optional) If you set up a Clerk webhook later, point it at
   `https://<your-app>.replit.app/api/__clerk` and add the secret here.

---

## 3. Switch Stripe to live mode

The app reads its Stripe credentials from the Replit Stripe **connector**, not
from a plain secret. `artifacts/api-server/src/stripeClient.ts` automatically
asks for the `production` connector when `REPLIT_DEPLOYMENT=1`, so the only
thing you need to do is connect Stripe in live mode for the deployment.

1. Open the **Integrations** pane → Stripe → **Connect** and authenticate with
   your live Stripe account. Make sure the connector status is `healthy` and
   the environment shows `production`.
2. Seed the live products and prices (run once, from the deployment shell or
   from a local shell with `STRIPE_ENV=production` exported):

   ```bash
   STRIPE_ENV=production pnpm --filter @workspace/db exec tsx ../../scripts/seed-stripe-products.ts
   ```

   This creates two products in your live Stripe account if they don't exist:
   - **PsychPro Pro** — $9.99/mo, $79.99/yr (`metadata.neuronotes_tier=pro`)
   - **PsychPro Scholar** — $19.99/mo, $159.99/yr (`metadata.neuronotes_tier=scholar`)

   The script is idempotent at both the **product** and **price** level: it
   looks up existing products by `metadata.neuronotes_tier`, then for each
   tier it ensures an active recurring price exists for both monthly and
   annual amounts (creating only the missing ones). Price IDs are loaded
   dynamically by the API at runtime (`/api/subscription/plans`), so there are
   no hard-coded price IDs to swap.

   > **If you already have PsychPro-like products in your live Stripe account
   > without `metadata.neuronotes_tier` set** (e.g. created manually in the
   > Dashboard), the seed script will *not* see them and will create new ones
   > alongside — leaving duplicate SKUs. To avoid this, either (a) archive the
   > old untagged products in the Stripe Dashboard before running the seed, or
   > (b) open them and add the metadata key `neuronotes_tier=pro` /
   > `neuronotes_tier=scholar` so the script reuses them. The
   > `/api/subscription/plans` route also filters on this same metadata, so
   > untagged products will be invisible to the pricing page regardless.

3. In the Stripe Dashboard (**Live mode**), create a webhook endpoint:
   - URL: `https://<your-app>.replit.app/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.created`,
     `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the signing secret (`whsec_…`) into the `STRIPE_WEBHOOK_SECRET`
     deployment secret.

---

## 4. Seed the production database

The Postgres database for the deployment is empty when first provisioned. Push
the schema and seed all study content (15 topics, 200+ flashcards, 150+ quiz
questions, 15 study guides, 15 practice exams):

```bash
# Run these against the production DATABASE_URL (from the deployment shell, or
# locally with the production DATABASE_URL exported).

pnpm --filter @workspace/db run push     # creates all tables (non-interactive)
pnpm --filter @workspace/db run seed     # inserts all study content
```

The `push` script is a thin wrapper around `drizzle-kit push --force`
(`lib/db/scripts/push.ts`) that:

- Requires `DATABASE_URL` to be set and exits with a clear error otherwise.
- Runs a one-time backfill on existing databases that pre-date the
  `topics.name` unique constraint: it adds `topics_name_unique` directly via
  SQL when the `topics` table exists but the constraint is missing. This is
  what lets `push` complete without the interactive
  *"do you want to truncate `topics`?"* prompt that `drizzle-kit` would
  otherwise show on a drifted database. On a fresh database (no `topics`
  table yet) the backfill is a no-op and `drizzle-kit` creates everything
  from the schema, including the `client_error_rate_hits` and
  `client_error_rate_warnings` rate-limit tables.
- Then invokes `drizzle-kit push --force --config ./drizzle.config.ts` so any
  remaining data-loss prompts are auto-approved. Re-running the script is
  idempotent.

> **Both `push` and `push-force` now imply `--force`.** They go through the
> same wrapper and auto-approve drizzle-kit's data-loss prompts. There is no
> longer a "ask-before-destructive" mode in this repo — if you need to inspect
> a destructive change before applying it, run `pnpm --filter @workspace/db
> exec drizzle-kit push --config ./drizzle.config.ts` directly (interactive)
> against a scratch database first.

If duplicate `topics.name` rows already exist, the backfill aborts with a
list of the offending names — resolve the duplicates first, then re-run
`pnpm --filter @workspace/db run push`.

To verify the fresh-provisioning contract above (every table, index, and the
`topics_name_unique` constraint really do come up from an empty database with
no manual intervention), run the one-shot integration test:

```bash
pnpm --filter @workspace/db run test:push-fresh-db
```

It provisions a temporary database next to the current `DATABASE_URL`, runs
`push` against it twice (once for fresh-create, once for idempotency), snapshots
`information_schema`, and drops the temporary database when done. Useful before
the first publish on a brand-new project, or after editing
`lib/db/scripts/push.ts` or `lib/db/src/schema/index.ts`. Requires `CREATE
DATABASE` privilege on the connection (the default Replit Postgres user has
this).

To verify the chained "first publish" sequence end-to-end (push then seed
against a brand-new database, with content tables populated and no orphan FK
rows), run:

```bash
pnpm --filter @workspace/db run test:push-then-seed-fresh-db
```

It provisions a temporary database, runs `push` then `seed` against it, asserts
every content table (`topics`, `flashcards`, `quiz_questions`, `study_guides`,
`practice_exams`, `practice_exam_questions`) meets the documented row-count
minimums above, and drops the temporary database when done. Catches regressions
where a seed insert assumes a constraint or column that `push` doesn't create
on a fresh database — issues that would otherwise only surface on a real
production publish. Requires `CREATE DATABASE` privilege.

The seed is fully idempotent and **safe to re-run on a live database**. It
preserves all user data:

- **`users`**, **`progress`**, **`quiz_attempts`**, **`exam_attempts`**,
  **`custom_decks`** (and their child custom-content tables), and **`feedback`**
  are never touched.
- **`topics`** are upserted by their unique `name`, so existing topic IDs are
  preserved. That means rows in `progress`, `quiz_attempts`, and `exam_attempts`
  (which reference `topics.id`) stay valid across re-seeds.
- **`flashcards`**, **`quiz_questions`**, **`study_guides`**, **`practice_exams`**,
  and **`practice_exam_questions`** are wiped (`TRUNCATE … RESTART IDENTITY`,
  no `CASCADE`) and re-inserted. No user-data table references these IDs, so a
  full replacement is safe.

⚠️ **Always run `pnpm --filter @workspace/db run push` before reseeding.**
Topic upserts depend on the `topics.name` unique constraint; against an older
schema that doesn't have it yet, the seed will fail with `there is no unique or
exclusion constraint matching the ON CONFLICT specification`. The push step in
the commands above takes care of this on a fresh deployment, but is also
required the first time you reseed an environment that pre-dates this change.

**Two operations to avoid doing through this script:**

- **Renaming an existing topic.** Because upserts key on `name`, changing the
  value of `name` for a topic that already exists in production is treated as
  a brand-new topic. The old row is left orphaned and any user `progress` on it
  stays attached to the old `id`.
- **Deleting / removing a topic from `seed.ts`.** The seed never deletes from
  `topics` (that would cascade and wipe user `progress`). Removing a topic from
  this file leaves the topic row in the database with no flashcards, quiz
  questions, or study guides attached — users will still see the empty topic
  card in the UI.

For either case, write a one-off migration script (under `lib/db/src/`) that
does the rename or removal explicitly (`UPDATE topics SET name = …` or, after
manually moving / deleting any user `progress` for that topic, `DELETE FROM
topics WHERE id = …`) instead of editing `seed.ts`.

---

## 5. Pre-publish smoke test (in the deployment preview, before going live)

Most deployments support previewing the built artifact before flipping the live
DNS. Walk through this end-to-end while signed in:

1. Sign up with email + password (no dev banner should appear).
2. Complete onboarding (4 steps).
3. Open a topic → flashcards flip, quiz scores, study guide renders, practice
   exam runs.
4. Use the app until you hit the 10-interaction free limit; the upgrade prompt
   should appear.
5. Click **Subscribe** → Stripe Checkout opens in **Live mode** → pay with a
   real card → you're returned to `/subscription?success=true` and your account
   is upgraded (verify Pro/Scholar features unlock).
6. Refresh — your subscription tier should persist (server-side, via the Stripe
   webhook).

If anything in step 5 hangs in `free` after payment, the Stripe webhook is
either missing or pointing at the wrong URL.

---

## 6. Publish

Click **Publish** in the workspace toolbar. Replit handles building, hosting,
TLS, and health checks. The API server's startup health probe is configured at
`/api/healthz` (see `artifacts/api-server/.replit-artifact/artifact.toml`).

After it's live, hit `https://<your-app>.replit.app/api/healthz` — you should
get `{"status":"ok"}`.

---

## 7. Custom domain (optional, do later)

Add a custom domain in the deployment UI (Settings → Domains). DNS instructions
are shown in-product. After the domain verifies, update Clerk's allowed origins
to include it.

---

## Rollback

If a publish goes wrong:

- **App is broken but the previous build was fine** → in the deployment UI,
  open **Deployments** → pick the last good build → **Promote**. Traffic moves
  back instantly.
- **Bad data in the production DB** → re-run `pnpm --filter @workspace/db run
  seed` against `DATABASE_URL` to restore content tables to a known-good state.
  This is safe to do on a live database — `users`, `progress`, `quiz_attempts`,
  `exam_attempts`, `custom_decks`, and `feedback` are all preserved. See step 4
  for the one caveat (topic renames).
- **Stripe charged a real customer in error** → issue refunds from the Stripe
  Dashboard; subscription state is reconciled automatically by the webhook on
  next subscription change event.
- **Compromised secret** → rotate it in the Secrets panel and re-deploy. For
  the Clerk secret key, also rotate it in the Clerk Dashboard. For
  `STRIPE_WEBHOOK_SECRET`, regenerate the endpoint signing secret in the
  Stripe Dashboard and copy the new value here.
