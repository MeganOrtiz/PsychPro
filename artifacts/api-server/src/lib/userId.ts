import { type Request, type Response } from "express";
import { getAuth } from "@clerk/express";

// The legacy `X-User-Id` header name is kept for backwards-compatible logging
// only. Identity is now derived from the verified Clerk session token (set on
// the request by `clerkMiddleware()` in `src/app.ts`) — the header itself is
// no longer read for any authorization decision.
export const USER_ID_HEADER = "x-user-id";

/**
 * Returns the verified Clerk user id for the current request, or `null` when
 * the request carries no valid Clerk session. Use this on routes that are
 * anonymous-tolerant (e.g. `/api/leaderboard`, `/api/client-errors`,
 * `/api/feedback/is-admin`) where the caller may legitimately be signed out.
 */
export function getUserId(req: Request): string | null {
  try {
    const auth = getAuth(req);
    return auth.userId ?? null;
  } catch {
    // `getAuth` throws if `clerkMiddleware` has not run on this request.
    // Treat that as "no verified caller" rather than crashing the route.
    return null;
  }
}

/**
 * Explicit alias for routes that intentionally accept anonymous callers. Use
 * this instead of `getUserId` to signal intent at the call site.
 */
export const getOptionalUserId = getUserId;

/**
 * Returns the verified Clerk user id, or writes `401 Unauthorized` to the
 * response and returns `null`. Use this on every protected route — never
 * trust client-supplied identity headers.
 */
export function requireUserId(req: Request, res: Response): string | null {
  const userId = getUserId(req);
  if (!userId) {
    res.status(401).json({ error: "Authentication required" });
    return null;
  }
  return userId;
}
