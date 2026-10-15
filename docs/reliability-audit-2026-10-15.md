# PsychPro / EPPP reliability investigation

## Scope and limits

Reviewed the web route map (54 declared paths), shared authentication/query
infrastructure, suite navigation, promo redemption, trial/access cache updates,
Stripe return paths, and primary course/study/progress loading states. Inspected
the public catalog query and sampled public API responses through the preview proxy.
This was a reliability investigation, not a security penetration test or a
production load test.

Browser checks covered landing, EPPP promo, legal pages, auth entry links,
browser history, and unauthenticated protected-route redirects at desktop and
390px mobile width. External Clerk prevents authenticated browser verification
in this environment. No promo, trial, payment, exam submission, upload, or
account deletion was performed in the browser.

## Confirmed issues addressed

| Finding | Change |
| --- | --- |
| Topic catalog queried counts twice for every topic, competing with account/access reads for database connections. | Three grouped database queries, independent of topic count. No response contract or content changes. |
| Token registration ran after protected children could begin requesting account data. | Register the token bridge before query effects; protected children wait for bridge readiness. Public pages remain available while auth initializes. |
| Generated account query keys were not uniformly user-scoped. | Clear in-memory query/mutation caches on an account transition; do not reuse another account's cached profile or study data. |
| Stalled generated GETs could leave loading indicators indefinitely. | Bound read fetch/body processing to 20 seconds with caller cancellation and cleanup. Writes are not timed out or automatically replayed. |
| All read failures received the same retry treatment. | Retry transient connection/server errors with a finite limit, not auth, access, validation, not-found, or explicit cancellation errors. Briefly cache reads to avoid immediate duplicate navigation fetches. |
| Failed dynamic imports immediately stranded a route. | One bounded retry for recognized chunk-load failures, followed by a clear refresh message. No automatic full-page reload that could discard study work. |
| Post-auth entitlement failure could silently select the main dashboard. | Show an access-resolution retry state rather than guessing the user's suite. Global auth fallbacks use the same account-aware welcome resolver as the forms. Primary deep-link redirects remain intact. |
| Promo redemption did not invalidate the shared study-access query. | Refresh study access alongside entitlements, subscription queries, and promo status. |
| Trial success could navigate before active access-query refreshes completed. | Await the shared successful-trial invalidation work before mutation success resolves. |
| Stripe return could display stale access, and subscription return claimed success before confirming status. | Refresh account/access data on PsychPro and EPPP returns, with staggered bounded refreshes for delayed webhooks. A URL parameter never grants access or proves payment. |
| Some failed content/progress reads appeared as empty content, unavailable guides, zero progress, or a purchase lock. | Add explicit in-page retry states across dashboard, courses, lesson detail, progress, Study Lab, flashcards, quizzes, guides, practice/mastery exams, billing catalogs, and EPPP access resolution. Preserve loaded exam data on background read failures. |
| Terms and a guide upgrade prompt still advertised retired plan names/prices. | Align factual plan/trial descriptions with combined PsychPro and separate EPPP; remove the retired guide price. Existing cancellation/refund policies were not changed. |
| Workspace typecheck failed on a shared palette import from legacy mockups. | Use the palette's local relative import; the same palette values remain in use. |

## Evidence

- Catalog sample before: 44 topics, 89 database queries, approximately 2.00 seconds
  through the development proxy.
- Catalog sample after: same 44 topics, three database queries, approximately
  0.25 seconds. Full JSON comparison matched all fields/counts after ordering by id.
  These are individual development samples, not a production performance guarantee.
- Public health, topics, PsychPro pricing, and EPPP pricing endpoints returned 200.
- Full workspace typecheck passed, including API, website, mobile, mockups, and scripts.
- Website production build passed. Existing large-chunk warnings remain for the
  main bundle and lazily loaded 3D view; no speculative bundler restructuring was
  performed without runtime profiling.
- 24 focused tests passed: auth navigation, promo return handling, suite
  destinations, transient/deterministic retry behavior, lazy-import recovery,
  timeout propagation, cancellation, and listener/timer cleanup.
- Design-drift and surface-hue checks passed.
- Public browser/history/mobile checks passed. The tester flagged global fallback
  URLs still targeting `/dashboard`; source was subsequently corrected to `/welcome`.
  Actual authenticated redirect completion remains unverified.
- Final EPPP promo screenshot rendered the existing composition and auth buttons.

## Remaining verification/configuration gaps

1. Signed-in account switching, both suite dashboards, trial activation, promo
   redemption, exam save/submit, and checkout/webhook completion need a working
   authenticated test session. Do not represent public redirect tests as coverage
   of those journeys. Do not bypass authentication to obtain test screenshots.
2. Browser testing saw repeated 403 responses from the external Sentry envelope
   endpoint. Public pages rendered despite them. Investigate reporting project /
   credential / network configuration separately; no secret values were read and
   production error reporting was not silently disabled.
3. These changes are in the workspace. This investigation did not publish them
   or validate the published deployment's current behavior.
