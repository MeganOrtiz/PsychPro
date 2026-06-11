---
name: PsychPro EPPP journal / missed-questions card glass
description: The eps-mq-card family on the EPPP suite must use the brighter translucent cerulean glass, not opaque dark fills.
---

The EPPP suite (`artifacts/neuronotes/src/pages/eppp-suite.tsx`) keeps its styling in an embedded CSS-in-JS template at the bottom of the file using a local `C` palette. The Reflections, My Notes, and Missed Questions panels share `.eps-mq-card` and inner classes (`.eps-mq-explain`, `.eps-mq-option`, `.eps-reflection-note`).

**Rule:** card surfaces must match the canonical glass treatment in `index.css` (`.lesson-header-box` / `.recommended-tile`): `linear-gradient(145deg, rgba(42,146,174,0.32), rgba(30,114,140,0.4))`, border `rgba(196,232,242,0.22)`, `backdrop-filter: blur(20px) saturate(135%)`, plus the inset + cyan-glow box-shadow. Inner boxes use translucent cyan tints (e.g. `rgba(118,228,247,0.05–0.10)`), never opaque navy.

**Why:** these cards originally used opaque near-black `rgba(14,58,74,0.95)→rgba(8,42,55,0.97)`; the owner flagged them as "wayyy too dark" vs the rest of the site, which is bright translucent glass over the cyan smoke backdrop.

**How to apply:** if a card here looks too dark, lift only the alpha stops (±0.04) of the established glass recipe — do NOT introduce new opaque color triplets. Keep `.eps-mq-option.is-correct` (0.10) brighter than a normal option (0.05) so the correct answer stays distinguishable.
