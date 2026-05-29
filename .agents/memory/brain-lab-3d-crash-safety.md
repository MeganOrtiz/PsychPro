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
