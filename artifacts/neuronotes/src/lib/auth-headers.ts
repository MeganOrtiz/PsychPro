/**
 * Auth for the web app is carried by the Replit Auth session cookie (`sid`,
 * httpOnly), which the browser sends automatically on same-origin requests to
 * `/api/*`. There is therefore no bearer token to attach on the client — these
 * helpers exist only so the many direct `fetch()` call sites can keep building
 * their headers object through one shared function.
 */

/**
 * Build a headers object for a direct `fetch()` call. The session travels in
 * the cookie, so this simply returns the caller-supplied headers unchanged.
 */
export async function authHeaders(
  extra: Record<string, string> = {},
): Promise<Record<string, string>> {
  return { ...extra };
}

/** Convenience: `authHeaders({ "Content-Type": "application/json" })`. */
export async function jsonAuthHeaders(): Promise<Record<string, string>> {
  return authHeaders({ "Content-Type": "application/json" });
}
