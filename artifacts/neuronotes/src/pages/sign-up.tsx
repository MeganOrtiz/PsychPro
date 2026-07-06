import { useEffect } from "react";
import { useAuth } from "@workspace/replit-auth-web";
import { FullScreenLoader } from "@/components/full-screen-loader";

/**
 * There is no in-app sign-up form — account creation is handled by the hosted
 * Replit Auth flow (the same entry point as sign-in). This page immediately
 * hands off to `login()`, which sends the browser to `/api/login`. Signed-in
 * users are bounced to /welcome so the post-auth resolver can route them.
 */
export default function SignUpPage() {
  const { isLoading, isAuthenticated, login } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      window.location.href = `${base}/welcome`;
    } else {
      login();
    }
  }, [isLoading, isAuthenticated, login]);

  return <FullScreenLoader testId="sign-up-loading" />;
}
