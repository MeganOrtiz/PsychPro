---
name: study-page-bg horizontal seam
description: Diagnosing a faint dead-straight full-width horizontal line across the PsychPro app background.
---

# Faint horizontal line across the app background

**Symptom:** a faint, **dead-straight, full-width** horizontal line over the deep-cerulean
nebula background, at a fixed viewport position, on any authenticated page (reported as
"on the main dashboard" but it's the shared surface). Only visible on **HiDPI / Retina /
fractional-zoom** displays — a DPR-1 screenshot will NOT reproduce it.

**Cause:** `.study-page-bg::before` is already `position: fixed; inset: 0` (pinned to the
viewport). It *also* had `background-attachment: fixed` on its layers. That is redundant,
and it makes the browser composite the background against the viewport at fractional
device-pixel boundaries, painting a 1px seam.

**Fix:** set `background-attachment: scroll` (the default) on the `::before` layers. Since
the pseudo-element box already equals the viewport, the image still covers identically —
visually identical, seam gone. (in `artifacts/neuronotes/src/index.css`.)

**Why this over the obvious suspects:**
- It is NOT a header border — the desktop top bar has no border (only the `md:hidden`
  mobile header has `border-b`, which won't show at desktop width).
- It is NOT a baked-in image seam — `brain-clouds.png` is a clean organic nebula; a
  dead-straight line cannot come from clouds.
- It is NOT a doubled background layer — stacked `study-page-bg` boxes are all
  viewport-fixed and overlap perfectly, so they never seam.

**How to apply:** if a straight full-width faint line ever reappears over the app
background, check `background-attachment` on any `position: fixed` full-viewport
background element first — don't hunt for borders or regenerate the image.
