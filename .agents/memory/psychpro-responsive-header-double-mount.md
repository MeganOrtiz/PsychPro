---
name: Breakpoint-toggled headers double-mount polling components
description: Why a component placed in both the mobile and desktop header polls/listens twice, and how to gate it.
---

**Rule:** In `artifacts/neuronotes` the app shell (`src/components/layout/app-layout.tsx`) renders two headers that are toggled by CSS only — a `md:hidden` mobile header and a `hidden md:flex` desktop header. **Both are always in the DOM**, so any stateful component you drop into both (e.g. `NotificationsBell`, which runs a `setInterval` poll of `/api/notifications` and a document `mousedown` listener) **mounts twice** and does its side-effects twice — CSS `hidden` does not unmount.

**Why:** Discovered when unifying the notifications bell + Clerk avatar into the shared top bar. Putting `<NotificationsBell/>` in both headers doubled the notifications API traffic and duplicated global listeners, even though the user only ever sees one.

**How to apply:** Gate the instance by breakpoint with the `useIsMobile()` hook (`@/hooks/use-mobile`, 768px = Tailwind `md`): render it as `{isMobile && <X/>}` in the mobile header and `{!isMobile && <X/>}` in the desktop header, so exactly one mounts. Applies to ANY effectful/polling/listener component shared across the two headers — not just the bell.
