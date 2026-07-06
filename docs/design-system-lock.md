# PsychPro Design System Lock

PsychPro's visual system keeps drifting when individual pages get tweaked — surfaces
slide toward navy, accents creep toward mint, cards turn rounder and softer. Two
automated guardrails pin the system so a page-level edit can't silently change the
global look. Both run as validation checks and fail loudly (exit 1) on drift.

| Check | Script | Locks |
|-------|--------|-------|
| Surface hue | `scripts/check-surface-hue.mjs` (`pnpm --filter @workspace/neuronotes run check:surface-hue`) | **Color** — every literal surface color stays in the cerulean hue window (188–193); button accents stay cerulean, never mint/green |
| Design drift | `scripts/check-design-drift.mjs` (`pnpm --filter @workspace/neuronotes run check:design-drift`) | **Shape / structure / type** — locked tokens, glass-card recipe, typography, and shared component mappings |

## What the design-drift lock pins

All values live in `artifacts/neuronotes/src/index.css`.

**Global structural tokens (`:root`)**
- `--radius: .625rem;` — the global corner-radius token.
- `--surf-hue: 193;` — the surface hue base.

**Native background artwork**
- Authenticated pages render the optimized `app-smoke.webp` directly.
- The landing page renders the optimized `brain-clouds.webp` directly.
- Neither backdrop may add a global CSS `filter` or vignette gradient. This keeps
  the artwork clear instead of placing a dark, processed “film” over the site.

**Canonical pigment-only glass card** — the main-site `.study-page-bg .bg-card` rule,
which mirrors the EPPP `.epd-card`:
- `border-radius: 20px;` — fixed, **non-pill** corner.
- `backdrop-filter: blur(5px) saturate(190%)` — the glass blur.
- `linear-gradient(145deg, …)` — the 145° pigmented fill direction.
- no cyan top-bloom, inset cyan glow, or outer cyan corona on idle cards.
- depth comes from pigment contrast plus the neutral dark drop shadow.
- `border: 1px solid rgba(196, 232, 242, 0.22)` — cerulean hairline border.
- `inset 0 1px 0 rgba(255, 255, 255, 0.03)` — restrained highlight shared
  identically by landing, authenticated app, and EPPP cards.

The guardrail checks the landing, authenticated app, and EPPP implementations
together. A page-local style block cannot change this shared recipe independently.

**Banned accents** — mint / teal-green hexes (`#5EEAD4`, `#2DD4BF`, `#14B8A6`) are
rejected in `index.css`. The only accent is locked cerulean `#76E4F7` /
`rgba(118, 228, 247, A)`.

**Typography**
- Interface/display: Montserrat 300–700 via `--app-font-sans`.
- Editorial/clinical reading: Merriweather regular, italic, and bold via
  `--app-font-serif`.
- Pages consume the tokens rather than declaring their own font stacks.

**Shared component mappings**
- The shared `Button` variants remain mapped to the canonical `btn-glass*`
  recipes; parallel `.glass-button` and `.cta-glass` utilities are rejected.
- The shared `Card` retains its canonical `rounded-xl border bg-card` base.

## Enforcement

- `pnpm test` runs `design:check` before the test suite, so ordinary validation
  cannot skip the visual contract.
- Any existing CI or deployment pipeline that invokes `pnpm test` now runs the
  same visual contract before the rest of the test suite.

## Changing the design system on purpose

The lock is not "never change the design" — it is "never change it *by accident*."
When you intentionally update a locked value, change it in `index.css` **and** update
the matching entry in `scripts/check-design-drift.mjs` (and this doc) in the **same
commit**. That makes every deliberate change to the system explicit and reviewable.
