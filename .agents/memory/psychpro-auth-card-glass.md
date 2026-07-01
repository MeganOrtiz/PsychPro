---
name: PsychPro Clerk auth card glass (sign-in / sign-up)
description: How the Clerk sign-in/sign-up card should be styled — translucent glass depth, not a flat opaque box — and the footer two-tone fix.
---

# Clerk auth card (sign-in / sign-up) glass

The `/sign-in` and `/sign-up` Clerk `<SignIn>/<SignUp>` cards are styled via
`appearance.elements` inline style objects in `sign-in.tsx` / `sign-up.tsx`.

## Two lessons the owner surfaced

1. **"Remove glow" is NOT "make it opaque/flat."** A first attempt set the card
   fill to ~0.95–0.99 alpha with a weak 5px blur → the backdrop blur did nothing,
   so it rendered as a dead flat teal box. Owner: **"this is bad."**
   **Fix / rule:** real glass depth = translucency (fill alpha ~0.70–0.82) +
   strong `backdropFilter: blur(~30px) saturate(~155%)` so the smoke wallpaper
   (`.study-page-bg`) diffuses through, PLUS a bright top edge
   (`inset 0 1px 0 rgba(255,255,255,0.20)`) + a soft drop shadow for lift. This
   gives premium glass **without** any cyan glow (no top-bloom radial, no cyan
   corona) — fully compatible with the app-wide no-idle-card-glow direction.

2. **Clerk's default `footer` renders as a lighter mismatched band** below the
   form (holds "Don't have an account? Sign up" + "Secured by Clerk" +
   "Development mode"), creating an ugly two-tone split inside the card.
   **Fix:** add a `footer` element style with `background: "transparent"` (and an
   optional faint `borderTop` hairline) so the whole thing reads as one cohesive
   glass panel.

**Why:** glass reads as glass because you can see *through* it; an almost-opaque
fill kills that regardless of hue. Depth cues (blur, top highlight, shadow) do
the work glow used to do.

**How to apply:** any auth/hero card on the smoke background should be
translucent glass with these depth cues, not a solid fill. Keep hue 192 so
check:surface-hue passes; keep it cyan-glow-free so check:design-drift passes.
