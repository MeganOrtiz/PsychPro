---
name: Brain Lab view-switch on select
description: Why selecting a structure must not snap to a different anatomical view tab.
---
In brain-lab.tsx, `handleSelect` syncs the active view via `viewForStructure(id)`.

**Rule:** When a structure appears in the HOTSPOTS of multiple views (common now that
medial/dorsal/ventral reuse cortex + brainstem ids that also exist on lateral/midsagittal/
ventralNerves), selecting it from the active diagram or its chip must STAY on the current
tab. Pass the current view as the `preferred` arg: `viewForStructure(id, currentView)`, and
drive it through the functional `setActiveView(c => viewForStructure(id, c) ?? c)` updater.

**Why:** `viewForStructure` returns the FIRST matching view in fixed VIEW_KEYS order
(lateral → … → ventralNerves). Without a preferred bias, clicking e.g. dorsal `frontal-lobe`
or ventral `optic-chiasm` instantly redirects to lateral/midsagittal — the markers feel broken.

**How to apply:** Only let view-snapping happen for picks NOT visible on the current diagram
(global search, hash deep-link). Marker clicks and active-view chips should preserve the tab.
