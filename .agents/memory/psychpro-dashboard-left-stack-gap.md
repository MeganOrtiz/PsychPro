---
name: PsychPro dashboard left-stack spacing
description: How to make the /dashboard left column vertical tile gap match the EPPP dashboard.
---

Rule: to match the EPPP dashboard's vertical rhythm, the main `/dashboard`
left content column must use a flex column with an inline `gap: clamp(18px, 2.4vw, 28px)`
— the exact same mechanism and value as EPPP's `.epd-shell` (`display:flex; flex-direction:column; gap: clamp(18px,2.4vw,28px)`).

**Why:** A Tailwind v4 arbitrary utility `space-y-[clamp(18px,2.4vw,28px)]` is
unreliable for this (the complex clamp arbitrary value did not produce the
intended gap), so an "I set the spacing" claim looked unchanged/off to the owner.
Inline flex `gap` is guaranteed by CSS and is a direct mechanism match to EPPP.

**How to apply:** When asked to match spacing between two surfaces, match the
*mechanism* (flex gap vs margin) and the literal value, and prefer an inline
`style={{ gap: ... }}` over a Tailwind arbitrary `space-y-[...]` for clamp-based
gaps. Switching a block+space-y container to flex-col here is safe: children are
card sections + a nested grid, no margin-collapse dependence, `min-w-0` retained.
