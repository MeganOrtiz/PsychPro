---
name: Brain Lab label-gutter layout
description: How the desktop Brain Lab leader-line text labels are laid out and why the gap must be adaptive
---

The desktop Brain Lab "Sections" view renders anatomy labels as text in left/right
gutters connected to anchor dots by SVG leader lines (`LabeledBrainDiagram` in
`brain-lab.tsx`), instead of numbered circle markers. Mobile keeps the old marker
`BrainDiagram` + numbered key.

Layout: measure the rendered <img> rect via refs + ResizeObserver + img onLoad,
convert HOTSPOTS (% coords) to px, split labels left/right by anchor x vs image
midline, sort each side by anchor y, then collision-resolve label Y.

**Rule:** the vertical gap between stacked labels MUST be adaptive, not a fixed
constant. Compute `minGap = min(idealGap, availableHeight/(count-1))` per side.

**Why:** the diagram wrapper is `overflow-hidden`. Dense views (midsagittal ~28
hotspots, heavily left-weighted) at a fixed gap need more vertical room than the
pane has, so the clamp pushes top/bottom labels off-canvas where they're invisible
and unclickable. Shrinking the gap when `count*idealGap > availableHeight` keeps
every label on-canvas.

**Verify (auth-gated):** external Clerk blocks the test browser. Add a DEV-only
`<Route path="/__brain-lab">{() => <div className="h-screen"><BrainLabPage/></div>}</Route>`
in App.tsx BEFORE the auth catch-all (h-screen wrapper is needed — without it the
page collapses to content height and misleads you). Screenshot via app_preview at
both tall and short viewports (e.g. 1280x640) and with `#focus=<id>` to test the
selected/detail state, then REMOVE the route.
