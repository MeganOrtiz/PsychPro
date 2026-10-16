import { useState } from "react";
import { Check, ChevronRight, GraduationCap, Sparkles } from "lucide-react";
import "./_group.css";

type PlanOption = {
  id: string;
  label: string;
  amount: string;
  cadence: string;
  billing: string;
  note?: string;
};

const psychproFeatures = [
  "Every built-in topic: flashcards, quizzes, study guides, and practice exams",
  "Course mastery exams and progress tracking",
  "Upload PDF, DOCX, or TXT notes, or paste text",
  "AI builds flashcards, quizzes, study guides, and exams from your own material",
  "50 AI generation requests per month (each selected tool counts as one)",
];

const psychproOptions: PlanOption[] = [
  { id: "psychpro-monthly", label: "Monthly", amount: "$19.99", cadence: "/ month", billing: "Recurring · billed monthly" },
  { id: "psychpro-yearly", label: "Yearly", amount: "$159.99", cadence: "/ year", billing: "Recurring · billed yearly", note: "Save $79.89 vs monthly" },
];

const epppOptions: PlanOption[] = [
  { id: "eppp-monthly", label: "Monthly", amount: "$99", cadence: "/ month", billing: "Recurring · billed monthly" },
  { id: "eppp-six", label: "6 months", amount: "$499", cadence: "for 6 months", billing: "Prepaid · one-time payment" },
  { id: "eppp-year", label: "12 months", amount: "$799", cadence: "for 12 months", billing: "Prepaid · one-time payment" },
];

function Option({
  option,
  selected,
  onSelect,
  suite,
}: {
  option: PlanOption;
  selected: boolean;
  onSelect: () => void;
  suite: string;
}) {
  return (
    <button
      type="button"
      className={`pp-glass pp-option w-full p-4 text-left ${selected ? "is-selected" : ""}`}
      aria-pressed={selected}
      aria-label={`Select ${suite} ${option.label}, ${option.amount} ${option.cadence}`}
      onClick={onSelect}
    >
      <span className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[.12em] text-[#51595f]">{option.label}</span>
        <span className={`mt-0.5 flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full border ${selected ? "border-[#43494e] bg-[#43494e] text-white" : "border-[#9da5aa] bg-white"}`}>
          {selected && <Check size={11} strokeWidth={3} />}
        </span>
      </span>
      <span className="mt-3 flex items-baseline gap-1.5">
        <span className="pp-price text-[32px] font-bold">{option.amount}</span>
        <span className="text-[11px] font-medium text-[#646c72]">{option.cadence}</span>
      </span>
      <span className="mt-2 block text-[10px] font-medium tracking-[.01em] text-[#596167]">{option.billing}</span>
      {option.note && <span className="mt-2 inline-block rounded-full border border-[#c6ccd0] bg-white/70 px-2.5 py-1 text-[10px] font-semibold text-[#485056]">{option.note}</span>}
    </button>
  );
}

export function Plans() {
  const [selected, setSelected] = useState("psychpro-monthly");
  const [confirmation, setConfirmation] = useState("");
  const chosen = [...psychproOptions, ...epppOptions].find((option) => option.id === selected)!;
  const suite = selected.startsWith("eppp") ? "EPPP Mastery Suite" : "PsychPro";

  function previewSelection() {
    setConfirmation(`${suite} · ${chosen.amount} ${chosen.cadence} · ${chosen.billing}.`);
  }

  return (
    <main className="paid-plans min-h-[100dvh] px-5 pb-10 pt-8 sm:px-8 sm:pt-11">
      <div className="mx-auto max-w-[1120px]">
        <header className="mb-7 flex flex-col gap-5 border-b border-[#cbd0d4] pb-6 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.24em] text-[#697176]">
              <span className="h-px w-7 bg-[#92999e]" /> PsychPro learning suite
            </div>
            <h1 className="text-[38px] font-medium leading-[1.02] tracking-[-.055em] sm:text-[48px]">Choose your plan.</h1>
            <p className="mt-3 max-w-[620px] text-[13px] leading-6 text-[#596167] sm:text-sm">
              Coursework and custom study tools, or focused EPPP licensure preparation. Choose the workspace that fits your next step.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full border border-[#cbd0d4] bg-white/65 px-3 py-2 text-[10px] font-medium tracking-[.08em] text-[#596167] sm:self-auto">
            <span className="h-1.5 w-1.5 rounded-full bg-[#656c71]" /> Two separate suites
          </div>
        </header>

        {confirmation && (
          <div role="status" className="pp-preview-note mb-5 flex items-start justify-between gap-4 px-4 py-3 text-xs">
            <span><strong className="text-[#2e353a]">Preview only — no checkout.</strong> {confirmation}</span>
            <button type="button" className="text-[10px] font-semibold uppercase tracking-[.1em] text-[#596167] underline underline-offset-2" onClick={() => setConfirmation("")}>Dismiss</button>
          </div>
        )}

        <div className="pp-plan-grid grid grid-cols-2 items-stretch gap-5 lg:gap-6">
          <section className="pp-opaque flex flex-col p-5 sm:p-7" aria-labelledby="psychpro-heading">
            <div className="mb-5 flex items-center gap-3">
              <span className="pp-icon-well"><Sparkles size={19} strokeWidth={1.8} /></span>
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[.21em] text-[#777f84]">Coursework & custom study</p>
                <h2 id="psychpro-heading" className="mt-0.5 text-[23px] font-semibold tracking-[-.035em]">PsychPro</h2>
              </div>
            </div>
            <div className="mb-6 rounded-xl border border-[#d3d8db] bg-white/60 px-4 py-3">
              <p className="text-[12px] leading-5 text-[#51595f]">A full learning suite for your courses, built-in topics, and study material.</p>
            </div>
            <div className="mb-6 space-y-3.5">
              {psychproFeatures.map((feature) => (
                <div key={feature} className="pp-check"><Check size={16} /><span>{feature}</span></div>
              ))}
            </div>
            <div className="mt-auto border-t border-[#cbd0d4] pt-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[10px] font-semibold uppercase tracking-[.17em] text-[#555e63]">Choose billing</h3>
                <span className="text-[10px] text-[#737b80]">All prices in USD</span>
              </div>
              <div className="pp-option-grid grid grid-cols-2 gap-3">
                {psychproOptions.map((option) => (
                  <Option key={option.id} option={option} suite="PsychPro" selected={selected === option.id} onSelect={() => { setSelected(option.id); setConfirmation(""); }} />
                ))}
              </div>
              <button type="button" className="pp-chrome-button mt-4 w-full" onClick={previewSelection}>
                Preview PsychPro selection <ChevronRight aria-hidden="true" />
              </button>
              <p className="mt-2.5 text-center text-[9px] leading-4 text-[#747c81]">Plan selection is a visual preview only.</p>
            </div>
          </section>

          <section className="pp-opaque flex flex-col p-5 sm:p-7" aria-labelledby="eppp-heading">
            <div className="mb-5 flex items-center gap-3">
              <span className="pp-icon-well"><GraduationCap size={20} strokeWidth={1.8} /></span>
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[.21em] text-[#777f84]">Licensure preparation</p>
                <h2 id="eppp-heading" className="mt-0.5 text-[23px] font-semibold tracking-[-.035em]">EPPP Mastery Suite</h2>
              </div>
            </div>
            <p className="mb-5 text-[12px] leading-[1.75] text-[#51595f]">
              Full access to the EPPP Mastery Suite: knowledge domains, question bank, domain and full-length exams, missed-question review, and more.
            </p>
            <div className="mb-5 rounded-xl border border-[#cbd0d4] bg-[#f1f3f4] px-4 py-3.5">
              <p className="text-[11px] font-semibold text-[#343b40]">A separate suite, sold separately.</p>
              <p className="mt-1 text-[10px] leading-4 text-[#60686e]">PsychPro access does not include EPPP. EPPP access does not include PsychPro.</p>
            </div>
            <div className="mb-6 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.13em] text-[#6a7277]">
              <span className="h-px flex-1 bg-[#cbd0d4]" /> Choose access term <span className="h-px flex-1 bg-[#cbd0d4]" />
            </div>
            <div className="pp-option-grid grid grid-cols-3 gap-2.5">
              {epppOptions.map((option) => (
                <Option key={option.id} option={option} suite="EPPP" selected={selected === option.id} onSelect={() => { setSelected(option.id); setConfirmation(""); }} />
              ))}
            </div>
            <div className="mt-auto border-t border-[#cbd0d4] pt-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-[10px] font-semibold uppercase tracking-[.17em] text-[#555e63]">Billing at a glance</h3>
                <span className="text-[10px] text-[#737b80]">Monthly renews · access terms are prepaid</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg border border-[#d2d7da] bg-white/65 px-2 py-2.5">
                  <p className="text-[9px] uppercase tracking-[.1em] text-[#727a7f]">Monthly</p>
                  <p className="mt-1 text-[10px] font-semibold text-[#363d42]">Recurring</p>
                </div>
                <div className="rounded-lg border border-[#d2d7da] bg-white/65 px-2 py-2.5">
                  <p className="text-[9px] uppercase tracking-[.1em] text-[#727a7f]">6 months</p>
                  <p className="mt-1 text-[10px] font-semibold text-[#363d42]">One-time</p>
                </div>
                <div className="rounded-lg border border-[#d2d7da] bg-white/65 px-2 py-2.5">
                  <p className="text-[9px] uppercase tracking-[.1em] text-[#727a7f]">12 months</p>
                  <p className="mt-1 text-[10px] font-semibold text-[#363d42]">One-time</p>
                </div>
              </div>
              <button type="button" className="pp-chrome-button mt-4 w-full" onClick={previewSelection}>
                Preview EPPP selection <ChevronRight aria-hidden="true" />
              </button>
              <p className="mt-2.5 text-center text-[9px] leading-4 text-[#747c81]">Plan selection is a visual preview only.</p>
            </div>
          </section>
        </div>

        <footer className="mt-5 flex flex-col gap-2 border-t border-[#cbd0d4] pt-4 text-[10px] leading-5 text-[#666e73] sm:flex-row sm:items-center sm:justify-between">
          <span>Books you own stay in your library, whichever suite you choose.</span>
          <span className="font-medium tracking-[.08em]">PsychPro · EPPP Mastery Suite</span>
        </footer>
      </div>
    </main>
  );
}
