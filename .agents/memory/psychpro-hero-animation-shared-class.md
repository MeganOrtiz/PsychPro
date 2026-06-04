---
name: PsychPro hero entrance-animation shared class trap
description: Why a reused utility class (.landing-cta-row) silently goes invisible outside the hero on the landing page.
---

# Hero entrance-animation hooks must stay hero-scoped

The landing page (`artifacts/neuronotes/src/pages/landing.tsx`) drives the hero
intro by giving entrance elements a base `opacity: 0` + translateY and only
un-hiding them under `.landing-hero.is-mounted ...`.

`.landing-cta-row` is NOT hero-only — it is also used by the FINAL CTA section.
When the base hidden rule listed the bare global `.landing-cta-row`, the FINAL
CTA's "GET STARTED FREE" button stayed permanently at `opacity: 0` (its own
opacity was 1, but the parent row's 0 hid it). The user perceived this as a
large empty "extra space" / smoky gap between the FINAL CTA heading and the
ALL TOPICS section — there was no real spacing bug; an invisible button
occupied the space.

**Why:** a globally-named animation hook applied to a class shared with
non-hero sections leaks the hidden state. Fix = scope the hidden rule to
`.landing-hero .landing-cta-row` (keep the reveal `.landing-hero.is-mounted
.landing-cta-row`). Non-hero cta-rows then keep their default `opacity: 1`.

**How to apply:** when a "section looks empty / has a gap" report points at a
button-bearing row, check whether the row's class is also a hero entrance
element with a base `opacity:0` that is only un-hidden inside `.landing-hero`.
Inspect the PARENT row's computed opacity, not just the button's. General rule:
never attach hero/mount entrance-animation base styles to a class reused
outside the hero — scope the hidden state to the hero.
