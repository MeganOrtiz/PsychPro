---
name: PsychPro white/luminous system
description: Current design system since 2026-07-16 — entire site (landing + logged-in) on a light silver/white palette anchored by the white luminous brain image; blue-window landing exception retired.
---

# The rule
The ENTIRE site — landing page AND logged-in app — runs on the white/luminous system: light silver floor `#eef0f2`, pure-white surfaces, pale-gray tile ladder `#f4f5f6/#eaecee/#dfe2e5`, near-black actions `#3f4449/#24282c`, dark ink text `#24282c` / muted `#6b7278`, `ink` = white-on-dark only. The old blue-window landing exception is RETIRED.

**Why:** Owner adopted the white luminous brain image as the site-wide visual anchor (2026-07-16): white brain hero on landing, brain cutout top-center on both dashboards, whole site flipped light.

# How it works
- Token keys unchanged; only `--pp-*` VALUES flipped light in index.css + palette.ts (same commit, guardrail-pinned). STUDY_PALETTE derives from PP so TS consumers follow. LANDING consts in palette.ts are now silver/white, still landing-only.
- Backdrop `::before` is a pure-CSS silver radial gradient — no background image anywhere in index.css (drift script enforces).
- Assets: `src/assets/white-brain-hero.jpg` (landing hero, radial-mask feathered 58%/54% at 50% 48%, fade 38%→72% to hide the jpg rectangle) and `white-brain-cutout.png` (`.pp-dash-brain`, top-center on dashboard + EPPP dashboard).
- CAUTION when flipping a foundation: page-local color consts and inline literals keep dark-system assumptions — `C.cloud/C.mist = PP.neutral100/300`, `PP.white` text on `var(--pp-ocean*)`/`mat-opaque`/tile fills, `text-white` classes, `color-scheme: dark`. All were retoned to `PP.text`/`PP.textDim` (2026-07-16). Grep for these patterns after any future retone; tsc and guardrails do NOT catch contrast regressions.
- Hue guardrail still allows blue 178–220 (brain-structures + legacy chart hues only); a stray blue in UI chrome will NOT be caught — sweep manually.

# How to apply
Any retone: index.css + palette.ts + both guardrail scripts in one commit; then grep pages/components for light-text-on-light patterns; verify landing by screenshot (auth-gated pages via tsc/guardrails or mockup-sandbox copy).

2026-07-19: Owner flagged the hero brain looked "nothing like" the source JPEG — the radial mask was cropping the whole splash + floor reflection to a small center blob. Rule: the hero must show the FULL brain-splash artwork (width min(880px,94vw)); the mask (70% 66% at 50/50, opaque 52% → 0 at 93%) only feathers outer edges into the page. Never tighten it back to a center-crop.

2026-07-19 (later): Owner reordered the hero per mockup — PSYCHPRO wordmark + tagline lead (z-index 1, they overlap the splash top), brain artwork after, headline below; drift-guard lock updated to enforce this order. Mobile (≤640px) uses a softer mask + smaller negative margins. Caution: inserting a media query mid-rule once split .landing-hero-brain and silently dropped the desktop mask — keep base props in one block.

2026-07-19 (later still): Hero now uses a background-removed transparent cutout (brain-splash-hero-cutout-q.png, PNG8-quantized ~370KB); ALL radial masks removed — owner did not want the visible image box. Original JPEG kept as brain-splash-hero.jpg; floor reflection is gone with the background (accepted).

2026-07-19: Both dashboards (main + EPPP) now open with a shared .pp-dash-hero banner — wide crop of the transparent splash cutout with BrandBanner (showIcon=false, empty tagline) overlaid top-center; image anchored at top:74% so the wordmark clears the brain. Old .pp-dash-brain emblem + mask retired.
