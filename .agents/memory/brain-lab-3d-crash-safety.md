---
name: Brain Lab 3D crash safety
description: Why the WebGL/3D Brain Lab view must be isolated behind an error boundary and avoid remote runtime asset fetches.
---

The Brain Lab page defaults to a 3D view that lazy-loads a heavy three.js /
react-three-fiber scene. Any failure in that subtree white-screens the whole
page if it is not contained.

**Rule:** Keep the 3D/WebGL subtree wrapped in an error boundary that degrades
to the 2D "Sections" view, and avoid runtime fetches of remote 3D assets
(e.g. drei `<Environment preset=... />` pulls an HDR from a CDN) inside it.

**Why:** Two real, hard-to-reproduce production failure modes:
1. After a republish, a client holding the old cached `index` tries to lazy-load
   a 3D chunk whose hashed filename no longer exists → the dynamic import
   rejects → unhandled error → blank page. (Same browser-cache class of issue
   that makes "my published changes didn't show up" reports common here.)
2. `drei <Environment preset>` fetches an HDR from a remote CDN at runtime; a
   blocked/failed fetch throws through Suspense and crashes the canvas.
Neither reproduces in the auth-gated local preview, so they only surface in
production reports.

**How to apply:** When touching brain-lab / brain-3d-view, do not reintroduce a
remote-HDR `Environment`; rely on in-scene lights (MeshPhysicalMaterial renders
fine without an envMap, just less reflective). Keep the lazy 3D view inside its
error boundary so chunk-load and three.js runtime errors fall back instead of
blanking the page.

**Mesh orientation vs marker coords:** Structure marker positions in
`data/brain-structures.ts` use **+Z = anterior (front)**, +Y = up (e.g.
frontal/prefrontal/orbitofrontal have z>0; occipital z=-1.45). The shipped
brain.glb is exported with its anterior facing **-Z**, so `FittedBrain` applies
`wrapper.rotation.y = Math.PI` to align the mesh to that coord space. Symptom if
this is missing/wrong: labels read front/back-swapped (occipital marker sits on
the frontal lobe). Markers are SIBLINGS of the mesh inside the shared spin group,
so any orientation fix must rotate the mesh wrapper, never the shared group (that
would move markers too). If the GLB is ever re-exported/replaced, re-check this
rotation rather than editing the data.

**Empty-brain ≠ corruption:** A report of "3D panel shows only faint marker
glows, no white brain mesh" with NO error fallback shown is almost always the
~13MB brain.glb caught mid-download, NOT a corrupt asset. Markers render
instantly (they live outside Suspense); the brain is under an inner
`<Suspense fallback={null}>` so it shows nothing until the GLB streams in. Before
chasing corruption, validate the GLB header (magic/total==filesize/BIN chunk) —
if valid, the fix is a visible loading state, not a re-export. We added a
`LoadingOverlay` (drei `useProgress`, rendered OUTSIDE `<Canvas>` in the DOM —
the hook is a global loading-manager store, works without Canvas context) showing
"Loading 3D brain… N%". Safe because the GLB is the only three.js-loader asset on
the page (the section PNGs are plain `<img>`), so `useProgress.active` won't fire
spuriously.
