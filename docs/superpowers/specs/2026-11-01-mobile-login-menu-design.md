# Mobile landing login menu

## Problem

The landing-page login menu is designed to open on desktop hover. Its trigger
and menu both start a 180 ms close timer on `pointerleave`, regardless of
pointer type. On a touch-emulated phone, tapping the trigger opens the menu and
then emits `pointerleave` for the touch pointer; the menu closes before the user
can choose a suite.

## Approved behavior

- Preserve the current desktop hover interaction.
- On phones and other touch devices, the first tap on **LOG IN** opens the
  suite choices.
- Keep those choices open until the user selects **PsychPro** or **EPPP
  Mastery Suite**, or taps outside the menu.
- Keep keyboard activation and focus behavior intact.
- Do not change labels, styling, routes, authentication, or trial state.

## Implementation approach

Make the existing pointer-leave close behavior mouse-only. Touch pointer-leave
must not schedule an automatic close. Keep the dropdown's existing selection
and outside-interaction behavior, so suite links still navigate and dismiss the
menu normally.

## Verification

- At a phone-sized viewport with touch enabled, tap **LOG IN** and confirm the
  menu remains open beyond the current 180 ms close window.
- Tap each suite option and confirm it navigates to that suite's existing login
  route.
- Tap outside the open menu and confirm it closes.
- Use a mouse to confirm hover still opens the menu and moving to an option
  keeps it open.
- Run the web typecheck and inspect the public landing page.
