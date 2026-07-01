---
name: PsychPro all-tiles/all-buttons glass sweep — REVERTED
description: Owner rejected unifying every tile + button onto one glass recipe; the logged-in dashboards looked flat/muddy. Do not re-attempt without explicit ask.
---

# All-surfaces glass unification was reverted

An attempt to apply the landing feature-card glass recipe to **every** tile AND
button across the main site and EPPP suite (one family, one-step elevation:
deeper containers, standard nested tiles, scaled glass buttons) was **reverted
in full at the owner's request**.

**Why it failed:** when every surface shares the identical cerulean glass — same
hue, same cyan hairline, same halo, high opacity (fills 0.82–0.96 alpha at
7–19% lightness) — the logged-in **Dashboard** and **EPPP Dashboard** read as a
flat, muddy wall of near-identical dark boxes. Hierarchy collapsed: top-level
sections, nested cards, and buttons all landed at nearly the same visual weight;
nested cards inside the dark "panel" containers couldn't lift (a child's
backdrop blur can't re-sample the page bg through an already-blurred dark
parent). Net: nothing "popped," opposite of the goal.

**Process lesson (the real miss):** the sweep was reported "done" after verifying
only the landing, /privacy, /terms, and a synthetic `/__glass-preview` route —
NOT the actual auth-gated Dashboard / EPPP Dashboard, because Clerk blocks the
test browser. The surfaces that changed most were never seen. See
`psychpro-signed-in-verification.md` — verify auth-gated screens via a
mockup-sandbox copy or have the owner screenshot before claiming done.

**How to apply:** do NOT re-roll a "make every tile/button use the landing glass"
unification. If asked to improve dashboard look, preserve real tonal hierarchy
(distinct weights for container vs nested card vs button) and verify on the
logged-in screens, not proxies.

**How it was reverted:** restored the changed files under
`artifacts/neuronotes/src/` to the Published baseline captured just before the
Plan→Build transition that started the sweep (via `git show <baseline>:<path>` +
write). The deeper design history before that point (glowing-outline buttons,
deepened cerulean stack) was left intact.

**Update:** a later, DIFFERENT request DID unify main-site cards — but onto the
already-approved EPPP `.epd-card` recipe, not the landing recipe, preserving
hierarchy and excluding nav rails. See `psychpro-eppp-unified-cards.md`.

**Update 2 (idle cards go pigment-only):** the owner then
asked to remove the cyan glow from cards everywhere and confirmed all cards
should be consistent. This is NOT the muddy all-surfaces unification that was
reverted — it only strips the *idle* card top-bloom radial + negative-spread
cyan corona, leaving pigment glass. Hierarchy is preserved because interactive
states (hover/active/selected), buttons, nav pills, and tabs KEEP their glow, so
resting cards read flat but still lift on interaction. See the superseding note
in `psychpro-pigment-over-glow.md` for the full keep/strip matrix.

**Update 3 (CURRENT — signature-glass sweep, sanctioned):** Update 2 is now
RETRACTED. Owner explicitly (via user_query) asked to make *every button and
tile* match the top-right launch pills ("Back to PsychPro" / "EPPP Mastery
Suite" = the `.eppp-launch-btn` glass: translucent cerulean fill + cyan hairline
border + soft cyan glow). Applied to `.bg-card`, `.lesson-header-box`,
`.recommended-tile` (idle) and StudySurface `light`/default tone. The muddy-wall
failure was AVOIDED by keeping fills opaque enough (alpha .58/.70) — verified
over the smoke bg via a throwaway `/__glass-preview` DEV route (since removed):
tiles read as the launch-pill glass and stay legible, hierarchy holds. The
design-drift lock was flipped to REQUIRE the glow (`0 0 26px -6px
rgba(118,228,247,0.42)`); the old pigment-only assertion is gone. See
`psychpro-design-lock.md`. Do not "restore pigment-only" — that direction is dead.

**Update 4 (Update 3 REVERTED — pigment is canonical, this is now a hard rule):**
The signature-glass sweep from Update 3 was REVERTED by the owner. They posted the
June-27 EPPP-dashboard screenshot (dark, refined, semi-transparent PIGMENT cards
with a subtle rgba(196,232,242,~0.2) hairline and NO cyan glow) and asked to make
the "entire site look like that again," frustrated that this keeps happening. Root
cause of the recurrence: a request phrased "make every tile match the [glowy]
buttons" gets literally applied as button-glow-on-cards, which produces the muddy /
over-glowed dashboards the owner rejects EVERY time. Reverted by restoring the card
recipes (.bg-card, .recommended-tile idle, .lesson-header-box in index.css;
.epd-card in eppp-dashboard.tsx; StudySurface light; the drift lock) to the
pre-sweep commit state. KEPT the separate, un-retracted background over-saturation
fix (app-smoke filter saturate 1.32→1.16). **Hard rule going forward:** cards/tiles
= pigment, no cyan glow; glow belongs to buttons + launch pills only. Do NOT
re-apply the card glow sweep; if a future request seems to ask for it, surface this
history first.

**Update 5 (Update 4 was WRONG — correcting the record):** Update 4 claimed
"pigment is canonical, no glow on cards." That is FALSE and caused another bad
revert. The owner then posted the SAME June-27 screenshot again asking why it got
worse. Root cause: the June-27 look is TRANSLUCENT GLASS WITH A SUBTLE GLOW (commit
1585ea0), not flat pigment. Restoring the de-glowed pigment baseline (423bf00) made
the cards dark/flat. Fixed by restoring the real 1585ea0 glass recipe to .bg-card,
.epd-card, .recommended-tile, .lesson-header-box, StudySurface, and FLIPPING the
guardrail to REQUIRE the glow. Authoritative details + exact values now live in
`psychpro-canonical-card-recipe.md`. Do not trust any note calling June-27
"pigment / no glow".
