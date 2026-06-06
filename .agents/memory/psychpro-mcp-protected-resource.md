---
name: PsychPro MCP protected-resource discovery
description: Why Claude.ai's connector fails to reach the PsychPro MCP server, and the RFC 9728 endpoint/routing it requires.
---

When a Claude (Claude.ai web custom connector) "can't access PsychPro," the usual cause is OAuth **discovery**, not the MCP endpoint itself. The MCP authorization spec requires the resource server to publish RFC 9728 **Protected Resource Metadata** at `/.well-known/oauth-protected-resource` (and the resource-specific `/.well-known/oauth-protected-resource/api/mcp` variant), and the `/api/mcp` 401 `WWW-Authenticate` must point `resource_metadata` there.

**The trap:** any `/.well-known/*` path that is NOT listed in the api-server's `artifact.toml` `paths` falls through to the SPA static handler, which returns `text/html` with HTTP 200. A strict client (Claude.ai) fetches the metadata, gets HTML instead of JSON, and silently fails — reporting it can't connect.

**Why:** path-based routing only forwards the exact path prefixes in `paths` to the api-server; everything else is the SPA's. So a new well-known endpoint needs BOTH an Express route (root-level in app.ts under the `MCP_ENABLED` gate, plus `/api/.well-known/...` aliases in oauth.ts) AND a `paths` entry in `.replit-artifact/artifact.toml`.

**How to apply:** if MCP/Claude connect breaks, curl the prod well-known paths and check `content-type` — `text/html` means it's hitting the SPA (missing route or missing `paths` entry). The full handshake (register → authorize → token → initialize) can still pass manually even when discovery is broken, because manual flows skip the protected-resource fetch; don't conclude "it works" from a manual handshake alone.

**Also:** the discovery doc derives the issuer from the request host (`OAUTH_ISSUER` override or `req.protocol`+Host). Prod issuer is `https://psychprosuite.com`. Cold-start 500s on `/api` and `/.well-known/*` right after publish are an autoscale boot race, not a real failure — the API serves 200 once warm (~15s).
