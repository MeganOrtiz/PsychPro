---
name: Brain Lab 3D region markers
description: How Brain Lab 3D regions are shown (cerulean glow patches, not dots) and the facing/depth rules that keep interior structures visible.
---

The Brain Lab 3D view (brain-3d-view.tsx) marks brain regions that are parented
to the SAME rotating group as the GLB so they track the brain when rotated/zoomed.
The visual was changed from drei `<Html>` dots to **soft cerulean glow patches**
(owner disliked "dot soup"; wanted regions to "light up" in the site's cerulean).

**Current model (glow patches):** each region = an invisible raycastable
hit-sphere (opacity-0 mesh) for click/hover + an additive `Sprite` glow that eases
toward full on hover/select and rests at a faint ambient level when live. Glow uses
a shared module-singleton `CanvasTexture` (radial white→transparent) tinted with
`PALETTE.surf`. Deep glows use `depthTest:false` so interior structures light up
through the cortex.

**Facing/visibility rule (unchanged intent):** per-frame, compute the region's
camera-facing dot product (outward normal vs. direction to camera) in the brain
group's local space via `parent.worldToLocal`. Front/deep = live (hoverable +
clickable + glowing); far side = faded out and hit-sphere `visible=false` (which
also turns OFF its raycast, preventing click-through). Toggle interaction via the
hit-sphere's `visible`, and drive glow via material/ref mutation in useFrame —
never React state (60fps re-render storm).

**Why not hard occlusion:** many structures are INTERIOR (hippocampus, thalamus,
brainstem). Treat regions with small |position| (< ~0.4 of the ~3.4-unit fit) as
central: always live, never faded, glow through the surface.

**Accessibility:** the 3D markers are WebGL (not DOM), but brain-lab.tsx already
offers DOM-accessible selection for every structure (group chips `chip-${id}`,
search overlay, and 2D Sections `hotspot-${id}` — all real <button>s with aria),
so the canvas is a visual enhancement, not the only selection path. Do NOT re-add
DOM buttons over the canvas — that reintroduces the dot-soup the owner rejected.

**How to apply:** any change to region visibility/interaction must preserve (a)
interior structures staying selectable + visible, (b) far-side regions disabling
their raycast, and (c) ref/material mutation (not state) in useFrame.
