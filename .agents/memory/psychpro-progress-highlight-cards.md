---
name: PsychPro progress page highlight cards
description: The Needs Work / Strong Areas pair on /progress must share the deep-turquoise surface, not a pale light fill.
---

On `artifacts/neuronotes/src/pages/progress.tsx`, the "Highlights row" has two side-by-side cards: "Needs Work" (weak topics) and "Strong Areas". They are a designed pair and must look identical in surface treatment.

**Rule:** both cards use `background: linear-gradient(135deg, ${P.surface}, ${P.bg})`, `borderColor: ${P.surf}66`, light text (`text-white` heading, `text-white/90` items), and a bright-cyan `P.surf` icon.

**Why:** "Needs Work" originally used a pale `P.paperSoft` (#CCE5EC) fill with dark `P.ink` text, so it rendered noticeably paler/lighter than every other deep-turquoise box on the page (the owner flagged this). Matching it to its Strong Areas sibling fixed the mismatch.

**How to apply:** Keep the two highlight cards in lockstep. If you restyle one, restyle the other. Never reintroduce a light/paper fill for these — the page theme is deep cerulean with light text.
