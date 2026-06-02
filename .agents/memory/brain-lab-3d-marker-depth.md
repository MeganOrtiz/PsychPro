---
name: Brain Lab 3D marker depth
description: Why Brain Lab 3D dots use per-frame facing-fade instead of true depth occlusion.
---

The Brain Lab 3D view (brain-3d-view.tsx) labels brain regions with drei `<Html>`
dot markers parented to the same rotating group as the GLB. They DO track the
brain, but with no depth handling every dot drew on top — back-of-head markers
bled through the front face, so users perceived them as "floating / not attached."

**Rule:** Make the dots recede when they rotate to the far side by fading each
marker per-frame on its camera-facing dot product (outward normal vs. direction
to camera, computed in the brain group's local space via `parent.worldToLocal`).
Front-facing = full opacity + clickable; far side = faint + `pointerEvents:none`.
Mutate DOM styles directly (refs), never React state, or you get a 60fps
re-render storm.

**Why not true occlusion** (depth-tested 3D dots or `<Html occlude>`): many
structures are INTERIOR (hippocampus, thalamus, brainstem). Hard occlusion would
hide their dots entirely behind the cortex. Facing-fade keeps interior dots
visible — markers with small |position| (< ~0.4 of the ~3.4-unit fit) are treated
as central and kept readable rather than faded.

**How to apply:** Any change to marker visibility/interaction must preserve (a)
interior structures staying selectable and (b) direct-style mutation in useFrame.
