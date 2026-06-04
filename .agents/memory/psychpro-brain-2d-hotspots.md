---
name: PsychPro Brain Lab 2D hotspots
description: How the 2D hotspot markers work, how to verify/calibrate them, and how they relate to the 3D data.
---

# Brain Lab 2D hotspots

The Brain Lab has TWO independent structure-location datasets:
- **2D**: `HOTSPOTS` in `brain-lab.tsx` — per-view percentage coords (x/y %) keyed by tab group, drawn over the view PNGs (lateral/midsagittal/coronal). The quiz builds its markers from these same HOTSPOTS.
- **3D**: `position` data in `brain-structures.ts` — used only by the WebGL view.

**They are not linked.** Fixing a marker in one does NOT fix the other. The 3D `position` data is self-consistent and is the 3D source of truth; don't edit it to fix a 2D problem.

**Why this matters:** "the X label sits on the wrong structure" reports are almost always wrong *coordinate values* in HOTSPOTS, not a layout/letterbox bug. Verified directly: a plain block wrapper vs a shrink-to-fit (`w-fit`) wrapper render the percentage markers in identical positions — the object-contain image element keeps its aspect ratio, so % maps straight onto the image either way.

**How to verify/calibrate 2D markers:** the live Brain Lab page is auth-gated (external Clerk blocks the screenshot tool) and the 3D view needs WebGL (also not screenshottable). The 2D views need neither. Add a throwaway DEV-only route that renders the view PNG + markers (current vs proposed coords side by side), screenshot it, then delete the route/page. Brains in all view images face LEFT (frontal = left). Clean up any temporary calibration mockups (mockup-sandbox) and dev routes when done — they otherwise drift from the real coords and mislead later audits.
