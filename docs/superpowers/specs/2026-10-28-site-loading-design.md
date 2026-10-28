# Site-Wide Loading Design

## Goal

Make navigation feel continuous across the PsychPro web app and EPPP suite by
avoiding full-screen replacement loaders during ordinary page navigation and
data loading. Do not change page content, route destinations, or access rules.

## Findings

- `AppRouter` is currently wrapped by one root-level `Suspense` boundary. When a
  lazy page module is not loaded yet, the boundary replaces the entire route
  tree with `FullScreenLoader`, including the current page and signed-in
  navigation shell.
- Signed-in routes deliberately use full-screen loaders while Clerk, profile,
  onboarding, or suite-access checks are unresolved. These checks enforce
  authentication and suite access and must remain blocking.
- Pages use a mix of section skeletons and blocking content placeholders.
  Cached query data is generally kept by React Query during background refresh;
  the implementation should preserve that behavior and focus on cold-load gaps.
- The PsychPro shell lives in `AppLayout`; the EPPP suite has its own shell and
  route structure. The first lazy load of either suite can therefore behave
  differently from later in-suite navigation.

## Design

### Route loading

- Add route-level Suspense boundaries so a lazy page load replaces only the
  route content, not the persistent application shell.
- For routes inside `AppLayout`, keep the sidebar and header mounted and show a
  compact, low-motion placeholder in the main content region.
- For protected routes outside `AppLayout`, use a route-appropriate placeholder
  after the existing authentication and suite-access gates. Do not expose
  protected content or bypass a gate while loading.
- Keep full-screen loading for Clerk startup, auth-token readiness, onboarding
  decisions, suite-access decisions, and checkout handoff. Keep their existing
  retry/error behavior.
- Public routes and suite roots that do not share `AppLayout` should use a
  route-appropriate surface placeholder instead of a spinner-only interstitial
  or blank frame. Full-screen blocking remains reserved for real auth and
  access decisions.

### Page data

- Audit existing page-level loading branches for cases that hide already
  available content or show an oversized spinner for a small pending section.
- Use local skeletons for cold data loads and retain existing content during
  background refetches.
- Do not add automatic page reloads or replay mutations. Keep in-progress study
  state, drafts, and exams intact during navigation and recovery.
- Do not increase query fan-out or change cache freshness unless an observed
  loading issue requires it.

### Visual behavior and accessibility

- Keep page dimensions stable while loading to reduce layout shifts.
- Use the existing white/luminous surface tokens and shared loader styling.
- Respect reduced-motion preferences; avoid adding a mandatory route animation.
- Mark loading regions with appropriate busy/live semantics without announcing
  every background refresh.

## Scope

- PsychPro web artifact, including both PsychPro and EPPP routes.
- No change to mobile app, page copy, billing, route structure, or authorization
  policy.

## Verification

- Typecheck and production build.
- Run existing auth, suite-entry, and loading-reliability tests.
- Confirm protected route fallbacks remain behind their access gates.
- Verify representative route transitions at desktop and mobile widths where
  an authenticated preview is available; otherwise report that the signed-in
  UI could not be visually verified in the managed browser.
