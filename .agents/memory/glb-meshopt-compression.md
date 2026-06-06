---
name: GLB meshopt compression + drei decoder choice
description: How to losslessly shrink a geometry-only GLB and load it in drei without a CDN
---

# GLB meshopt compression (geometry-only models)

For a large geometry-only GLB (no textures), the win is mesh compression, not
texture work. Pipeline that is geometry-lossless and drops size ~85%:

`gltf-transform`: dedup → prune → weld → meshopt (level "high"). Result carries
`EXT_meshopt_compression` + `KHR_mesh_quantization`. Validate afterwards that the
vertex count is unchanged (e.g. brain.glb: 215,601 verts, 13.16MB → 1.83MB).

**Why meshopt over Draco here:** drei decodes meshopt with a **bundled, local**
decoder (three-stdlib) — no network. drei's Draco path defaults to the **gstatic
CDN**, a remote runtime fetch we explicitly avoid (see brain-lab-3d-crash-safety).

**How to apply (drei loader flags):** `useGLTF` / `useGLTF.preload` take
`(path, useDraco, useMeshopt)`. For a meshopt GLB call them as
`useGLTF(URL, false, true)` and `useGLTF.preload(URL, false, true)` so Draco is
off and the local meshopt decoder is used.

Dev tooling (`@gltf-transform/*`, `meshoptimizer`, `sharp`) is one-off — install
to run the transform, then remove from devDeps so it doesn't linger.

Images: brain-view cutout PNGs (with alpha) → WebP q82 alphaQuality 100 keeps the
transparent cutout and drops ~95%. `.png` → `.webp` import swap is all the app needs.
