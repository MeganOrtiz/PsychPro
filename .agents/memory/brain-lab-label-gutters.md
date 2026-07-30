---
name: Brain Lab four-edge label layout
description: How the desktop Brain Lab leader-line text labels are laid out around all four edges and why overflow must spill between edges
---

The desktop Brain Lab "Sections" view renders anatomy labels as text CHIPS placed
around all four edges of the brain image (left/right columns + top/bottom rows),
connected to anchor dots by straight SVG leader lines (`LabeledBrainDiagram` in
`brain-lab.tsx`). Mobile keeps the marker `BrainDiagram` + numbered key.

Layout: measure the rendered <img> rect (refs + ResizeObserver + img onLoad),
convert HOTSPOTS (% coords) to px, then assign each label to an edge by the angle
from image centre → anchor (`atan2`). Wedges are intentionally asymmetric: top/bottom
get a narrow 60° each, left/right a roomy 120° each, because the slim rows hold far
fewer labels than the tall columns.

**Rule:** the slim top/bottom rows have limited horizontal width. Before laying out
columns, compute the row's needed width (`sum(w)+gap*(n-1)`); while it exceeds the
available width, spill the most off-centre label (max `|ax - cx0|`) into its adjacent
side column. Only then lay out columns (vertical de-overlap + clamp) and rows
(horizontal de-overlap + clamp).

**Corner rule (2026-07-18):** rows and columns must not share the corners. Clamp
row bounds to the IMAGE span (`box.l+8 .. box.l+box.w-8`), and when a top/bottom
row has chips, offset the column bounds past that row's tallest chip
(`colTop = 16 + topRowH + 10`, `colBottom = wrapH - (40 + bottomRowH + 10)`).
Without this, the leftmost row chip and the topmost column chip both clamp into
the same corner and stack on each other.

A DEV-only `?view=<key>` query param on the page deep-links any Sections view
for screenshot verification (gated on `import.meta.env.DEV`).

**Column over-full de-overlap (2026-07-30, supersedes the old row-only advice below):**
the tall side columns need the SAME anti-collapse logic the rows have. The old
backward pull-back pass clamped each chip individually to `Math.max(maxY, colTop + h/2)`,
which collapsed several chips onto the SAME top y when a column was over-full →
stacked unreadable labels (this was the "labels stacking at the top edges" bug).
Fix: drop the per-chip colTop clamp in the pull-back pass; if the pull-back pushes
the first chip above `colTop`, RE-LAY the whole sorted column top→bottom from
`colTop` with a shared reduced gap `g = min(gap, (avail - sumH)/(n-1))` (mildly
negative when truly over-full, so the squeeze is shared evenly instead of stacking).
This keeps every chip mapped to its own anchor and terminates exactly at colBottom.

**Why:** dense views (e.g. lateral ~30 hotspots) put 5+ near-vertical anchors into
the top wedge, but the row only fits ~3 wide chips. Without spilling, the pull-back
compresses them to the left bound and they overlap or clip off the `overflow-hidden`
canvas. Spilling to the tall side columns (which have ample vertical room) keeps every
label on-canvas and non-overlapping. Always clamp the collision pull-back to the
left/top bound (`Math.max(maxX, rowLeft + w/2)`) so a too-full row overlaps mildly
rather than escaping off-screen.

**Verify (auth-gated):** external Clerk blocks the test browser. Add a DEV-only
`<Route path="/__brainlab">{() => <div className="h-screen overflow-hidden"><BrainLabPage/></div>}</Route>`
in App.tsx (gate on `import.meta.env.DEV`, place before the auth catch-all; the
h-screen+overflow-hidden wrapper is needed or the page collapses to content height).
Screenshot via app_preview on the DENSEST view (lateral) to catch row overflow, then
REMOVE the route.
