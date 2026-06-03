---
name: PsychPro sidebar nav color (cerulean, NOT mint)
description: The sidebar nav glow was mint-cyan but the owner reversed it — it must use the locked cerulean palette.
---

The left sidebar navigation pills (border, outer glow, active left-bar, luminous
text) live in the `.nav-glass-*` rules of `artifacts/neuronotes/src/index.css` and the
`NAV_ITEM_*` tokens in `app-layout.tsx`.

**Current state (owner-confirmed 2026-06-03):** use the locked cerulean
`#76E4F7` / `rgb(118,228,247)` for glow/border/active-bar and `#A7F3FF` (mist) for
luminous text. The nav idle surface stays flat dark teal `rgba(12,28,38,0.55)`.

**Why:** The sidebar previously used mint-cyan `#5EEAD4` / `rgb(94,234,212)` (hue ~166,
greener than the locked 188–198 band). The owner first specified that mint on purpose,
then later said the left column "gives a green vibe" and asked to fix it. So the mint
override was *retracted* — the sidebar now conforms to the locked surf-cyan palette like
the rest of the app.

**How to apply:** Do NOT re-introduce `#5EEAD4` / `rgb(94,234,212)` / `#A7F3E8` in the
sidebar nav. Keep it on the locked cyan. NOTE: the same mint still exists in the GLOBAL
button glass (`.btn-glass`, `.btn-glass-strong`, `button.bg-primary/secondary`, outline
buttons) in index.css — those were left as-is because the owner scoped the fix to the
left column only. If the owner later complains buttons look green, shift those too.
