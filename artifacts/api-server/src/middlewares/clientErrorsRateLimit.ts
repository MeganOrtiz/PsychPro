import { type Request, type Response, type NextFunction } from "express";
import { getAuth } from "@clerk/express";

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 30;
const MAX_TRACKED_KEYS = 10_000;

interface ClientState {
  hits: number[];
  warnedAt?: number;
}

const state = new Map<string, ClientState>();

function getClientKey(req: Request): string {
  // `req.ip` is derived by Express via the `proxy-addr` package using the
  // app's `trust proxy` setting (configured to 1 in app.ts). With one trusted
  // hop, this returns the address the immediate proxy reports as the client,
  // which clients cannot forge by sending their own X-Forwarded-For header.
  // We deliberately do NOT read X-Forwarded-For directly from headers here.
  return req.ip ?? req.socket.remoteAddress ?? "unknown";
}

function pruneOldest(): void {
  if (state.size <= MAX_TRACKED_KEYS) return;
  const oldestKey = state.keys().next().value;
  if (oldestKey !== undefined) state.delete(oldestKey);
}

function getAuthUserIdSafe(req: Request): string | null {
  try {
    return getAuth(req).userId ?? null;
  } catch {
    return null;
  }
}

export function clientErrorsRateLimit(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const key = getClientKey(req);
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  const existing = state.get(key) ?? { hits: [] };
  const recent = existing.hits.filter((ts) => ts > windowStart);
  const warnedAt = existing.warnedAt;
  const warnedThisWindow = warnedAt !== undefined && warnedAt > windowStart;

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldest = recent[0] ?? now;
    const retryAfterSec = Math.max(1, Math.ceil((oldest + WINDOW_MS - now) / 1000));
    res.setHeader("Retry-After", String(retryAfterSec));
    res.status(429).json({ error: "Too many client error reports" });

    let nextWarnedAt = warnedThisWindow ? warnedAt : undefined;
    if (!warnedThisWindow) {
      const userAgent = req.headers["user-agent"] ?? null;
      const userId = getAuthUserIdSafe(req);
      req.log.warn(
        {
          clientErrorsRateLimit: {
            ip: key,
            userAgent,
            userId,
            windowMs: WINDOW_MS,
            limit: MAX_REQUESTS_PER_WINDOW,
          },
        },
        "Client error reports throttled: a single client exceeded the per-IP rate limit",
      );
      nextWarnedAt = now;
    }

    state.set(key, { hits: recent, warnedAt: nextWarnedAt });
    return;
  }

  recent.push(now);
  state.set(key, {
    hits: recent,
    warnedAt: warnedThisWindow ? warnedAt : undefined,
  });
  pruneOldest();
  next();
}
