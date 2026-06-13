---
name: Leaderboard perf aggregation (node-pg ARRAY_AGG + autoscale cache/pool)
description: Gotchas when moving the PsychPro leaderboard from full-table JS scans to grouped SQL + caching.
---

- **node-pg returns ARRAY_AGG(...) as a non-array via `db.execute`.** An `ARRAY_AGG(DISTINCT col)` came back as something whose `.map` is not a function, throwing `(row.x ?? []).map is not a function` at runtime (typecheck passes — it's a runtime shape mismatch). Don't rely on Postgres array aggregates parsing into JS arrays through drizzle `db.execute`. Instead emit one row per group element (e.g. `SELECT DISTINCT user_id, date_trunc('day', last_accessed)`) and group in JS.
  **Why:** array-type parsing is inconsistent in this stack; the scalar/row path is reliable.

- **`date_trunc('day', col)` on a `timestamp WITHOUT time zone` is timezone-independent wall-clock truncation.** It exactly matches a JS `startOfDay(new Date(parsed))` because node-pg parses without-tz values as local wall-clock. So the leaderboard streak day-bucketing in SQL preserves the legacy server-local-day semantics — but ONLY because `progress.last_accessed` is without-tz. If a column is ever `timestamptz`, `date_trunc` becomes session-tz dependent and this equivalence breaks.

- **Autoscale = per-instance state.** The leaderboard 30s snapshot cache and the Postgres pool `max` are per-instance: cache is eventually-consistent across instances (acceptable), and effective DB connections = `PG_POOL_MAX` × instance count, so keep the per-instance cap conservative (default 8). Same caveat applies to any in-memory rate limiter — it's bypassable across instances.
