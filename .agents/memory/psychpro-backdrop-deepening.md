---
name: PsychPro in-app backdrop deepening & de-glow
description: How to actually make the signed-in dashboards read deep, and where the "glow" really comes from
---

# Deepen the in-app backdrop with a scrim, not brightness()

The signed-in backdrop (main dashboard, EPPP, every page) is the shared
`.study-page-bg::before` painting a luminous cyan smoke image. The main dashboard
inherits it from the `AppLayout` root (its own page root has no backdrop class);
EPPP adds `study-page-bg` on its own root; landing overrides the image+filter via
a `.landing-root.study-page-bg::before` rule.

**Why:** owner kept saying "nothing changed / dashboards still bright & glowy"
after the backdrop was merely dimmed with `filter: brightness()`. A bright source
image barely responds to a brightness dim — the real deepening lever is a
**full-coverage dark cerulean scrim inside the ::before background-image gradient**
(darken the whole image, not just a corner vignette).

**The "glow" is a separate additive `.study-page-bg::after` nebula layer**, not the
image — dimming ::before never touches it. Cut its opacity to de-glow, and **scope
de-glow to in-app** by restoring the landing's glow with a
`.landing-root.study-page-bg::after` override.

**How to apply:** the design-drift guardrail does NOT lock these ::before/::after
values, so change them freely; keep colors as `var(--surf-hue)` / rgba(118,228,247)
to keep check-surface-hue green. Verify on the DEV `/__glass-preview` route (a
faithful backdrop proof — same `.study-page-bg` layers, unlike the Clerk-gated real
pages), then remember prod needs a republish before the owner sees it.
