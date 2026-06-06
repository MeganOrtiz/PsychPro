---
name: Brain Lab 3D facing-cache invalidation
description: Why per-marker camera-facing caching must invalidate on parent transform, not just camera
---

# Caching per-marker facing math must account for the auto-spin

Each 3D Brain Lab Marker recomputes a camera-facing test every frame
(`parent.worldToLocal(cam)` + 2 normalize + dot) to gate hover/click and glow on
front- vs far-side regions. It's tempting to cache the result and only recompute
when the **camera** moves.

**Why that's wrong:** the brain group auto-spins (a `Spin` component increments
`rotation.y` while `autoSpin && selectedId === null`). During spin the camera is
static but the marker's **parent world transform** changes every frame, so a
camera-only cache freezes facing/visibility until the user first interacts.

**How to apply:** invalidate the cache when EITHER the camera world position
changes OR the parent world transform changes. Detect the latter cheaply with a
weighted scalar fingerprint of `parent.matrixWorld.elements` (reading matrixWorld
is free — `worldToLocal` already depends on it). For a single-axis spin the
fingerprint is sinusoidal in the spin angle, so it always differs frame-to-frame
during spin (recompute) and is stable when fully idle (skip). Seed the refs with
`Infinity` sentinels so the first frame always computes.
