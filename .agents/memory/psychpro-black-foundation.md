---
name: PsychPro black foundation
description: 2026-07-09 owner-directed reset — entire visual layer stripped to pure black; supersedes all prior cerulean/glass/glow design locks.
---

# PsychPro black foundation (2026-07-09, Task-era reset)

The owner had the ENTIRE visual layer stripped: cerulean palette, glass/blur,
glow, gradients, colored tiles — across landing, main site, EPPP suite, and
Clerk auth surfaces. Content/features/layout/copy unchanged.

**The rule:** pure-black page floors (#000000 body + `.study-page-bg::before`),
flat dark-gray panels (#0f0f0f–#1c1c1c ladder), neutral gray borders,
white/gray text. `--surf-hue: 0` with 0% saturation everywhere it is consumed.
A global reset block at the end of `index.css` bans `backdrop-filter` and
`text-shadow` app-wide (`!important`), and kills `box-shadow` except
`:focus`/`:focus-visible`.

**Why:** owner decision — this supersedes ALL earlier color-system memories:
cerulean surface stack, mint retraction, card darkening ladder, teal backdrop
grade, June-27 glowing look, pigment-over-glow, EPPP card glass, site-wide
button glow, header scrims (scrims now disabled entirely).

**How to apply:**
- Never reintroduce saturated color into UI chrome. Allowed exceptions:
  semantic red/amber (hue 0–70) and green (90–160) status colors, and
  `src/data/brain-structures.ts` anatomy colors (educational, exempt).
- Landing keeps the glass-brain artwork: `landing-glass-brain.jpeg`,
  `background-size: contain`, #000 letterbox — never cover-crop.
- Both guardrails were repointed in the same commit:
  `check-surface-hue.mjs` = src-wide saturation ban (s>25% non-semantic
  fails, incl. Tailwind blue-family classes); `check-design-drift.mjs` =
  black floors, reset-block presence, no gradients in index.css OR in
  TS/TSX inline styles (mask-image fades + dev-glass-preview exempt),
  legacy accent hexes banned, typography + Button/Card contracts.
- `btn-glass*` CLASS NAMES survive in button.tsx (recipes are now flat);
  the drift lock still checks variant→class wiring, so don't rename.
- STUDY_PALETTE keys are unchanged but values are grayscale; components
  still import it — don't delete keys.
