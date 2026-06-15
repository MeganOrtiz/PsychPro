---
name: PsychPro site-wide button glow + glass
description: How "every button glows on hover/click" is enforced site-wide without clobbering bespoke buttons.
---

# Site-wide button glow + adaptive glass

Every button on PsychPro must glow on hover AND press, and read as glass.

**Mechanism (do not "fix" by adding higher-specificity global button rules):**
- The shadcn `Button` variants carry the glass: default→`.btn-glass-strong`, outline/secondary→`.btn-glass`, ghost→`.btn-glass-ghost`, destructive→`.btn-glass-destructive`, link→`.btn-link-glow`. Raw `button.bg-primary` / `button.bg-secondary` / `button.border.border-input` have their own scoped recipes.
- The catch-all that guarantees bare raw `<button>`s still glow is a selector wrapped ENTIRELY in `:where(...)` so it has ZERO specificity: `:where(.study-page-bg button:not([class*="cl-"]):not(:disabled):hover){box-shadow:...}` (+ `:active`). It only adds a box-shadow glow, never an idle background.

**Why `:where()` (zero specificity):** any button with its own box-shadow (`.btn-glass*`, `.bg-primary`, `.nav-glass*`, `.eppp-launch-btn`, `.eps-*`, quiz options) automatically overrides it, so the catch-all can't cause the wildcard-style regressions that broke `[class*="bg-primary"]`. Clerk's avatar button is excluded via `:not([class*="cl-"])`.

**Why destructive stays near-opaque (not translucent glass):** a translucent red over a white StudySurface card makes white label text invisible. `.btn-glass-destructive` uses a ~0.95–1.0 alpha red gradient (legible on dark AND white), expressing "glass" via backdrop-blur + a red glow corona instead of transparency. Same reason the legacy outline recipe excludes `.bg-destructive`.

**Scope note:** landing page wrapper is `landing-root study-page-bg`, so the catch-all already covers landing. Nav items are `<div>`s (not buttons) — untouched by the catch-all by design.

**Guardrail also enforces button COLOR family (not just surface hue).** `scripts/check-surface-hue.mjs` (run by the `surface-hue` workflow) has an accent-family pass: any BRIGHT, saturated cyan/green-family color (L≥0.5, S>0.35, hue 120–210) used inside a button/CTA rule must sit in the cerulean window [184,200] (accent #76E4F7 ≈ 189) — this catches mint #5EEAD4 (hue ~170) drifting back into button borders/glows. It scans flat button rules in `index.css` AND CSS authored in `.tsx` backtick template literals (e.g. `landing.tsx`); `${…}` interpolations are blanked first so only literal colors are inspected. Reds (destructive, hue ~0) and near-white insets (low S) are ignored.

**Adaptive transparency:** delivered honestly via `backdrop-filter: blur() saturate()` on buttons and boxes (`.bg-card`, tiles, header boxes) — the blur samples whatever is behind, so the same recipe reads differently over dark vs light. CSS cannot truly measure background contrast; backdrop-filter is the real adaptive mechanism.
