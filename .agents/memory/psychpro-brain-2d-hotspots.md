---
name: PsychPro Brain Lab 2D hotspots
description: How the 2D hotspot markers work, how to verify/calibrate them, and how they relate to the 3D data.
---

# Brain Lab 2D hotspots

The Brain Lab has TWO independent structure-location datasets:
- **2D**: `HOTSPOTS` in `brain-lab.tsx` — per-view coords keyed by tab group, drawn over the view PNGs. Only `x`,`y` (%) matter: each hotspot is rendered as a NUMBERED marker disc on the brain whose number = its index in the view's HOTSPOTS array + 1. The number is array-position-derived, so reordering a view's hotspots renumbers everything — keep array order intentional. Legacy `lx`/`ly`/`side` fields linger in the data but are unused (the old leader-line label paradigm was removed); harmless to leave, don't rely on them. The quiz also builds its markers from these same HOTSPOTS (x/y only).
- **3D**: `position` data in `brain-structures.ts` — used only by the WebGL view, now filtered to category==="lobe" (4 lobes only).

**They are not linked.** Fixing a marker in one does NOT fix the other. The 3D `position` data is self-consistent and is the 3D source of truth; don't edit it to fix a 2D problem.

**Rendering paradigm (Sections views):** numbered markers on the brain + a side `NumberedKey` (scrollable, color-coded list, one row per hotspot, number matches the disc). Hover/select is synced BOTH ways (`hoveredId` state on the page; key rows and markers each emphasize on hover). Clicking either opens the existing `StructureDetail`. The key replaced the old leader lines AND the old chip strip. The key is gated to `viewMode === "sections"`; 3D/quiz modes fall back to `EmptyDetail` (desktop aside) and show no key on mobile.

**Marker/key color = part TYPE, not per-id.** `CATEGORY_BY_ID` (in brain-structures.ts) maps every id → `PartCategory`; `CATEGORY_META` holds each type's color. `BRAIN_STRUCTURES` is DERIVED from `STRUCTURE_DEFS` and injects category + category color at runtime — never hand-edit per-structure colors. The key header shows an inline legend of the types present in the active view. Locked cerulean #76E4F7 = lobe; mint #5EEAD4 still FORBIDDEN.

**Why this matters:** "the X label sits on the wrong structure" reports are almost always wrong *coordinate values* in HOTSPOTS, not a layout/letterbox bug. Verified directly: a plain block wrapper vs a shrink-to-fit (`w-fit`) wrapper render the percentage markers in identical positions — the object-contain image element keeps its aspect ratio, so % maps straight onto the image either way.

**Anatomical correctness rules (when a labeled reference plate is the authority):** the midsagittal/medial views are true MIDLINE surfaces — show `thalamus` + `hypothalamus` (+ optic-chiasm, mammillary-bodies, pituitary), NOT `amygdala`/`hippocampus` (those are lateral temporal, not on the midline). The 12 cranial nerves DO now exist as real structures (category `nerve`, color #D77BE0 — NOT mint) and the "Cranial Nerves" (ventralNerves) view labels them I–XII. The `coronal` image is a SURFACE 3D render (not a real slice) and most references have no coronal panel — leave it alone.

**Tab display labels were renamed (internal ViewKeys unchanged):** key `medial` (medial-surface render) is shown as **"Midsagittal"**; key `midsagittal` (deep-cut render) is shown as **"Sagittal"**. The keys stay `medial`/`midsagittal` everywhere in code — only `VIEWS[].label` and `BRAIN_VIEWS[].viewName/caption` changed. Don't "fix" the apparent mismatch by renaming keys.

**Hotspot sets follow uploaded atlas plates** (medial 28 / sagittal 21 / dorsal 11 / ventral 13 / cranial-nerves 12); array order = plate numbering, so the numbered markers match the plate. When the source view images are merely RESIZED (not redrawn), transform existing hotspot %coords mathematically: map old-%→old-pixel, normalize against the old alpha bbox, then re-project into the new centered brain box — far faster and more accurate than re-eyeballing. New descriptor text is placeholder; the OWNER authors it.

**How to verify/calibrate 2D markers:** the live Brain Lab page is auth-gated (external Clerk blocks the screenshot tool) and the 3D view needs WebGL (also not screenshottable). The 2D views need neither. Add a throwaway DEV-only route that renders the view PNG + markers (current vs proposed coords side by side), screenshot it, then delete the route/page. Brains in all view images face LEFT (frontal = left). Clean up any temporary calibration mockups (mockup-sandbox) and dev routes when done — they otherwise drift from the real coords and mislead later audits.
