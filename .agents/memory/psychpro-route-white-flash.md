---
name: PsychPro route white-flash floor
description: Why the app needs a global dark body floor to avoid white flashes between routes/auth.
---

PsychPro is visually always-dark, but `<body>` resolves shadcn `--background` to the
LIGHT token (`:root --background: 198 40% 96%`). Only `.study-page-bg` / `.dark`
subtrees flip `--background` dark. So the canvas under everything is light, and a
route swap (or a transitional gate that mounts a different surface) can flash that
light canvas for a frame — reads as "choppy".

**Rule:** keep a global dark floor `html, body, #root { background-color: #05252d }`
in index.css (matches `.study-page-bg::before` base color). Don't remove it to "fix"
a light page — light routes set their own surface on top.

**How to apply:** if a white/flash appears between sign-in → /welcome → onboarding →
dashboard, the cause is almost never the page itself; it's the body floor or a
transitional loader that isn't on a dark surface. Use the shared `FullScreenLoader`
(study-page-bg + spinner) for every transitional state so consecutive screens share
one continuous nebula backdrop, and gate Clerk boot with `<ClerkLoading>` so a cold
protected-route load doesn't render blank before the session resolves.
