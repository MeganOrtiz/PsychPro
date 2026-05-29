---
name: Image hotspot overlays
description: Aligning clickable markers on top of an object-contain image that scales with its container
---

Rule: To overlay clickable markers (or labels) that stay pinned to an image rendered with `object-contain` inside a flexible container, wrap the `<img>` in a `position: relative` div that shrink-wraps the image (`max-h-full max-w-full` on both wrapper and img, img `display:block`), then absolutely position markers by percentage `left`/`top` of that wrapper. The wrapper sizes to the rendered image box, so percentages track the image — not the larger letterboxed container.

**Why:** Positioning markers as a % of the container fails because `object-contain` letterboxes the image, so the image box ≠ container box and markers drift off anatomy.

**How to apply:** Used in PsychPro Brain Lab (`artifacts/neuronotes/src/pages/brain-lab.tsx`) for clickable brain-region hotspots. Keep CSS filters/drop-shadows on the img only; markers are siblings so they aren't filtered. Give markers a ~36px hit target with a smaller visual dot, plus `focus-visible` affordance for keyboard users.
