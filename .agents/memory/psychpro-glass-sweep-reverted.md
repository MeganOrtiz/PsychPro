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
