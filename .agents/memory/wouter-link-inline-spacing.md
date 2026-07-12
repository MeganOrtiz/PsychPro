---
name: wouter Link ignores vertical spacing
description: wouter <Link> renders an inline <a>, so Tailwind space-y-* / vertical margins are silently ignored between links.
---

wouter's `<Link>` renders a plain inline `<a>` element. Inline elements ignore vertical margins, so Tailwind `space-y-*` on a parent produces ZERO visible gap between stacked Links — rows sit touching even though the class is present.

**Why:** This caused the main-app sidebar buttons to touch while the EPPP sidebar (whose links are wrapped in block `<div>`s) had proper 4px gaps — same recipe, structurally different result. Owner flagged it repeatedly before the root cause was found (2026-07-12).

**How to apply:** When stacking wouter Links vertically, either wrap each Link in a block `<div>` or force the anchors block-level with a scoped CSS rule (e.g. `.some-nav a { display: block; }`). Never assume `space-y-*` works on bare Links — the class will be present but produce zero gap.
