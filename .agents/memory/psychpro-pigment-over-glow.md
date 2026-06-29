---
name: PsychPro pigment-over-glow correction
description: The "flat/bland/foggy" complaint is a glow+blur desaturation problem, not a hue/darkness problem; the owner's final direction is pigment-only (saturated deep cerulean fill, NO cyan glow at all) on content cards/panels.
---

# Pigment over glow

When the owner says content cards/panels look "flat", "bland", "foggy", or "washed
out", the root cause is **stacked cyan glow + layered backdrop-blur desaturating and
flattening contrast**, NOT the wrong hue and NOT that surfaces are too dark.

**Why:** Owner edited the reference in their own photo editor (saturation+contrast up,
brightness down) and showed a side-by-side; the more-pigmented version killed the fog.
They explicitly rejected an "add cyan glow/bloom" attempt: *"no i dont want to add glow
like that. this is an image that i adjusted on my computer and i like it better."*

## Final decision: pigment-only, NO cyan glow on content cards
Owner's settled direction (supersedes every earlier "reduce the glow a bit" pass): a
content card/panel = **saturated deep cerulean linear-gradient fill (push HSL saturation
to 100%, widen top→bottom lightness contrast, deepen) + a white top hairline + a deep
drop shadow for separation. NO cyan radial top-bloom. NO cyan inner/outer corona.**
Do NOT "add light/glow" to fix flatness — that is the cause, not the cure; fix with
saturate + contrast up, brightness down, and LESS glow.

**Scope this applies to (all done):**
- Shared recipes: index.css `.bg-card`, `.lesson-header-box`, `.recommended-tile`
  (base/hover/active), and StudySurface `tone="light"`.
- Inline page panels on the main-site sidebar pages: dashboard, progress, reflections,
  topics, brain-lab.

**Left as the template:** EPPP `.epd-card` (eppp-dashboard.tsx) is intentionally NOT
changed. Any pasted session plan that says to align inline surfaces *to* the `.epd-card`
glow recipe (blur20, fill 0.74/0.85, coronas 0.42/0.30) is STALE — those are the old
foggy numbers; do NOT re-add glow.

## How to sweep inline panels safely (critical)
Most `rgba(118,228,247…)` inline uses are **legitimate accents — keep them**:
`borderColor`, icon-chip backgrounds, chart strokes / tooltip borders, heading
`textShadow` (form `0 0 16px rgba(...)`, no spread), and brain-viz radials (which use
`PALETTE.surf`, not a literal cyan). A blind find/replace on the cyan literal will strip
these and break the design (this is the same mistake behind the reverted glass sweep).

Strip ONLY the two card/panel glow signatures:
1. Background top-bloom: `radial-gradient(125% 80% at 50% 0%, rgba(118,228,247,X) 0%,
   rgba(118,228,247,0.00) 58%|60%), ` → remove the prefix, leave the `linear-gradient(...)`.
2. Box-shadow coronas: `inset 0 0 Npx -Mpx rgba(118,228,247,X)` and
   `0 0 Npx -Mpx rgba(118,228,247,X)`. The `-Mpx` **spread** is what distinguishes a
   corona from a heading text-shadow — match on it so you don't touch headings.

Use targeted `perl -0pi` substitutions (self-contained, balanced substrings), then grep
to confirm zero blooms/coronas remain AND that the accent/textShadow counts are unchanged.
`edit` `replace_all` misses indentation variants — see psychpro-design-lock for the value
guardrail. After the sweep, verify no dangling commas / empty `boxShadow` strings via tsc.

## Guardrail
`scripts/check-design-drift.mjs` now (a) REQUIRES the max-saturation pigment fill on
`.bg-card` and (b) FORBIDS any `rgba(118,228,247…)` cyan glow returning to `.bg-card`.
Hue stays locked (`--surf-hue` 192) so check-surface-hue is unaffected. Any intentional
card-recipe change must update this guardrail in the same commit.

**Verification constraint:** Clerk blocks the test browser on auth-gated pages, so verify
the look via an isolated mockup-sandbox copy of the real composition (see
psychpro-signed-in-verification), never a proxy.
