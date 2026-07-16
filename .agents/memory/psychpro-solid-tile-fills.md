---
name: PsychPro solid tile fills
description: Owner rule (2026-07-15) — every box/button fill in the logged-in app is fully opaque; translucent GLASS alphas retired for the --pp-tile ladder.
---

Rule: every box and button fill in the logged-in app must be fully opaque so
surfaces read against the vivid site-wide liquid-flare backdrop.

**Why:** the backdrop artwork is high-contrast; translucent tile fills let it
bleed through and made cards/buttons hard to see. Owner ordered "all boxes and
buttons solid" on 2026-07-15 with the main dashboard as the baseline look.

**How to apply:**
- Use the solid tile ladder in index.css `:root`: `--pp-tile` #1f1f1f (rest),
  `--pp-tile-strong` #262626 (hover / icon wells), `--pp-tile-stronger`
  #2e2e2e (active). Values are the old alpha mixes baked over --pp-surface.
- GLASS-family class NAMES survive (.mat-glass, .btn-glass, .nav-glass-*,
  .pp-btn-glass…) but their fills are solid now.
- Semantic status tiles are solid hex mixes (#162d1e / #321b1b / #342713).
- Intentional exceptions that STAY translucent: modal/dialog scrims and
  overlays (deep/black alphas), .btn-glass-ghost REST state (transparent by
  design; hover/active are solid), and the entire landing page (owner's
  blue-window exception).
- Guardrail: check-design-drift.mjs enforces solid .mat-glass/.btn-glass fills
  and bans any `background: rgba(var(--pp-ocean-deep-rgb)…)` in index.css.
  Update locks in the same commit as intentional changes.
