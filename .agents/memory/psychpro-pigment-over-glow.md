---
name: PsychPro pigment-only / no-glow sweep was REVERTED
description: The "pigment-only, strip ALL cyan glow from content cards" direction was built, deployed, then rejected by the owner as "worse" and reverted. Do NOT re-strip glow from live cards.
---

# Pigment-only / no-glow sweep — REVERTED, then RE-REQUESTED (current = no idle glow)

> **SUPERSEDING UPDATE (current confirmed direction):** the owner LATER
> re-requested removing the "weird glow" from cards everywhere (main site + EPPP)
> and confirmed all cards should be consistent. The current live state is:
> **idle card surfaces = pigment-only** — NO cyan top-bloom radial
> (`radial-gradient(… at 50% 0%, rgba(118,228,247,…))`) and NO negative-spread
> cyan corona box-shadows on the resting card. **Interactive glow is PRESERVED:**
> `:hover` / `:active` / selected states, buttons (`.btn-*`, `.eppp-launch-btn`,
> `button.bg-*`), nav pills (`.nav-glass-*`), tabs (`.eps-subtab`), the
> achievement `.course-mastery-tile--mastered` state, keyframes, and the
> flashcard flip faces (study-surface `accent` / `card-front` tones) all KEEP
> their glow. The `.bg-card` recipe is locked pigment-only by check:design-drift.
> Owner taste on card glow has now oscillated 3+ times — treat any future
> "add/remove card glow" as high-risk and confirm scope (idle vs interactive).
> The REVERTED history below is retained for context but no longer the direction.

# Pigment-only / no-glow sweep — REVERTED (historical)

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

**Clarification:** "pigment over glow" does NOT mean cards should have zero glow.
The canonical card (June-27) keeps a SUBTLE cyan bloom+corona; stripping it makes
cards read flat/dark. The rule is: fight muddiness with saturation/contrast and by
REDUCING excessive glow — not by removing glow entirely. See
`psychpro-canonical-card-recipe.md`.
