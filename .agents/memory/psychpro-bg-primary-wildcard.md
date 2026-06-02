---
name: PsychPro bg-primary button wildcard
description: Why the .study-page-bg button-glass CSS must NOT use a [class*="bg-primary"] wildcard selector.
---

The legacy glass-button rules under `.study-page-bg` / `.study-page-aurora` in
`artifacts/neuronotes/src/index.css` once targeted
`:where(.bg-primary, button.bg-primary, [class*="bg-primary"])`.

**The bug:** `[class*="bg-primary"]` matches ANY element whose class attribute
contains the substring `bg-primary` — including Tailwind opacity variants like
`bg-primary/15`, `bg-primary/10`, `bg-primary/5`. Across the app those are used
for subtle tint chips, badges, avatars, and selection states (NOT buttons). The
wildcard hijacked all of them and forced the full heavy button treatment
(gradient bg + 14px radius + border + cyan glow), overriding the author's
intended subtle tint.

**The fix / rule:** scope these button-glass rules to actual buttons only —
`button.bg-primary`, `button.bg-secondary`. The exact-class selector
`.bg-primary` only matches the literal `bg-primary` class, never `bg-primary/NN`
(Tailwind escapes the slash to `.bg-primary\/15`). So dropping the wildcard
restores correct tint-chip rendering while keeping real buttons styled.

**Why it matters:** the canonical button recipe is `.btn-glass` /
`.btn-glass-strong` (wired through the shared `Button` component, using the
`--btn-glow` HSL var). Keep any legacy button rules tuned to that same restrained
glow language and never reintroduce substring/wildcard class selectors for
styling — they leak onto unrelated elements.
