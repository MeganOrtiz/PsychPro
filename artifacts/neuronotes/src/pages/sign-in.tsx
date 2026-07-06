import { useEffect } from "react";
import { useAuth } from "@workspace/replit-auth-web";
import { FullScreenLoader } from "@/components/full-screen-loader";

/**
 * There is no in-app login form — authentication is handled by the hosted
 * Replit Auth flow. This page immediately hands off to `login()`, which sends
 * the browser to `/api/login`. Signed-in users are bounced to /welcome so the
 * post-auth resolver can route them to the right destination.
 */
export default function SignInPage() {
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

  return <FullScreenLoader testId="sign-in-loading" />;
}
