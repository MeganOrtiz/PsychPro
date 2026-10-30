import { useEffect } from "react";
import { useLocation } from "wouter";

type RouteCategory =
  | "landing"
  | "plans"
  | "authentication"
  | "onboarding"
  | "psychpro"
  | "eppp"
  | "other";

function categoryForPath(path: string): RouteCategory | null {
  if (path === "/" || path === "/welcome") return "landing";
  if (path === "/subscription" || path === "/plans") return "plans";
  if (path === "/sign-in" || path === "/sign-up") return "authentication";
  if (path === "/onboarding" || path.startsWith("/onboarding/")) return "onboarding";
  if (path === "/admin" || path.startsWith("/admin/")) return null;
  if (path === "/eppp" || path.startsWith("/eppp/")) return "eppp";
  if (
    path === "/dashboard" ||
    path.startsWith("/topics") ||
    path.startsWith("/courses") ||
    path === "/study-lab" ||
    path === "/brain-lab" ||
    path === "/progress" ||
    path === "/resources" ||
    path === "/my-library" ||
    path.startsWith("/my-decks")
  ) {
    return "psychpro";
  }
  return "other";
}

/**
 * Sends only a broad route category. The API creates and manages the
 * HttpOnly first-party browser cookie; this component never reads identity,
 * query strings, referrers, or study content.
 */
export function PageviewTracker() {
  const [path] = useLocation();

  useEffect(() => {
    if (!import.meta.env.PROD) return;
    const routeCategory = categoryForPath(path);
    if (!routeCategory) return;

    void fetch("/api/analytics/pageview", {
      method: "POST",
      credentials: "same-origin",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ routeCategory }),
    }).catch(() => {
      // Tracking is best-effort and must never interrupt navigation.
    });
  }, [path]);

  return null;
}
