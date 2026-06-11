---
name: PsychPro cerulean surface stack
description: The brightened deep-cerulean surface palette and the rule for lifting dark-teal fills without touching shadows.
---

# PsychPro cerulean surface stack

Owner repeatedly says the study/EPPP UI reads "too dark teal / dull" and wants it
brighter and more turquoise / deep cerulean / cyan. The fix is to lift the
**surface** stack, NOT the locked accent.

**Rule:**
- Accent stays locked at cerulean `#76E4F7` (and `mint` stays fully removed — see
  psychpro-sidebar-nav-mint-cyan.md).
- The surface/background stack lives in TWO mirrored places that MUST move together,
  plus inline rgba fills:
  1. `STUDY_PALETTE` hex (src/lib/study-theme.ts)
  2. the HSL token mirror in `.study-page-bg` (src/index.css) — keep hex↔HSL coherent,
     including `--border` which must equal `steel` (#3196AF ≈ 192 56% 44%).
  3. hardcoded inline `rgba()` surface gradients scattered across pages/components.
- Keep these DARK on purpose (never flatten into bright cyan): `ink` (deepest anchor,
  sidebar/page floor), the page vignette `rgba(8,37,48,...)`, `text-shadow`
  `rgba(2,13,18,...)`, and drop-shadows `rgba(0,0,0,...)`. Only lift background/gradient
  FILL stops.

**Why:** the perceived darkness comes MOSTLY from hardcoded inline rgba surface
gradients (especially the EPPP cards the owner screenshots), not just the tokens — so a
token-only change looks unchanged on those surfaces. Lifting shadows/vignette instead
kills text legibility.

**How to apply:** retone in lockstep — tokens + index.css HSL mirror together, then
sweep inline rgba surface fills. When scripting the inline sweep, scope the regex to
numbers immediately after `rgb(`/`rgba(` ONLY; a bare `\d+,\d+,\d+` match will also
mangle whitespace in numeric arrays, fn args, and copy strings (silent but real). Keep
a fixed old→new triplet map so the same dark fill always lifts to the same bright value.
