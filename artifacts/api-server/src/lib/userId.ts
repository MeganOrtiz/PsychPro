import { type Request, type Response } from "express";

// Server-side authentication has been removed. Routes identify the caller by
// reading a plain `X-User-Id` request header. NO validation is performed —
// the value is whatever the client sent. Re-add a real auth layer (token
// verification, session lookup, signature check) before trusting this in
// production with untrusted clients.
export const USER_ID_HEADER = "x-user-id";

export function getUserId(req: Request): string | null {
  const raw = req.header(USER_ID_HEADER);
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

// Helper for routes that previously rejected with 401 when no user identity
// was present. The 401 has been intentionally replaced with a 400 because
// the server is no longer performing authentication — the missing value is
// now a missing required input header, not an unauthenticated session.
export function requireUserId(req: Request, res: Response): string | null {
  const userId = getUserId(req);
  if (!userId) {
    res.status(400).json({ error: `Missing ${USER_ID_HEADER} header` });
    return null;
  }
  return userId;
}
