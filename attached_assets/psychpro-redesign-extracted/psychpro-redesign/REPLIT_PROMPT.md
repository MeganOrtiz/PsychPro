# PsychPro Visual Redesign — Replit Implementation Package

## HOW TO USE THIS PACKAGE

Paste the prompt below into Replit's AI agent, then upload the included files. The agent will integrate the styling and components into your existing PsychPro project without disturbing routing, data logic, or feature behavior.

---

## PROMPT TO PASTE INTO REPLIT

I'm doing a **visual-only redesign** of my existing PsychPro app. Do NOT change any routes, data fetching, state management, component hierarchy, authentication, or feature behavior. Only update styling, colors, background imagery, typography, and visual effects.

### What to apply

1. Replace my current global theme CSS with the contents of `src/styles/theme.css` (provided).
2. Add `src/styles/effects.css` for shared visual effects (glows, blurs, particle background).
3. Add the nebula background component from `src/components/NebulaBackground.jsx` and mount it once at the root of the app so it sits behind all pages as a fixed layer with `z-index: -1`.
4. Update my landing page (`src/pages/Landing.jsx` provided as the reference target) to match the new hero, feature cards row, trust/testimonial row, newsletter row, and footer. Keep my existing routes and copy text where my version already has it — only swap the JSX structure and class names to match the provided file.
5. Update my dashboard layout to match `src/pages/Dashboard.jsx` provided. Specifically: apply the new sidebar styling, the centered header with `PSYCHPRO` wordmark and "ADVANCE YOUR MIND. ELEVATE CARE." tagline, the new card styling (translucent with backdrop blur and cyan border-glow), and the new Spotlight panel on the right.
6. Wire up Tailwind (or convert the provided utility classes into your styling system) so the design tokens in `theme.css` are used as CSS variables across the app.
7. Use Lucide React for all icons (thin 1.5px stroke). Install if not already present: `npm install lucide-react`.
8. For the hero brain image: I will provide `public/brain-hero.png` separately (a glowing anatomical brain on a soft blue nebula background, with NO lightning bolts / electrical arc filaments — only the brain and soft cosmic clouds). Reference it as `/brain-hero.png` in the hero section. If the file isn't present yet, leave a placeholder div with the class `brain-hero-placeholder` so I can drop the asset in later.

### Visual direction summary

Move from the current muted dark-teal photographic look to a **luminous, cosmic, nebula-inspired aesthetic**. Glowing brain suspended in deep space, ethereal blue smoke clouds, electric cyan accents, thin wide-tracked typography. All cards translucent with backdrop blur. All interactive elements have soft cyan outer glows. Smooth 250ms ease transitions on every hover.

### Important constraints

- Do NOT generate a new brain image with lightning bolts. The brain should glow softly with surrounding cloud/nebula only.
- Preserve all existing functionality — only the visual layer changes.
- Maintain full responsive behavior (cards stack on mobile, sidebar collapses to hamburger).
- Use the CSS variables defined in `theme.css` everywhere — do not hardcode hex values in components.

---

## FILES IN THIS PACKAGE

```
src/
  styles/
    theme.css          → CSS variables (colors, typography tokens)
    effects.css        → Reusable glow, blur, particle effects
    globals.css        → Base resets and global styles
  components/
    NebulaBackground.jsx   → Fixed background layer with particle drift
    Header.jsx             → Top navigation for landing page
    Sidebar.jsx            → Left sidebar for dashboard
    FeatureCard.jsx        → Reusable feature card
    StatBlock.jsx          → Stat display block
    CTAButton.jsx          → Outlined cyan glow button
    TopicTile.jsx          → Topic tile for dashboard recommended grid
    DashboardCard.jsx      → Translucent card wrapper
  pages/
    Landing.jsx        → Full landing page implementation
    Dashboard.jsx      → Full dashboard implementation
public/
  brain-hero.png       → (you provide) glowing brain + nebula, no lightning
```

## DEPENDENCIES

```bash
npm install lucide-react
```

If using Tailwind, ensure it is configured. Otherwise the provided CSS is plain CSS and works standalone.

## ASSET NOTE

The hero brain image is the visual centerpiece. Generate it separately with this prompt for best results:

> Glowing anatomical brain centered, bilateral symmetry visible, electric cyan inner luminescence, surrounded by soft ethereal blue nebula clouds billowing outward, deep navy-black background, faint particle stars scattered for depth, no lightning, no electrical arcs, no jagged energy filaments, cinematic, photorealistic, 4K, premium scientific aesthetic.

Save the result as `public/brain-hero.png`.
