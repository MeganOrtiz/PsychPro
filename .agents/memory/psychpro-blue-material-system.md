---
name: PsychPro blue three-material system
description: The owner-approved 2026-07-09 blue design system (Opaque/Glass/Gloss) that replaced the black foundation — palette, material rules, glow discipline, guardrails.
---

# PsychPro blue three-material system (owner-approved 2026-07-09)

Replaces the short-lived pure-black/gray foundation from earlier the same day. This is the CURRENT system.

**The three materials** (recipes live in `src/index.css`):
- **OPAQUE** (`.mat-opaque`) — structural panels: solid navy-tint gradient, lit top bevel, neutral black shadow. NEVER glows, never reacts to hover.
- **GLASS** (`.mat-glass`, `.mat-glass-interactive`) — nested tiles: tinted transparency (rgba(13,88,162,a) family), brighter bevel. NO backdrop-filter/blur ever. Interactive glass gets hover glow + lift only.
- **GLOSS** (`.btn-glass-strong`) — primary buttons: cyan gradient (#08a5d1→#0bd4df) + glossy highlight, dark ink text (#03131f), hover corona. `.btn-glass` = glass secondary. (Class NAMES kept from the glass era; recipes are the new materials — guardrail pins them.)

**Palette (--pp-\* tokens, :root)**: floor #000000, deep #04101f, surface #071c33, navy #052a58, navy-bright #0e4e71, ocean #0b669a, ocean-deep #0d58a2, cyan #08a5d1, bright #0bd4df, icy #aaedf0, text #e5e5e5, text-dim #a3a3a3. Derived: --pp-bevel(-bright), --pp-line(-bright), --pp-glow(-strong), --pp-shadow. `--surf-hue: 211`, `--surf-sat: 62%` (page fills use `hsl(var(--surf-hue) var(--surf-sat) L% / a)`).

**Rules (owner-locked):**
- Glow ONLY on :hover/:active/:focus. At-rest depth = pigment (gradients, bevels, black shadows).
- backdrop-filter banned app-wide (global `none !important` reset + guardrail scans TSX for backdrop-blur classes).
- Page floor stays pure #000; landing hero brain lock unchanged.
- Fonts: Montserrat body, **Outfit** display (`--app-font-display`), Merriweather editorial.
- Text grays #e5e5e5/#a3a3a3 stay gray — they are not accents.
- Elevation ladder #04101f → #071c33 → #092642; a panel and its nested tiles must never share the same fill.

**Why:** owner reset to black, then approved this blue direction from canvas specimens (canvas shape `blue-material-system` shows the canonical spec).

**How to apply:** consume --pp-* tokens / mat-* classes; charts use LITERAL blues (SVG attrs render hsl(var()) black). Guardrails: `scripts/check-surface-hue.mjs` (allowed hue window 178–220 + semantic red/green; Tailwind ban only indigo/violet/purple/fuchsia/pink) and `scripts/check-design-drift.mjs` (pins tokens, materials, blur ban, glow-only-hover walker, fonts, button/card contract). Update lock entries in the same commit as intentional design changes. `src/lib/study-theme.ts` retoned blue with unchanged keys.
