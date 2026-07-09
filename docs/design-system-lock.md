# PsychPro Design System Lock

PsychPro's visual system keeps drifting when individual pages get tweaked — black
surfaces slide toward flat navy, cyan accents creep toward mint, and glass cards
lose their glossy edge-light. Two automated guardrails pin the system so a
page-level edit can't silently change the global look. Both run as validation
checks and fail loudly (exit 1) on drift.

| Check | Script | Locks |
|-------|--------|-------|
| Surface hue | `scripts/check-surface-hue.mjs` (`pnpm --filter @workspace/neuronotes run check:surface-hue`) | **Color** — every literal surface color stays in the cyan hue window (186–194); button accents stay cyan, never mint/green |
| Design drift | `scripts/check-design-drift.mjs` (`pnpm --filter @workspace/neuronotes run check:design-drift`) | **Shape / structure / type** — locked tokens, liquid-glass card recipe, typography, and shared component mappings |

## What the design-drift lock pins

All values live in `artifacts/neuronotes/src/index.css`.

**Global structural tokens (`:root`)**
- `--radius: .625rem;` — the global corner-radius token.
- `--surf-hue: 190;` — the surface hue base.

**Native background artwork**
- Authenticated pages render `app-smoke.webp` inside a near-black stage with
  cyan specular gradients.
- The landing page renders the supplied `liquid-brain.jpeg` reference as the
  first-viewport brand signal.
- Neither backdrop may add a global CSS `filter`. Gradients are allowed only as
  part of the locked black-stage treatment.

**Canonical liquid-neuroglass card** — the main-site `.study-page-bg .bg-card`
rule, which mirrors the EPPP `.epd-card`:
- `border-radius: 18px;` — fixed, **non-pill** corner.
- `backdrop-filter: blur(18px) saturate(210%)` — the glass blur.
- `radial-gradient(120% 90% at 50% 0%, …)` — the locked specular top highlight.
- `linear-gradient(145deg, hsl(var(--surf-hue) 100% 12% / 0.82), hsl(var(--surf-hue) 100% 5% / 0.96))` — near-black cyan glass fill.
- `border: 1px solid rgba(167, 243, 255, 0.30)` — icy cyan hairline border.
- `inset 0 1px 0 rgba(255, 255, 255, 0.16)` — specular highlight.
- `inset 0 -18px 40px -34px rgba(118, 228, 247, 0.38)` — restrained cyan lower reflection.
- `0 28px 72px -46px rgba(0, 0, 0, 0.92)` — black depth shadow.

The guardrail checks the landing, authenticated app, and EPPP implementations
together. A page-local style block cannot change this shared recipe independently.

**Banned accents** — mint / teal-green hexes (`#5EEAD4`, `#2DD4BF`, `#14B8A6`) are
rejected in `index.css`. The only accent is locked cyan `#76E4F7` /
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
