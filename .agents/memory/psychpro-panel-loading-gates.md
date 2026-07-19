---
name: PsychPro panel loading gates
description: Don't gate panel rendering on auth-protected react-query fetches; hydrate drafts when data arrives.
---
Rule: In PsychPro panels, gate the initial "Loading…" state only on public/content queries (e.g. topics). Never block rendering on an auth-protected per-user query (settings, study plan, profile extras) — render defaults immediately and hydrate the draft state when the saved data arrives (hydrate-once ref + skip if the user already edited/`dirty`).

**Why:** A protected query that 401s (anon dev preview, token race, transient auth) can sit in pending/retry for many seconds, leaving the whole panel stuck on a spinner. The EPPP Study Plan panel appeared "stuck loading" in anonymous DEV screenshots purely because of this; the UI itself was fine.

**How to apply:** `const loading = contentLoading;` only. Saved-data hydrate: `useEffect(() => { if (!data || hydrated.current || dirty) return; hydrated.current = true; …set draft… }, [data])`. Also note: orval hooks' `options.query` requires full UseQueryOptions (adding `retry` alone fails typecheck) — rely on the global QueryClient retry config instead.
