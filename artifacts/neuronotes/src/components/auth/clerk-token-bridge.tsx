import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { setAuthTokenGetter } from "@workspace/api-client-react";

/**
 * Bridges the Clerk session into the generated API client. Once the Clerk
 * SDK has loaded, every API request will carry an
 * `Authorization: Bearer <clerk-session-token>` header so the api-server's
 * `clerkMiddleware()` can authenticate the request.
 *
 * Render this once, near the top of the tree, inside <ClerkProvider>.
 */
export function ClerkTokenBridge() {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      setAuthTokenGetter(() => getToken());
    } else {
      setAuthTokenGetter(null);
    }
    return () => setAuthTokenGetter(null);
  }, [isLoaded, isSignedIn, getToken]);

  return null;
}
