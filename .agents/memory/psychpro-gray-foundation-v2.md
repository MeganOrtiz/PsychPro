---
name: PsychPro gray foundation v2 (landing blue exception)
description: Current design system since 2026-07-10 — logged-in app is black/white/gray on grayed --pp-* tokens; only the landing page keeps the blue-window look.
---

# The rule
The logged-in app (dashboards, courses, EPPP, sign-in, everything inside) is black/white/gray ONLY. The marketing landing page alone keeps the blue-window look.

**Why:** Owner: "rest of the site is horrible revert back to the all black white and gray for the inside of the site" (2026-07-10), after approving the blue landing the day before. This is the second time the owner has rejected color inside the app (see psychpro-black-foundation.md) — do not re-blue the interior.

# How it works
- The three-material structure (OPAQUE/GLASS/GLOSS, glow hover-only, no backdrop-filter, pp-* scoped classes) is UNCHANGED — only the `--pp-*` token VALUES were grayed (keys/names kept, e.g. `--pp-cyan` is now light gray #d6d6d6, `--pp-ocean` mid gray #3c3c3c). STUDY_PALETTE derives from PP so TS consumers followed automatically.
- `:root` has `--surf-hue: 0; --surf-sat: 0%`; every fixed-saturation `var(--surf-hue) NN%` pattern was converted to `var(--surf-hue) var(--surf-sat)` — reintroducing a fixed `NN%` saturation would render RED at hue 0.
- Landing blue lives in exactly two places: the `LANDING` consts in `src/lib/palette.ts` (consumed only by landing.tsx) and the scoped `.landing-root.study-page-bg { --surf-hue: 211; --surf-sat: 62%; }` override in index.css. Never use `LANDING` outside the landing page.
- GLOSS button gradients were retargeted (icy→bright→cyan rest, cyan→text-dim active) because the old bright→cyan→ocean stops turn into an ugly light-to-dark-gray ramp under gray tokens.
- Both guardrails were repointed in the same commit (drift script pins the gray token hexes + glow triplet 240,240,240; hue script still allows the 178–220 blue window — needed for landing — so a stray blue INSIDE the app will NOT be caught by the guardrail; sweep manually, including percent-encoded `%23xxxxxx` colors in data URIs).

# How to apply
Any future retone: change token values in index.css + palette.ts + guardrail pins in one commit; check data-URI colors and `var(--surf-hue)` saturation patterns; verify landing stays blue (screenshot) and inside stays gray (sign-in page + /__glass-preview are un-gated proxies).
