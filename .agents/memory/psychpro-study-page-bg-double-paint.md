---
name: PsychPro study-page-bg double-paint
description: Why the cerulean page backdrop reads navy / shows a top seam, and the correct one-line fix
---
`study-page-bg` (the fixed full-viewport cerulean nebula backdrop, painted via
`::before`/`::after` in index.css) is applied BOTH on `AppLayout` AND on almost
every page component (so each page also works as a standalone route).

When a page renders inside AppLayout it therefore carries `study-page-bg` nested
inside another `study-page-bg`. Both fixed pseudo-elements paint at z-index -2/-1,
so the semi-transparent vignette overlay STACKS — the whole app reads darker/navy
("color drift") and the doubled fixed layer can leave a faint hairline seam at the
top of the page.

**Fix:** suppress the inner backdrop, never edit ~40 page files:
`.study-page-bg .study-page-bg::before/::after { content: none; }` (plus the
study-page-aurora combos). The backdrop is then painted exactly once.

**Why:** the lever for "too navy" is overlay STACKING (and historically HUE), not
the image. Lightening the single vignette + a higher-res landscape image restores
vibrancy; keep surfaces on canonical hue 192.

**How to apply:** if someone reports the backdrop is too dark/navy, has a faint top
line, or "drifted again", first check for nested study-page-bg, not literal colors.
