type TokenGetter = () => Promise<string | null> | string | null;

let tokenGetter: TokenGetter | null = null;

/**
 * Registered by `ClerkTokenBridge` once the Clerk SDK has loaded. Allows
 * direct `fetch()` call sites (i.e. anything that doesn't go through the
 * generated API client in `@workspace/api-client-react`) to authenticate
 * with the same verified Clerk session token the API client uses.
 *
 * Pass `null` on sign-out / unmount to clear.
 */
export function setClerkTokenGetter(getter: TokenGetter | null): void {
  tokenGetter = getter;
}

export async function getClerkToken(): Promise<string | null> {
  if (!tokenGetter) return null;
  try {
    return await tokenGetter();
  } catch {
    return null;
  }
}

/**
 * Build a headers object with `Authorization: Bearer <clerk-token>` attached
 * when a Clerk session is loaded. Merge in any extra headers (e.g.
 * `Content-Type: application/json`) the caller needs.
 */
export async function authHeaders(
  extra: Record<string, string> = {},
): Promise<Record<string, string>> {
  const headers: Record<string, string> = { ...extra };
  const token = await getClerkToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

/** Convenience: `authHeaders({ "Content-Type": "application/json" })`. */
export async function jsonAuthHeaders(): Promise<Record<string, string>> {
  return authHeaders({ "Content-Type": "application/json" });
}
