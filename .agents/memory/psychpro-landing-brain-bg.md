---
name: PsychPro landing brain artwork
description: Current rule — the owner's glowing-blue hero brain is an inline <img> at the TOP of the landing hero, text right below; never a page background, never stretch/crop.
---

# Landing brain artwork: inline hero image at the top

**Current durable rule (since July 9, 2026, owner-directed):**
- The owner's glowing-blue glass brain (`src/assets/bg/landing-hero-brain.jpeg`,
  pre-trimmed to the brain itself) renders as an inline `<img
  className="landing-hero-brain">` — the FIRST element of the landing hero,
  with the wordmark/text stack beginning right below it.
- The landing page floor is pure `#000` like the rest of the app; the brain is
  NOT a page background anymore (the earlier full-page glass-brain backdrop
  from July 8 was replaced by this arrangement).
- The drift guardrail (check-design-drift.mjs) REQUIRES: no wallpaper on the
  landing backdrop rule, no images in index.css at all, the hero-brain img
  present in landing.tsx, AND the img appearing before the wordmark. Any
  future landing-art change must update the guardrail in the same commit.

**Why:** the owner supplied a new brain image on July 9 with the explicit
instruction "add it to the top of the landing page with the text beginning
right below." Prior history: a cover-crop portrait background was rejected
(desktop crop showed ~40% of the art), and a full-page contain background was
then used for a day before this inline-hero arrangement superseded it.

**How to apply:**
- Never `cover`-crop portrait art with a focal subject; never stretch.
- Owner-supplied AI art usually carries huge black padding — trim it
  (`magick -fuzz 12% -trim +repage -bordercolor black -border 24`) so the
  text can truly start right below the subject.
- The saturated blue artwork is exempt from the neutral-palette guardrail
  (it only scans code literals, not image files) — this is intentional owner
  artwork on the black foundation.
- Screenshot both desktop 16:9 and a narrow mobile viewport before calling
  landing-art changes done.

**Gotcha:** AI-generated JPEGs can carry a bright 1px baked-in border that
renders as a seam against black — check edge rows/columns and crop if needed.


# UPDATE 2026-07-12 — brain REMOVED
Owner asked to remove the hero brain from the landing page entirely. The <img>, its CSS, and the old artwork lock are gone; the drift guardrail now FAILS if `landing-hero-brain` reappears in landing.tsx. The wordmark/text stack leads the hero. A new liquid-swirl cyan asset (attached_assets/ChatGPT_Image_Jul_11..._1783836088326.jpeg) was provided and saved but has NO placement yet — wait for owner direction before using it.
