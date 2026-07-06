---
name: PsychPro corona/bloom removal (design-drift fix)
description: Owner banned cyan top-blooms, inset glows, and outer coronas app-wide; cards are pigment-only glass now. Read before touching .bg-card / glass surfaces or the design-drift guardrail.
---

The design-drift guardrail (`scripts/check-design-drift.mjs`) used to LOCK a
"cyan inner glow + outer corona" box-shadow recipe on `.bg-card` as canonical.
That lock itself was drift — the owner's actual spec is **pigment-only glass**:
145° diagonal cerulean gradient, 20px non-pill corners, cerulean hairline
border, tight blur(20px) saturate(135%), and a **neutral dark** depth shadow
(`rgba(0,0,0,...)` only — no `rgba(118,228,247,...)` in the shadow layer).

**Why:** the bloom/corona pattern had propagated as inline styles into ~20+
files (cards, tiles, banners, toasts) and the guardrail was actively
re-enforcing it, so every attempted fix kept getting flagged as "drift."

**How to apply:**
- `.bg-card` / `.epd-card`-style recipes: keep gradient + hairline border +
  radius + blur; shadow must be neutral dark only.
- The guardrail now REQUIRES the neutral shadow and BANS any
  `rgba(118,228,247,...)` inside `.bg-card`'s box-shadow or as a
  `radial-gradient` top-bloom — check both directions when editing it.
- Small decorative cyan accents are still fine and intentional: thin hairline
  borders, `0 0 0 Npx` focus rings, progress-bar fills, and restrained
  micro-glows on small icons/underlines (e.g. the "signal-beam" title
  underline pattern reused in app-layout.tsx and eppp-suite.tsx). Only
  card/toast-level blurred coronas (`0 0 <blur>px rgba(118,228,247,...)`,
  blur ≳15px) were removed — from `sonner.tsx` toast shadows,
  `my-decks-new.tsx` selection glows, and `study-surface.tsx`.
- A leftover bug from a prior bad edit — a trailing `,` immediately before
  `!important;` in a box-shadow list — silently breaks the whole declaration;
  worth a quick eyeball after any mechanical regex sweep over CSS.
