// Sentry frontend initialization.
//
// Called from `main.tsx` before the custom global error listeners. It is a
// no-op when `VITE_SENTRY_DSN_FRONTEND` is not configured.
//
// Privacy: this is a clinical study app. Session Replay is intentionally NOT
// enabled (it would record on-screen answers, notes, reflections, and other
// clinical content). `sendDefaultPii: false` keeps Sentry from attaching the
// user's IP/identifiers, and `beforeSend` / `beforeBreadcrumb` strip request
// bodies, query strings, auth headers, and console logs.
import * as Sentry from "@sentry/react";

let initialized = false;

export function initSentry(): void {
  if (initialized) return;
  const dsn = import.meta.env.VITE_SENTRY_DSN_FRONTEND as string | undefined;
  if (!dsn) return;
  initialized = true;

  const release =
    typeof import.meta.env.VITE_RELEASE_ID === "string" &&
    import.meta.env.VITE_RELEASE_ID.trim()
      ? (import.meta.env.VITE_RELEASE_ID as string)
      : undefined;

  Sentry.init({
    dsn,
    environment: import.meta.env.PROD ? "production" : "development",
    release,
    sendDefaultPii: false,
    // Low-rate performance tracing; error monitoring is the priority.
    tracesSampleRate: 0.05,
    beforeSend(event) {
      const req = event.request as unknown as
        | {
            url?: string;
            query_string?: unknown;
            data?: unknown;
            headers?: Record<string, unknown>;
          }
        | undefined;
      if (req) {
        if (typeof req.url === "string") req.url = req.url.split("?")[0];
        delete req.query_string;
        delete req.data;
        if (req.headers) {
          for (const key of Object.keys(req.headers)) {
            const lower = key.toLowerCase();
            if (lower === "cookie" || lower === "authorization") {
              delete req.headers[key];
            }
          }
        }
      }
      delete event.user;
      return event;
    },
    beforeBreadcrumb(breadcrumb) {
      // Console logs may contain anything the app logged — drop entirely.
      if (breadcrumb.category === "console") return null;
      if (breadcrumb.data) {
        const data = breadcrumb.data as Record<string, unknown>;
        if (typeof data.url === "string") data.url = data.url.split("?")[0];
        // Defense-in-depth: never let request/response payloads (which can
        // carry answers, notes, reflections, or other clinical content) ride
        // along on fetch/xhr or navigation breadcrumbs.
        delete data.body;
        delete data.request_body;
        delete data.response_body;
      }
      return breadcrumb;
    },
  });
}

export { Sentry };
