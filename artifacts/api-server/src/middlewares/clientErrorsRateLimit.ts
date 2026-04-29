import { type Request, type Response, type NextFunction } from "express";

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 30;
const MAX_TRACKED_KEYS = 10_000;

const hits = new Map<string, number[]>();

function getClientKey(req: Request): string {
  // `req.ip` is derived by Express via the `proxy-addr` package using the
  // app's `trust proxy` setting (configured to 1 in app.ts). With one trusted
  // hop, this returns the address the immediate proxy reports as the client,
  // which clients cannot forge by sending their own X-Forwarded-For header.
  // We deliberately do NOT read X-Forwarded-For directly from headers here.
  return req.ip ?? req.socket.remoteAddress ?? "unknown";
}

function pruneOldest(): void {
  if (hits.size <= MAX_TRACKED_KEYS) return;
  const oldestKey = hits.keys().next().value;
  if (oldestKey !== undefined) hits.delete(oldestKey);
}

export function clientErrorsRateLimit(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const key = getClientKey(req);
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  const existing = hits.get(key) ?? [];
  const recent = existing.filter((ts) => ts > windowStart);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldest = recent[0] ?? now;
    const retryAfterSec = Math.max(1, Math.ceil((oldest + WINDOW_MS - now) / 1000));
    res.setHeader("Retry-After", String(retryAfterSec));
    res.status(429).json({ error: "Too many client error reports" });
    hits.set(key, recent);
    return;
  }

  recent.push(now);
  hits.set(key, recent);
  pruneOldest();
  next();
}
