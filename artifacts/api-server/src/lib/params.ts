import type { Request, Response } from "express";

/**
 * Parse a numeric route parameter (e.g. `/foo/:id`).
 *
 * Express types `req.params.<name>` as `string | string[]` because route
 * parsers can theoretically return repeated values. In practice we expect a
 * single string here, so we coerce/validate explicitly and respond with 400
 * if the value is missing, an array, or not a base-10 integer.
 *
 * Returns the parsed number on success, or `null` if a 400 response was sent.
 * Callers should `return` immediately when `null` is returned.
 */
export function parseIntParam(
  req: Request,
  res: Response,
  name: string,
): number | null {
  const raw = req.params[name];
  if (typeof raw !== "string" || !/^-?\d+$/.test(raw)) {
    res.status(400).json({ error: `Invalid '${name}' parameter` });
    return null;
  }
  const parsed = Number(raw);
  if (!Number.isSafeInteger(parsed)) {
    res.status(400).json({ error: `Invalid '${name}' parameter` });
    return null;
  }
  return parsed;
}
