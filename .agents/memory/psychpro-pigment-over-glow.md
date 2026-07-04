---
name: PsychPro pigment-over-glow correction
description: The "flat/bland/foggy" complaint is a glow+blur desaturation problem, not a hue/darkness problem; fix with pigment (saturate+contrast up, brightness down) and LESS glow, never more light.
---

# Pigment over glow

When the owner says the site looks "flat", "bland", or "foggy", the root cause is
**stacked cyan glow + layered backdrop-blur desaturating and flattening contrast**, NOT
the wrong hue and NOT that surfaces are too dark.

**The fix (owner-confirmed "yes exactly"):**
- Increase **saturation** and **contrast**, and **lower brightness** (deepen blacks) so the
  cerulean reads as *pigment*, not a milky wash.
- **Reduce** the glow: fewer/weaker cyan coronas (outer + the doubled inset corona), and pull
  back the ~25 `backdrop-filter: blur() saturate()` layers that compound into haze across nested
  surfaces (page bg → panel → card → inner tile).
- Do NOT "add more light/glow" to fix flatness — that is the cause, not the cure.

**Why:** Owner edited the landing hero in their own photo editor (saturation+contrast up,
brightness down) and showed a side-by-side; the more-pigmented version killed the fog. Confirmed
the diagnosis directly.

**How to apply:**
- Hero/backdrop images live on `.study-page-bg::before` (in-app = `app-smoke.jpg`) and
  `.landing-root.study-page-bg::before` (landing = `brain-clouds.jpg`). Correct them with a CSS
  `filter: saturate() contrast() brightness()` on the `::before`.
- Phase 1 (backdrop image filter) is DONE site-wide: the same validated pass — saturate(1.32)
  contrast(1.12) brightness(0.9) — now lives on BOTH the base in-app `::before` and the landing
  override, so every page shares one pigment lever. Tune brightness/saturation there first.
- Opaque surfaces that DON'T sample the wallpaper backdrop (portaled popovers/dropdowns/tooltips
  read `.dark` tokens; in-page surfaces read the `.study-page-bg` tokens) get no benefit from the
  ::before filter — deepen THOSE by nudging the surface token S up / L down in BOTH blocks (keep
  hue on var(--surf-hue) so guardrails don't see a literal hue). Foregrounds/accents stay put.
- Keep hue locked (--surf-hue 192) so check-surface-hue + check-design-drift stay green — a filter
  and var(--surf-hue) token tuples add no literal hue, so guardrails are unaffected.
- Further glow/blur reduction on cards/buttons/panels is the remaining lever if the deepened
  backdrop + tokens still read foggy.
