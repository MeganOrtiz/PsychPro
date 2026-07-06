import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";

/**
 * Clerk-authenticated route guard. Mount on any route that requires a
 * signed-in Clerk user. Reads the auth context populated by
 * `clerkMiddleware()` (mounted globally in `app.ts`) and rejects with 401
 * when no `userId` is present.
 *
 * After this middleware succeeds, `req.clerkUserId` holds the Clerk user id
 * for the request handler to use.
 */
export interface ClerkAuthedRequest extends Request {
  clerkUserId?: string;
}

export function requireAuth(
  req: ClerkAuthedRequest,
  res: Response,
  next: NextFunction,
): void {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  req.clerkUserId = userId;
  next();
}
