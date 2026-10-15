import { useEffect, useRef } from "react";
import { useSearch } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  getGetStudyAccessQueryKey,
  getGetSubscriptionStatusQueryKey,
  getGetUserProfileQueryKey,
} from "@workspace/api-client-react";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

/** Stripe's return can beat its webhook. Refresh access for a bounded window.
 * The redirect itself is never proof of payment or permission to unlock content.
 */
export function useBillingReturn() {
  const search = useSearch();
  const qc = useQueryClient();
  const handled = useRef<string | null>(null);
  const params = new URLSearchParams(search);
  const success = params.get("success") === "true" || params.get("eppp_success") === "true";
  const canceled = params.get("canceled") === "true" || params.get("eppp_canceled") === "true";
  const outcome = success ? "success" : canceled ? "canceled" : null;

  useEffect(() => {
    if (!outcome || handled.current === outcome) return;
    handled.current = outcome;
    const cleanReturnParams = () => {
      const url = new URL(window.location.href);
      ["success", "canceled", "eppp_success", "eppp_canceled"].forEach((key) => url.searchParams.delete(key));
      window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
    };
    trackEvent("checkout_returned", { surface: "billing", outcome: outcome === "success" ? "success_redirect" : "canceled" });
    if (outcome === "canceled") {
      toast("Checkout canceled. Your access has not changed.");
      cleanReturnParams();
      return;
    }
    toast("Welcome back from checkout. We're refreshing your access; payment confirmation may take a moment.");
    const refresh = () => Promise.all([
      qc.invalidateQueries({ queryKey: getGetStudyAccessQueryKey() }),
      qc.invalidateQueries({ queryKey: getGetSubscriptionStatusQueryKey() }),
      qc.invalidateQueries({ queryKey: getGetUserProfileQueryKey() }),
      qc.invalidateQueries({ queryKey: ["entitlements"] }),
    ]);
    void refresh();
    // Staggered refreshes accommodate webhook delivery without polling forever.
    const timers = [2_000, 5_000, 10_000, 20_000].map((ms) => window.setTimeout(() => {
      void refresh();
      if (ms === 20_000) cleanReturnParams();
    }, ms));
    return () => timers.forEach(window.clearTimeout);
  }, [outcome, qc]);
}
