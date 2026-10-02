# Shared PsychPro / EPPP book library

## Approved direction

Add **My Library** to both web suites. Both entry points show the same collection
for the signed-in account while retaining the current suite's navigation.
Owning both subscriptions must not create duplicate book copies or cause another
charge for the same book. PsychPro and EPPP subscriptions remain separate.

## Current scope

- Use the corrected PDF at
  `deliverables/PsychPro_Foundations_in_Clinical_Psychology_Volume_1_Corrected.pdf`.
- Grant the textbook for honest website feedback of any sentiment or category.
- Let the user read or download their earned PDF from either suite's My Library.
- Keep book access independent of subscription status and subscription expiry.
- Support multiple books in the data model rather than hardcoding a single PDF.
- Do not implement paid-book checkout, change Stripe subscriptions, add EPUB
  delivery, or modify the mobile app in this change.

## Catalog and ownership

Use one shared book catalog and one shared account-owned collection. Each book
has a stable identity and metadata, including title, volume, description, cover,
and a private persistent PDF object path. Each ownership record is unique by
account and book, with its grant source and timestamp.

The database must enforce uniqueness, not just the UI. A repeated feedback
submission, concurrent request, navigation between suites, or account holding
both subscriptions must not duplicate the book. Future payment processing must
consult this same ownership record rather than create separate suite purchases.
Future books can be added to this catalog without rebuilding the two library
pages; their purchase or eligibility rules are outside this initial reward.

## Feedback and reward flow

After valid feedback is successfully saved, grant the textbook through an
idempotent operation. Saving feedback and recording ownership should be atomic
where possible, so failures cannot silently lose a message or its reward.

The response tells the client whether the book is available and whether it was
already owned. The form refreshes the shared library query and displays an
explicit **Open My Library** action that stays in the current suite.

An account with previously saved feedback can claim the same textbook once
without submitting another message. The server verifies its own saved feedback
records; it must not trust a client assertion of eligibility. Never grant a book
for a failed or invalid submission.

## Library UI

The PsychPro sidebar gains a My Library route; the EPPP sidebar gains its own
My Library tab. Both use the same book-list component and account-keyed API.
Do not replace My Decks, My Notes, or Reflections.

Show each owned book once with its cover, title, and Read PDF / Download actions.
Include useful loading, retry/error, and empty states. The empty state can direct
eligible users to claim their feedback reward, or open the existing feedback
form. Do not invent demo ownership or silently show an empty list on errors.

Use the existing white/chrome design, shared controls, and palette tokens.
Keep the owner's dashboard promotion composition and copy intact.

## Protected PDF delivery

Store PDF bytes in private App Storage; PostgreSQL stores only metadata and
ownership. Use existing Clerk identity and storage infrastructure, without
changing authentication providers.

Reading and downloading require authentication and server-side ownership
verification. A public asset URL or generic storage endpoint must not bypass
ownership checks. Protect responses from shared caching and use appropriate PDF
content headers. Do not expose private object paths in ordinary book-list data.
Downloaded PDFs can still be shared outside the app; this is not DRM.

## Verification

- Both library entry points show the same account-owned collection.
- Feedback grants the reward once, including concurrent/repeated submissions.
- An account with both subscriptions sees one copy; no billing call is involved.
- Previously submitted feedback enables one idempotent claim.
- Ownership remains after refresh and subscription changes.
- The PDF opens/downloads correctly; another account and signed-out callers are
  denied, including through alternate storage paths.
- Navigation and the feedback success action retain the active suite.
- Account deletion handles ownership records safely.
- New routes are classified in the route-auth matrix; type checks and design
  guardrails pass.
- Clearly distinguish real persistence tests from mocked browser responses if
  the external Clerk instance blocks programmatic test sign-in.