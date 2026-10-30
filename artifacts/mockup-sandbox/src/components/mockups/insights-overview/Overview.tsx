export function Overview() {
  const overview = [
    { label: "Unique visitors", value: "1,284", detail: "anonymous browser estimate", note: "3,960 pageviews" },
    { label: "Signups", value: "86", detail: "6.7% of unique visitors", note: "visitor → signup" },
    { label: "Trials started", value: "31", detail: "36.0% of signups", note: "18 PsychPro · 13 EPPP" },
    { label: "Paid starts", value: "8", detail: "completed purchases", note: "5 PsychPro · 3 EPPP" },
  ];

  const trend = [
    { day: "MON", visitors: 33, signups: 24 },
    { day: "TUE", visitors: 46, signups: 34 },
    { day: "WED", visitors: 40, signups: 29 },
    { day: "THU", visitors: 59, signups: 42 },
    { day: "FRI", visitors: 52, signups: 36 },
    { day: "SAT", visitors: 70, signups: 49 },
    { day: "SUN", visitors: 63, signups: 45 },
  ];

  return (
    <main className="min-h-[100dvh] bg-white px-5 py-6 text-[#172a32] sm:px-8 sm:py-8 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        <header className="flex flex-col gap-5 border-b border-[#dce9e9] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#dff5f1] text-[#087e78]">
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
                  <path d="M4 17.5 9 12l3.2 3.1L20 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15.5 7H20v4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#31545a]">PsychPro / Owner insights</span>
              <span className="rounded-full border border-[#c5e6e2] bg-[#f2fbf9] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#087e78]">Admin view</span>
            </div>
            <h1 className="font-['DM_Sans'] text-[32px] font-semibold leading-none tracking-[-0.045em] sm:text-[39px]">A clear read on your funnel.</h1>
            <p className="mt-2 text-[14px] text-[#49626a]">Traffic, intent, and completed purchases across PsychPro and EPPP.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-2 rounded-lg border border-[#d5e4e5] px-3 py-2 text-[12px] font-semibold text-[#2b454d]">
              <svg viewBox="0 0 20 20" className="h-4 w-4 text-[#087e78]" fill="none" aria-hidden="true">
                <rect x="2.8" y="4" width="14.4" height="13" rx="2" stroke="currentColor" strokeWidth="1.4" />
                <path d="M6 2.8v2.7M14 2.8v2.7M3 7.6h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              Last 7 days
            </span>
            <span className="rounded-lg bg-[#f0f8f7] px-3 py-2 text-[11px] font-semibold text-[#31545a]">Sample data · Not live</span>
          </div>
        </header>

        <section aria-label="Funnel overview" className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#31545a]">The four numbers to know</h2>
            <span className="text-[11px] font-medium text-[#526b72]">All figures shown are sample values</span>
          </div>
          <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-[#dce9e9] sm:grid-cols-2 lg:grid-cols-4">
            {overview.map((item, index) => (
              <article key={item.label} className={`relative min-h-[158px] px-5 py-5 ${index > 0 ? "border-t border-[#dce9e9] sm:border-l sm:border-t-0" : ""} ${index === 2 ? "lg:border-l" : ""}`}>
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-[#36515a]">{item.label}</p>
                  <span className="h-2 w-2 rounded-full bg-[#26a99c]" />
                </div>
                <p className="mt-4 font-['DM_Sans'] text-[38px] font-semibold leading-none tracking-[-0.055em] tabular-nums text-[#172a32]">{item.value}</p>
                <p className="mt-2 text-[12px] font-medium text-[#49626a]">{item.detail}</p>
                <div className="mt-4 border-t border-[#e5eeee] pt-3 text-[11px] font-semibold text-[#087e78]">{item.note}</div>
              </article>
            ))}
          </div>
          <p className="mt-2 text-right text-[10px] font-medium text-[#526b72]">Sample values for the last 7 days · visitor totals are estimated from unique browsers</p>
        </section>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.03fr_0.97fr]">
          <section className="rounded-2xl border border-[#dce9e9] px-5 py-5 sm:px-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[16px] font-bold tracking-[-0.02em]">Traffic &amp; signup pulse</h2>
                  <span className="rounded-full bg-[#eff8f7] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#087e78]">Sample trend</span>
                </div>
                <p className="mt-1 text-[12px] text-[#49626a]">Daily pattern within the selected seven-day window</p>
              </div>
              <div className="flex gap-4 pt-1 text-[10px] font-semibold text-[#36515a]">
                <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#159d92]" /> Visitors</span>
                <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#a5d8d2]" /> Signups</span>
              </div>
            </div>
            <div className="mt-6">
              <div className="relative h-[178px] border-b border-[#dce9e9]">
                <div className="absolute inset-x-0 top-[20%] border-t border-dashed border-[#e5eeee]" />
                <div className="absolute inset-x-0 top-[50%] border-t border-dashed border-[#e5eeee]" />
                <div className="absolute inset-x-0 top-[80%] border-t border-dashed border-[#e5eeee]" />
                <div className="absolute inset-0 flex items-end justify-between gap-3 px-2">
                  {trend.map((item) => (
                    <div key={item.day} className="flex h-full flex-1 flex-col items-center justify-end">
                      <div className="flex h-[83%] w-full items-end justify-center gap-[5px]">
                        <div className="w-[min(22px,38%)] rounded-t-[5px] bg-[#159d92]" style={{ height: `${item.visitors}%` }} title={`${item.visitors} sample visitors`} />
                        <div className="w-[min(22px,38%)] rounded-t-[5px] bg-[#a5d8d2]" style={{ height: `${item.signups}%` }} title={`${item.signups} sample signups`} />
                      </div>
                      <span className="mt-2 text-[9px] font-bold tracking-[0.08em] text-[#526b72]">{item.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-3 rounded-xl bg-[#f2faf9] px-4 py-3">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#d9f1ed] text-[#087e78]">
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" aria-hidden="true"><path d="M10 3v14M5 8l5-5 5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <p className="text-[11px] leading-[1.55] text-[#36515a]"><strong className="font-bold text-[#172a32]">Conversion context:</strong> sample signup rate is 6.7% of estimated unique visitors. The trend is illustrative, not live reporting.</p>
            </div>
          </section>

          <section className="rounded-2xl border border-[#dce9e9] px-5 py-5 sm:px-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[16px] font-bold tracking-[-0.02em]">Two suites, one snapshot</h2>
                <p className="mt-1 text-[12px] text-[#49626a]">Trials and completed paid starts, kept separate</p>
              </div>
              <span className="rounded-full border border-[#d5e4e5] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#36515a]">Sample values</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <article className="rounded-xl border border-[#cfe7e3] bg-[#f5fbfa] p-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#119b90]" />
                  <h3 className="text-[12px] font-bold text-[#174b4c]">PsychPro</h3>
                </div>
                <p className="mt-5 font-['DM_Sans'] text-[31px] font-semibold leading-none tracking-[-0.05em] tabular-nums">18</p>
                <p className="mt-1 text-[11px] font-semibold text-[#49626a]">trial starts</p>
                <div className="my-4 border-t border-[#d9eae7]" />
                <p className="font-['DM_Sans'] text-[26px] font-semibold leading-none tracking-[-0.04em] tabular-nums">5</p>
                <p className="mt-1 text-[11px] font-semibold text-[#49626a]">completed paid starts</p>
                <p className="mt-3 rounded-md bg-white px-2.5 py-2 text-[10px] font-semibold text-[#31545a]">27.8% of trials → paid</p>
              </article>
              <article className="rounded-xl border border-[#dce9e9] bg-white p-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#73bdb5]" />
                  <h3 className="text-[12px] font-bold text-[#174b4c]">EPPP</h3>
                </div>
                <p className="mt-5 font-['DM_Sans'] text-[31px] font-semibold leading-none tracking-[-0.05em] tabular-nums">13</p>
                <p className="mt-1 text-[11px] font-semibold text-[#49626a]">trial starts</p>
                <div className="my-4 border-t border-[#e5eeee]" />
                <p className="font-['DM_Sans'] text-[26px] font-semibold leading-none tracking-[-0.04em] tabular-nums">3</p>
                <p className="mt-1 text-[11px] font-semibold text-[#49626a]">completed paid starts</p>
                <p className="mt-3 rounded-md bg-[#f2faf9] px-2.5 py-2 text-[10px] font-semibold text-[#31545a]">23.1% of trials → paid</p>
              </article>
            </div>
            <div className="mt-4 border-t border-[#e5eeee] pt-3 text-[10px] leading-[1.5] text-[#49626a]">
              Paid-start rates use completed paid starts divided by suite trial starts. Values are sample data for this concept.
            </div>
          </section>
        </div>

        <footer className="mt-6 flex flex-col gap-1 border-t border-[#dce9e9] pt-4 text-[10px] font-medium text-[#49626a] sm:flex-row sm:items-center sm:justify-between">
          <span>Owner overview · PsychPro + EPPP</span>
          <span>Sample data only · No personal information displayed</span>
        </footer>
      </div>
    </main>
  );
}
