---
name: PsychPro main site adopts EPPP card system
description: The main site's tiles/cards now use the EPPP .epd-card recipe verbatim; EPPP is the template. How this differs from the reverted glass sweep.
---

# Main site unified onto the EPPP card recipe

The owner confirmed (via an EPPP-dashboard screenshot) that the MAIN site —
dashboard plus every page reachable from the main sidebar tabs — should adopt the
EXACT EPPP visual system. EPPP is the TEMPLATE and stays untouched. The canonical
tile is EPPP's `.epd-card`: a radial cyan top-bloom over a 145° diagonal cerulean
glass, border `rgba(196,232,242,0.22)`, `blur(20px) saturate(135%)`, with an inset
top highlight + inset cyan inner glow + outer cyan corona + deep drop shadow.
A brighter SELECTED variant (radial 0.16 + `145deg hsl(192 85% 26%/0.84) →
hsl(192 89% 19%/0.90)`) is used for active/selected/unlocked states.

Where it was applied: the shared layer (`.study-page-bg .bg-card` in index.css and
StudySurface `tone="light"`) carries most pages; per-page inline surfaces were
aligned in topics.tsx (course rail, topic/lesson cards, mastery button) and
brain-lab.tsx (search modal, detail panel, empty state, numbered key). Dashboard
banners, progress highlight cards, and reflections cards already used the 145°
radial-bloom family from a prior pass. EXCLUDED: left sidebar/nav rails
(`.nav-glass*`, `.eps-kb-rail*`) on both sides.

**Why this is NOT the reverted sweep:** the reverted attempt (see
`psychpro-glass-sweep-reverted.md`) forced the LANDING recipe onto EVERY tile AND
button at high opacity, flattening hierarchy. This work instead matches the
already-approved EPPP dashboard, keeps the standard-vs-brighter-selected tonal
split, and leaves nav rails alone — so hierarchy survives.

**Supersedes "never re-lift":** `psychpro-cerulean-surface-stack.md` says don't
re-lift surfaces toward bright. The EPPP `.epd-card` fill (19% L / 0.74 alpha) is
LIGHTER than the deepened stack (7–14% L / 0.82–0.96 alpha) — that is intentional
and owner-approved for CARDS. Do not "re-deepen" the EPPP card tiles back to the
old stack; the deepen rule still governs page backgrounds and non-card surfaces.

**How to apply:** to change the card look, edit EPPP's `.epd-card` (the source of
truth) and mirror into the shared `.bg-card` / StudySurface light recipe; verify on
the logged-in screens (Clerk blocks the test browser — owner screenshot or
mockup-extract of the real composition), never on a synthetic route.
