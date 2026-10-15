import { createContext, useContext, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
const AuthReadyContext = createContext(false);
export const useAuthReady = () => useContext(AuthReadyContext);

export function ClerkTokenBridge({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();
  const queryClient = useQueryClient();
  const identity = isLoaded ? (isSignedIn ? userId : "signed-out") : undefined;
  const previousIdentity = useRef<string | null | undefined>(undefined);
  const [registeredIdentity, setRegisteredIdentity] = useState<string | null>();

  // Layout effects run before query effects. Protected routes also wait for
  // registration, so a cold load cannot send its first request anonymously.
  useLayoutEffect(() => {
    if (!isLoaded) return;
    if (previousIdentity.current !== undefined && previousIdentity.current !== identity) {
      // Generated query keys aren't all user-scoped. Never reuse another
      // account's profile, study materials, or billing status in this tab.
      queryClient.clear();
    }
    previousIdentity.current = identity;
    if (isSignedIn) {
      setAuthTokenGetter(() => getToken());
      setClerkTokenGetter(() => getToken());
    } else {
      setAuthTokenGetter(null);
      setClerkTokenGetter(null);
    }
    setRegisteredIdentity(identity);
    return () => {
      setAuthTokenGetter(null);
      setClerkTokenGetter(null);
    };
  }, [isLoaded, isSignedIn, getToken, identity, queryClient]);

  return (
    <AuthReadyContext.Provider value={!!isLoaded && registeredIdentity === identity}>
      {children}
    </AuthReadyContext.Provider>
  );
}
