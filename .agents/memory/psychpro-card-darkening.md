---
name: PsychPro card darkening (July 2026)
description: Owner-requested site-wide darkening of boxes/tiles — cards must read DARKER than the smoke backdrop; canonical ladder and what was deliberately left bright.
---

Owner directive (July 8, 2026, with dashboard screenshot): "rather than lighter than the rest of the site, the boxes and tiles need to be darker." This partially supersedes the June-27 restore's "don't re-darken" — that ban applied to the whole-page grade; CARD/TILE fills specifically are now locked darker.

**The rule:** all box/tile glass surfaces sit on a darkened lightness ladder — canonical card gradient is 88% 10% → 88% 6% (alphas unchanged); hover/feature/active steps were shifted down proportionally (~9-13 lightness points), preserving the one-step elevation gap between panels and nested tiles.

**Why:** cards lighter than the backdrop read as washed-out floating panes; darker-than-backdrop fills restore depth and text contrast over the teal smoke.

**How to apply:** any new surface joins the darkened ladder (reference .bg-card / .epd-card / .lesson-header-box). Deliberately NOT darkened: glowing pill BUTTONS (82% 38% / 88% 22% gradient — buttons keep glow per the site-wide button convention), nav-glass sidebar pills (see-through chrome, not boxes), and the shadcn tokens (--card/--background/--popover) which the drift lock pins. check-design-drift.mjs pins the darkened values (EPPP card, landing tokenized surfaces, and .lesson-header-box — that one drifted once by being missed in the sweep, hence its own contract).

**Gotcha:** a sed-based sweep missed .lesson-header-box and the EPPP-suite tile hover/active states because their lightness/alpha combos differed from the canonical tokens — after any ladder shift, grep for leftover mid-lightness surf-hue values (e.g. `8[4-9]% [12][0-9]%`) and classify each hit as tile (darken) vs button (keep).
