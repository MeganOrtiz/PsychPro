import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import { setClerkTokenGetter } from "@/lib/auth-headers";

/**
 * Bridges the Clerk session into both:
 *   1. The generated API client (`@workspace/api-client-react`) so every
 *      generated request carries `Authorization: Bearer <clerk-token>`.
 *   2. The shared `authHeaders()` helper in `@/lib/auth-headers` so any
 *      direct `fetch()` call site can build the same header.
 *
 * The api-server's `clerkMiddleware()` then verifies the token via
 * `getAuth(req)` and route handlers read the verified user id with
 * `requireUserId` / `getOptionalUserId`. The legacy `X-User-Id` request
 * header is no longer sent or consulted.
 *
 * Render this once, near the top of the tree, inside <ClerkProvider>.
 */
export function ClerkTokenBridge() {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      setAuthTokenGetter(() => getToken());
      setClerkTokenGetter(() => getToken());
    } else {
      setAuthTokenGetter(null);
      setClerkTokenGetter(null);
    }
    return () => {
      setAuthTokenGetter(null);
      setClerkTokenGetter(null);
    };
  }, [isLoaded, isSignedIn, getToken]);

  return null;
}
