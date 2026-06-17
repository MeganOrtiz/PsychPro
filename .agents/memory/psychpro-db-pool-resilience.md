---
name: PsychPro DB pool / startup resilience
description: How the api-server survives intermittent Postgres cold-start connection timeouts and idle-socket drops.
---

The Postgres behind PsychPro (Replit-managed, autoscale) intermittently times
out connections on cold start and silently drops idle TCP sockets. Symptoms
seen in logs: "Connection terminated due to connection timeout" failing the
one-shot startup backfills, "Connection terminated unexpectedly", and an
occasional slow/aborted first /api/topics. These are TRANSIENT — once the DB is
warm, queries return in 60-175ms. Do NOT chase them as a constant bug.

**The durable rules:**
- The shared pool (lib/db/src/index.ts) MUST keep `keepAlive: true` and a
  `pool.on('error', ...)` handler. Without the handler, pg re-emits an idle
  client's error as an unhandled pool 'error' event and crashes the whole
  process. The handler just logs and lets pg recycle the dead client.
- Any one-shot startup task that touches the DB (the idempotent backfills) MUST
  run through a retry-with-backoff wrapper (`runStartupTaskWithRetry` in
  artifacts/api-server/src/index.ts). A single 10s cold-start timeout otherwise
  permanently skips that task for the instance until the next restart.

**Why backoff uses full jitter:** every autoscale instance cold-starts against
the same DB; synchronized fixed-delay retries would thundering-herd a brownout.
Jitter (`random()*cappedBackoff`) desyncs them.

**How to apply:** only retry idempotent/race-safe work this way (the backfills
use ON CONFLICT DO NOTHING + null-guarded updates). Never wrap a non-idempotent
write in blind retries. Total retry window is ~tens of seconds; if stronger
guarantees are ever needed, add a low-frequency periodic re-run, not a longer
boot-time stall (backfills already run in the background, never blocking
readiness).
