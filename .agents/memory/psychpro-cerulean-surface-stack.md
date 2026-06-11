---
name: PsychPro cerulean surface stack
description: The deep-cerulean surface palette, where it lives (two mirrored places + inline rgba), and the radiance/depth treatment.
---

# PsychPro cerulean surface stack

DIRECTION REVERSED 2026-06-11. The owner previously asked for "brighter / less dark
teal" (surfaces were lifted). The owner then RETRACTED that: they disliked the
lighter look and want the WHOLE site **deeper/darker cerulean-turquoise** with
"incandescence and radiance throughout," "depth perception," and an "ethereal vibe."
Current state = DEEPENED. Do NOT re-lift surfaces to the old brighter values.

**Rule:**
- Accent stays locked at cerulean `#76E4F7` (and `mint` stays fully removed — see
  psychpro-sidebar-nav-mint-cyan.md). Radiance comes from the locked cyan accents +
  glows against a DEEP floor, not from lifting the base.
- The surface/background stack lives in TWO mirrored places that MUST move together,
  plus inline rgba fills:
  1. `STUDY_PALETTE` hex (src/lib/study-theme.ts)
  2. the HSL token mirror in `.study-page-bg` (src/index.css) — keep hex↔HSL coherent,
     including `--border` which must equal `steel` (#3196AF ≈ 192 56% 44%).
  3. hardcoded inline `rgba()` surface gradients in index.css recipes
     (`.bg-card`, `.recommended-tile`, `.lesson-header-box`) and across pages.
- Keep DARK on purpose: `ink` (deepest anchor), the page vignette, `text-shadow`
  near-black, drop-shadows `rgba(0,0,0,...)`.

**Radiance/depth recipe (current):** `.study-page-bg::before` layers a central cyan
bloom (`rgba(118,228,247,~0.16)` upper-center) + a deep cerulean vignette (edges to
`rgba(2,13,19,0.82)`) over brain-clouds.png on a `#04161d` base. Glass cards add an
inner cyan top-bloom + outer cyan corona + deep drop shadow for incandescence + depth.

**Why:** perceived tone comes MOSTLY from the inline rgba surface gradients in the
index.css recipes, not just the tokens — a token-only change looks unchanged on cards.
Retone in lockstep: tokens + HSL mirror + the recipe rgba together.

**How to apply (inline rgba sweep):** scope any regex to numbers immediately after
`rgb(`/`rgba(` ONLY; a bare `\d+,\d+,\d+` match also mangles numeric arrays/args/copy.
Keep a fixed old→new triplet map so the same fill always maps consistently.
