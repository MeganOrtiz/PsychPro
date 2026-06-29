---
name: PsychPro pigment-only / no-glow sweep was REVERTED
description: The "pigment-only, strip ALL cyan glow from content cards" direction was built, deployed, then rejected by the owner as "worse" and reverted. Do NOT re-strip glow from live cards.
---

# Pigment-only / no-glow sweep — REVERTED

A full sweep that stripped every cyan glow (top-bloom radials + box-shadow coronas)
off the main-site content cards/panels — leaving a pigment-only saturated cerulean
fill — was built, merged, and deployed. The owner looked at the live dashboard + EPPP
suite and rejected it outright: **"no this is worse. revert."** The site files were
restored to their pre-sweep state.

**Why:** The owner's earlier photo-editor reference (saturation+contrast up, NO added
glow) read as "pigment beats glow" *for a single static card image*, but applied across
the whole live app the glow-stripped cards looked flat/dead in context. The glow is part
of what makes the surfaces read as glass. Removing it wholesale was a downgrade.

**How to apply:**
- Do NOT re-run a "remove all cyan glow / pigment-only" pass on the live content cards.
  The cards keep their cyan glow (top-bloom + soft corona), consistent with the EPPP
  `.epd-card` glass recipe.
- "Flat/bland/foggy" complaints are still usually over-blur + desaturation — fix with
  saturate/contrast up and brightness down, but **keep the glow**; do not strip it.
- Owner taste on this oscillated within one session (asked for no-glow, then for the
  brighter "Back to PsychPro" button glass, then reverted the no-glow live changes).
  Treat live-card glow changes as high-risk: prototype in the mockup-sandbox and get
  explicit sign-off on the REAL composition before touching the live site.

**Verification constraint:** Clerk blocks the test browser on auth-gated pages, so the
dashboard/EPPP cards can't be screenshotted directly — verify via an isolated
mockup-sandbox copy of the real composition (see psychpro-signed-in-verification), and
rely on owner screenshots for the live look.
