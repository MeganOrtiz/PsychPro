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

## Calm-it-down de-glow rule (site-wide)
When the owner asks to "calm it down" / strip cyan glow while KEEPING the glass cards + smoke,
the durable STRIP vs KEEP boundary is:
- **STRIP** the outer cyan corona / drop-shadow / cyan text-shadow from: plain + heading TEXT,
  BUTTONS and TABS (all states + their bare inline `svg` icons), sidebar/site NAV link coronas,
  progress rings/dots/bars, the wordmark underline, and standalone glowing divider lines.
- **KEEP**: glass CARD/tile/panel/row recipes and their hover glows; icon BADGES (an `svg` inside
  a `radial-gradient` container — these are card/section decoration); brain-lab/brain-quiz image
  filters + hotspot markers (visualization imagery, not chrome); landing hero CTAs (separate bright
  family). Card-grid decorative symbol auras (e.g. topics.tsx 39-symbol grid) are card decoration → keep.
- When stripping a multi-line `box-shadow`, the ring line that becomes the new terminator must end
  in `;` not `,` — the two cyan corona lines are the LAST entries, so replace the
  `0 0 0 1px …,\n  <corona>,\n  <corona>;` tail with `0 0 0 1px …;` or the whole declaration is
  dropped as malformed.
- eppp-suite.tsx carries its OWN full styled button/tab/nav system (.eps-subtab, .eps-ghost-btn,
  .eps-save-btn + svg) mirroring index.css's launch/glass buttons — de-glow it in lockstep or that
  major section stays glowing while the rest is calm.
**Why:** aligns with pigment-over-glow; owner picked this scope ("option 1"). Chrome loses glow,
cards keep it, so hierarchy stays intact and the owner's card family is preserved.
- VALUES MUST BE BOLD to be visible: the landing's original brightness(0.9) (-10%) was invisible
  on the in-app app-smoke backdrop and the user read it as "you did nothing." app-smoke.jpg is
  intrinsically brighter than the landing brain image, so the in-app `::before` filter needs a
  STRONGER pass than the landing (in-app now saturate(1.5) contrast(1.16) brightness(0.58) +
  vignette center 0.30 / edge 0.74; landing keeps its own 0.9 over the darker brain image).
  When asked to lower brightness "site-wide", change brightness in big steps (0.6-0.7), not 0.9.
- Verify the in-app backdrop on the PUBLIC `/sign-in` page (shares the app-smoke `::before`) — do
  not rely on the landing screenshot, whose separate override masks in-app backdrop edits.

## Raising saturation SITE-WIDE = surface tokens, not the backdrop filter
When the owner asks to "increase saturation across the ENTIRE site", the backdrop
`filter: saturate()` on the muted dark JPGs is NOT the lever — it barely moves an
already-desaturated image and reads as "you just turned down brightness" (owner
rejected this twice). The direct, visible lever is the **S component of every
`hsl(var(--surf-hue) S% L% / A)` surface token**: bump S upward (e.g. +10, cap 100)
across all css + tsx. Because the hue stays tokenized, both guardrails
(check-surface-hue, check-design-drift) are blind to it — no literal hue added.
Secondary lever: raise all glass `backdrop-filter: ... saturate(N%)` (saturates the
wallpaper showing through translucent glass). To genuinely enrich a backdrop image
itself, inject a saturated cerulean tint LAYER via `background-blend-mode: overlay`
(hue on var(--surf-hue)), not just a bigger filter saturate().
**Why:** filter saturate on a flat/muted source ≈ no-op; deepening the token S and the
blend tint pushes real pigment. **How to apply:** sweep with a perl `s///ge` that reads
the ORIGINAL matched S digit (no cascade), preserve relative L/alpha so hierarchy stays
intact; if drift locks the `.bg-card` saturate value, update the lock in the SAME commit.

## Landing brain-clouds backdrop is the loudest glow
The `.landing-root.study-page-bg::before` brain-clouds.jpg hero backdrop (glow baked into the JPG) is the single loudest glow on the whole site — "first thing i see is glow" reports point here, NOT at CSS coronas. Can't strip glow from the image, so calm it in CSS: pull `filter: brightness` down hard (~0.66) + modest saturate/contrast, and lay a soft deep-cerulean veil over the WHOLE radial (incl. center at 50% 34% where the brain sits) instead of only darkening the edges. Deepen, never brighten.
