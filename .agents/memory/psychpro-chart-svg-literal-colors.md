---
name: PsychPro chart/SVG colors must be literal hue-192
description: Why Recharts/SVG inline colors on the landing page can't use the hsl(var(--surf-hue)) guardrail escape hatch
---

# Recharts / SVG inline colors vs the surface-hue guardrail

**Rule:** colors fed to Recharts/SVG props (`stroke`, `fill`, axis `tick.fill`)
must be **literal** colors, never `hsl(var(--surf-hue) …)`.

**Why:** Recharts emits `stroke`/`fill` as SVG **presentation attributes**, and
`var()` only resolves in CSS *properties*, not attributes — so the guardrail's
preferred `hsl(var(--surf-hue) …)` escape hatch renders as black there.

**How to apply:** the surface-hue guardrail still flags dark saturated cerulean
literals outside hue [188,193], so pick hue **exactly 192** for chart literals
(deep ink ≈ `rgb(11,59,71)`; line/dots = `cyanDeep #3196AF`). Near-white card
backgrounds are auto-exempt (the guardrail ignores L≥0.5). This came up making the
landing DASHBOARD "Study Analytics" card white to match the white brain in the
adjacent Brain Lab section.
