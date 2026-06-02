---
name: PsychPro glass-button class is the source of truth
description: Which CSS class governs glass+glow buttons in the PsychPro (neuronotes) artifact, and the historical duplicate to watch for.
---

**Rule:** The single source of truth for the glass + cyan-glow button look in `artifacts/neuronotes` is `.btn-glass-strong` / `.btn-glass` (defined in `src/index.css`), wired into the shared `<Button>` component (`src/components/ui/button.tsx`) via the variant map. Do not introduce a parallel `.glass-button`, `.cta-glass`, or similar one-off class.

**Why:** An older `.glass-button` utility lived in `src/index.css` and was hardcoded across pages (notably `pages/dashboard.tsx`). When the shared Button was switched to `.btn-glass-strong`, those hardcoded usages kept rendering with the older, milder style because both classes have equal specificity and the cascade order favored the older one. Result: the landing CTAs looked correct but in-app buttons looked flat — and the discrepancy wasn't caught because nobody grepped for the competing class.

**How to apply:**
- When restyling buttons, grep `rg "glass-button|cta-|btn-"` first to surface every competing class.
- Prefer dropping `className` overrides on `<Button>` — let the variant carry the style.
- If a page needs a custom button look, extend the variant map in `button.tsx`, don't add a parallel utility class.

**Sidebar nav glass gotcha:** A "glass/frosted" surface needs a translucent **background fill** (`bg-white/[0.06]`-ish), not just `backdrop-blur` + border + shadow. The sidebar nav tiles (`NAV_ITEM_IDLE` in `src/components/layout/app-layout.tsx`) had blur+border+shadow but no idle fill, so they read as merely *outlined* and the user repeatedly reported them as "not glass/opaque." Adding an idle `bg-white/[…]` fill (matching the Tools Studio tile which already had one) fixes it. **Why:** blur over a dark sidebar with nothing behind the tile produces almost no visible frosting.

**Spotlight "see-through smoke" is a painted image, NOT backdrop-blur.** The dashboard SpotlightCard's smoky look is achieved by painting the same `@/assets/bg/brain-clouds.png` inside the surface with a dark gradient overlay over the StudySurface "dark" base — there is no real translucency to the page behind it. **How to apply:** to make any panel (e.g. the sidebar `<aside>`) "show the smoke through" the same way, layer that image into its `background` (gradient-overlay → `url(smokeBg)` → base gradient), don't reach for translucent fill + `backdrop-filter`.

**All sidebar buttons share one glass helper.** Every clickable row in the sidebar — main nav, Tools Studio tiers, and the profile link — routes through `navItemClass(isActive)` (= `NAV_ITEM_BASE` + `NAV_ITEM_IDLE`/`NAV_ITEM_ACTIVE`). When restyling sidebar buttons, change that helper / the `.nav-glass-*` rules once rather than re-styling individual rows, and don't reintroduce per-row one-off `bg-white/[…]` styles.
