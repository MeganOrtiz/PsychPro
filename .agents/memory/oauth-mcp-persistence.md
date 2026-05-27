---
name: OAuth/MCP state must be persisted
description: Why MCP OAuth (dynamic client registration + auth codes + access/refresh tokens) for Claude.ai connectors cannot live in process memory.
---

Rule: Any OAuth 2.1 + PKCE state we issue for the MCP route (registered clients, single-use auth codes, access tokens, refresh tokens) must live in Postgres, not in-memory Maps.

**Why:** Replit Autoscale runs multiple instances and recycles them. Claude.ai's "Add custom connector" dialog does dynamic client registration (RFC 7591) and then immediately hits `/authorize` and `/token`. When these landed on different instances, `/authorize` returned `invalid_client / Unknown client_id` because the client was only registered on instance A. Same class of bug surfaces on every restart.

**How to apply:** New OAuth-shaped flows (or any cross-request handshake state with a short TTL) get a DB table from day one. Don't use `new Map()` for anything that must survive a second HTTP hop. Sweep expired rows lazily on each access (cheap) rather than relying on a background timer that doesn't run on serverless replicas.
