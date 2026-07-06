import type { Request, Response, NextFunction } from "express";
import { getUserId } from "../lib/userId";

/**
 * Authenticated route guard. Mount on any route that requires a signed-in
 * user. Reads the identity populated by `authMiddleware()` (mounted globally
 * in `app.ts`) and rejects with 401 when no user is present.
 *
 * After this middleware succeeds, `req.authUserId` holds the verified user id
 * for the request handler to use.
 */
export interface AuthedRequest extends Request {
  authUserId?: string;
}

export function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
): void {
  const userId = getUserId(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  req.authUserId = userId;
  next();
}
