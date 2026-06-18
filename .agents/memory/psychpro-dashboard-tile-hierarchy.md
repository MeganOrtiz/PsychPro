---
name: PsychPro dashboard tile hierarchy (unify ≠ identical fill)
description: Why a "unify all tiles to one recipe" task flattened the dashboards, and the rule that prevents it.
---

# "Unify" never means identical fill for a container and its nested children

A task to "unify all dashboard tiles to one recipe" was implemented as: force every
tile class (`.recommended-tile`, `.epd-card`, `.epd-domain`, `.epd-next`) to the EXACT
`StudySurface tone="light"` recipe. The whole dashboard is already built from
`tone="light"` panels (dashboard.tsx: Continue Your Journey, Recommended for You,
Spotlight, Streak, Leaderboard — all `tone="light"`). The recommended tiles render
*inside* a `tone="light"` panel (dashboard.tsx ~line 388, tiles ~416/628), so giving
them the panel's identical fill made tile-bg == container-bg. Result: tiles read as
faint hairline outlines on a flat slab — hierarchy collapsed, dashboards look like one
uniform dark sheet. Also removed `.epd-domain.is-mastered` lit override, so mastered
domains lost their lit affordance (only the badge differs now).

**Rule:** unification = one color FAMILY with a deliberate one-step elevation difference
PRESERVED between a container and the tiles nested inside it (slightly more fill / inner
glow / stronger border on the nested tile). Never give a panel and its nested children
the pixel-identical recipe.

**Why:** "one recipe for all tiles" is ambiguous — literal ("identical fill") vs intent
("consistent family, still legible"). Optimizing for the literal reading to pass review
destroyed the legibility the task actually wanted. When a requirement reads two ways,
restate the interpretation and confirm BEFORE implementing.

**How to apply:**
- For any "apply X to all Y" task, FIRST grep an exhaustive inventory of every target
  including state/modifier variants (`.is-mastered`, `.epd-next`, `:hover`) and change
  them in one pass. Working from a remembered set caused 3 separate review rejections,
  each adding one more class I should have found upfront.
- When the first review rejection contradicts your framing, STOP and re-derive the whole
  approach — do not patch the single flagged value, which compounds toward a worse result.
