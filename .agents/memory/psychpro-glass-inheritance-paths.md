---
name: PsychPro glass surface inheritance paths
description: How card/panel "glass" depth propagates site-wide and where the flat gaps always are
---

The deep translucent cerulean "glass" look is NOT applied per-page. Most
surfaces inherit it automatically through three shared mechanisms:

1. Tailwind `bg-card` — `.study-page-bg .bg-card` / `.study-page-aurora .bg-card`
   in `index.css` carries the canonical recipe. Any shadcn Card on a study page
   is glass for free.
2. `StudySurface` tone="light" (components/study/study-surface.tsx) — the
   default tone; shared by dashboard, quiz, study pages, today-reviews, etc.
3. `.recommended-tile` in `index.css` — tile/list-item glass.

**Why this matters:** when asked to "add glass everywhere", do NOT sweep every
page. Grep for the gaps instead. The only flat/opaque surfaces are:
- `StudySurface` NON-light tones (dark / accent / card-front) — these were the
  last flat ones; accent/card-front are the flashcard back/front faces and must
  stay visually distinct (back = directional gradient, front = centered radial
  bloom) even after both go glass.
- bespoke inline-styled panels that bypass the three paths (e.g. flat
  `linear-gradient(135deg, ${P.surface}, ${P.bg})` / `...f0` strings).

**How to apply:** to find remaining flat panels, grep for the flat token
gradients (`P.surface`/`P.bg` solid pairs) and low-alpha `rgba(94,176,200,...)`
fills, then EXCLUDE buttons, chips/badges/icon tints, inputs/textareas, photo
banners, skeleton bars, and page backdrops (#04080c) — those intentionally stay
opaque. Canonical recipe = the `.bg-card` rule in index.css.

**Bespoke inline tiles use MORE THAN ONE legacy signature — grep for all:** a
single grep misses pages. Known legacy families seen inline: (a) eppp-suite nav
rail `rgba(196,232,242,0.x)` hairline + `145deg` fill (EXCLUDED — leave it);
(b) quiz/reflections cards = `radial-gradient(125% 80%...) , linear-gradient(145deg, ...19%/0.79, ...14%/0.90)` + `rgba(118,228,247,0.24)` border + `blur(18px)`;
(c) privacy/terms TOC + contact/DMCA boxes = `linear-gradient(145deg, ...19%/0.69, ...14%/0.83)` + `border 0.18`, no shadow/backdrop. All of (b)/(c) are in-scope
tiles → convert to the STANDARD landing recipe (180deg 0.82/0.90, border 0.36,
blur(10) saturate(140), inset+drop+halo shadow). Sweep by grepping `145deg`
across `pages/` (not just one hairline color), then exclude only `.eps-kb-rail*`.

**Cross-dashboard tile parity:** the main Dashboard "Recommended for You" tiles
(`.recommended-tile`, index.css) and the EPPP dashboard "Progress by domain"
tiles (`.epd-domain`, eppp-dashboard.tsx) must share the SAME resting glass
recipe — owner wants both dashboards to feel identical. They were drifting
(recommended-tile was lighter/glassier). Keep their base recipes in sync; do
NOT fork into a dashboard-scoped class unless the owner explicitly asks for
divergence (fragmenting the canonical glass is what this file warns against).
