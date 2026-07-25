---
name: Mask flips with transform
description: CSS mask-image applied to a transformed (mirrored) element is transformed too — edge fades land on the wrong edge.
---
A `mask-image` fade meant for an element's bottom edge ends up at the TOP when the element also carries `transform: scaleY(-1)` — the mask is part of the element's paint, and the transform flips the painted result (hard visible edge where the fade was expected; showed up on the PsychPro landing artwork band's mirrored splash image in the owner's real browser).

**Why:** Per spec, masking happens before the transform; dev screenshots can look right by coincidence when image content and the misplaced fade overlap.

**How to apply:** For dissolves/blends on mirrored or rotated images, don't mask the image — paint overlay gradients (::before/::after with white→transparent linear-gradients) positioned in the parent's coordinate space. Also robust across browsers with partial mask support.
