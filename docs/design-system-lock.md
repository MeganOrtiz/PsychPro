# PsychPro Design System Lock

PsychPro's visual system keeps drifting when individual pages get tweaked — surfaces
slide toward navy, accents creep toward mint, cards turn rounder and softer. Two
automated guardrails pin the system so a page-level edit can't silently change the
global look. Both run as validation checks and fail loudly (exit 1) on drift.

| Check | Script | Locks |
|-------|--------|-------|
| Surface hue | `scripts/check-surface-hue.mjs` (`pnpm --filter @workspace/neuronotes run check:surface-hue`) | **Color** — every literal surface color stays in the cerulean hue window (188–193); button accents stay cerulean, never mint/green |
| Design drift | `scripts/check-design-drift.mjs` (`pnpm --filter @workspace/neuronotes run check:design-drift`) | **Shape / structure** — the locked tokens and the glass-card recipe below |

## What the design-drift lock pins

All values live in `artifacts/neuronotes/src/index.css`.

**Global structural tokens (`:root`)**
- `--radius: .625rem;` — the global corner-radius token.
- `--surf-hue: 193;` — the surface hue base.

**Canonical luminous glass card** — the main-site `.study-page-bg .bg-card` rule,
which mirrors the EPPP `.epd-card`:
- `border-radius: 20px;` — fixed, **non-pill** corner.
- `backdrop-filter: blur(20px) saturate(135%)` — the glass blur.
- `linear-gradient(145deg, …)` — the 145° diagonal bloom direction.
- `inset 0 0 40px -22px rgba(118, 228, 247, 0.42)` — cyan inner glow.
- `0 0 28px -6px rgba(118, 228, 247, 0.30)` — cyan outer corona.
- `border: 1px solid rgba(196, 232, 242, 0.22)` — cerulean hairline border.

**Banned accents** — mint / teal-green hexes (`#5EEAD4`, `#2DD4BF`, `#14B8A6`) are
rejected in `index.css`. The only accent is locked cerulean `#76E4F7` /
`rgba(118, 228, 247, A)`.

## Changing the design system on purpose

The lock is not "never change the design" — it is "never change it *by accident*."
When you intentionally update a locked value, change it in `index.css` **and** update
the matching entry in `scripts/check-design-drift.mjs` (and this doc) in the **same
commit**. That makes every deliberate change to the system explicit and reviewable.
