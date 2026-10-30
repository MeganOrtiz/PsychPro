import { useState } from "react";

const days = [
  { day: "Mon", visitors: 155, signups: 9 },
  { day: "Tue", visitors: 168, signups: 10 },
  { day: "Wed", visitors: 172, signups: 11 },
  { day: "Thu", visitors: 181, signups: 12 },
  { day: "Fri", visitors: 194, signups: 13 },
  { day: "Sat", visitors: 198, signups: 14 },
  { day: "Sun", visitors: 216, signups: 17 },
];

function TrendChart({ showSignups }: { showSignups: boolean }) {
  const visitorPoints = days
    .map((point, index) => `${74 + index * 158},${211 - (point.visitors - 145) * 1.18}`)
    .join(" ");
  const signupPoints = days
    .map((point, index) => `${74 + index * 158},${337 - point.signups * 7.1}`)
    .join(" ");

  return (
    <svg
      className="h-full w-full overflow-visible"
      viewBox="0 0 1040 390"
      role="img"
      aria-label="Sample seven-day trend: visitors and signups both rise through the week"
      preserveAspectRatio="none"
    >
      {[72, 142, 212, 282, 352].map((y, index) => (
        <g key={y}>
          <line x1="58" x2="1018" y1={y} y2={y} stroke="#e4eeec" strokeDasharray="3 7" />
          <text x="0" y={y + 4} fill="#50635f" fontSize="11" fontFamily="ui-monospace, monospace">
            {index === 0 ? "220" : index === 1 ? "200" : index === 2 ? "180" : index === 3 ? "160" : "140"}
          </text>
        </g>
      ))}
      <text x="0" y="23" fill="#536662" fontSize="10" fontFamily="ui-monospace, monospace" letterSpacing="1.1">
        VISITORS
      </text>
      <polyline points={visitorPoints} fill="none" stroke="#178c83" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      {days.map((point, index) => {
        const x = 74 + index * 158;
        const y = 211 - (point.visitors - 145) * 1.18;
        return (
          <g key={point.day}>
            <circle cx={x} cy={y} r="5" fill="#fff" stroke="#178c83" strokeWidth="3" />
            <text x={x} y="382" textAnchor="middle" fill="#50635f" fontSize="12" fontFamily="ui-monospace, monospace">
              {point.day}
            </text>
          </g>
        );
      })}
      {showSignups && (
        <>
          <polyline points={signupPoints} fill="none" stroke="#bd8a43" strokeWidth="3" strokeDasharray="7 7" strokeLinecap="round" strokeLinejoin="round" />
          {days.map((point, index) => (
            <circle
              key={`signup-${point.day}`}
              cx={74 + index * 158}
              cy={337 - point.signups * 7.1}
              r="4"
              fill="#fff"
              stroke="#bd8a43"
              strokeWidth="2.5"
            />
          ))}
        </>
      )}
    </svg>
  );
}

function SuiteRow({
  suite,
  tint,
  trials,
  paid,
  rate,
}: {
  suite: string;
  tint: string;
  trials: string;
  paid: string;
  rate: string;
}) {
  return (
    <div className="grid grid-cols-[minmax(120px,1.2fr)_repeat(3,minmax(76px,1fr))] items-center gap-3 border-t border-[#e5eeec] py-4 first:border-0">
      <div className="flex items-center gap-3">
        <span className={`h-2.5 w-2.5 rounded-full ${tint}`} />
        <span className="font-semibold text-[#183632]">{suite}</span>
      </div>
      <div>
        <div className="text-[10px] font-medium uppercase tracking-[.12em] text-[#50635f] md:hidden">Trials</div>
        <div className="font-mono text-[15px] text-[#183632]">{trials}</div>
      </div>
      <div>
        <div className="text-[10px] font-medium uppercase tracking-[.12em] text-[#50635f] md:hidden">Paid starts</div>
        <div className="font-mono text-[15px] text-[#183632]">{paid}</div>
      </div>
      <div>
        <div className="text-[10px] font-medium uppercase tracking-[.12em] text-[#50635f] md:hidden">Trial → paid</div>
        <div className="font-mono text-[15px] text-[#183632]">{rate}</div>
      </div>
    </div>
  );
}

export function Trends() {
  const [showSignups, setShowSignups] = useState(true);
  return (
    <main className="min-h-[100dvh] bg-white px-5 py-7 text-[#183632] sm:px-8 lg:px-12 lg:py-9">
      <div className="mx-auto max-w-[1440px]">
        <header className="flex flex-col gap-6 border-b border-[#dce8e5] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <span className="inline-flex h-7 items-center border border-[#b9d9d4] px-2.5 text-[10px] font-semibold uppercase tracking-[.16em] text-[#147a72]">
                Owner insights
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[.11em] text-[#50635f]">PsychPro · EPPP</span>
            </div>
            <h1 className="font-['DM_Sans'] text-[32px] font-semibold leading-none tracking-[-.045em] sm:text-[39px]">
              The week, in motion<span className="text-[#178c83]">.</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#405550]">
              Follow the path from first visit to paid start. Every figure on this page is sample data, not live.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <span className="text-[11px] font-semibold uppercase tracking-[.13em] text-[#405550]">Period</span>
            <div className="flex h-10 items-center gap-2 border border-[#cbdcd8] px-3.5 text-sm font-medium">
              <span>Last 7 days</span>
              <span className="font-mono text-[10px] uppercase tracking-[.08em] text-[#50635f]">Sample period</span>
            </div>
          </div>
        </header>

        <section className="pt-7" aria-labelledby="trend-title">
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 font-mono text-[11px] uppercase tracking-[.13em] text-[#147a72]">01 / Traffic &amp; signup trend</div>
              <h2 id="trend-title" className="text-[21px] font-semibold tracking-[-.03em]">A steadier climb into the weekend</h2>
              <p className="mt-1.5 text-[13px] text-[#405550]">Sample daily estimates · unique browsers and new signups</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="inline-flex items-center gap-2 text-xs font-medium text-[#28433e]">
                <i className="h-[3px] w-5 rounded-full bg-[#178c83]" /> Unique visitors
              </span>
              <button
                type="button"
                aria-pressed={showSignups}
                onClick={() => setShowSignups((visible) => !visible)}
                className="inline-flex items-center gap-2 text-xs font-medium text-[#28433e] outline-none focus-visible:ring-2 focus-visible:ring-[#178c83]"
              >
                <i className={`h-[3px] w-5 rounded-full ${showSignups ? "bg-[#bd8a43]" : "bg-[#a5b5b1]"}`} />
                Signups <span className="text-[10px] text-[#50635f]">{showSignups ? "shown" : "hidden"}</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_275px]">
            <div className="border border-[#dce8e5] px-4 pb-3 pt-4 sm:px-6">
              <div className="h-[245px] sm:h-[285px]">
                <TrendChart showSignups={showSignups} />
              </div>
              <div className="mt-2 flex flex-col gap-2 border-t border-[#e5eeec] pt-3 text-xs sm:flex-row sm:items-center sm:justify-between">
                <span className="text-[#405550]">Sample period comparison</span>
                <span className="font-medium text-[#147a72]">Visitor trend up through the week <span aria-hidden="true">↗</span></span>
              </div>
            </div>
            <aside className="flex flex-col justify-between border border-[#dce8e5] bg-[#f4faf8] p-5 sm:p-6">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[.15em] text-[#50635f]">Sample total · 7 days</div>
                <div className="mt-3 font-mono text-[42px] leading-none tracking-[-.06em] text-[#147a72]">1,284</div>
                <div className="mt-2 text-sm font-medium">estimated unique visitors</div>
                <p className="mt-1.5 text-xs leading-5 text-[#405550]">Anonymous browser estimate; not a count of named people.</p>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[#d4e4e0] pt-4">
                <div>
                  <div className="font-mono text-[22px] tracking-[-.04em]">3,960</div>
                  <div className="mt-1 text-[11px] text-[#405550]">pageviews · sample</div>
                </div>
                <div>
                  <div className="font-mono text-[22px] tracking-[-.04em]">86</div>
                  <div className="mt-1 text-[11px] text-[#405550]">signups · sample</div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="mt-8 border-t border-[#dce8e5] pt-6" aria-labelledby="conversion-title">
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 font-mono text-[11px] uppercase tracking-[.13em] text-[#147a72]">02 / Suite conversion</div>
              <h2 id="conversion-title" className="text-[21px] font-semibold tracking-[-.03em]">Where trials become paid starts</h2>
            </div>
            <span className="text-xs text-[#405550]">Sample seven-day totals · suites kept separate</span>
          </div>
          <div className="border-y border-[#dce8e5]">
            <div className="hidden grid-cols-[minmax(120px,1.2fr)_repeat(3,minmax(76px,1fr))] gap-3 py-3 font-mono text-[10px] uppercase tracking-[.11em] text-[#50635f] md:grid">
              <div>Suite</div><div>Trials started</div><div>Paid starts</div><div>Trial → paid</div>
            </div>
            <SuiteRow suite="PsychPro" tint="bg-[#178c83]" trials="Sample · 18" paid="Sample · 5" rate="Sample · 27.8%" />
            <SuiteRow suite="EPPP" tint="bg-[#bd8a43]" trials="Sample · 13" paid="Sample · 3" rate="Sample · 23.1%" />
          </div>
          <div className="mt-3 flex flex-col gap-1 text-[11px] leading-5 text-[#405550] sm:flex-row sm:justify-between">
            <span>Both trials are seven-day trials. Paid starts are completed purchases, split by suite.</span>
            <span className="font-mono">Sample conversion context: 31 trials → 8 paid starts</span>
          </div>
        </section>

        <footer className="mt-7 flex flex-col gap-2 border-t border-[#dce8e5] pt-4 text-[10px] font-medium uppercase tracking-[.12em] text-[#50635f] sm:flex-row sm:items-center sm:justify-between">
          <span>PsychPro / Private owner dashboard concept</span>
          <span>All values are illustrative sample data · no live reporting</span>
        </footer>
      </div>
    </main>
  );
}
