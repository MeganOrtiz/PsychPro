import { useState } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  BookOpen,
  ChevronDown,
  CircleHelp,
  CreditCard,
  Download,
  ExternalLink,
  Eye,
  GraduationCap,
  LayoutDashboard,
  UsersRound,
} from "lucide-react";

const stages = [
  {
    id: "visitors",
    label: "Unique visitors",
    detail: "Anonymous browser estimate",
    value: "1,284",
    icon: UsersRound,
    tint: "bg-[#e8f6f3]",
    color: "text-[#167968]",
  },
  {
    id: "signups",
    label: "Signups",
    detail: "Created an account",
    value: "86",
    icon: Eye,
    tint: "bg-[#e8f6f3]",
    color: "text-[#167968]",
  },
  {
    id: "trials",
    label: "Suite trials",
    detail: "Seven-day trials started",
    value: "31",
    icon: BookOpen,
    tint: "bg-[#e8f6f3]",
    color: "text-[#167968]",
  },
  {
    id: "paid",
    label: "Paid starts",
    detail: "Completed purchase",
    value: "8",
    icon: CreditCard,
    tint: "bg-[#d9f1eb]",
    color: "text-[#0d695a]",
  },
];

const suiteRows = [
  {
    name: "PsychPro",
    description: "Psychology exam preparation",
    trials: "18",
    paid: "5",
    rate: "27.8%",
    width: "58%",
    marker: "bg-[#197b69]",
    Icon: GraduationCap,
  },
  {
    name: "EPPP",
    description: "EPPP exam preparation",
    trials: "13",
    paid: "3",
    rate: "23.1%",
    width: "42%",
    marker: "bg-[#8dc7b9]",
    Icon: BookOpen,
  },
];

function FunnelStage({
  stage,
  index,
}: {
  stage: (typeof stages)[number];
  index: number;
}) {
  const Icon = stage.icon;
  return (
    <div className="relative flex min-w-0 flex-1 items-stretch">
      <section className="flex w-full flex-col rounded-[10px] border border-[#dce9e5] bg-white px-5 pb-4 pt-5 shadow-[0_3px_14px_rgba(29,75,65,0.035)]">
        <div className="flex items-center justify-between">
          <div className={`grid h-9 w-9 place-items-center rounded-[9px] ${stage.tint} ${stage.color}`}>
            <Icon size={17} strokeWidth={1.8} />
          </div>
          <span className="font-mono text-[10px] font-medium tracking-[0.12em] text-[#68827b]">
            0{index + 1}
          </span>
        </div>
        <div className="mt-5">
          <p className="text-[12px] font-semibold tracking-[0.01em] text-[#29433d]">
            {stage.label}
          </p>
          <p className="mt-1 min-h-[30px] text-[11px] leading-[1.4] text-[#58716a]">
            {stage.detail}
          </p>
        </div>
        <div className="mt-4 border-t border-[#e8efec] pt-3">
          <span className="font-mono text-[28px] font-medium leading-none tracking-[-0.055em] text-[#17352e]">
            {stage.value}
          </span>
          <span className="ml-2 align-[3px] text-[9px] font-semibold uppercase tracking-[0.11em] text-[#71847e]">
            sample
          </span>
        </div>
      </section>
    </div>
  );
}

function ConversionLink({
  rate,
  caption,
}: {
  rate: string;
  caption: string;
}) {
  return (
    <div className="relative z-10 flex w-[86px] shrink-0 flex-col items-center justify-center">
      <div className="mb-1 flex items-center gap-1 rounded-full bg-[#f0f7f5] px-2.5 py-1.5 text-[#276f61]">
        <ArrowRight size={11} strokeWidth={2} />
        <span className="font-mono text-[11px] font-semibold">{rate}</span>
      </div>
      <span className="max-w-[78px] text-center text-[9px] leading-[1.35] text-[#687e77]">
        {caption}
      </span>
    </div>
  );
}

export function Funnel() {
  const [rangeOpen, setRangeOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState("Last 30 days");
  const [rangeNotice, setRangeNotice] = useState("");

  const ranges = ["Last 7 days", "Last 30 days", "Last 90 days"];

  return (
    <div className="min-h-[100dvh] bg-white font-['DM_Sans',sans-serif] text-[#17352e]">
      <div className="flex min-h-[100dvh]">
        <aside className="hidden w-[220px] shrink-0 flex-col border-r border-[#e4ece9] bg-white px-4 pb-5 pt-6 md:flex">
          <div className="flex items-center gap-3 px-2">
            <div className="grid h-9 w-9 place-items-center rounded-[10px] bg-[#dff2ed] text-[#126d5d]">
              <span className="font-['DM_Sans',sans-serif] text-[15px] font-bold tracking-[-0.08em]">P.</span>
            </div>
            <div>
              <p className="text-[14px] font-bold tracking-[-0.03em] text-[#18372f]">PsychPro</p>
              <p className="mt-0.5 text-[10px] font-medium tracking-[0.045em] text-[#667d75]">OWNER CONSOLE</p>
            </div>
          </div>

          <div className="mt-10 px-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[#72867f]">
            Workspace
          </div>
          <nav className="mt-3 space-y-1" aria-label="Owner navigation">
            <div className="flex items-center gap-3 rounded-[7px] px-3 py-[10px] text-[12px] font-medium text-[#5b706a]">
              <LayoutDashboard size={16} strokeWidth={1.8} />
              Overview
            </div>
            <div className="flex items-center gap-3 rounded-[7px] border border-[#cfe6df] bg-[#eff8f5] px-3 py-[10px] text-[12px] font-semibold text-[#176d5d]">
              <BarChart3 size={16} strokeWidth={2} />
              Insights
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#338b79]" />
            </div>
            <div className="flex items-center gap-3 rounded-[7px] px-3 py-[10px] text-[12px] font-medium text-[#5b706a]">
              <GraduationCap size={16} strokeWidth={1.8} />
              Suite activity
            </div>
          </nav>

          <div className="mt-auto rounded-[9px] border border-[#e2ece8] bg-white px-3.5 py-3">
            <div className="flex items-center gap-2 text-[#54756c]">
              <CircleHelp size={14} />
              <span className="text-[11px] font-semibold">About these figures</span>
            </div>
            <p className="mt-2 text-[10px] leading-[1.55] text-[#526a63]">
              Anonymous estimates shown for concept review. No individual account details.
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="flex min-h-[65px] items-center justify-between border-b border-[#e7eeeb] px-5 md:px-9">
            <div className="flex items-center gap-2 text-[11px] text-[#647a73]">
              <span className="font-medium">Owner console</span>
              <span className="text-[#a1b0ab]">/</span>
              <span className="font-semibold text-[#29463e]">Insights</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#dce9e5] px-2.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#60a995]" />
              <span className="text-[10px] font-semibold tracking-[0.04em] text-[#536e65]">SAMPLE VIEW</span>
            </div>
          </header>

          <div className="mx-auto max-w-[1180px] px-5 pb-10 pt-7 md:px-9 md:pt-9">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#398675]">
                  PsychPro + EPPP · Owner insights
                </p>
                <h1 className="mt-2 font-['DM_Sans',sans-serif] text-[30px] font-semibold leading-[1.08] tracking-[-0.055em] text-[#17352e] md:text-[36px]">
                  From first visit to paid
                </h1>
                <p className="mt-2 max-w-[570px] text-[13px] leading-[1.6] text-[#4f6961]">
                  A clear read on where prospective learners move forward — and where they pause.
                </p>
              </div>
              <div className="relative flex shrink-0 items-center gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setRangeOpen((open) => !open)}
                    aria-expanded={rangeOpen}
                    className="flex h-9 items-center gap-2 rounded-[7px] border border-[#dce8e4] bg-white px-3 text-[11px] font-semibold text-[#35564d] transition-colors hover:bg-[#f7fbf9] focus:outline-none focus:ring-2 focus:ring-[#b5dacf]"
                  >
                    {selectedRange}
                    <ChevronDown size={13} />
                  </button>
                  {rangeOpen && (
                    <div className="absolute right-0 top-11 z-20 w-[150px] rounded-[8px] border border-[#dce8e4] bg-white p-1 shadow-[0_8px_24px_rgba(32,67,58,0.12)]">
                      {ranges.map((range) => (
                        <button
                          type="button"
                          key={range}
                          onClick={() => {
                            setSelectedRange(range);
                            setRangeOpen(false);
                            setRangeNotice("Sample figures are unchanged across periods.");
                          }}
                          className={`block w-full rounded-[5px] px-2.5 py-2 text-left text-[11px] ${selectedRange === range ? "bg-[#eff8f5] font-semibold text-[#176d5d]" : "text-[#4d665e] hover:bg-[#f7fbf9]"}`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setRangeNotice("Export is unavailable in this sample dashboard.")}
                  className="flex h-9 items-center gap-2 rounded-[7px] border border-[#dce8e4] bg-white px-3 text-[11px] font-semibold text-[#35564d] transition-colors hover:bg-[#f7fbf9] focus:outline-none focus:ring-2 focus:ring-[#b5dacf]"
                >
                  <Download size={13} />
                  Export
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-y border-[#e3ece8] py-2.5">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px]">
                <span className="rounded-[4px] bg-[#eaf6f2] px-1.5 py-1 font-bold uppercase tracking-[0.08em] text-[#216f60]">
                  Sample data
                </span>
                <span className="font-medium text-[#536d65]">
                  Illustrative values only · not live analytics
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#5d746c]">Period: {selectedRange} · sample</span>
            </div>
            {rangeNotice && (
              <div role="status" className="mt-2 text-[10px] font-medium text-[#347666]">
                {rangeNotice}
              </div>
            )}

            <section className="mt-7" aria-labelledby="funnel-heading">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 id="funnel-heading" className="text-[15px] font-bold tracking-[-0.025em] text-[#1e3d35]">
                      Conversion funnel
                    </h2>
                    <span className="rounded-[4px] border border-[#e0eae6] px-1.5 py-0.5 text-[9px] font-semibold text-[#5e766e]">
                      SAMPLE
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#58716a]">
                    Each rate is measured against the step immediately before it.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-[#577068]">
                  <span className="h-2 w-2 rounded-full bg-[#4a9b88]" />
                  Anonymous journey estimate
                </div>
              </div>

              <div className="mt-4 rounded-[11px] border border-[#e1ebe7] bg-[#fbfdfc] p-3 sm:p-4">
                <div className="grid grid-cols-1 gap-2 sm:flex sm:items-stretch sm:gap-0">
                  {stages.map((stage, index) => (
                    <div key={stage.id} className="contents">
                      <FunnelStage stage={stage} index={index} />
                      {index < stages.length - 1 && (
                        <ConversionLink
                          rate={["6.7%", "36.0%", "25.8%"][index]}
                          caption={["visitor → signup", "signup → any trial", "trial → paid"][index]}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-[#e5eeea] pt-3">
                  <div className="flex items-center gap-2 text-[10px] text-[#58716a]">
                    <ArrowDownRight size={14} className="text-[#378372]" />
                    <span>Visitor → paid overall</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[13px] font-semibold text-[#176d5d]">0.6%</span>
                    <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#637a72]">sample conversion</span>
                  </div>
                </div>
              </div>
            </section>

            <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(250px,0.75fr)]">
              <section className="rounded-[10px] border border-[#e1ebe7] bg-white p-5" aria-labelledby="suite-heading">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 id="suite-heading" className="text-[14px] font-bold tracking-[-0.02em] text-[#1e3d35]">
                        Trial → paid, by suite
                      </h2>
                      <span className="rounded-[4px] bg-[#f0f7f5] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.05em] text-[#397968]">sample</span>
                    </div>
                    <p className="mt-1 text-[10px] text-[#5a726a]">
                      Paid starts divided by seven-day trial starts.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-[#567068]">
                    Both suites
                    <ArrowDown size={12} />
                  </div>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#eaf1ee]" aria-label="Sample trial share by suite">
                  <div className="flex h-full w-full">
                    <div className="h-full bg-[#197b69]" style={{ width: "58.1%" }} />
                    <div className="h-full bg-[#8dc7b9]" style={{ width: "41.9%" }} />
                  </div>
                </div>

                <div className="mt-1 flex justify-between font-mono text-[9px] text-[#687e77]">
                  <span>31 trial starts · sample</span>
                  <span>8 paid starts · sample</span>
                </div>

                <div className="mt-3 divide-y divide-[#e8efec]">
                  {suiteRows.map(({ name, description, trials, paid, rate, marker, Icon }) => (
                    <div key={name} className="grid grid-cols-[minmax(130px,1.4fr)_0.65fr_0.65fr_0.7fr] items-center gap-3 py-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className={`h-2.5 w-2.5 shrink-0 rounded-[3px] ${marker}`} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <Icon size={13} className="shrink-0 text-[#4c7066]" />
                            <span className="truncate text-[11px] font-bold text-[#29463e]">{name}</span>
                          </div>
                          <p className="mt-0.5 truncate text-[9px] text-[#60776f]">{description}</p>
                        </div>
                      </div>
                      <div>
                        <p className="font-mono text-[12px] font-semibold text-[#24443b]">{trials}</p>
                        <p className="mt-0.5 text-[9px] text-[#647a73]">trials · sample</p>
                      </div>
                      <div>
                        <p className="font-mono text-[12px] font-semibold text-[#24443b]">{paid}</p>
                        <p className="mt-0.5 text-[9px] text-[#647a73]">paid · sample</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-[12px] font-semibold text-[#176d5d]">{rate}</p>
                        <p className="mt-0.5 text-[9px] text-[#647a73]">sample rate</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="flex flex-col rounded-[10px] border border-[#e1ebe7] bg-white p-5" aria-labelledby="traffic-heading">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 id="traffic-heading" className="text-[14px] font-bold tracking-[-0.02em] text-[#1e3d35]">
                      Traffic context
                    </h2>
                    <p className="mt-1 text-[10px] text-[#5a726a]">Top of funnel · sample period</p>
                  </div>
                  <div className="grid h-8 w-8 place-items-center rounded-[8px] bg-[#eff8f5] text-[#397968]">
                    <BarChart3 size={15} />
                  </div>
                </div>
                <div className="mt-4 flex items-end justify-between border-b border-[#e8efec] pb-3">
                  <div>
                    <p className="font-mono text-[25px] font-medium leading-none tracking-[-0.05em] text-[#193a31]">3,960</p>
                    <p className="mt-1.5 text-[10px] font-medium text-[#58716a]">Pageviews · sample</p>
                  </div>
                  <span className="rounded-[5px] bg-[#f2f8f6] px-2 py-1 text-[9px] font-semibold text-[#49756a]">
                    3.1 / visitor · sample
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[10px]">
                  <span className="text-[#59726a]">Unique visitors</span>
                  <span className="font-mono font-semibold text-[#28483f]">1,284 · sample</span>
                </div>
                <div className="mt-4 rounded-[7px] border-l-[2px] border-[#80bcae] bg-[#f5faf8] px-3 py-2.5">
                  <p className="text-[10px] font-semibold text-[#31584d]">Reading the funnel</p>
                  <p className="mt-1 text-[10px] leading-[1.55] text-[#516d64]">
                    The largest relative drop comes before signup. Trial-to-paid is shown separately for PsychPro and EPPP.
                  </p>
                </div>
              </section>
            </div>

            <footer className="mt-6 flex flex-col gap-2 border-t border-[#e6eeeb] pt-3 text-[9px] text-[#5d756d] sm:flex-row sm:items-center sm:justify-between">
              <span>PsychPro owner insights · illustrative sample values · no personal data</span>
              <span className="inline-flex items-center gap-1.5">
                Conversion context is directional, not a forecast.
                <ExternalLink size={10} />
              </span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
