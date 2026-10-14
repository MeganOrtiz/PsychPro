import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useUser } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetEpppPromoQueryKey, useGetEpppPromo, useRedeemEpppPromo } from "@workspace/api-client-react";
import { Check, Loader2, TriangleAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import crownSrc from "@/assets/eppp-chrome-crown.webp";
import bookSrc from "@/assets/psychpro-foundations-book.webp";
import "./eppp-promo.css";

const splashSrc = `${import.meta.env.BASE_URL}api/storage/public-objects/brand/dashboard-teal-splash-complete.webp`;
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
        <p className="promo-prompt">Create a free account or sign in, then come back here to redeem code <strong>{PROMO_CODE}</strong>.</p>
        <div className="promo-actions">
          <a className="promo-glass" href={promoAuthHref("sign-up", code || PROMO_CODE)} data-testid="button-promo-signup">Create account</a>
          <a className="promo-glass" href={promoAuthHref("sign-in", code || PROMO_CODE)} data-testid="button-promo-signin">Sign in</a>
        </div>
      </div>
    );
  } else if (promo.isError) {
    body = (
      <div role="alert" className="space-y-3" data-testid="promo-error">
        <p className="flex items-center gap-2 text-foreground">
          <TriangleAlert className="w-4 h-4" /> We could not load your promo status. {errInfo(promo.error).message}
        </p>
        <button type="button" className="promo-glass promo-glass--auto" onClick={() => promo.refetch()} data-testid="button-promo-retry">
          Try again
        </button>
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
        <Link href="/eppp/dashboard" className="promo-glass promo-glass--auto" data-testid="button-promo-open-suite">Open the EPPP dashboard</Link>
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
            <Link href="/eppp/dashboard" className="promo-glass promo-glass--auto" data-testid="button-promo-open-suite">Open the EPPP dashboard</Link>
          </>
        ) : (
          <Link href="/subscription" className="promo-glass promo-glass--auto" data-testid="button-promo-subscribe">See EPPP plans</Link>
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
        <div className="promo-form-row">
          <Input
            id="promo-code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            autoComplete="off"
            maxLength={64}
            placeholder={PROMO_CODE}
                        data-testid="input-promo-code"
          />
          <button type="submit" className="promo-glass promo-glass--auto" disabled={redeem.isPending || refreshing} data-testid="button-promo-redeem">
            {redeem.isPending || refreshing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Redeem 7 days of EPPP
          </button>
        </div>
        <p className="text-sm text-foreground">
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
    <div className="promo-root">
      <main className="promo-main">
        <header className="promo-hero">
          <p className="promo-eyebrow">PsychPro EPPP promo</p>
          <h1 className="promo-title"><span className="promo-wordmark">EPPP Mastery Suite</span><span>7 Days FREE</span></h1>
          <div className="promo-art" aria-hidden>
            <img className="promo-splash" src={splashSrc} alt="" width={1672} height={603} />
            <img className="promo-crown" src={crownSrc} alt="" />
          </div>
          <div className="promo-copy">
            <p>Try the study materials on the EPPP Mastery Suite free for 7 days.</p>
            <p>No credit card</p>
            <p>No automatic charge</p>
            <p>Unlimited access to help you master the concepts with confidence</p>
          </div>
        </header>

        <section className="promo-panel" aria-live="polite" data-testid="promo-card">
          {body}
        </section>

        <section className="promo-offer" aria-labelledby="promo-offer-title" data-testid="promo-book-offer">
          <img className="promo-book" src={bookSrc} alt="Foundations in Clinical Psychology textbook cover" loading="lazy" />
          <div className="promo-offer-copy">
            <h2 id="promo-offer-title">For a Limited Time</h2>
            <p>Leave us an honest review and receive a FREE copy of the Foundations in Clinical Psychology textbook!</p>
          </div>
        </section>

        <aside className="promo-notes" data-testid="promo-terms">
          <h2>One week, one claim per account</h2>
          <ul>
            <li>You will see the exact expiry date and time as soon as you redeem.</li>
            <li>Access ends automatically, with no automatic renewal. Refreshing will not add time.</li>
            <li>Existing paid EPPP access and billing terms stay unchanged.</li>
          </ul>
        </aside>
      </main>
    </div>
  );
}
