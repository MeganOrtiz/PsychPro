---
name: PsychPro header scrim convention
description: How floating page/section headers stay readable over the cerulean smoke wallpaper
---

# Floating header legibility = shared `.text-scrim` utility

Floating page/section headers (titles, eyebrows, subtitles) sit directly on
the cerulean brain-smoke wallpaper and wash out over bright plumes. The fix is
the shared `.text-scrim` / `.text-scrim-start` utility in
`artifacts/neuronotes/src/index.css` (after the `.bg-card` block).

**Rule:** to make a floating header readable, wrap it (or tag its container)
with `.text-scrim` (centered) or `.text-scrim text-scrim-start` (left-aligned).
Do NOT add ad-hoc per-element `text-shadow` — that diverges from the shared
treatment. The utility is a soft, edge-fading deep-cerulean radial pool drawn
by `::before` at `z-index:-1` under `isolation:isolate`; it is NOT a hard box,
so the smoke stays visible.

**Why:** owner wants the smoke wallpaper visible but headers legible; a hard
lozenge/box was explicitly rejected. Applying at the shared layer means main
site + EPPP both improve from one change.

**How to apply:** new floating header over `.study-page-bg` / EPPP sections →
add `.text-scrim`. Hue MUST come from `hsl(var(--surf-hue) ...)` (not a literal)
so the surface-hue guardrail stays green.

**Related:** `mistSoft` / palette token `n` (study-theme.ts) is the canonical
muted-text color (chart ticks, captions, Clerk auth secondary text). Lifting it
lifts dim text everywhere at once — that breadth is intended, not a stray edit.
