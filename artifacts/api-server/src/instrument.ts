// Sentry backend initialization.
//
// Imported FIRST in `index.ts` (before `./app`) so the SDK is set up before
// the rest of the server module graph runs. It is a no-op when
// `SENTRY_DSN_BACKEND` is not configured, so dev/test environments without a
// DSN behave exactly as before.
//
// Privacy: this is a clinical study app. We never want user identities or any
// user-entered / clinical content (answers, notes, reflections, study text) to
// leave the server. `sendDefaultPii: false` keeps Sentry from attaching IPs,
// cookies, and user identifiers, and `beforeSend` / `beforeBreadcrumb` strip
// request bodies, query strings, auth headers, and console logs as a second
// line of defense.
import * as Sentry from "@sentry/node";

const dsn = process.env.SENTRY_DSN_BACKEND;

if (dsn) {
  Sentry.init({
    dsn,
    environment:
      process.env.NODE_ENV === "production" ? "production" : "development",
    sendDefaultPii: false,
    // Low-rate performance tracing; error monitoring is the priority.
    tracesSampleRate: 0.05,
    beforeSend(event) {
      const req = event.request as unknown as
        | {
            data?: unknown;
            cookies?: unknown;
            query_string?: unknown;
            url?: string;
            headers?: Record<string, unknown>;
          }
        | undefined;
      if (req) {
        // Request body, cookies, and query string can all carry
        // user-entered or clinical content — drop them.
        delete req.data;
        delete req.cookies;
        delete req.query_string;
        if (typeof req.url === "string") req.url = req.url.split("?")[0];
        if (req.headers) {
          for (const key of Object.keys(req.headers)) {
            const lower = key.toLowerCase();
            if (lower === "authorization" || lower === "cookie") {
              delete req.headers[key];
            }
          }
        }
      }
      // Never attach the resolved user object.
      delete event.user;
      return event;
    },
    beforeBreadcrumb(breadcrumb) {
      // Console logs may contain anything the app logged — drop entirely.
      if (breadcrumb.category === "console") return null;
      if (breadcrumb.data) {
        const data = breadcrumb.data as Record<string, unknown>;
        if (typeof data.url === "string") data.url = data.url.split("?")[0];
        delete data.body;
      }
      return breadcrumb;
    },
  });
}
