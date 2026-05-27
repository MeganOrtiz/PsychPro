import { type Request, type Response, type NextFunction } from "express";

/**
 * Per-IP throttle for `POST /api/oauth/register` (dynamic client
 * registration). Unlike `/api/feedback`, an attacker hitting this endpoint
 * can balloon the in-memory `oauthStore` client map — there is no auth on
 * RFC 7591 registration by design — so we cap registrations from any
 * single source.
 *
 * Defaults: 10 registrations per IP per hour. Tunable via env for incident
 * response.
 *
 * Pattern mirrors `feedbackRateLimit`: in-memory sliding window keyed on
 * `req.ip` (Express derives this from `trust proxy = 1` in app.ts and the
 * `proxy-addr` package, so it cannot be forged via `X-Forwarded-For`).
 *
 * Single-instance assumption: PsychPro currently deploys as one api-server
 * process, so a Map is sufficient. Promote to a DB-backed limiter if we
 * ever scale horizontally — otherwise each replica enforces its own
 * counter and an attacker can multiply the limit by the replica count.
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

const WINDOW_MS = readPositiveIntEnv("OAUTH_REGISTER_RATE_LIMIT_WINDOW_MS", 60 * 60 * 1000);
const MAX = readPositiveIntEnv("OAUTH_REGISTER_RATE_LIMIT_MAX", 10);

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

export function oauthRegisterRateLimit(req: Request, res: Response, next: NextFunction): void {
  const key = clientKey(req);
  const now = Date.now();
  sweep(now);
  const arr = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= MAX) {
    const oldest = arr[0];
    const retryAfterSec = Math.max(1, Math.ceil((oldest + WINDOW_MS - now) / 1000));
    res.setHeader("Retry-After", String(retryAfterSec));
    res.status(429).json({
      error: "too_many_requests",
      error_description: "Too many client registrations from this address. Try again later.",
    });
    req.log.warn(
      { oauthRegisterRateLimit: { ip: key, windowMs: WINDOW_MS, limit: MAX } },
      "OAuth dynamic-registration throttled",
    );
    return;
  }
  arr.push(now);
  hits.set(key, arr);
  next();
}
