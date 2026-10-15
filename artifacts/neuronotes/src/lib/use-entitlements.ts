import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import { useAuth } from "@clerk/clerk-react";

export type Entitlements = {
  tier: "free" | "pro" | "scholar";
  isAdmin: boolean;
  isSubscribed: boolean;
  // EPPP Mastery Suite access is a SEPARATE access level from Master/Scholar,
  // driven by an expiry date (epppAccessUntil). epppAccess already folds in the
  // expiry check and admin bypass — prefer it over reading the date directly.
  epppAccess: boolean;
  epppAccessUntil: string | null;
  flashcardPreviewLimit: number;
  quizLimit: number;
  examLimit: number;
  quizzesCompleted: number;
  examsCompleted: number;
  flashcardsCapped: boolean;
  quizLocked: boolean;
  examLocked: boolean;
  studyGuideLocked: boolean;
};

/**
 * Single source of truth for "is this user allowed to X" on the client.
 * Backed by GET /api/users/entitlements which uses lifetime attempt counts
 * to compute per-feature locks. Cached for 30s so the topic detail page,
 * the sub-pages, and the upgrade overlays all see consistent state.
 */
export function useEntitlements() {
  const { userId, isLoaded, isSignedIn } = useAuth();
  return useQuery<Entitlements>({
    queryKey: ["entitlements", userId],
    enabled: isLoaded && !!isSignedIn,
    queryFn: ({ signal }) => customFetch<Entitlements>("/api/users/entitlements", { signal, responseType: "json" }),
    staleTime: 30_000,
    refetchInterval: 30_000,
    refetchOnWindowFocus: "always",
  });
}
