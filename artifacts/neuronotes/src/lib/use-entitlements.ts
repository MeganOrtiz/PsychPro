import { useQuery } from "@tanstack/react-query";
import { authHeaders } from "./auth-headers";

export type Entitlements = {
  tier: "free" | "pro" | "scholar";
  isAdmin: boolean;
  isSubscribed: boolean;
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
  return useQuery<Entitlements>({
    queryKey: ["entitlements"],
    queryFn: async () => {
      const res = await fetch("/api/users/entitlements", { headers: await authHeaders() });
      if (!res.ok) throw new Error(`entitlements fetch failed: ${res.status}`);
      return res.json();
    },
    staleTime: 30_000,
  });
}
