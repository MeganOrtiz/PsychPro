---
name: PsychPro route white-flash floor
description: Why the app needs a global dark body floor, and why it MUST live on body only (not html/#root) or it wipes every page backdrop.
---

PsychPro is visually always-dark, but `<body>` resolves shadcn `--background` to the
LIGHT token (`:root --background: 198 40% 96%`). Only `.study-page-bg` / `.dark`
subtrees flip `--background` dark. So the canvas under everything is light, and a
route swap (or a transitional gate that mounts a different surface) can flash that
light canvas for a frame — reads as "choppy".

**Rule:** keep a global dark floor on `<body>` ONLY: `body { background-color: #05252d }`
in index.css (matches `.study-page-bg::before` base color). Don't remove it to "fix"
a light page — light routes set their own surface on top.

**CRITICAL — body only; never html or #root.**
Every page backdrop (landing brain-clouds, in-app app-smoke) lives on a
`position: fixed; z-index: -2` ::before. For those to be visible, body's background
must be PROPAGATED to the canvas — the bottom-most paint layer, behind the negative-z
::before. The browser only propagates body's background to the canvas when `<html>`
has NO background of its own.
- Add a background to `<html>` (or to the normal-flow `#root`) and propagation breaks:
  body's background now paints in normal flow, ON TOP of the fixed ::before, wiping
  the backdrop. Symptom: landing goes flat (dark `#root`/body) or washed-out (light
  body), in-app pages may look fine only because their bg image is browser-cached.
**Why:** a white-flash fix once set `html, body, #root { background-color }`; that
killed propagation and erased the landing brain-clouds backdrop after publish. Setting
it on `body` alone fixes the flash AND keeps the backdrop (canvas = dark, ::before on
top).

**How to apply:** if a white/flash appears between sign-in → /welcome → onboarding →
dashboard, the cause is almost never the page itself; it's the body floor or a
transitional loader that isn't on a dark surface. Use the shared `FullScreenLoader`
(study-page-bg + spinner) for every transitional state so consecutive screens share
one continuous nebula backdrop, and gate Clerk boot with `<ClerkLoading>` so a cold
protected-route load doesn't render blank before the session resolves. If a page
backdrop vanishes, check whether anything gave `<html>`/`#root` a background — that,
not the image asset, is the usual culprit (the asset still serves 200; a "403" in the
console is an unrelated guest API call).
