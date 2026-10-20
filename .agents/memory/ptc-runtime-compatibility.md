---
name: Programmatic tool runtime compatibility
description: Durable runtime may lack clock and random APIs despite general callback documentation.
---

This workspace has returned `Date.now() is disabled in durableptc v1`, and
`crypto` was unavailable in the durable scope. If a fixture needs a unique
identifier, generate it inside a small `"use impure"` function using Node's
`crypto.randomUUID()`, then return only the identifier.

**Why:** General tool documentation advertised durable clock/random support, but
the active runtime rejected those calls before fixture creation.

**How to apply:** Keep callbacks in the durable scope; isolate only the
unsupported clock/random operation. Do not retry alternate durable globals or
assume a failed expression already performed later database writes.
