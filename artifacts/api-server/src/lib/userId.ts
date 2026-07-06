import { type Request, type Response } from "express";

// Identity is derived exclusively from the verified Replit Auth (OIDC) session
// loaded onto the request by `authMiddleware()` in `src/app.ts`, which
// populates `req.user` from a server-side session in Postgres. No
// client-supplied identity header is ever trusted — see `replit.md`
// § Auth Pattern.

/**
 * Returns the verified user id for the current request, or `null` when the
 * request carries no valid session. Use this on routes that are
 * anonymous-tolerant (e.g. `/api/leaderboard`, `/api/client-errors`,
 * `/api/feedback/is-admin`) where the caller may legitimately be signed out.
 */
export function getUserId(req: Request): string | null {
  return req.user?.id ?? null;
}

/**
 * Explicit alias for routes that intentionally accept anonymous callers. Use
 * this instead of `getUserId` to signal intent at the call site.
 */
export const getOptionalUserId = getUserId;

/**
 * Returns the verified user id, or writes `401 Unauthorized` to the
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
