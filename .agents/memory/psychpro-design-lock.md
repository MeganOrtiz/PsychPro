---
name: PsychPro design system lock
description: The two automated guardrails that pin the visual system, and the protocol for changing it on purpose.
---

PsychPro has TWO complementary anti-drift guardrails in
`artifacts/neuronotes/scripts/`, both wired as validation checks:

- `check-surface-hue.mjs` (`check:surface-hue`) — pins **color**: every literal
  surface color stays in the cerulean hue window; accents stay cerulean, not mint.
- `check-design-drift.mjs` (`check:design-drift`) — pins **structure**: the
  `.study-page-bg .bg-card` glass recipe (== EPPP `.epd-card`), the `--radius` and
  `--surf-hue` tokens (scoped to `:root`), and bans mint/teal hexes. Comments are
  blanked before matching so a value in a comment can't satisfy or trip a lock.

**Rule / protocol:** the lock is "never change the design *by accident*," not
"never change it." When you intentionally change a locked value in index.css, update
the matching entry in `check-design-drift.mjs` (and `docs/design-system-lock.md`) in
the SAME commit. An accidental drift fails the check loudly (exit 1).

**Why:** the owner's original hand-built lock was wiped by a `git clean -fd` (it was
never committed). This is the rebuild; keep it committed.

**How to apply:** don't ban things used legitimately at scale (e.g. rounded-full,
111+ uses). Lock the canonical recipe + tokens, not every utility.

## Material composition discipline (2026-07-09)
Pages/components must COMPOSE the shared material classes from index.css (.mat-opaque / .mat-glass(-interactive) / .mat-icon-well(--round) / .mat-chip / .pp-btn-* / .eppp-launch-btn) — never re-declare the material values in page CSS or inline styles. The drift guardrail's material rule bans the signature values (opaque gradient+shadow stack, glass base fill 0.16, icon-well cyan-0.35 border) in TSX. sonner.tsx is the one whitelisted exception (third-party toast internals need !important arbitrary values via its classNames API). State modifiers (is-active elevated fills, elevation steps) and pure geometry overrides remain legitimately local.
**Why:** Task-176 review rejected value-migration alone; duplicated recipes drift silently.
**How to apply:** new tiles/cards/buttons start from a shared class + local geometry; intentional material changes edit index.css + guardrail lock in the same commit.
