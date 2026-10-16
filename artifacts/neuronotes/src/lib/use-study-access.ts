import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetStudyAccess,
  useStartStudyTrial,
  getGetStudyAccessQueryKey,
  getGetSubscriptionStatusQueryKey,
  getGetUserProfileQueryKey,
  getGetDashboardSummaryQueryKey,
  type StudyAccess,
  type SuiteStudyAccess,
} from "@workspace/api-client-react";

export type TrialSuite = "psychpro" | "eppp";

export const PSYCHPRO_TRIAL_AI_LIMIT = 5;
export const PSYCHPRO_MONTHLY_AI_LIMIT = 50;

export function isTrialSuite(v: string | null | undefined): v is TrialSuite {
  return v === "psychpro" || v === "eppp";
}

/** Suite trial state derived from the server's StudyAccess record. */
export function trialPhase(s: SuiteStudyAccess | undefined): "paid" | "active" | "expired" | "available" | "none" {
  if (!s) return "none";
  if (s.paid || s.legacy) return "paid";
  if (s.active) return "active";
  if (s.startedAt && !s.active) return "expired";
  if (s.canStart) return "available";
  return "none";
}

export function formatTrialDate(iso: string | null | undefined) {
  if (!iso) return "";
  return new Date(iso).toLocaleString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Effective plan/trial access for the signed-in account. Only fetches after
 * Clerk is ready; cache is scoped by user id. Refetches on focus and exactly
 * when the earliest active trial expires so gated UI flips without reload.
 */
export function useStudyAccess() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const enabled = isLoaded && !!isSignedIn;
  const query = useGetStudyAccess({
    query: {
      queryKey: [...getGetStudyAccessQueryKey(), userId ?? "anon"],
      enabled,
      staleTime: 30_000,
      refetchOnWindowFocus: true,
      refetchInterval: 5 * 60_000,
    },
  });

  const queryClient = useQueryClient();
  const qcRef = useRef(queryClient);
  qcRef.current = queryClient;
  const data = query.data as StudyAccess | undefined;
  const nextExpiry = [data?.psychpro, data?.eppp, { active: true, expiresAt: data?.aiUsage?.resetsAt ?? null }]
    .filter((s) => s?.active && s.expiresAt)
    .map((s) => new Date(s!.expiresAt as string).getTime())
    .filter((t) => t > Date.now())
    .sort((a, b) => a - b)[0];

  useEffect(() => {
    if (!nextExpiry) return;
    const ms = Math.min(nextExpiry - Date.now() + 1500, 2 ** 31 - 1);
    // On expiry refresh ONLY access/entitlement caches. Decks, sources,
    // progress, and owned books are never cleared or deleted.
    const t = window.setTimeout(() => {
      const qc = qcRef.current;
      void qc.invalidateQueries({ queryKey: getGetStudyAccessQueryKey() });
      void qc.invalidateQueries({ queryKey: ["entitlements"] });
      void qc.invalidateQueries({ queryKey: getGetSubscriptionStatusQueryKey() });
    }, Math.max(ms, 1000));
    return () => window.clearTimeout(t);
  }, [nextExpiry]);

  return { ...query, data, enabled };
}

export function useStartTrial() {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const invalidateAll = () => Promise.all([
    queryClient.invalidateQueries({ queryKey: getGetStudyAccessQueryKey() }),
    queryClient.invalidateQueries({ queryKey: ["entitlements"] }),
    queryClient.invalidateQueries({ queryKey: getGetSubscriptionStatusQueryKey() }),
    queryClient.invalidateQueries({ queryKey: getGetUserProfileQueryKey() }),
    queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() }),
  ]);
  const mutation = useStartStudyTrial({
    mutation: {
      onSuccess: async (access) => {
        // Seed the current account's access before entering its dashboard,
        // instead of briefly rendering an old no-access/trial-available state.
        if (userId) queryClient.setQueryData([...getGetStudyAccessQueryKey(), userId], access);
        await invalidateAll();
      },
      onError: (err) => {
        // 409 = already started or already paid: just refresh, never reset.
        if ((err as { status?: number })?.status === 409) invalidateAll();
      },
    },
  });
  return mutation;
}

export function apiErrorMessage(err: unknown, fallback: string) {
  const e = err as { status?: number; data?: { error?: string; message?: string }; message?: string };
  return e?.data?.error || e?.data?.message || fallback;
}
