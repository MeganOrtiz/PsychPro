# Paid plans page color tuning

## Problem

The paid plans page uses the suite-switch turquoise token for featured borders,
checkmarks, badges, hover, focus, and checkout-loading states. Its current hue
reads green on this page.

## Approved direction

- Keep the plan panels and cards neutral silver/white with dark, readable text.
- Replace the green-leaning accent with the existing brighter blue-cyan token
  for featured-plan emphasis and interactive states.
- Keep plan copy, prices, layout, and payment behavior unchanged.

## Implementation

Scope the retone to `PaidPlansView` styles. Reuse the existing promo blue-cyan
token and its RGB channels instead of adding raw color values or changing
site-wide palette tokens.

## Verification

- Confirm no suite-switch turquoise token remains in the paid plans stylesheet.
- Run web typecheck and both visual guardrails.
- Inspect the plans UI at desktop and mobile widths for readable contrast and
  preserved layout.
