---
name: GLB/binary asset corruption & three.js extension support
description: Why the neuronotes 3D brain "couldn't load", and how to diagnose corrupted binary assets + unsupported glTF extensions.
---

# 3D brain (brain.glb) load failures

Two independent failure modes broke the rotating 3D brain in brain-lab (error boundary showed "3D view couldn't load"):

## 1. Binary asset mangled through a text encoding
A commit that "restored assets" re-saved `brain.glb` after decoding it as text and re-encoding as UTF-8. Every byte > 0x7F became the 3-byte UTF-8 replacement-char sequence `EF BF BD` (U+FFFD). Symptoms:
- File size balloons (13.1MB → 16.6MB here).
- GLB header is wrong: the `JSON` chunk magic shifts past offset 16 (was at 19), total-length field is garbage, millions of `EF BF BD` sequences.
- Irreparable — geometry floats are destroyed.

**Diagnose:** dump first 40 bytes hex; if you see `efbfbd` repeating, it's this corruption. Count `EF BF BD` occurrences.
**Fix:** recover a clean blob from git history (`git cat-file -p <commit>:<path>`), validate header offsets (`JSON` magic at byte 16, `total == filesize`, BIN chunk byteLength == buffers[0].byteLength, max bufferView end <= buffer length).
**Why:** never round-trip binary assets through anything text-aware. A clean prior commit is the fastest recovery.

## 2. three.js dropped KHR_materials_pbrSpecularGlossiness
Even the clean GLB listed `KHR_materials_pbrSpecularGlossiness` in `extensionsRequired`. three.js r184's GLTFLoader removed this (deprecated spec-gloss) handler, so it throws "Unknown required extension" → error boundary fires.
**Fix:** strip the extension from `extensionsRequired` (and the per-material `extensions` block + `extensionsUsed`) directly in the GLB's JSON chunk, then re-pad JSON to 4 bytes and recompute chunk/total lengths. Safe here because `FittedBrain` re-skins every mesh with its own MeshPhysicalMaterial — original materials are irrelevant.
**How to apply:** any Sketchfab/older GLB on modern three.js — if load fails with an unknown-required-extension error and you override materials anyway, just strip the required extension rather than chasing a polyfill.
