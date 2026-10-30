import {
  bigserial,
  index,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * Minimal, anonymous pageview events. The browser identifier is random,
 * browser-scoped, and is never joined to an account.
 */
export const anonymousPageviewsTable = pgTable(
  "anonymous_pageviews",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    browserId: text("browser_id").notNull(),
    routeCategory: text("route_category").notNull(),
    occurredAt: timestamp("occurred_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("anonymous_pageviews_occurred_at_idx").on(table.occurredAt),
    index("anonymous_pageviews_browser_occurred_idx").on(
      table.browserId,
      table.occurredAt,
    ),
  ],
);

/**
 * Counts each successful initial Stripe Checkout Session once. No account,
 * email, or customer identifiers are stored in this aggregate ledger.
 */
export const paidConversionLedgerTable = pgTable(
  "paid_conversion_ledger",
  {
    checkoutSessionId: text("checkout_session_id").primaryKey(),
    suite: text("suite").notNull(),
    planCategory: text("plan_category").notNull(),
    paidAt: timestamp("paid_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    index("paid_conversion_ledger_paid_at_idx").on(table.paidAt),
    index("paid_conversion_ledger_suite_paid_at_idx").on(
      table.suite,
      table.paidAt,
    ),
  ],
);
