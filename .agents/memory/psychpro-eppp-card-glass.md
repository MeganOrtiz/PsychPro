---
name: PsychPro EPPP journal / missed-questions card glass
description: The eps-mq-card family on the EPPP suite must use the brighter translucent cerulean glass, not opaque dark fills.
---

The EPPP suite (`artifacts/neuronotes/src/pages/eppp-suite.tsx`) keeps its styling in an embedded CSS-in-JS template at the bottom of the file using a local `C` palette. The Reflections, My Notes, and Missed Questions panels share `.eps-mq-card` and inner classes (`.eps-mq-explain`, `.eps-mq-option`, `.eps-reflection-note`).

**Rule:** card surfaces must match the canonical glass treatment in `index.css` (`.lesson-header-box` / `.recommended-tile`): `linear-gradient(145deg, rgba(42,146,174,0.32), rgba(30,114,140,0.4))`, border `rgba(196,232,242,0.22)`, `backdrop-filter: blur(20px) saturate(135%)`, plus the inset + cyan-glow box-shadow. Inner boxes use translucent cyan tints (e.g. `rgba(118,228,247,0.05–0.10)`), never opaque navy.

**Why:** these cards originally used opaque near-black `rgba(14,58,74,0.95)→rgba(8,42,55,0.97)`; the owner flagged them as "wayyy too dark" vs the rest of the site, which is bright translucent glass over the cyan smoke backdrop.

**How to apply:** if a card here looks too dark, lift only the alpha stops (±0.04) of the established glass recipe — do NOT introduce new opaque color triplets. Keep `.eps-mq-option.is-correct` (0.10) brighter than a normal option (0.05) so the correct answer stays distinguishable.

**Also applies to the Part 1/Part 2 knowledge cards** (`.eps-kb-rail-item`, `.eps-kb-rail-item.is-active`, `.eps-kb-lesson` in the same CSS-in-JS block). These originally used a near-opaque flat fill `linear-gradient(135deg, rgba(20,100,128,0.78), rgba(11,54,70,0.86))` which the owner flagged as "flat, too light and bad" (2026-06-11). Fixed by aligning them to the canonical translucent glass (`.recommended-tile` recipe: radial cyan top-bloom + `linear-gradient(145deg, rgba(20,90,116,0.34), rgba(11,62,82,0.46))` + blur(20px) saturate(135%) + inner cyan inset glow + outer cyan corona + deep drop shadow). The flatness came from HIGH alpha (0.78/0.86) hiding the backdrop; depth comes from LOW-alpha translucency over the brain backdrop plus the cyan glows.
