---
name: PsychPro cerulean surface stack
description: The brightened deep-cerulean surface palette and the rule for lifting dark-teal fills without touching shadows.
---

# PsychPro cerulean surface stack

Owner repeatedly says the study/EPPP UI reads "too dark teal" and wants it brighter
and more turquoise / deep cerulean / cyan. The fix is to lift the **surface** stack,
NOT the locked accent.

**Rule:**
- Accent stays locked at cerulean `#76E4F7` (and `mint` stays fully removed — see
  psychpro-sidebar-nav-mint-cyan.md).
- The surface/background stack lives in two mirrored places that must move together:
  `STUDY_PALETTE` (artifacts/neuronotes/src/lib/study-theme.ts) and the HSL token
  mirror in `.study-page-bg` (artifacts/neuronotes/src/index.css). Current brighter
  values: bg `#09303F`, bgSoft `#0B4356`, surface `#0C4355`, surfaceElev `#11576F`,
  steel/tealDeep `#3196AF`, teal `#68CCDE`, ink `#06232D`.
- Hardcoded inline `rgba()` surface gradients across pages were lifted in lockstep:
  `10,45,61→12,67,85`, `6,28,40 & 6,28,38→9,48,63`, `14,60,80→17,87,111`,
  `8,36,48 & 8,32,42→11,67,86`, deep stops `2,13,18→7,33,43` (fills only).
  Do NOT reintroduce the old darker triplets.

**Why:** the perceived darkness came mostly from hardcoded inline rgba surface
gradients (especially the EPPP cards the owner screenshotted), not just the tokens —
so a token-only change looks unchanged on those surfaces.

**How to apply:** when retoning, change tokens + index.css mirror together, then sweep
inline rgba surface fills. **Keep `rgba(2,13,18,...)` in `text-shadow` (and dark
drop-shadows) near-black** — lifting those reduces text legibility. Only lift
`background`/gradient FILL stops.
