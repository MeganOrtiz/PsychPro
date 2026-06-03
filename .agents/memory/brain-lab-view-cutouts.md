---
name: Brain Lab view image cutouts
description: Brain Lab anatomical view PNGs must be transparent cutouts, not boxed images.
---

# Brain Lab view images must be transparent cutouts

Every image used as a Brain Lab view (`artifacts/neuronotes/src/assets/brain-views/*.png`,
wired into `BRAIN_VIEWS` in `brain-lab.tsx`) must have a **transparent background** so the
brain floats on the dark teal app background with the cyan glow hugging its silhouette.

**Why:** the view `<img>` applies a fixed CSS filter
(`grayscale(1) contrast(1.05) brightness(1.03)` + teal drop-shadows). That filter recolors
but **cannot remove a baked-in background**. A source image with a solid rectangular
background (e.g. the original coronal.png had a dark-teal box) renders as a hard-edged framed
box that is visibly incongruent with the cutout lateral/midsagittal views.

**How to apply:** before adding/replacing a view image, knock out its background to alpha
(remove-image-background). Keep the canvas dimensions identical to the original — HOTSPOTS are
positioned by percentage over an `object-contain` img, so same canvas size = hotspot coords
stay valid. To eyeball congruence without the auth gate, render the three views side-by-side
in mockup-sandbox with the exact filter on bg `#061F2B` and screenshot.
