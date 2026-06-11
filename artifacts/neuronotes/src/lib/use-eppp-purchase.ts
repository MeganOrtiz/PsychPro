import { useMutation, useQuery } from "@tanstack/react-query";
import { authHeaders } from "./auth-headers";

export type EpppMonthlyPlan = {
  priceId: string;
  unitAmount: number;
  currency: string;
  interval: string;
};

export type EpppOneTimePlan = {
  priceId: string;
  unitAmount: number;
  currency: string;
  months: number;
};

export type EpppPlans = {
  productId: string | null;
  name: string | null;
  description: string | null;
  monthly: EpppMonthlyPlan | null;
  oneTime: EpppOneTimePlan[];
};

/**
 * EPPP Mastery Suite purchase catalog. Backed by GET /api/eppp/plans (anonymous)
 * which surfaces the EPPP Stripe product's monthly subscription plus the
 * one-time access packs ($499 → 6mo, $799 → 12mo). These endpoints are not part
 * of the generated API client, so they're called directly like
 * use-entitlements does.
 */
export function useEpppPlans() {
  return useQuery<EpppPlans>({
    queryKey: ["eppp-plans"],
    queryFn: async () => {
      const res = await fetch("/api/eppp/plans");
      if (!res.ok) throw new Error(`eppp plans fetch failed: ${res.status}`);
      return res.json();
    },
    staleTime: 5 * 60_000,
  });
}

/** Starts an EPPP Checkout Session and returns the redirect URL. */
export function useEpppCheckout() {
  return useMutation<{ url: string }, Error, { priceId: string }>({
    mutationFn: async ({ priceId }) => {
      const res = await fetch("/api/eppp/checkout", {
        method: "POST",
        headers: { ...(await authHeaders()), "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      if (!res.ok) {
        let message = "Could not start checkout. Please try again.";
        try {
          const body = await res.json();
          if (body?.error) message = body.error;
        } catch {
          // keep default message
        }
        throw new Error(message);
      }
      return res.json();
    },
  });
}
