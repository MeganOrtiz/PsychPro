---
name: PsychPro teal backdrop hue-rotate grade
description: Why the site backdrop is graded to teal-turquoise via CSS hue-rotate while --surf-hue stays 193; supersedes "no mint" for the BACKDROP only.
---

# Teal-turquoise backdrop grade

The owner supplied an EXACT teal-turquoise reference (deep near-black base `#011521`,
glowing turquoise clouds `#23C3BD`–`#56DDD4`, glow hue ~178) and said "this is the
exact color and pigment it needs to be." The baked backdrop JPGs
(`assets/bg/app-smoke.jpg`, `assets/bg/brain-clouds.jpg`) are cerulean-BLUE (hue ~193).

**How it's done:** a single `hue-rotate(-21deg)` on the two `.study-page-bg::before`
`filter` rules in `index.css` (base in-app rule + `.landing-root` override). That
filter wraps the WHOLE backdrop layer — the JPG *and* the `--surf-hue` overlay
gradients — so the entire backdrop grades cohesively from cerulean (193) to turquoise
(~172) with one value. Paired with `saturate(2.05) contrast(1.15) brightness(0.78)`
for the vivid-glow-on-near-black look.

**Why not change --surf-hue:** changing the hue token to ~178 would (a) break both
guardrails (check-surface-hue window 188–193, check-design-drift locks --surf-hue:193)
and cascade a lock rewrite, and (b) re-tint every glass surface. Grading only the
backdrop filter keeps guardrails green (filter functions add no literal colors and
aren't checked) and leaves surfaces on the locked cerulean token; translucent glass
picks up the teal from the backdrop anyway.

**Why:** the DOMINANT thing the user sees is the backdrop wallpaper (~75% of the
viewport). Getting its pigment exactly right = "get the color right" for the whole site.

**Reconciles with the "no mint" rule** (`psychpro-sidebar-nav-mint-cyan.md`): that
retraction still holds for SURFACES/BUTTONS (they stay cerulean #76E4F7). This teal
grade is BACKDROP-ONLY and by explicit owner request with a reference image — it is
not a reintroduction of mint on UI chrome.

**How to apply:** if the backdrop ever looks "too blue again," adjust the single
`hue-rotate` value on both filter rules (more negative = greener/teal, less = bluer);
~-21deg lands on the reference turquoise, ~-26deg tips into emerald. Do NOT delete the
hue-rotate as drift, and do NOT try to fix it by editing --surf-hue.

## Lesson
Pigment the user reacts to lives in the BACKDROP layer, not the surfaces. Cranking
saturation on nested glass tokens to change the site's "color" makes pages garish/neon
(the owner rejected exactly that) without fixing the perceived hue. Grade the backdrop.
