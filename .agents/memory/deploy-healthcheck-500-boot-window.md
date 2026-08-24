---
name: Deployment healthcheck 500s during boot
description: Startup "healthcheck failed ... returned status 500" lines in deployment logs are pre-boot proxy noise, not an app bug
---
The platform proxy returns 500 for EVERY artifact path (/api, /mobile/, /.well-known/oauth-*) during the window between "starting artifact process" and the server's "Server listening" line (~10s for api-server: big esbuild bundle + source maps + Sentry init). The checks retry and all pass once the port opens; endpoints return 200 after boot.

**Why:** Investigated 2026-08-24 after treating these lines as a production OAuth bug — the discovery handlers are trivial and never 500 once up.

**How to apply:** Before "fixing" a healthcheck 500, check whether it happened before the "Server listening" log line. Only 500s AFTER listening are real bugs.
