import { useMemo, useState } from "react";
import { Activity, BarChart3, CalendarDays, CreditCard, RefreshCw, Users } from "lucide-react";
import { useGetAdminInsights } from "@workspace/api-client-react";

const WINDOWS = [7, 30, 90, 365] as const;
type WindowDays = (typeof WINDOWS)[number];

function formatCount(value: number | null | undefined): string {
  return value == null ? "Unavailable" : new Intl.NumberFormat().format(value);
}

function shortDate(value: string): string {
  const date = new Date(`${value}T00:00:00Z`);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", timeZone: "UTC" });
}

function metricTotal(left: number | null, right: number | null): number | null {
  return left == null || right == null ? null : left + right;
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <span className="insights-accent-well grid h-9 w-9 place-items-center rounded-xl">
          <Icon aria-hidden="true" className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-5 break-words text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {value}
      </p>
      <p className="mt-2 min-h-8 text-xs leading-relaxed text-muted-foreground">{detail}</p>
    </article>
  );
}

export default function AdminInsightsPage() {
  const [days, setDays] = useState<WindowDays>(30);
  const { data, isLoading, isError, error, refetch, isFetching } =
    useGetAdminInsights({ days });
  const unavailable = new Set(data?.unavailableSources ?? []);
  const trialTotal = metricTotal(data?.trials.psychpro ?? null, data?.trials.eppp ?? null);
  const paidTotal = metricTotal(data?.paid.psychpro ?? null, data?.paid.eppp ?? null);
  const maxTrendValue = useMemo(
    () =>
      Math.max(
        1,
        ...(data?.trend ?? []).flatMap((bucket) => [
          bucket.pageviews ?? 0,
          bucket.newAccounts ?? 0,
        ]),
      ),
    [data?.trend],
  );
  const hasData = Boolean(
    data &&
      [data.traffic.uniqueBrowsers, data.traffic.pageviews, data.accounts.newAccounts,
        data.trials.psychpro, data.trials.eppp, data.paid.psychpro, data.paid.eppp]
        .some((value) => value != null && value > 0),
  );
  const errorStatus = (error as { status?: number } | undefined)?.status;

  if (isError && errorStatus === 403) {
    return (
      <main className="admin-insights mx-auto max-w-3xl p-6 sm:p-10">
        <section className="rounded-2xl border border-border bg-card p-8 text-center">
          <h1 className="text-xl font-semibold text-foreground">Insights are owner-only</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in with the verified owner account to view these aggregate metrics.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-insights mx-auto w-full max-w-[1360px] px-4 py-6 text-foreground sm:px-7 sm:py-8 lg:px-10">
      <header className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-foreground">
            <BarChart3 aria-hidden="true" className="insights-accent h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-[0.15em]">
              PsychPro · Owner insights
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            A clear read on your funnel.
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Aggregate traffic, app accounts, trials, and completed payments across both suites.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="insights-window" className="sr-only">Reporting period</label>
          <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground">
            <CalendarDays aria-hidden="true" className="insights-accent h-4 w-4" />
            <select
              id="insights-window"
              value={days}
              onChange={(event) => setDays(Number(event.target.value) as WindowDays)}
              className="bg-transparent text-foreground outline-none"
            >
              {WINDOWS.map((windowDays) => (
                <option key={windowDays} value={windowDays}>Last {windowDays} days</option>
              ))}
            </select>
          </span>
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted disabled:cursor-wait disabled:opacity-60"
          >
            <RefreshCw aria-hidden="true" className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </header>

      {isLoading ? (
        <section aria-label="Loading insights" className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="h-36 animate-pulse rounded-2xl border border-border bg-card" />
          ))}
        </section>
      ) : isError ? (
        <section role="alert" className="mt-7 rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
          <h2 className="font-semibold text-foreground">Insights couldn’t be loaded</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The dashboard is temporarily unavailable. No numbers are substituted for missing data.
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-4 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted"
          >
            Try again
          </button>
        </section>
      ) : data ? (
        <>
          {data.unavailableSources.length > 0 && (
            <div role="status" className="mt-5 rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
              Some metrics are temporarily unavailable: {data.unavailableSources.join(", ")}.
              Available groups are still shown.
            </div>
          )}

          <section aria-label="Funnel overview" className="mt-7">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                The numbers to know
              </h2>
              <span className="text-xs text-muted-foreground">
                {new Date(data.period.start).toLocaleDateString()} – {new Date(data.period.end).toLocaleDateString()}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <MetricCard
                icon={Users}
                label="Unique browsers"
                value={formatCount(data.traffic.uniqueBrowsers)}
                detail="Estimated from anonymous first-party browser IDs."
              />
              <MetricCard
                icon={Activity}
                label="Pageviews"
                value={formatCount(data.traffic.pageviews)}
                detail="Broad route categories only; no exact URLs or study activity."
              />
              <MetricCard
                icon={Users}
                label="New app accounts"
                value={formatCount(data.accounts.newAccounts)}
                detail="First app profile creation, not abandoned registrations."
              />
              <MetricCard
                icon={CalendarDays}
                label="Trials started"
                value={formatCount(trialTotal)}
                detail={`PsychPro ${formatCount(data.trials.psychpro)} · EPPP ${formatCount(data.trials.eppp)}`}
              />
              <MetricCard
                icon={CreditCard}
                label="Paid starts"
                value={formatCount(paidTotal)}
                detail={`PsychPro ${formatCount(data.paid.psychpro)} · EPPP ${formatCount(data.paid.eppp)}`}
              />
            </div>
          </section>

          {!hasData && unavailable.size === 0 && (
            <p className="mt-5 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
              No tracked activity in this period yet. New production events will appear here.
            </p>
          )}

          <div className="mt-7 grid gap-5 xl:grid-cols-[1.03fr_0.97fr]">
            <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold">Traffic and new accounts</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {days <= 30 ? "Daily totals" : days <= 90 ? "Weekly totals" : "Monthly totals"} in the selected window
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 text-xs font-medium text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <i aria-hidden="true" className="insights-chart-accent h-2 w-2 rounded-full" /> Pageviews
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <i aria-hidden="true" className="h-2 w-2 rounded-full bg-muted-foreground/40" /> New app accounts
                  </span>
                </div>
              </div>
              <div
                role="img"
                aria-label="Pageviews and new app accounts by reporting bucket"
                className="mt-6 grid min-h-52 items-end gap-1 border-b border-border pb-2"
                style={{ gridTemplateColumns: `repeat(${Math.max(1, data.trend.length)}, minmax(0, 1fr))` }}
              >
                {data.trend.map((bucket) => {
                  const pageviewHeight = bucket.pageviews == null
                    ? 0
                    : Math.max(bucket.pageviews > 0 ? 3 : 0, (bucket.pageviews / maxTrendValue) * 100);
                  const accountHeight = bucket.newAccounts == null
                    ? 0
                    : Math.max(bucket.newAccounts > 0 ? 3 : 0, (bucket.newAccounts / maxTrendValue) * 100);
                  return (
                    <div key={bucket.label} className="flex h-48 min-w-0 flex-col items-center justify-end">
                      <div className="flex h-full w-full items-end justify-center gap-0.5">
                        <span
                          title={`${formatCount(bucket.pageviews)} pageviews`}
                          className="insights-chart-accent w-1/3 max-w-4 rounded-t-sm"
                          style={{ height: `${pageviewHeight}%` }}
                        />
                        <span
                          title={`${formatCount(bucket.newAccounts)} new app accounts`}
                          className="w-1/3 max-w-4 rounded-t-sm bg-muted-foreground/40"
                          style={{ height: `${accountHeight}%` }}
                        />
                      </div>
                      <span className="mt-2 w-full truncate text-center text-[9px] text-muted-foreground">
                        {shortDate(bucket.label)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Unique browsers are an estimate, not a count of identifiable people. New app accounts
                begin when an account first reaches the app.
              </p>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <div>
                <h2 className="text-base font-semibold">Two suites, one snapshot</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Trial starts and completed initial payments are kept separate.
                </p>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {([
                  { key: "psychpro", title: "PsychPro", trial: data.trials.psychpro, paid: data.paid.psychpro },
                  { key: "eppp", title: "EPPP Mastery Suite", trial: data.trials.eppp, paid: data.paid.eppp },
                ] as const).map((suite) => {
                  const plans = data.paid.byPlanCategory.filter((item) => item.suite === suite.key);
                  return (
                    <article key={suite.key} className="rounded-xl border border-border bg-background p-4">
                      <h3 className="text-sm font-semibold text-foreground">{suite.title}</h3>
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-2xl font-semibold tabular-nums">{formatCount(suite.trial)}</p>
                          <p className="mt-1 text-xs text-muted-foreground">trial starts</p>
                        </div>
                        <div>
                          <p className="text-2xl font-semibold tabular-nums">{formatCount(suite.paid)}</p>
                          <p className="mt-1 text-xs text-muted-foreground">paid starts</p>
                        </div>
                      </div>
                      {plans.length > 0 && (
                        <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
                          Plans: {plans.map((plan) => `${plan.planCategory.replaceAll("_", " ")} ${formatCount(plan.count)}`).join(" · ")}
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>
              <p className="mt-4 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
                Paid starts count successful initial Stripe checkouts only. Renewals and unpaid checkouts
                are not counted. Payment history starts when this ledger is deployed.
              </p>
            </section>
          </div>

          <footer className="mt-6 flex flex-col gap-1 border-t border-border pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>Owner overview · PsychPro + EPPP</span>
            <span>Updated {new Date(data.period.refreshedAt).toLocaleString()}</span>
          </footer>
        </>
      ) : null}
    </main>
  );
}
