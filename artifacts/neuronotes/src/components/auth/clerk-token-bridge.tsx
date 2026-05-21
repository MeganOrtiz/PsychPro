import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import { setClerkUserId } from "@/lib/user-id";

/**
 * Bridges the Clerk session into the generated API client. Once the Clerk
 * SDK has loaded, every API request will carry an
 * `Authorization: Bearer <clerk-session-token>` header so the api-server's
 * `clerkMiddleware()` can authenticate the request, and the
 * `X-User-Id` header carries the signed-in Clerk user id (falling back to
 * the anonymous browser UUID when not signed in — see
 * `src/lib/user-id.ts`).
 *
 * Render this once, near the top of the tree, inside <ClerkProvider>.
 */
export function ClerkTokenBridge() {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      setAuthTokenGetter(() => getToken());
      setClerkUserId(userId ?? null);
    } else {
      setAuthTokenGetter(null);
      setClerkUserId(null);
    }
    return () => {
      setAuthTokenGetter(null);
      setClerkUserId(null);
    };
  }, [isLoaded, isSignedIn, userId, getToken]);

  return null;
}
