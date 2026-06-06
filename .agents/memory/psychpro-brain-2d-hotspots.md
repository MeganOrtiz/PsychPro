---
name: PsychPro Brain Lab 2D hotspots
description: How the 2D hotspot markers work, how to verify/calibrate them, and how they relate to the 3D data.
---

# Brain Lab 2D hotspots

The Brain Lab has TWO independent structure-location datasets:
- **2D**: `HOTSPOTS` in `brain-lab.tsx` — per-view coords keyed by tab group, drawn over the view PNGs. Each hotspot now carries BOTH an anchor (`x`,`y` %, the precise spot on the brain) AND a label position (`lx`,`ly` % in the margin) + `side` ("left"=label box right-aligned/grows left, "right"=grows right). Rendered as thin SVG leader lines (`LeaderLines`, 0–100 viewBox, `vectorEffect="non-scaling-stroke"`) from anchor→label, plus a clickable anchor dot + colored label box (`LeaderLabel`). NOT dots anymore. The quiz still builds its markers from these same HOTSPOTS (uses only x/y; ignores lx/ly/side).
- **3D**: `position` data in `brain-structures.ts` — used only by the WebGL view, now filtered to category==="lobe" (4 lobes only).

**They are not linked.** Fixing a marker in one does NOT fix the other. The 3D `position` data is self-consistent and is the 3D source of truth; don't edit it to fix a 2D problem.

**Label color = part TYPE, not per-id.** `CATEGORY_BY_ID` (in brain-structures.ts) maps every id → `PartCategory`; `CATEGORY_META` holds each type's color. `BRAIN_STRUCTURES` is DERIVED from `STRUCTURE_DEFS` and injects category + category color at runtime — never hand-edit per-structure colors. `CategoryLegend` shows the types present in the active view. Locked cerulean #76E4F7 = lobe; mint #5EEAD4 still FORBIDDEN.

**Legend placement:** `CategoryLegend` is a child of the OUTER BrainDiagram pane (absolute top-left), NOT the inner shrink-to-fit image box — otherwise it overlaps the frontal labels.

**Why this matters:** "the X label sits on the wrong structure" reports are almost always wrong *coordinate values* in HOTSPOTS, not a layout/letterbox bug. Verified directly: a plain block wrapper vs a shrink-to-fit (`w-fit`) wrapper render the percentage markers in identical positions — the object-contain image element keeps its aspect ratio, so % maps straight onto the image either way.

**How to verify/calibrate 2D markers:** the live Brain Lab page is auth-gated (external Clerk blocks the screenshot tool) and the 3D view needs WebGL (also not screenshottable). The 2D views need neither. Add a throwaway DEV-only route that renders the view PNG + markers (current vs proposed coords side by side), screenshot it, then delete the route/page. Brains in all view images face LEFT (frontal = left). Clean up any temporary calibration mockups (mockup-sandbox) and dev routes when done — they otherwise drift from the real coords and mislead later audits.
