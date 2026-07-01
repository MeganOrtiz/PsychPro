---
name: PsychPro cerulean surface stack
description: The deep-cerulean surface palette, where it lives (two mirrored places + inline rgba), and the radiance/depth treatment.
---

# PsychPro cerulean surface stack

CANONICAL SURFACE HUE = 192; lever for "too navy" is HUE, never lightness (set 2026-06-12).
**Why:** confirmed pendulum — surfaces at hue 191 read GREEN, at 196 read NAVY; the locked
accent #76E4F7 is hue 189. Bright cyan accents floating on bluer (higher-hue) surfaces are
what reads as navy, even when no surface is literally navy. **How to apply:** to retone,
shift only the surface HUE toward the accent (keep S/L/alpha); diagnose "too navy" by the
surface↔accent hue gap, not depth.

SINGLE KNOB (2026-06-12): surface colors are centralized behind one CSS var `--surf-hue`
in index.css — UI surfaces are written `hsl(var(--surf-hue) S% L% / A)` (and the .dark /
.study-page-bg token tuples use `var(--surf-hue) S% L%`). Change that one number to retone
every surface. INTENTIONAL EXCEPTION: `study-theme.ts` stays literal hex (also feeds
three.js / brain-lab, which can't parse `hsl(var())`) — keep it in sync by hue manually.
A guardrail (`scripts/check-surface-hue.mjs`, validation step `surface-hue`) fails the build
if any LITERAL surface (dark+saturated cerulean) drifts outside hue 188–193 — covers rgb/
hex/hsl()/bare token tuples; `hsl(var(--surf-hue) …)` has no literal hue so it always passes.

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

**landing.tsx is its OWN island** — but the owner can waive that. Historically the
marketing landing page ran a SEPARATE bright card family (`C.bgPanel`/`C.bgPanelStrong`
tokens + per-tile inline gradients), independent of the app/EPPP surfaces, and had to be
deepened separately after a global retone. **OVERRIDE (2026-07-01):** owner explicitly asked
to make the landing tiles "the same as the main site and EPPP." So ALL landing tiles were
migrated onto the canonical EPPP `.epd-card` glass via shared tokens in the `C` object —
`C.cardBg` (radial top-bloom + 145deg linear `hsl(var(--surf-hue) 100% 17%/.95→100% 11%/.99)`),
`C.cardBorder rgba(196,232,242,0.22)`, `C.cardBlur blur(5px) saturate(190%)`, `C.cardShadow`
(4-layer). Applied to `.landing-feature-card`, `.landing-science-item`, `.landing-founder-card`,
`.landing-scholar-card`, `.landing-mastery-card`, `.landing-final-card`, `.landing-split-body--boxed`.
DELIBERATE EXCEPTIONS: (1) `.landing-topic-chip` stays a LIGHT pill (shares the deep fill +
cardBorder for family, but NO radial bloom / heavy card shadow — a 44px pill with the full
recipe looks wrong); (2) `.landing-dash-card` stays WHITE (`#ffffff→#e3f3fa`) — it's a
dashboard-illustration mockup with dark ink on white; converting it to dark glass makes its
contents unreadable. **Why the override is safe:** the epd recipe is all `hsl(var(--surf-hue))`
(surface-hue guardrail passes) and does not touch the locked `.bg-card` recipe (design-drift
passes). Also unified in the same pass: white text floating on the wallpaper (not in a tile)
now uses a shared `C.textPool` dark drop-shadow (tagline/headline/blurb/eyebrow/section-title/
section-sub/split-title) for legibility instead of cyan-only glows. Verify on the public `/`
route (no auth gate). **If the owner later reverts:** restore the bright-family tokens; do NOT
assume the island rule alone — check for an explicit unify/revert request first.

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

**Radiance/depth recipe (current, updated 2026-06-14):** the shared backdrop
`assets/bg/brain-clouds.png` is now a HIGH-DEFINITION 1408×768 LANDSCAPE deep-cerulean
nebula image that GLOWS on its own (bright incandescent core baked into the art) — it
is no longer the old portrait brain image. Because the image self-glows, `.study-page-bg
::before` NO LONGER adds an additive cyan center bloom; instead its inner gradient is a
deep-cerulean *tame* over the bright core (so it reads deep turquoise, not washed-out
bright teal), plus a deepened deep-cerulean vignette to the edges, all in
`hsl(var(--surf-hue) …)`. The backdrop is fully STATIC — the earlier "living atmosphere"
animations (atmosphere-smoke-drift / nebula-drift / radiance-breathe) were REMOVED at the
owner's request; `::after` now holds static nebula glows at opacity 0.92. To re-skin every
page, replace that one shared PNG. **Why "too teal" → fix:** owner reads a flat/bright
center as "too teal"; deepen by taming the core + deepening the vignette (and prefer a
deeper-toned background image), NOT by lifting/brightening. Glass cards still add an inner
cyan top-bloom + outer cyan corona + deep drop shadow for incandescence + depth.

**Why:** perceived tone comes MOSTLY from the inline rgba surface gradients in the
index.css recipes, not just the tokens — a token-only change looks unchanged on cards.
Retone in lockstep: tokens + HSL mirror + the recipe rgba together.

**How to apply (inline rgba sweep):** scope any regex to numbers immediately after
`rgb(`/`rgba(` ONLY; a bare `\d+,\d+,\d+` match also mangles numeric arrays/args/copy.
Keep a fixed old→new triplet map so the same fill always maps consistently.

**UPDATE 2026-06-14 — the legacy rgba surface fills are GONE.** The deep-cerulean
surface family `rgba(11,54,70)/rgba(6,33,46)` (and the older `rgba(20,90,116)/
rgba(11,62,82)`) NO LONGER EXISTS anywhere in src — every surface fill is now
`hsl(var(--surf-hue) S% L% / A)` (tokens in index.css `.dark`/`.study-page-bg`, the
glass recipes in index.css, AND inline gradients across ~23 .tsx files incl. landing's
`C.bgPanel`/`bgPanelStrong`). So a surface retone is now an hsl(var(--surf-hue)) sweep,
NOT an rgba sweep — don't go hunting for rgba triplets.

**PIGMENT = SATURATION lever (2026-06-14).** Owner wanted "much richer / more
pigmented" and explicitly chose saturation-only: keep hue (192) + keep it deep (no
lightness lift) + NO green shift. To make surfaces richer, raise ONLY the S digit on the
`hsl(var(--surf-hue) S% L%)` surfaces — in BOTH index.css (token tuples + recipe
gradients) AND every inline `.tsx` gradient (the dominant card pair is `76% 19% / 80%
14%`; the subtle-tint pair is `49% 58%`). Used ~+12–20 pts by band, cap ~92, keeping
L + alpha. **EXCLUDE:** text/foregrounds + `--muted-foreground`, the locked accent
`#76E4F7` (188 90% 72%) and `rgba(118,228,247)`, and the icy-text/neutral hex in
`study-theme.ts` (mist/cloud/paper/inkSoft).
**DO saturate study-theme.ts SURFACE hex too** (ink/bg/bgSoft/surface/surfaceElev/
steel/tealDeep/teal) — they mirror the `.study-page-bg` HSL tokens AND drive live UI
directly (auth/sign-in theming, dashboard header, app-layout 3rd gradient layer,
subscription, eppp shell), so leaving them flat makes the site patchy. Convert each hex→
HSL, keep HUE (192 surfaces / 189 teal) + lightness, raise only S to the matching token
target, convert back to hex; also fix the now-stale `/* #hex */` comments in index.css.
Brain-lab (brain-lab.tsx, brain-3d-view.tsx, brain-quiz.tsx) only imports the accent
glow (`surf #76E4F7`, untouched) — saturating background surface hex is safe: a valid
hex string can't break WebGL/GLB; the documented brain risks are asset corruption +
lightness, NOT the S channel.
**Why:** saturation never touches the hue digit, so the surface-hue guardrail is
unaffected. To go richer/less rich later, re-run the band bump on the same hsl surfaces +
re-derive the study-theme.ts hex; NEVER touch hue or lightness.

**#0077B6 "Rich Ocean Blue" brief request DECLINED in favor of the lock (2026-06-30).**
A landing-revamp brief asked to "use Rich Ocean Blue (#0077B6) for secondary backgrounds/
cards/gradients only." #0077B6 is hue ~201, L~0.36 — it lands squarely in the navy band the
surface-hue guardrail blocks (would FAIL the build and read as the exact navy drift the lock
prevents). When shown the tradeoff, the owner chose to KEEP the locked cerulean (it already
reads as deep rich ocean-blue) rather than loosen the guardrail. **How to apply:** if a future
brief re-requests #0077B6 (or any hue outside 188–193) for surfaces, do NOT apply it literally;
restate the conflict and default to the locked cerulean unless the owner explicitly opts to
loosen the lock.
