---
name: PsychPro cerulean surface stack
description: The deep-cerulean surface palette, where it lives (two mirrored places + inline rgba), and the radiance/depth treatment.
---

# PsychPro cerulean surface stack

CANONICAL HUE = 192 (set 2026-06-12, latest). The 2026-06-11 retone bumped surfaces to
hue ~196 (see study-theme.ts comment + .dark block); owner reported "too navy AGAIN."
Confirmed pendulum: surfaces at hue 191 read GREEN, at 196 read NAVY; the accent #76E4F7
is hue 189. Fix applied: a gated global hue sweep pulling EVERY surface in the hue band
[193,206] (lightness<60%, saturation>20%) down to hue 192 — across study-theme.ts hex
tokens, the index.css .dark + .study-page-bg HSL blocks, and ALL inline rgba() families in
pages/components. Accents (hue<193, incl. #76E4F7/#68CCDE) left untouched as the north
star. Lightness/saturation preserved (hue is the only lever). #3196AF was already hue ~192
so it didn't move. The sweep was a Node script in code_execution (RGB↔HSL, band+L+S gate);
re-run that approach for any future retone — never hand-edit the ~13 duplicated families.

HUE REVERSAL 2026-06-11. After the deepening (below), the owner said the whole
site looked "too navy" and asked to "return to deep cerulean/deep turquoise." Root cause:
EVERY surface sat at hue ~194–203 (bluer cerulean) while the locked accent #76E4F7 is
hue 189 (turquoise-cyan) — bright turquoise accents floating on bluer surfaces READ AS
NAVY, even though no surface was literally navy-hue. PLUS a genuinely-navy legacy global
`.dark` block (hue 210–222, the shadcn defaults: --background/--card/--sidebar/--popover
/--muted/--primary/--accent). Fix applied: pulled ALL surface hues toward ~191 (70% toward
189) to MATCH the accent, +slight saturation, +gentle lightness lift on the darkest, and
retoned the `.dark` block to hue 189–192. So the canonical surface hue is now ~191, not
196–200. Diagnostic for future "too navy": check the surface↔accent HUE GAP, not just
lightness — keep surfaces within a few degrees of the 189 accent.

EARLIER (same day): owner had asked for "brighter / less dark teal" (lifted), RETRACTED
it for "deeper/darker cerulean-turquoise" with "incandescence/radiance/depth/ethereal,"
so surfaces were DEEPENED twice. The hue reversal above kept it deep but shifted hue to
turquoise. Do NOT re-lift surfaces back to bright; the lever for "navy" is HUE, not depth.

**Diagnostic heuristic — when the owner says "too light":** check SURFACE
translucency/alpha first, NOT the tokens. The repeat offender is `StudySurface
tone="light"` (the most-used card tone): low alpha lets the bright cyan-bloom backdrop
wash through and reads light even over deep tokens. Fix = raise card opacity + deepen the
fill, drop the per-card cyan top-bloom, and tame the page `::before` central bloom +
strengthen the vignette — in lockstep across study-surface.tsx tones and the index.css
recipes (`.bg-card`, `.recommended-tile`, `.lesson-header-box`).

**Verification trick:** the dashboard is Clerk-auth-gated (screenshot browser gets 403),
so calibrate against a target mockup via a throwaway DEV-only route gated by
`import.meta.env.DEV` that renders the real surface classes on study-page-bg; screenshot,
tune, then DELETE the route + file. For public verification of a sweep, screenshot
`/privacy` and `/terms` — they're public and use the same light card family.

**CRITICAL — the light card recipe is DUPLICATED inline, not centralized.** Changing the
shared recipes (StudySurface tones, `.bg-card`, `.recommended-tile`, `.lesson-header-box`)
does NOT propagate to most pages. The idle "light" card family
`rgba(20,90,116,A) → rgba(11,62,82,B)` is copy-pasted into per-page inline styles AND into
per-page `<style>` blocks across ~13 files: EPPP (eppp.tsx, eppp-suite.tsx,
eppp-dashboard.tsx via `.eppp-*`/`.eps-*`/`.epd-*`) and main study pages (dashboard,
flashcards, quiz, practice-exam, progress, reflections, subscription, feedback, privacy,
terms). A site-wide retone MUST sweep all of them. Fastest reliable way: a Node script in
code_execution that regex-replaces the two exact RGB prefixes ONLY (capturing alpha) —
`rgba(20,90,116,A)→rgba(11,54,70, min(A+0.33,0.90))` and
`rgba(11,62,82,A)→rgba(6,33,46, min(A+0.33,0.90))`. code_execution stdout shows TRUE
numbers (the bash/rg display garbles RGB to "n"), so enumerate + replace there.
The brighter companion families (`rgba(20,100,128,...)`, hover/active tiers, flashcard
accent/card-front in study-surface.tsx) are intentional elevated/interactive tiers — leave
them unless specifically asked.

**landing.tsx is its OWN island.** The marketing landing page does NOT use the
`rgba(20,90,116)/rgba(11,62,82)` family the sweep targets — it has a separate bright card
family that the site-wide sweep never touches, so it stays light after a global deepen and
the owner re-reports "too light" for the landing only. Its surfaces: the `C.bgPanel`/
`C.bgPanelStrong` tokens (drive `.landing-feature-card` + `.landing-topic-chip`), plus
inline gradients on `.landing-science-item`, `.landing-founder-card`, `.landing-dash-card`,
`.landing-scholar-card`, `.landing-mastery-card`. Deepen all of these to the canonical
`rgba(11,54,70,~0.82–0.86)→rgba(6,33,46,0.90)`; keep the cyan hairlines/glows/shadows for
radiance. Verify on the public `/` route (no auth gate).

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
