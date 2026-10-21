# Check It Out dashboard preview crops

## Goal

Shorten the first computer/dashboard preview on both public Check It Out tours so visitors can reach the tour content sooner, while keeping the dashboard wide and recognizable.

## Approved design

- Keep the current laptop frame width, dashboard styling, and real read-only dashboard content.
- In the opening preview only, show a shorter, top-anchored viewport of the dashboard. The approved comparison uses a crop around 48.75% of the dashboard's base width, preserving the same crop proportion as the visual mockup.
- Apply the same treatment to PsychPro and EPPP.
- Keep the remaining tour stops, page copy, navigation, calls to action, and dashboard content unchanged.

## Implementation shape

The dashboard iframe currently measures its full rendered content, and its wrapper uses that full height. Add an optional visible-height limit to the shared live preview frame. When the limit is present, retain the full iframe height and let the existing overflow-hidden wrapper clip the lower portion; keep the crop anchored at the top. Pass the limit only to the two opening dashboard previews. Other live-frame uses retain their current full-content sizing.

## Responsive behavior and accessibility

Scale the visible crop together with the existing frame width so its proportions remain consistent on narrower screens. Preserve the laptop shell and the dashboard's existing top content. Keep the iframe inert and hidden from assistive technology as it is now; do not add interactive controls or alter the embedded dashboards.

## Verification

- Confirm each suite's opening dashboard is shorter and remains top-aligned.
- Confirm later tour previews retain their full-height behavior.
- Check the public tour at desktop and mobile widths for clipped laptop chrome, horizontal overflow, or an excessively small dashboard.
- Run the neuronotes typecheck/build and inspect both public tour routes.

## Scope exclusions

No dashboard redesign, content change, iframe data/query change, or edit to the remainder of either tour.
