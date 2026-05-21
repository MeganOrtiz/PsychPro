import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import type { ReactNode } from "react";

/**
 * Route guard: renders `children` only when a Clerk session exists,
 * otherwise sends the user to /sign-in. Use to wrap any protected route
 * (Dashboard, Workshop, Lab, Studio, Connect).
 */
export function RequireSignedIn({ children }: { children: ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
