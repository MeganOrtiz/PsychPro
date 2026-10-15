# PsychPro design protection

Preserve the current PsychPro visual system unless the owner explicitly requests
a visual change. This includes the main site, EPPP suite, promo pages, and shared
components.

## Scope and approval

- Routine bug fixes, performance work, authentication, billing, content updates,
  publishing, and Git maintenance do not authorize a redesign.
- Broad requests to clean up, optimize, or make things consistent do not authorize
  changing the palette, backgrounds, materials, typography, assets, or layout.
- An explicit visual request authorizes only the requested elements and pages.
  Preserve everything outside that scope, including spacing.
- If a non-visual task appears to require a visual-system change, explain why and
  obtain the owner's approval before making it.
- Do not restore historical branch styles or retired design recipes while
  resolving conflicts. Compare proposals with the current implementation.

## Guardrails

- Before an approved visual change, read `docs/design-system-lock.md` and inspect
  the current implementation and active design checks.
- Never weaken, bypass, remove, or rewrite a design check merely to make it pass.
  Approval for an unrelated fix is not approval to change a locked expectation.
- When an approved change deliberately alters a locked design value, update the
  implementation, matching check expectation, and design documentation together
  in one focused change, isolated from unrelated work.
- Run `pnpm run design:check` after an approved visual change and report the
  visual files changed and the result. Do not claim a check passed if it did not.
- Treat outdated design documentation as a discrepancy to report, not permission
  to replace the current design with an older one.
