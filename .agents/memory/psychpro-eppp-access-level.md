---
name: PsychPro EPPP separate access level
description: EPPP Mastery Suite is sold as its own access tier, independent of Master/Scholar
---

The EPPP Mastery Suite is a SEPARATE paid access level, NOT part of the
Master/Scholar subscription ladder.

- Access is expiry-date driven: `isAdmin || (epppAccessUntil > now)`. It is stored
  on its own user columns (`epppAccessUntil`, `epppSubscriptionId`) and never
  touches `subscriptionStatus`.
- EPPP and Master/Scholar do NOT unlock each other in either direction. Gate EPPP
  content with EPPP-specific helpers (computeEpppAccess / getEntitlements({eppp}) /
  the lib/eppp.ts classifier), never with the generic `isSubscribed`.
- Three Stripe purchase options live on the EPPP product (tagged
  `neuronotes_tier="eppp"`): a $99/mo recurring price (no extra metadata), and two
  one-time prices carrying `eppp_months` ("6" → $499, "12" → $799). One-time packs
  STACK months onto remaining access; recurring sets access to the period end.

**Why:** owner wanted EPPP monetized independently so subscribers don't get it
free and EPPP buyers don't get the full app.

**How to apply:** any new EPPP surface (topic, exam, route, UI) must check EPPP
access specifically; any new EPPP price must be tagged on the same product with
the metadata convention above or the catalog/webhook won't recognize it.
