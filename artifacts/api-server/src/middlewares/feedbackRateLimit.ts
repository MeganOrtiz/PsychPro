import { type Request, type Response, type NextFunction } from "express";

/**
 * Per-IP throttle for `POST /api/feedback` so a single abusive client can
 * not flood the admin inbox.
 *
 * Implementation: in-memory sliding-window counter keyed on `req.ip`
 * (Express derives this from the `trust proxy` setting in app.ts and the
 * `proxy-addr` package, so the limit cannot be forged via
 * `X-Forwarded-For`). Defaults: 5 submissions per IP per hour. The window
 * + max are env-overridable for incident response.
 *
 * Why not DB-backed (like `clientErrorsRateLimit`)? PsychPro currently
 * deploys as a single API server instance and feedback volume is low; a
 * Map is cheap, has no per-request DB round-trip, and the limit
 * "rebooting on restart" is acceptable for a 5/hour ceiling. Promote to
 * the DB-backed pattern if/when we scale to multiple instances.
 */

function readPositiveIntEnv(name: string, defaultValue: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === "") return defaultValue;
  const n = Number(raw.trim());
  if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) {
    throw new Error(
      `Invalid ${name} env value: ${JSON.stringify(raw)} (must be a positive integer)`,
    );
  }
  return n;
}

const WINDOW_MS = readPositiveIntEnv("FEEDBACK_RATE_LIMIT_WINDOW_MS", 60 * 60 * 1000);
const MAX = readPositiveIntEnv("FEEDBACK_RATE_LIMIT_MAX", 5);

const hits = new Map<string, number[]>();
let lastSweep = 0;

function sweep(now: number): void {
  if (now - lastSweep < WINDOW_MS) return;
  lastSweep = now;
  for (const [k, arr] of hits) {
    const fresh = arr.filter((t) => now - t < WINDOW_MS);
    if (fresh.length === 0) hits.delete(k);
    else if (fresh.length !== arr.length) hits.set(k, fresh);
  }
}

function clientKey(req: Request): string {
  return req.ip ?? req.socket.remoteAddress ?? "unknown";
}

export function feedbackRateLimit(req: Request, res: Response, next: NextFunction): void {
  const key = clientKey(req);
  const now = Date.now();
  sweep(now);
  const arr = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= MAX) {
    const oldest = arr[0];
    const retryAfterSec = Math.max(1, Math.ceil((oldest + WINDOW_MS - now) / 1000));
    res.setHeader("Retry-After", String(retryAfterSec));
    res.status(429).json({
      error: "Too many feedback submissions from this client. Please try again later.",
    });
    req.log.warn(
      { feedbackRateLimit: { ip: key, windowMs: WINDOW_MS, limit: MAX } },
      "Feedback submission throttled",
    );
    return;
  }
  arr.push(now);
  hits.set(key, arr);
  next();
}

export const feedbackRateLimitConfig: Readonly<{ windowMs: number; limit: number }> =
  Object.freeze({ windowMs: WINDOW_MS, limit: MAX });
