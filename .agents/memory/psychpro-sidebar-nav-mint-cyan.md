---
name: PsychPro sidebar nav mint-cyan override
description: The sidebar nav glow color intentionally departs from the locked cyan palette — do not "fix" it back.
---

The left sidebar navigation pills use **mint-cyan `#5EEAD4` / `rgb(94,234,212)`** for
their border, outer glow, active left-bar, and luminous text (`#A7F3E8`), set in the
`.nav-glass-*` rules of `artifacts/neuronotes/src/index.css` and the `NAV_ITEM_*`
tokens in `app-layout.tsx`.

**Why:** This hue is greener than the locked surf-cyan palette band the rest of the
app uses. The owner explicitly specified these exact values (with a reference image)
for a "compact luminous dark-glass" sidebar look, deliberately overriding the palette
convention. It is intentional, not a mistake.

**How to apply:** Do not "correct" the sidebar nav back to the STUDY_PALETTE cyan to
satisfy the locked-palette convention. Owner-specified exact colors win. The nav
surface is flat dark teal `rgba(12,28,38,0.55)` at idle, brightening on hover/active.
