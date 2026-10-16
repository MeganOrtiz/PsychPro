import { useState } from "react";
import { Check, Crown, GraduationCap, Sparkles, Zap } from "lucide-react";
import "./_group.css";

const catalog = {
  psychpro: {
    features: [
      "Every built-in topic: flashcards, quizzes, study guides, and practice exams",
      "Course mastery exams and progress tracking",
      "Upload PDF, DOCX, or TXT notes, or paste text",
      "AI builds flashcards, quizzes, study guides, and exams from your own material",
      "50 AI generation requests per month (each selected tool counts as one)",
      "EPPP Mastery Suite not included",
    ],
    prices: [
      { id: "psych-month", title: "Billed monthly", amount: "$19.99", cadence: "/month", recurring: true },
      { id: "psych-year", title: "Billed yearly", amount: "$159.99", cadence: "/year", recurring: true },
    ],
  },
  eppp: {
    description: "Full access to the EPPP Mastery Suite: knowledge domains, question bank, domain and full-length exams, missed-question review, and more. Sold separately; PsychPro does not include EPPP, and EPPP does not include PsychPro.",
    prices: [
      { id: "eppp-month", title: "Monthly subscription", amount: "$99", cadence: "/month", recurring: true },
      { id: "eppp-6", title: "6 months access", amount: "$499", cadence: "one-time", recurring: false },
      { id: "eppp-12", title: "12 months access", amount: "$799", cadence: "one-time", recurring: false },
    ],
  },
};

type Price = { id: string; title: string; amount: string; cadence: string; recurring: boolean };

function StaticPrice({ price, onSelect }: { price: Price; onSelect: (label: string) => void }) {
  return (
    <div className="pp-glass p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{price.title}</p>
          <p className="mt-1 text-[11px] text-[#626a70]">{price.recurring ? "Recurring billing" : "One-time payment"}</p>
        </div>
        <div className="text-right">
          <p className="pp-price text-[30px] font-bold">{price.amount}</p>
          <p className="mt-1 text-[11px] text-[#626a70]">{price.cadence}</p>
        </div>
      </div>
      <button className="pp-chrome-button w-full" onClick={() => onSelect(`${price.title} — ${price.amount} ${price.cadence}`)}>
        <Zap aria-hidden="true" /> Choose plan
      </button>
    </div>
  );
}

export function Current() {
  const [message, setMessage] = useState("");
  return (
    <main className="paid-plans-current min-h-[100dvh] px-5 py-9 sm:px-8">
      <div className="mx-auto max-w-[680px]">
        <header className="mb-7">
          <div className="mb-4 flex items-center gap-3">
            <span className="pp-icon-well"><Crown size={19} /></span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#70777c]">PsychPro learning suite</p>
              <h1 className="text-[27px] font-semibold tracking-[-.04em]">Plans</h1>
            </div>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[#596167]">PsychPro for coursework and your own material. EPPP Mastery Suite for licensure prep.</p>
        </header>

        {message && <div role="status" className="pp-preview-note mb-4 px-4 py-3 text-xs"><strong>Preview only.</strong> {message} No payment has been taken.</div>}

        <div className="space-y-5">
          <section className="pp-opaque p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="pp-icon-well"><Sparkles size={19} /></span>
              <h2 className="text-lg font-semibold">PsychPro</h2>
            </div>
            <div className="mb-5 space-y-2.5">
              {catalog.psychpro.features.map((feature) => <div key={feature} className="pp-check"><Check /><span>{feature}</span></div>)}
            </div>
            <div className="space-y-3">
              {catalog.psychpro.prices.map((price) => <StaticPrice key={price.id} price={price} onSelect={setMessage} />)}
            </div>
          </section>

          <section className="pp-opaque p-6">
            <div className="mb-3 flex items-center gap-3">
              <span className="pp-icon-well"><GraduationCap size={19} /></span>
              <h2 className="text-lg font-semibold">EPPP Mastery Suite</h2>
            </div>
            <p className="mb-4 text-[13px] leading-6 text-[#596167]">{catalog.eppp.description}</p>
            <div className="space-y-3">
              {catalog.eppp.prices.map((price) => <StaticPrice key={price.id} price={price} onSelect={setMessage} />)}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
