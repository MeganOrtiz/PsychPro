---
name: PsychPro prod course seeding & dev/prod data divergence
description: How courses (and any topic-derived lookup data) get into production, and why dev DB diverges from prod.
---

# Prod is the content source of truth; dev DB is a stale snapshot

PsychPro EPPP content is authored **directly into the production database** by Claude
via the MCP tools (psychprosuite.com). The development database is a stale copy and
will lag prod (e.g. dev had 7 categories / 39 topics while prod had 8 categories / 46
topics including "Pediatric & Neuropsychiatric Conditions").

**How to apply:** Never trust the dev DB row counts as production reality. Verify prod
with `executeSql({ environment: "production" })` (read-only). `lib/db/src/seed.ts` is a
stale dev bootstrap that uses *different* categories (Foundations/Clinical/Neuroanatomy)
and **never runs in production** (post-merge runs only `db push`; the prod deploy runs
`node dist/index.mjs`). Do not treat seed.ts as the source of truth.

# Schema reaches prod via Publish; DATA does not

Replit's Publish flow diffs dev→prod **schema** and applies it (new tables, new
columns). It does **not** seed data, and prod `executeSql` is read-only, so tooling
cannot write prod rows.

**Why:** A courseId-based system needed `courses` rows backfilled in prod, but nothing
in the publish path creates data rows.

**How to apply:** The only path to seed prod DATA is logic that runs **inside the prod
app at runtime**. We backfill `courses` from distinct `topics.category` on api-server
startup (background, after `listen`) via `backfillCoursesFromTopics` — idempotent and
race-safe (ON CONFLICT DO NOTHING on unique `courses.name`; topic links only touch
`course_id IS NULL`). This is DML-only DATA seeding, which is allowed; startup **DDL**
self-healing is NOT (that's the database skill's prohibition — schema is Publish's job).
So after a Publish, prod self-seeds its courses on first boot; no manual step.

# Course metadata keys must match the EXACT prod category string

`COURSE_DISPLAY_ORDER` / `COURSE_DESCRIPTIONS` are keyed by `topics.category`. The
Pediatric key was once `"Pediatric & Neuropsychiatric"` but the real prod category is
`"Pediatric & Neuropsychiatric Conditions"` — a mismatch silently drops that course to
displayOrder 99 + null description. Always key on the full prod string (the dev snapshot
may not even contain that category, so you can't discover the exact string from dev).
