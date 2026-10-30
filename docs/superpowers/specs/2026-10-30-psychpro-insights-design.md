# PsychPro Owner Insights — Design

**Status:** Approved design direction; awaiting owner review of this specification
**Date:** 2026-10-30

## Summary

Add a private, first-party insights dashboard to the existing PsychPro web app. It will give the owner an overview of anonymous site traffic, new app accounts, suite-specific free-trial starts, and successful paid conversions for PsychPro and EPPP.

The approved visual direction is **Overview first**: headline totals, a short traffic/signup trend, and a separate PsychPro/EPPP conversion comparison. All values must come from production data and be labeled with the selected reporting period.

## Goals

- Show unique-browser estimates and pageviews.
- Show new app accounts, PsychPro trial starts, EPPP trial starts, and completed initial paid checkouts.
- Keep PsychPro and EPPP figures distinct.
- Restrict both the page and its API to the verified primary email `admin@psychprosuite.com`.
- Keep tracking first-party and low-friction: no CAPTCHA or “are you human” challenge.
- Keep analytics failures from interrupting normal site use.

## Non-goals

- User-level activity history, names, emails, or account-level drilldowns.
- Revenue reporting, subscription renewal counts, marketing attribution, or exports.
- Tracking lesson content, study answers, or detailed signed-in navigation.
- Reconstructing historical anonymous visitors or inferring unrecorded historical payments.
- A mobile insights screen.

## Page and navigation

- Add one owner-only Insights page to the existing PsychPro web app, with a link in the existing admin navigation.
- Default the reporting window to the last 30 days. Provide 7-, 30-, 90-, and 365-day windows.
- The overview contains headline measures for unique browsers, pageviews, new app accounts, trial starts, and paid conversions. A compact trend and a separate PsychPro/EPPP comparison provide context.
- Present aggregate values only. Do not expose individual event rows or identifiers.
- Include a freshness indicator so the owner can tell when the data was last updated.

## Metric definitions and sources

| Metric | Definition and source |
| --- | --- |
| Unique visitors | Distinct anonymous first-party browser identifiers during the selected window. This is a browser estimate, not a count of identifiable people. |
| Pageviews | Accepted pageview events during the selected window, grouped by a broad, allowlisted route category. |
| New app accounts | First creation of a PsychPro `users` row, using `users.createdAt`. Rows are created on first authenticated app access, so this measures accounts that reached the app, not abandoned Clerk registrations or the exact Clerk account-creation time. |
| PsychPro trials | Server-stamped `users.psychproTrialStartedAt` values. |
| EPPP trials | Server-stamped `users.epppPromoRedeemedAt` values. The current access model uses this field as the EPPP seven-day trial start marker. |
| Paid conversions | Successful initial Checkout Sessions, grouped by suite and plan category. Count only when Stripe confirms payment; do not count subscription renewals as new conversions. |

The client-side `trial_started` event is useful for diagnostics, but is not the source of truth for trial totals. Trial totals come from the server-owned account timestamps.

## Data flow and storage

### Anonymous traffic

1. The browser sends a pageview to a first-party API endpoint.
2. On first use, the server issues a random opaque browser identifier in a first-party cookie with a 13-month lifetime. It does not use device fingerprinting or associate this identifier with a signed-in account.
3. The server accepts only an allowlisted route category: landing, plans, authentication, onboarding, PsychPro, EPPP, or other. It does not store the exact URL.
4. Store only the anonymous identifier, route category, and event timestamp. Do not store emails, account IDs, IP addresses, user-agent strings, query strings, referrers, or page content.
5. Apply the existing shared rate-limiting approach to this public endpoint. Ignore obvious automated crawlers where detectable without retaining their identifying headers.
6. Retain raw anonymous events for 13 months, then remove them. Enable collection only in production; preview and development activity must not pollute published metrics.

The privacy disclosure should describe this first-party, anonymous measurement before collection is enabled on the published site. No blocking challenge or new consent modal is part of this feature.

### Accounts and trials

Aggregate account and trial totals from existing server-owned `users` records. Do not copy these business events into the anonymous pageview stream.

### Paid conversions

The current Stripe webhook updates entitlements but does not persist a general history of successful paid conversions. Add a small conversion ledger written by the existing Checkout Session webhook path:

- Record a session only after Stripe reports a successful payment.
- Store the Checkout Session ID, suite, plan category, and paid timestamp; use the session ID as a uniqueness key so webhook redelivery cannot double-count.
- Do not store email or a user identifier in this ledger.
- Do not count renewals as new conversions.

Historical visitor data cannot be backfilled. New paid-conversion history begins when the ledger is deployed. Existing account and trial dates may be included from their current database fields; do not infer past paid conversions from an account’s current subscription status.

## Access control

- Require a signed-in Clerk session.
- Require the verified primary email to match `admin@psychprosuite.com` exactly.
- Enforce this owner-specific check on both the page and every insights API request. A hidden navigation link is not an access control.
- Do not rely on the generic `isAdmin` flag alone; the existing generic admin gate can also admit other explicitly granted administrators.
- Return aggregate results only.

## API boundary

- `POST /analytics/pageview`: anonymous, rate-limited ingestion endpoint. Validate route category and payload shape; ignore unexpected fields.
- `GET /admin/insights`: owner-only aggregate endpoint. Accept only the supported reporting windows and return aggregate counts, suite splits, date boundaries, and freshness metadata.

The pageview endpoint must respond safely when tracking is disabled or unavailable. It must not be used to grant access, create accounts, or update billing.

## Error and loading behavior

- Pageview requests are asynchronous and best-effort. Their failure must not block navigation, onboarding, or study activity.
- Show a stable loading state while aggregates load.
- If one source fails, show which metric group could not be loaded; do not display a fabricated zero.
- Show an explicit empty state when the selected period has no events.
- Reject invalid reporting windows and malformed events without returning sensitive details.

## Verification

- Verify the owner’s verified primary email can open the page and fetch aggregates.
- Verify anonymous requests, other signed-in users, and users with only a generic admin flag cannot fetch insights.
- Verify pageview payload validation, route allowlisting, shared rate limits, and that pageview failures do not interrupt the app.
- Verify unique-browser and pageview aggregation for each supported window, including date-boundary behavior.
- Verify account and both suite-trial totals use the correct database fields.
- Verify only successful initial payments are counted and duplicate Stripe webhook delivery creates one conversion.
- Verify the API response and logs contain no email, account ID, IP address, user-agent string, query string, or lesson-level data.
- Verify loading, empty, partial-source-error, and mobile-width layouts.

## Acceptance criteria

1. The owner can open a readable overview dashboard in the PsychPro web app.
2. The dashboard reports anonymous unique browsers and pageviews separately from account, trial, and payment metrics.
3. PsychPro and EPPP trial and paid-conversion totals remain separate.
4. Only a session with verified primary email `admin@psychprosuite.com` can access the page or aggregate endpoint.
5. Event collection is first-party, production-only, rate-limited, and does not block the site.
6. Duplicate payment webhook delivery cannot inflate completed paid conversions.
7. Metrics use explicit definitions and report missing data as an error rather than zero.
