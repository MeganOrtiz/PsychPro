import { useEffect } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@workspace/replit-auth-web";
import { FullScreenLoader } from "@/components/full-screen-loader";

/**
 * Route guard: renders `children` only when a Replit Auth session exists,
 * otherwise sends the user to the login flow. Use to wrap any protected route
 * (Dashboard, Workshop, Lab, Studio, Connect).
 *
 * While the session is still resolving we show the shared FullScreenLoader
 * instead of rendering nothing — otherwise a cold load of a protected route
 * flashes a blank (light) screen before the session resolves.
 */
export function RequireSignedIn({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated, login } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      login();
    }
  }, [isLoading, isAuthenticated, login]);

  if (isLoading || !isAuthenticated) {
    return <FullScreenLoader testId="auth-loading" />;
  }

  return <>{children}</>;
}
