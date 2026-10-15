import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  ClerkLoading,
  ClerkLoaded,
} from "@clerk/clerk-react";
import type { ReactNode } from "react";
import { FullScreenLoader } from "@/components/full-screen-loader";
import { useAuthReady } from "./clerk-token-bridge";

/**
 * Route guard: renders `children` only when a Clerk session exists,
 * otherwise sends the user to /sign-in. Use to wrap any protected route
 * (Dashboard, Workshop, Lab, Studio, Connect).
 *
 * While Clerk is still booting we show the shared FullScreenLoader instead of
 * rendering nothing — otherwise a cold load of a protected route flashes a
 * blank (light) screen before the session resolves.
 */
export function RequireSignedIn({ children }: { children: ReactNode }) {
  const authReady = useAuthReady();
  return (
    <>
      <ClerkLoading>
        <FullScreenLoader testId="auth-loading" />
      </ClerkLoading>
      <ClerkLoaded>
        <SignedIn>{authReady ? children : <FullScreenLoader testId="auth-token-loading" />}</SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </ClerkLoaded>
    </>
  );
}
