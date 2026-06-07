// Route-auth matrix test
// =====================================================================
// Walks the actual express app's router stack to discover every
// `(METHOD, /api/...)` route the server registers, and asserts that each
// one's response to an UNAUTHENTICATED request matches the documented
// expectation in `replit.md` § Auth Pattern and `threat_model.md`:
//
//   - PROTECTED   → unauthenticated calls MUST return 401
//   - ANONYMOUS   → unauthenticated calls MUST NOT return 401
//                   (any non-401 status is acceptable; we only care that
//                    the route did NOT auth-gate the caller)
//   - SPECIAL     → out-of-band auth schemes (Stripe webhook signature)
//                   that are verified separately
//
// The test ALSO fails if route discovery surfaces a `(METHOD, path)` pair
// that is not classified in any of the three maps. That is the drift
// alarm: any time a new route is added or an existing one moved between
// classes without updating the maps, this test fails loudly and forces
// the docs to stay in sync with the code.
//
// We do NOT need real Clerk credentials to exercise this. Without an
// `Authorization` header (or Clerk cookie), `clerkMiddleware()` leaves
// `getAuth(req).userId` null, `requireUserId(req, res)` writes 401 and
// `getOptionalUserId(req)` returns null. That is exactly the behaviour
// we want to assert.

import type { AddressInfo } from "node:net";
import type { IRouter, RequestHandler } from "express";

class AssertionError extends Error {}
function assert(cond: unknown, message: string): asserts cond {
  if (!cond) throw new AssertionError(message);
}

// ---------------------------------------------------------------------
// Expected classifications. Keep these in sync with the route files and
// with `replit.md` § Auth Pattern. If you change a route's auth posture
// or add/remove a route, update these sets — the discovery walker will
// fail loudly if you forget.
// ---------------------------------------------------------------------

const PROTECTED = new Set<string>([
  // users
  "GET /api/users/profile",
  "POST /api/users/profile",
  "GET /api/users/usage",
  "POST /api/users/usage",
  // progress / dashboard / attempts
  "GET /api/progress",
  "GET /api/progress/:topicId",
  "POST /api/progress/:topicId",
  "GET /api/dashboard/summary",
  "POST /api/quiz-attempts",
  "POST /api/exam-attempts",
  // course mastery exam
  "GET /api/courses/:category/mastery-status",
  "GET /api/courses/:category/mastery-exam",
  "POST /api/course-mastery-attempts",
  // topic content (auth-gated behind free-tier entitlements)
  "GET /api/topics/:topicId/flashcards",
  "GET /api/topics/:topicId/quizzes",
  "GET /api/topics/:topicId/practice-exam",
  // users (account management + admin)
  "DELETE /api/users/me",
  "DELETE /api/users/:userId",
  "GET /api/users/duplicates",
  "GET /api/users/entitlements",
  // subscription
  "POST /api/subscription/checkout",
  "POST /api/subscription/portal",
  "GET /api/subscription/status",
  // topics (study-guide is the only protected topic route)
  "GET /api/topics/:topicId/study-guide",
  // feedback (submit + admin list/patch)
  "POST /api/feedback",
  "GET /api/feedback",
  "PATCH /api/feedback/:id/status",
  // custom decks
  "GET /api/custom-decks",
  "POST /api/custom-decks",
  "GET /api/custom-decks/:id",
  "GET /api/custom-decks/:id/flashcards",
  "GET /api/custom-decks/:id/quiz",
  "GET /api/custom-decks/:id/cloze",
  "DELETE /api/custom-decks/:id",
  // storage uploads
  "POST /api/storage/uploads/request-url",
  // profile
  "GET /api/profile/me",
  "PATCH /api/profile/me",
  // featured-work
  "POST /api/featured-work",
  "GET /api/featured-work/mine",
  "GET /api/admin/featured-work",
  "PATCH /api/admin/featured-work/:id",
  // notifications
  "GET /api/notifications",
  "PATCH /api/notifications/:id/read",
  // connections (user + admin)
  "GET /api/connections/suggestions",
  "POST /api/connections/requests",
  "GET /api/connections/incoming",
  "POST /api/connections/requests/:id/respond",
  "GET /api/admin/connections/stats",
  "POST /api/admin/connections/audit",
  // admin tokens (MCP shared-secret bearer; 401 without it)
  "GET /api/admin/tokens",
  "POST /api/admin/tokens",
  "DELETE /api/admin/tokens/:id",
  // MCP JSON-RPC POST (OAuth or admin bearer; 401 without)
  "POST /api/mcp",
]);

const ANONYMOUS = new Set<string>([
  // health
  "GET /api/healthz",
  // topics (read-only catalog)
  "GET /api/topics",
  "GET /api/topics/:topicId",
  // client error reporter (anonymous-tolerant, rate-limited)
  "POST /api/client-errors",
  // leaderboard
  "GET /api/leaderboard",
  // feedback admin-flag probe (returns {isAdmin:false} for anon)
  "GET /api/feedback/is-admin",
  // profile public view
  "GET /api/profile/public/:userId",
  // featured-work public surfaces
  "GET /api/featured-work",
  "GET /api/featured-work/spotlight",
  "GET /api/featured-work/:id",
  // storage public/optional reads
  "GET /api/storage/public-objects/*filePath",
  "GET /api/storage/objects/*path",
  // subscription plans (catalog)
  "GET /api/subscription/plans",
  // admin status (boolean: is the MCP admin secret configured?)
  "GET /api/admin/status",
  // OAuth dynamic-registration + auth code flow (public by design)
  "POST /api/oauth/register",
  "GET /api/oauth/authorize",
  "POST /api/oauth/token",
  // OAuth discovery documents (public by design — clients fetch these
  // unauthenticated to discover the auth server / protected-resource metadata)
  "GET /api/.well-known/oauth-authorization-server",
  "GET /api/.well-known/oauth-protected-resource",
  "GET /api/.well-known/oauth-protected-resource/api/mcp",
  // MCP transport stubs (return 405; not auth-gated, just method-rejected)
  "GET /api/mcp",
  "DELETE /api/mcp",
]);

// Routes that authenticate out-of-band (NOT via Clerk session). Exercising
// them without their out-of-band credential is expected to return
// something other than 401 — we still enumerate them so discovery does
// not flag them as drift.
const SPECIAL = new Map<string, { expectedStatuses: number[]; reason: string }>([
  [
    "POST /api/stripe/webhook",
    {
      // 400 when STRIPE_WEBHOOK_SECRET is configured but no signature is
      // supplied; 400 with "Webhook secret not configured" when it is not.
      // Either way the webhook auth is signature-based, not Clerk.
      expectedStatuses: [400],
      reason: "Stripe webhook is signature-verified, not Clerk-gated.",
    },
  ],
]);

// Root-level (non-/api) routes app.ts registers when MCP is enabled.
const ROOT_ANONYMOUS = new Set<string>([
  "GET /.well-known/oauth-authorization-server",
  "GET /.well-known/oauth-protected-resource",
  "GET /.well-known/oauth-protected-resource/api/mcp",
]);

// ---------------------------------------------------------------------
// Discover every (METHOD, fullPath) pair the live express app registers.
// ---------------------------------------------------------------------

interface RouteLayer {
  route?: {
    path: string | string[];
    stack: { method?: string; handle: RequestHandler }[];
    methods?: Record<string, boolean>;
  };
  name?: string;
  handle?: unknown;
}

interface StackOwner {
  stack: RouteLayer[];
}

// In express 5 the layer that backs `app.use("/api", subRouter)` no longer
// exposes `.regexp` or `.path` — only an opaque `matchers` array. There is
// therefore no portable way to recover a mount prefix from a layer.
//
// We handle this with a two-tier strategy:
//
//   1. `knownPrefixes` maps a router instance (by reference identity) to
//      its mount prefix. Today only the top-level API router is in here
//      (`app.use("/api", apiRouter)` in src/app.ts).
//   2. Anything else — typically the per-feature child routers that
//      `routes/index.ts` composes via `router.use(childRouter)` with no
//      path — is treated as mounted at "" and walked recursively. That
//      matches express's behaviour for the no-prefix overload.
//
// The "Registered but NOT classified" drift check below catches any
// surprise: if a new feature router is ever mounted at a non-empty prefix
// without being added here, its routes will appear under the wrong path
// (or be misclassified) and the test will fail loudly.
async function buildKnownPrefixes(): Promise<Map<unknown, string>> {
  const apiRouter = (await import("../src/routes")).default;
  return new Map<unknown, string>([[apiRouter, "/api"]]);
}

function collectRouteFromLayer(
  layer: RouteLayer,
  prefix: string,
  out: Map<string, string>,
): void {
  const route = layer.route;
  if (!route) return;
  const paths = Array.isArray(route.path) ? route.path : [route.path];
  const methodsFromStack = route.stack
    .map((l) => l.method?.toUpperCase())
    .filter((m): m is string => Boolean(m));
  const methods = methodsFromStack.length > 0
    ? Array.from(new Set(methodsFromStack))
    : Object.keys(route.methods ?? {}).map((m) => m.toUpperCase());
  for (const p of paths) {
    const full = `${prefix}${p}`.replace(/\/+/g, "/");
    for (const method of methods) {
      out.set(`${method} ${full}`, full);
    }
  }
}

function walk(
  owner: StackOwner,
  prefix: string,
  knownPrefixes: Map<unknown, string>,
  out: Map<string, string>,
  unknownMounts: string[],
): void {
  for (const layer of owner.stack) {
    if (layer.route) {
      collectRouteFromLayer(layer, prefix, out);
      continue;
    }
    // A nested router exposes itself as a function with its own `.stack`.
    const handle = layer.handle as (StackOwner & { stack?: RouteLayer[] }) | undefined;
    if (handle && typeof handle === "function" && Array.isArray(handle.stack)) {
      const mountedAt = knownPrefixes.get(handle) ?? "";
      walk(handle, `${prefix}${mountedAt}`, knownPrefixes, out, unknownMounts);
    }
  }
}

// ---------------------------------------------------------------------
// Substitute path params / wildcards with sample values so the URL is
// resolvable. The actual values don't matter — every route we test
// either returns 401 (PROTECTED) before consulting the db OR is
// expected to return a non-401 status which can be anything 2xx-5xx.
// ---------------------------------------------------------------------
function concretizePath(p: string): string {
  return p
    .replace(/\*([A-Za-z_][A-Za-z0-9_]*)/g, "sample.png")
    .replace(/:([A-Za-z_][A-Za-z0-9_]*)\??/g, "sample");
}

// Bodies for POST/PATCH/PUT/DELETE need to parse, but the route handlers
// we expect to return 401 do so BEFORE inspecting the body, so an empty
// JSON object is enough.
const BODY_METHODS = new Set(["POST", "PATCH", "PUT", "DELETE"]);

// ---------------------------------------------------------------------
// Boot the app on an ephemeral port and exercise every route.
// ---------------------------------------------------------------------

async function main(): Promise<void> {
  process.env.MCP_ENABLED = process.env.MCP_ENABLED ?? "true";
  process.env.NODE_ENV = process.env.NODE_ENV ?? "test";

  const appModule = await import("../src/app");
  const app = appModule.default;

  // Express 5 attaches the root router as `app.router`; earlier versions
  // used `app._router`. Prefer whichever is present.
  const rootRouter = (app as unknown as { router?: IRouter; _router?: IRouter }).router
    ?? (app as unknown as { _router?: IRouter })._router;
  assert(rootRouter, "express app has no root router (.router / ._router)");
  // Force lazy initialisation of the router (express 5 builds it on first
  // request). `app._router` may be undefined until then.
  if (!(rootRouter as unknown as StackOwner).stack) {
    (app as unknown as { lazyrouter?: () => void }).lazyrouter?.();
  }

  const knownPrefixes = await buildKnownPrefixes();
  const discovered = new Map<string, string>();
  const unknownMounts: string[] = [];
  walk(
    rootRouter as unknown as StackOwner,
    "",
    knownPrefixes,
    discovered,
    unknownMounts,
  );
  if (unknownMounts.length > 0) {
    throw new AssertionError(
      `Discovered sub-router(s) the matrix walker doesn't know how to prefix: ${unknownMounts.join(", ")}. Add them to buildKnownPrefixes() in test/routeAuthMatrix.test.ts.`,
    );
  }

  const allClassified = new Set<string>([
    ...PROTECTED,
    ...ANONYMOUS,
    ...ROOT_ANONYMOUS,
    ...SPECIAL.keys(),
  ]);

  // Drift check #1: every classified route must actually be registered.
  const missing: string[] = [];
  for (const key of allClassified) {
    if (!discovered.has(key)) missing.push(key);
  }
  // Drift check #2: every discovered route must be classified.
  const unclassified: string[] = [];
  for (const key of discovered.keys()) {
    if (!allClassified.has(key)) unclassified.push(key);
  }

  if (missing.length > 0 || unclassified.length > 0) {
    console.error("Route-auth matrix drift detected.");
    if (missing.length > 0) {
      console.error(
        `\nClassified but NOT registered (${missing.length}):\n  - ${missing.sort().join("\n  - ")}`,
      );
    }
    if (unclassified.length > 0) {
      console.error(
        `\nRegistered but NOT classified (${unclassified.length}):\n  - ${unclassified.sort().join("\n  - ")}\n\nAdd each to PROTECTED, ANONYMOUS, ROOT_ANONYMOUS, or SPECIAL in test/routeAuthMatrix.test.ts.`,
      );
    }
    throw new AssertionError("Route classification is out of sync with registered routes.");
  }

  // Spin up an HTTP server on an ephemeral port so we can issue real
  // requests through the full middleware stack (including clerkMiddleware).
  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once("listening", () => resolve()));
  const addr = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${addr.port}`;

  const failures: string[] = [];
  let checked = 0;

  async function hit(method: string, registeredPath: string): Promise<number> {
    const url = `${baseUrl}${concretizePath(registeredPath)}`;
    const init: RequestInit = { method, redirect: "manual" };
    if (BODY_METHODS.has(method)) {
      init.headers = { "Content-Type": "application/json" };
      init.body = "{}";
    }
    const r = await fetch(url, init);
    // Drain the body so the connection can be released.
    await r.arrayBuffer().catch(() => undefined);
    return r.status;
  }

  try {
    for (const key of [...PROTECTED].sort()) {
      const [method, ...rest] = key.split(" ");
      const path = rest.join(" ");
      const status = await hit(method, path);
      checked++;
      if (status !== 401) {
        failures.push(
          `[PROTECTED] ${key} → expected 401, got ${status}. ` +
          `An unauthenticated request slipped past the auth gate.`,
        );
      }
    }

    for (const key of [...ANONYMOUS, ...ROOT_ANONYMOUS].sort()) {
      const [method, ...rest] = key.split(" ");
      const path = rest.join(" ");
      const status = await hit(method, path);
      checked++;
      if (status === 401) {
        failures.push(
          `[ANONYMOUS] ${key} → got 401, expected anything else. ` +
          `An anonymous-tolerant route is now auth-gated.`,
        );
      }
    }

    for (const [key, { expectedStatuses, reason }] of SPECIAL) {
      const [method, ...rest] = key.split(" ");
      const path = rest.join(" ");
      const status = await hit(method, path);
      checked++;
      if (!expectedStatuses.includes(status)) {
        failures.push(
          `[SPECIAL] ${key} → got ${status}, expected one of ${expectedStatuses.join("/")}. ${reason}`,
        );
      }
    }
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }

  if (failures.length > 0) {
    console.error(`\nRoute-auth matrix: ${failures.length} failure(s):`);
    for (const f of failures) console.error(`  - ${f}`);
    throw new AssertionError(`${failures.length} route(s) failed the auth-matrix check.`);
  }

  console.log(
    `routeAuthMatrix: OK — verified ${checked} route(s) ` +
    `(${PROTECTED.size} protected, ${ANONYMOUS.size + ROOT_ANONYMOUS.size} anonymous, ${SPECIAL.size} special).`,
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.stack ?? err.message : err);
  process.exit(1);
});
