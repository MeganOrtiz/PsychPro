# Landing Hero Layered Drift Design

## Status

Design proposal for review. No landing-page implementation changes are included in this document.

## Goal

Make the landing hero feel clearly alive by adding calm, scroll-aware movement to
the approved teal-and-glass artwork behind the existing chrome brain. The
artwork should suggest cloud flow and glass interweaving without becoming a
full-page background, changing the hero copy, or replacing the brain's existing
breathing pulse.

## Current context

- The hero uses a pure-white ground.
- The wordmark and tagline sit above an in-flow chrome brain.
- The approved transparent teal-and-glass artwork is a hero-only layer behind
  the brain.
- The existing brain animation is a slow scale pulse and must remain intact.
- The landing page already uses an opacity/translate entrance sequence for text.
- The page clips horizontal overflow to prevent the oversized artwork from
  shifting the viewport.

## Chosen direction

Use **layered artwork drift** with scroll awareness:

1. Preserve the supplied artwork as the visual source.
2. Render a small number of clipped artwork slices or masked duplicates inside
   the existing hero artwork wrapper.
3. Give each layer a distinct, bounded transform so cloud and glass forms move
   at slightly different rates and directions.
4. Map scroll progress to a CSS custom property using a passive scroll listener
   and `requestAnimationFrame`, rather than updating React state on every scroll
   event.
5. Keep the movement centered around the brain so the artwork never leaves the
   hero composition.
6. Keep the existing brain breathing animation separate from the scroll-driven
   layers.

The intended result is visible movement while the visitor scrolls: the layered
forms should appear to slide past and through one another, not wobble or ripple
like a filter effect.

## Motion behavior

- Ambient motion remains present at rest through slow, low-amplitude keyframes.
- Scroll adds a subtle directional offset to the layers.
- The strongest offset occurs near the hero-to-next-section transition, then
  eases back toward the composition center.
- Movement uses compositor-friendly transforms and opacity only.
- No continuously animated blur, drop-shadow, or large-area filter effects.
- `prefers-reduced-motion: reduce` disables both layered drift and the existing
  brain pulse, leaving the artwork static.
- Mobile uses smaller layer offsets and avoids adding any horizontal overflow.

## Visual and product constraints

- Keep the pure-white landing background.
- Keep the approved transparent artwork's color and overall silhouette.
- Keep the chrome brain asset, size relationship, and pulse.
- Keep the current wordmark, tagline, headline, paragraph, buttons, and stats.
- Do not alter dashboards, navigation structure, or non-hero landing sections.
- Do not introduce a full-page artwork backdrop, framed hero card, or new
  decorative glow system.
- Preserve empty alt text and `aria-hidden` behavior for decorative images.

## Implementation shape

- Extend the hero artwork markup in `landing.tsx` with explicit decorative
  layer elements and a hook/effect that writes a single CSS custom property.
- Keep all visual rules scoped to `.psychpro-hero__art` and its descendants.
- Prefer CSS masking/clipping over generating a new runtime canvas or WebGL
  surface.
- If the supplied asset cannot produce clean independent slices at runtime,
  create a small set of derived transparent WebP layers from the same source
  asset; do not redraw or replace the artwork.
- Avoid adding a dependency for the effect.

## Verification

1. Run the TypeScript check for the web artifact.
2. Run the existing surface-hue and design-drift guardrails.
3. Screenshot the landing hero at desktop and mobile widths.
4. Confirm the hero remains centered and no horizontal scrollbar appears.
5. Confirm reduced-motion styling removes the movement.
6. Inspect browser logs for animation, asset, and hydration errors.
7. Confirm the landing copy and all existing controls remain unchanged.

## Acceptance criteria

- The landing hero visibly has calm cloud/glass movement tied to scroll.
- The movement reads as layered interweaving rather than a single image sliding.
- The chrome brain still breathes independently.
- The effect is stable on desktop and mobile and does not cause page overflow.
- Reduced-motion users see a static composition.
- No dashboard or non-hero landing behavior changes.