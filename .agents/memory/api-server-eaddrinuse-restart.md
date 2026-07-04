---
name: api-server EADDRINUSE on restart
description: api-server workflow intermittently fails to boot with "EADDRINUSE 0.0.0.0:8080" after a restart/deploy because the old node process orphaned and kept the port; fix is exec + graceful shutdown.
---

# api-server EADDRINUSE on restart

**Symptom:** the `artifacts/api-server: API Server` workflow shows FAILED with
`listen EADDRINUSE: address already in use 0.0.0.0:8080`, yet the app often still
responds — because an *older* orphaned server is still bound to 8080 while the new
`build && start` can't grab the port. Recurs after workflow restarts, deploys, and
checkpoint-triggered restarts.

**Root cause:** the dev command chained `pnpm run build && pnpm run start`, and
`start` launched `node dist/index.mjs` through nested `pnpm` + `sh -c` layers. The
workflow's SIGTERM/SIGKILL hits the *top* pnpm process; it does NOT propagate down
to the leaf node server, so that node process orphans (reparented to init) and keeps
port 8080 held. The next boot then collides.

**Fix (two parts, both applied):**
1. `dev` script uses `exec` so node becomes the *direct* child of the workflow's
   pnpm and actually receives the signal:
   `... && pnpm run build && exec node --enable-source-maps ./dist/index.mjs`
   (confirm afterward: `pgrep -af index.mjs` shows a bare `node …`, NOT a `sh -c node` wrapper).
2. Graceful SIGTERM/SIGINT handlers in `src/index.ts` capture the `server` from
   `app.listen` and call `server.close()` → `process.exit(0)`, with a 5s `.unref()`
   failsafe force-exit so a hung connection can never hold the port.

**Verify a restart is truly clean:** record the pid (`pgrep -f index.mjs`), restart,
then assert the old pid is GONE (not orphaned) and only one new node is bound to 8080.

**Gotcha:** `pkill -f "dist/index.mjs"` self-matches the shell running the command
(its own command line contains the pattern) and kills itself mid-run (exit 143) —
but it does reap the orphans first. Prefer a narrower pattern or check state in a
separate call.
