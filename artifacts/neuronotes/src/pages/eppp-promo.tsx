import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useUser } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetEpppPromoQueryKey, useGetEpppPromo, useRedeemEpppPromo } from "@workspace/api-client-react";
import { Check, Loader2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { promoAuthHref } from "@/lib/eppp-promo-return";

const PROMO_CODE = "EPPP7";

function fmt(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString(undefined, { dateStyle: "long", timeStyle: "short" });
}

function errInfo(err: unknown): { status: number | null; message: string } {
  const e = err as { status?: number; data?: { error?: string } | null; message?: string } | null;
  return {
    status: typeof e?.status === "number" ? e.status : null,
    message: e?.data?.error || e?.message || "Something went wrong. Please try again.",
  };
}

export default function EpppPromoPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const qc = useQueryClient();
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const [code, setCode] = useState((params.get("code") ?? PROMO_CODE).trim().toUpperCase());
  const [fresh, setFresh] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const enabled = isLoaded && !!isSignedIn;
  const promoQueryKey = [...getGetEpppPromoQueryKey(), user?.id];
  const promo = useGetEpppPromo({ query: { queryKey: promoQueryKey, enabled, retry: false } });
  const redeem = useRedeemEpppPromo();

  useEffect(() => {
    document.title = "EPPP7 free week | PsychPro";
  }, []);

  useEffect(() => {
    setFresh(false);
    setFormError(null);
  }, [user?.id]);

  const data = promo.data;
  const expired = !!data?.redeemedAt && !!data.expiresAt && new Date(data.expiresAt).getTime() <= Date.now();
  const active = !!data?.redeemedAt && !expired;
  const hasRemainingAccess = !!data?.epppAccessUntil && new Date(data.epppAccessUntil).getTime() > Date.now();

  async function onRedeem(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const value = code.trim().toUpperCase();
    if (!value) return setFormError("Enter your promo code.");
    try {
      const claimed = await redeem.mutateAsync({ data: { code: value } });
      qc.setQueryData(promoQueryKey, claimed);
      setRefreshing(true);
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["entitlements"] }),
        qc.invalidateQueries({
          predicate: (q) => String(q.queryKey[0] ?? "").includes("subscription"),
        }),
        promo.refetch(),
      ]);
      setFresh(true);
    } catch (err) {
      const { status, message } = errInfo(err);
      setFormError(
        status === 409
          ? "This account has already claimed the EPPP7 promo. It can only be used once."
          : status === 400
            ? message || "That code is not valid. Check it and try again."
            : message,
      );
      if (status === 409) promo.refetch();
    } finally {
      setRefreshing(false);
    }
  }

  let body: React.ReactNode;
  if (!isLoaded || (enabled && promo.isLoading)) {
    body = (
      <div className="space-y-3" aria-busy="true" data-testid="promo-loading">
        <div className="h-5 w-2/3 rounded bg-muted animate-pulse" />
        <div className="h-10 w-full rounded bg-muted animate-pulse" />
      </div>
    );
  } else if (!isSignedIn) {
    body = (
      <div className="space-y-3">
        <p className="text-foreground">Create a free account or sign in, then come back here to redeem code {PROMO_CODE}.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="w-full sm:w-auto" data-testid="button-promo-signup">
            <a href={promoAuthHref("sign-up", code || PROMO_CODE)}>Create account</a>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto" data-testid="button-promo-signin">
            <a href={promoAuthHref("sign-in", code || PROMO_CODE)}>Sign in</a>
          </Button>
        </div>
      </div>
    );
  } else if (promo.isError) {
    body = (
      <div role="alert" className="space-y-3" data-testid="promo-error">
        <p className="flex items-center gap-2 text-foreground">
          <TriangleAlert className="w-4 h-4" /> We could not load your promo status. {errInfo(promo.error).message}
        </p>
        <Button variant="outline" onClick={() => promo.refetch()} data-testid="button-promo-retry">
          Try again
        </Button>
      </div>
    );
  } else if (active) {
    body = (
      <div className="space-y-4" data-testid="promo-active">
        <p className="flex items-center gap-2 font-semibold text-foreground">
          <Check className="w-5 h-5" />
          {fresh ? "Promo redeemed." : "You already claimed this promo."}
        </p>
        <p className="text-foreground">
          Your EPPP access is active until <strong>{fmt(data?.epppAccessUntil ?? data?.expiresAt)}</strong>.
          Promo window ends {fmt(data?.expiresAt)}. This promo requires no card and does not start a paid subscription.
        </p>
        <Button asChild data-testid="button-promo-open-suite">
          <Link href="/eppp/dashboard">Open the EPPP dashboard</Link>
        </Button>
      </div>
    );
  } else if (expired) {
    body = (
      <div className="space-y-4" data-testid="promo-expired">
        <p className="text-foreground">
          Your EPPP7 week ended {fmt(data?.expiresAt)}. The promo can be claimed once per account, so it cannot be restarted.
        </p>
        {hasRemainingAccess ? (
          <>
            <p className="text-foreground">Your existing EPPP access remains active until {fmt(data?.epppAccessUntil)}.</p>
            <Button asChild data-testid="button-promo-open-suite">
              <Link href="/eppp/dashboard">Open the EPPP dashboard</Link>
            </Button>
          </>
        ) : (
          <Button asChild data-testid="button-promo-subscribe">
            <Link href="/subscription">See EPPP plans</Link>
          </Button>
        )}
      </div>
    );
  } else if (data && !data.canRedeem) {
    body = (
      <p className="text-foreground" data-testid="promo-unavailable">
        This promo is not available for your account right now.
      </p>
    );
  } else {
    body = (
      <form onSubmit={onRedeem} className="space-y-3" data-testid="promo-form">
        <label htmlFor="promo-code" className="text-sm font-medium text-foreground">Promo code</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            id="promo-code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            autoComplete="off"
            maxLength={64}
            placeholder={PROMO_CODE}
            className="sm:max-w-xs"
            data-testid="input-promo-code"
          />
          <Button type="submit" disabled={redeem.isPending || refreshing} data-testid="button-promo-redeem">
            {redeem.isPending || refreshing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Redeem 7 days of EPPP
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Redeeming starts your seven days immediately. Promo access ends automatically, with no credit card required.
        </p>
        {formError && (
          <p role="alert" className="text-sm text-foreground flex items-start gap-2" data-testid="promo-form-error">
            <TriangleAlert className="w-4 h-4 mt-0.5 shrink-0" /> {formError}
          </p>
        )}
      </form>
    );
  }

  return (
    <div className="study-page-bg min-h-[100dvh] px-4 py-10 md:py-16">
      <main className="max-w-2xl mx-auto space-y-6">
        <header className="space-y-3">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">PsychPro EPPP promo</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Seven days of the EPPP Mastery Suite, free</h1>
          <p className="text-foreground leading-relaxed">
            Try the EPPP-only suite for seven days. No credit card, and no automatic charge when it ends. It covers EPPP
            content only and does not unlock other PsychPro plans.
          </p>
        </header>

        <section className="mat-opaque p-5 md:p-6" aria-live="polite" data-testid="promo-card">
          {body}
        </section>

        <section className="mat-opaque p-5 md:p-6 space-y-2">
          <h2 className="text-lg font-semibold text-foreground">One week, one claim per account</h2>
          <ul className="list-disc pl-5 space-y-1 text-foreground">
            <li>You will see the exact expiry date and time as soon as you redeem.</li>
            <li>Refreshing this page will not give you more time.</li>
            <li>Existing paid EPPP access and billing terms stay unchanged.</li>
          </ul>
        </section>

        <section className="mat-opaque p-5 md:p-6 space-y-2">
          <h2 className="text-lg font-semibold text-foreground">Optional: feedback for a book</h2>
          <p className="text-foreground leading-relaxed">
            If you choose, you can send honest feedback about the PsychPro website to earn a free textbook PDF. The PDF stays yours
            after the promo ends. Books are not awarded for redeeming the promo alone.
          </p>
        </section>
      </main>
    </div>
  );
}
