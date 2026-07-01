---
name: PsychPro canonical card recipe (the "June 27 look")
description: The exact glass recipe the owner keeps asking to restore, and the two failure modes that keep drifting in.
---

# The canonical card = the "June 27 look" = TRANSLUCENT GLASS WITH A SUBTLE GLOW

The owner repeatedly points at the June-27 EPPP-Mastery-Suite screenshot
(`attached_assets/Screenshot_2026-06-27_*.jpeg`) and says "make the whole site
look like this again." That screenshot was rendered by commit `1585ea0` (June 25;
it was the latest card-style commit before the screenshot timestamp). Its recipe:

- Fill: TRANSLUCENT — `linear-gradient(145deg, hsl(var(--surf-hue) 88% 19% / 0.74), hsl(var(--surf-hue) 88% 14% / 0.85))`
- A radial cyan TOP-BLOOM over the fill: `radial-gradient(125% 80% at 50% 0%, rgba(118,228,247,0.10) 0%, rgba(118,228,247,0.00) 58%)`
- Hairline border `rgba(196,232,242,0.22)` (0.20 on `.lesson-header-box`)
- Heavy glass blur: `backdrop-filter: blur(20px) saturate(135%)`
- SUBTLE cyan glow in the shadow stack: `inset 0 0 40px -22px rgba(118,228,247,0.42)` + `0 0 ~28px -6px rgba(118,228,247,0.30)` + deep drop shadow
- Applies uniformly to `.bg-card`, `.epd-card`, `.recommended-tile` (idle), `.lesson-header-box`, and StudySurface `light`/`default`.

**Why this keeps happening (the root cause):** the June-27 look was written into the
notes / commit summaries as "opaque PIGMENT cards, blur(5px), NO cyan glow" — the
exact OPPOSITE of what it is. So every "restore the June 27 look" applied flat
opaque pigment, which strips the glass and reads dark/muddy → owner reopens it.

## The TWO failure modes (both wrong, both keep drifting in)
1. **Flat opaque pigment, no glow** (e.g. commits `c9f0ade`/`423bf00`): fill ~.95/.99,
   `blur(5px)`, zero cyan glow. Reads dark, heavy, flat. This is NOT the June-27 look.
2. **Heavy launch-pill glow sweep** (e.g. `33e2ed6`): border `rgba(118,228,247,0.45)`,
   `blur(16px)`, big `0 0 26px` corona on EVERY tile+button. Reads muddy/overlit;
   owner reverts it too.

The canonical is the MIDDLE: translucent fill + heavy blur + a SOFT glow.

## Guardrail
`scripts/check-design-drift.mjs` pins `.bg-card` to this glass: it requires
`blur(20px) saturate(135%)` AND requires the cyan glow to be PRESENT
(`rgba(118,228,247…)` inside the card). If you ever intentionally change it, update
that lock in the same commit.

**How to apply:** if a future request says "restore the June 27 look" or "make the
cards like the image," use THIS recipe — do not trust any note that calls June 27
"pigment / no glow." `.bg-card` (index.css), `.epd-card` (eppp-dashboard.tsx), and
StudySurface (study-surface.tsx) are separate files — keep them in lockstep by hand.
Buttons/launch pills keep their own stronger glow; this file is only about cards/tiles.

## Page background (DEEP — do NOT lighten)
The owner reacted VERY strongly ("NOT LIGHTER") when the app-smoke backdrop was
run at native brightness. The signed-in background MUST stay deep: keep
`filter: saturate(1.16) contrast(1.1) brightness(0.92)` on `.study-page-bg::before`.
This SUPERSEDES the earlier "match the screenshot at native brightness" idea —
"exactly like the screenshot" does NOT mean lighter. Deep pigment > literal filter
match. Never remove or raise the brightness of this backdrop.

## Verifying without auth
The live EPPP/main dashboards are Clerk-gated (external instance blocks the test
browser). Verify card+background visually via the DEV-only route `/__eppp-preview`
(`src/pages/dev-eppp-preview.tsx`) which renders `EpppDashboardView` with static
mock data mirroring the screenshot. DEV-gated in `App.tsx`; screenshot it directly.
