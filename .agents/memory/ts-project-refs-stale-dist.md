---
name: TS project-reference stale dist
description: Why a consumer typecheck can miss freshly generated exports from a workspace lib.
---

With TypeScript project references, a consumer's `tsc` reads the referenced project's built `dist/*.d.ts`, not `src` — even when package.json `exports` points at `src/index.ts` for runtime.

**Why:** after regenerating a lib's source (e.g. orval regenerating the API client), a downstream typecheck reported "Module has no exported member" for hooks that clearly existed in src; the stale `dist` declarations were being consulted.

**How to apply:** if a consumer typecheck can't see a freshly added export from a `lib/*` package, run `npx tsc -b` inside that lib (or from root) to rebuild its declarations, then retry.
