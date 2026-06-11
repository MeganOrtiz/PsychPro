// =============================================================================
// In-depth, multi-step onboarding (Task #145).
//
// Step 1 (Account Creation) is the existing Clerk sign-up — the user is already
// signed in by the time they reach this page, so it shows here as a completed
// first step. This page owns steps 2-7:
//   2. Role               (learnerRole, single-select)
//   3. Learning Goals     (learningGoals[], multi-select)
//   4. Study Focus        (studyFocus, single-select)
//   5. EPPP Eligibility   (epppInterest — CONDITIONAL: only when an EPPP/exam
//                          goal or the EPPP study focus was chosen)
//   6. Tier Selection     (real Stripe products/prices; EPPP visually distinct)
//   7. Personalization Summary + CTA into PsychPro or the EPPP Mastery Suite
//
// Answers are persisted progressively (onboardingComplete stays false) so a
// detour to Stripe checkout never loses input. The final CTA flips
// onboardingComplete=true BEFORE any checkout redirect so returning from Stripe
// doesn't bounce the user back here (the route guard reads that flag).
// =============================================================================
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useUser } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Brain,
  ChevronRight,
  ChevronLeft,
  Check,
  GraduationCap,
  Sparkles,
  Target,
  BookOpen,
  ClipboardCheck,
  Stethoscope,
  Microscope,
  FlaskConical,
  Compass,
  Crown,
  Star,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useUpsertUserProfile,
  useGetUserProfile,
  useGetSubscriptionPlans,
  useCreateCheckoutSession,
  getGetUserProfileQueryKey,
  type UpsertUserProfileBody,
  type UserProfile,
  type SubscriptionPlan,
} from "@workspace/api-client-react";
import { useEpppPlans, useEpppCheckout } from "@/lib/use-eppp-purchase";
import { useEntitlements } from "@/lib/use-entitlements";
import { useToast } from "@/hooks/use-toast";
import { STUDY_PALETTE as P } from "@/lib/study-theme";

// ---------------------------------------------------------------------------
// Option sets
// ---------------------------------------------------------------------------
type Icon = React.ComponentType<{ className?: string }>;

const ROLE_OPTIONS: { value: string; icon: Icon }[] = [
  { value: "Undergraduate student", icon: BookOpen },
  { value: "Graduate / PhD / PsyD student", icon: GraduationCap },
  { value: "Postdoc or trainee", icon: Microscope },
  { value: "Licensed clinician", icon: Stethoscope },
  { value: "Researcher / academic", icon: FlaskConical },
  { value: "Lifelong learner", icon: Compass },
];

const GOAL_OPTIONS: { value: string; icon: Icon }[] = [
  { value: "Prepare for the EPPP", icon: GraduationCap },
  { value: "Prepare for course exams", icon: ClipboardCheck },
  { value: "Deepen clinical knowledge", icon: Stethoscope },
  { value: "Master neuroscience & the brain", icon: Brain },
  { value: "Build research & statistics skills", icon: FlaskConical },
  { value: "Explore psychology broadly", icon: Compass },
];

const FOCUS_OPTIONS: { value: string; icon: Icon }[] = [
  { value: "General PsychPro learning", icon: Sparkles },
  { value: "Assessment & diagnosis", icon: ClipboardCheck },
  { value: "Neuropsychology", icon: Brain },
  { value: "Psychotherapy & intervention", icon: Stethoscope },
  { value: "Research methods & statistics", icon: FlaskConical },
  { value: "EPPP Mastery Suite", icon: GraduationCap },
];

const EPPP_INTEREST_OPTIONS: { value: string; hint: string }[] = [
  { value: "Yes — I'm actively preparing", hint: "I have an exam date or I'm studying now" },
  { value: "Soon — within the next year", hint: "Planning ahead for licensure" },
  { value: "Just exploring for now", hint: "Curious what EPPP prep looks like" },
  { value: "Not pursuing the EPPP", hint: "I'm here for other reasons" },
];

// A learning goal / focus that means we should ask the conditional EPPP step.
const EPPP_TRIGGER_GOALS = new Set([
  "Prepare for the EPPP",
  "Prepare for course exams",
]);

type Answers = {
  learnerRole: string;
  learningGoals: string[];
  studyFocus: string;
  epppInterest: string;
  selectedTier: string; // free | pro | scholar | eppp
  selectedProduct: string; // human-readable label
  selectedPriceId: string | null;
};

const EMPTY: Answers = {
  learnerRole: "",
  learningGoals: [],
  studyFocus: "",
  epppInterest: "",
  selectedTier: "",
  selectedProduct: "",
  selectedPriceId: null,
};

type StepId = "account" | "role" | "goals" | "focus" | "eppp" | "tier" | "summary";

const STEP_META: Record<Exclude<StepId, "account">, { title: string; subtitle: string }> = {
  role: {
    title: "I am a...",
    subtitle: "This helps us tailor recommendations to where you are in your journey.",
  },
  goals: {
    title: "What do you want to achieve?",
    subtitle: "Pick everything that applies — you can change these any time.",
  },
  focus: {
    title: "Where should we start?",
    subtitle: "Choose the area you most want to focus on first.",
  },
  eppp: {
    title: "Are you preparing for the EPPP?",
    subtitle: "The EPPP Mastery Suite is a dedicated licensure-prep workspace.",
  },
  tier: {
    title: "Choose your plan",
    subtitle: "Start free, or unlock the full PsychPro experience.",
  },
  summary: {
    title: "You're all set",
    subtitle: "Here's your personalized PsychPro setup.",
  },
};

function fmtMoney(cents: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
    }).format(cents / 100);
  } catch {
    return `$${Math.round(cents / 100)}`;
  }
}

function deriveTier(name: string): "scholar" | "pro" {
  return /scholar/i.test(name) ? "scholar" : "pro";
}

type TierCard = {
  tier: string; // free | pro | scholar | eppp
  name: string;
  priceId: string | null;
  amount: number;
  currency: string;
  interval: string; // "month" | "one-time" | "free"
  blurb: string;
  features: string[];
  icon: Icon;
  eppp?: boolean;
};

export default function OnboardingPage() {
  const [, navigate] = useLocation();
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const email = user?.primaryEmailAddress?.emailAddress ?? undefined;
  const firstName = user?.firstName ?? user?.fullName?.split(" ")[0] ?? "";

  const upsert = useUpsertUserProfile();
  const checkout = useCreateCheckoutSession();
  const epppCheckout = useEpppCheckout();
  const { data: existingProfile } = useGetUserProfile();
  const { data: entitlements } = useEntitlements();
  const { data: subPlans } = useGetSubscriptionPlans();
  const { data: epppPlans } = useEpppPlans();

  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [stepId, setStepId] = useState<StepId>("role");
  const [submitting, setSubmitting] = useState(false);

  // Prefill from an existing profile (re-running onboarding to edit answers).
  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current || !existingProfile) return;
    seeded.current = true;
    const p = existingProfile as UserProfile;
    setAnswers((prev) => ({
      ...prev,
      learnerRole: p.learnerRole ?? "",
      learningGoals: Array.isArray(p.learningGoals) ? p.learningGoals : [],
      studyFocus: p.studyFocus ?? "",
      epppInterest: p.epppInterest ?? "",
      selectedTier: p.selectedTier ?? "",
      selectedProduct: p.selectedProduct ?? "",
    }));
  }, [existingProfile]);

  // The EPPP eligibility step only appears if the user signalled exam/EPPP intent.
  const showEppp = useMemo(() => {
    const goalTrigger = answers.learningGoals.some((g) => EPPP_TRIGGER_GOALS.has(g));
    return goalTrigger || answers.studyFocus === "EPPP Mastery Suite";
  }, [answers.learningGoals, answers.studyFocus]);

  const order = useMemo<StepId[]>(() => {
    const ids: StepId[] = ["account", "role", "goals", "focus"];
    if (showEppp) ids.push("eppp");
    ids.push("tier", "summary");
    return ids;
  }, [showEppp]);

  const rawIdx = order.indexOf(stepId);
  const idx = rawIdx === -1 ? order.indexOf("focus") : rawIdx;

  // -------------------------------------------------------------------------
  // Tier cards from live Stripe catalog
  // -------------------------------------------------------------------------
  const paidTiers = useMemo<TierCard[]>(() => {
    const byProduct = new Map<string, SubscriptionPlan>();
    for (const plan of subPlans ?? []) {
      const existing = byProduct.get(plan.id);
      // Prefer the monthly price when a product has several.
      if (!existing || (existing.interval !== "month" && plan.interval === "month")) {
        byProduct.set(plan.id, plan);
      }
    }
    return Array.from(byProduct.values())
      .map((plan) => {
        const tier = deriveTier(plan.name);
        return {
          tier,
          name: plan.name,
          priceId: plan.priceId,
          amount: plan.unitAmount,
          currency: plan.currency,
          interval: plan.interval,
          blurb:
            plan.description ??
            (tier === "scholar"
              ? "Everything in Master plus AI-powered study tools."
              : "Unlimited studying across the full PsychPro catalog."),
          features:
            tier === "scholar"
              ? ["Unlimited quizzes & exams", "AI study guides & PDF tools", "Priority new content"]
              : ["Unlimited quizzes & exams", "Full topic catalog", "Progress analytics"],
          icon: tier === "scholar" ? Crown : Star,
        } as TierCard;
      })
      .sort((a, b) => a.amount - b.amount);
  }, [subPlans]);

  const epppTier = useMemo<TierCard | null>(() => {
    if (!epppPlans?.productId) return null;
    const monthly = epppPlans.monthly;
    const fallback = epppPlans.oneTime[0];
    const priceId = monthly?.priceId ?? fallback?.priceId ?? null;
    if (!priceId) return null;
    const amount = monthly?.unitAmount ?? fallback?.unitAmount ?? 0;
    const currency = monthly?.currency ?? fallback?.currency ?? "usd";
    return {
      tier: "eppp",
      name: epppPlans.name ?? "EPPP Mastery Suite",
      priceId,
      amount,
      currency,
      interval: monthly ? "month" : "one-time",
      blurb: "A dedicated, EPPP-only workspace for full licensure-exam mastery.",
      features: [
        "Domain knowledge + mastery exams",
        "Full-length practice exams",
        "Clinical integration cases & rapid review",
      ],
      icon: GraduationCap,
      eppp: true,
    };
  }, [epppPlans]);

  const freeTier: TierCard = {
    tier: "free",
    name: "Free",
    priceId: null,
    amount: 0,
    currency: "usd",
    interval: "free",
    blurb: "Get started with core PsychPro learning at no cost.",
    features: ["Browse the topic catalog", "Starter flashcards & quizzes", "Track your progress"],
    icon: Sparkles,
  };

  const tierCards = useMemo<TierCard[]>(() => {
    const cards = [freeTier, ...paidTiers];
    if (epppTier) cards.push(epppTier);
    return cards;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paidTiers, epppTier]);

  // -------------------------------------------------------------------------
  // Persistence
  // -------------------------------------------------------------------------
  function buildBody(complete: boolean): UpsertUserProfileBody {
    return {
      ...(email ? { email } : {}),
      learnerRole: answers.learnerRole || undefined,
      learningGoals: answers.learningGoals,
      studyFocus: answers.studyFocus || undefined,
      epppInterest: showEppp ? answers.epppInterest || undefined : undefined,
      selectedTier: answers.selectedTier || undefined,
      selectedProduct: answers.selectedProduct || undefined,
      ...(complete ? { onboardingComplete: true } : {}),
    };
  }

  async function saveProgress() {
    try {
      await upsert.mutateAsync({ data: buildBody(false) });
    } catch {
      // Non-fatal: a failed mid-flow save is retried on the next step. Don't
      // block the user from continuing through the wizard.
    }
  }

  // -------------------------------------------------------------------------
  // Step validation + navigation
  // -------------------------------------------------------------------------
  function isStepValid(id: StepId): boolean {
    switch (id) {
      case "role":
        return !!answers.learnerRole;
      case "goals":
        return answers.learningGoals.length > 0;
      case "focus":
        return !!answers.studyFocus;
      case "eppp":
        return !!answers.epppInterest;
      case "tier":
        return !!answers.selectedTier;
      default:
        return true;
    }
  }

  async function handleNext() {
    if (!isStepValid(stepId)) return;
    await saveProgress();
    const next = order[idx + 1];
    if (next) setStepId(next);
  }

  function handleBack() {
    const prev = order[idx - 1];
    if (prev && prev !== "account") setStepId(prev);
  }

  // -------------------------------------------------------------------------
  // Final CTA
  // -------------------------------------------------------------------------
  const tier = answers.selectedTier;
  const isPaid = tier === "pro" || tier === "scholar" || tier === "eppp";
  const alreadyHasAccess =
    tier === "eppp" ? !!entitlements?.epppAccess : tier !== "free" ? !!entitlements?.isSubscribed : true;

  const ctaLabel = useMemo(() => {
    if (tier === "eppp") return alreadyHasAccess ? "Enter EPPP Mastery Suite" : "Continue to EPPP Checkout";
    if (isPaid) return alreadyHasAccess ? "Enter PsychPro" : "Continue to Checkout";
    return "Enter PsychPro";
  }, [tier, isPaid, alreadyHasAccess]);

  async function finalize(): Promise<boolean> {
    try {
      const updated = await upsert.mutateAsync({ data: buildBody(true) });
      // Refresh the cached profile so the onboarding route guard immediately
      // sees onboardingComplete=true and lets the user into the app.
      queryClient.setQueryData(getGetUserProfileQueryKey(), updated);
      return true;
    } catch {
      toast({
        title: "Couldn't save your setup",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
      return false;
    }
  }

  async function handleFinish() {
    setSubmitting(true);
    try {
      const ok = await finalize();
      if (!ok) return;

      // When resuming a saved flow, selectedPriceId isn't persisted server-side,
      // so recover it from the live catalog by matching the chosen tier.
      const priceId =
        answers.selectedPriceId ?? tierCards.find((c) => c.tier === tier)?.priceId ?? null;

      if (isPaid && !alreadyHasAccess && priceId) {
        try {
          const { url } =
            tier === "eppp"
              ? await epppCheckout.mutateAsync({ priceId })
              : await checkout.mutateAsync({ data: { priceId } });
          window.location.href = url;
          return;
        } catch (err) {
          toast({
            title: "Checkout couldn't start",
            description:
              err instanceof Error ? err.message : "You can upgrade any time from your account.",
            variant: "destructive",
          });
          // Onboarding is already complete — let them into the app instead of
          // trapping them on this screen.
        }
      }
      navigate(tier === "eppp" && alreadyHasAccess ? "/eppp/suite" : "/dashboard");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEnterFree() {
    // Secondary action on the summary for paid selections: skip checkout for now.
    setSubmitting(true);
    try {
      const ok = await finalize();
      if (ok) navigate("/dashboard");
    } finally {
      setSubmitting(false);
    }
  }

  // -------------------------------------------------------------------------
  // Render helpers
  // -------------------------------------------------------------------------
  const wide = stepId === "tier" || stepId === "summary";
  const meta = stepId !== "account" ? STEP_META[stepId] : null;

  const toggleGoal = (value: string) =>
    setAnswers((prev) => ({
      ...prev,
      learningGoals: prev.learningGoals.includes(value)
        ? prev.learningGoals.filter((g) => g !== value)
        : [...prev.learningGoals, value],
    }));

  return (
    <div className="min-h-screen study-page-bg flex flex-col" data-testid="onboarding-page">
      <style>{styles}</style>

      <div className="flex-1 flex items-start md:items-center justify-center p-4 md:p-6">
        <div className={`w-full ${wide ? "max-w-4xl" : "max-w-xl"} my-6`}>
          {/* Brand */}
          <div className="flex items-center gap-2.5 mb-6 justify-center">
            <span className="ob-brand-icon">
              <Brain aria-hidden />
            </span>
            <span className="font-bold text-xl" style={{ color: P.mist }}>
              PsychPro
            </span>
          </div>

          {/* Progress */}
          <div className="flex gap-1.5 mb-6" aria-hidden>
            {order.map((id, i) => (
              <div
                key={id}
                className="ob-progress-seg"
                style={{
                  background:
                    i <= idx
                      ? `linear-gradient(90deg, ${P.teal}, ${P.surf})`
                      : "rgba(118,228,247,0.14)",
                }}
              />
            ))}
          </div>

          <div className="ob-card p-6 md:p-8">
            <p className="ob-eyebrow">
              Step {idx + 1} of {order.length}
            </p>
            <h1 className="ob-title">{meta?.title}</h1>
            {meta?.subtitle && <p className="ob-sub">{meta.subtitle}</p>}

            <div className="mt-6">
              {/* ---- Role ---- */}
              {stepId === "role" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ROLE_OPTIONS.map(({ value, icon: I }) => (
                    <OptionTile
                      key={value}
                      label={value}
                      icon={I}
                      selected={answers.learnerRole === value}
                      onClick={() => setAnswers((p) => ({ ...p, learnerRole: value }))}
                      testid={`role-${value}`}
                    />
                  ))}
                </div>
              )}

              {/* ---- Goals (multi) ---- */}
              {stepId === "goals" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {GOAL_OPTIONS.map(({ value, icon: I }) => (
                    <OptionTile
                      key={value}
                      label={value}
                      icon={I}
                      selected={answers.learningGoals.includes(value)}
                      onClick={() => toggleGoal(value)}
                      multi
                      testid={`goal-${value}`}
                    />
                  ))}
                </div>
              )}

              {/* ---- Focus ---- */}
              {stepId === "focus" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FOCUS_OPTIONS.map(({ value, icon: I }) => (
                    <OptionTile
                      key={value}
                      label={value}
                      icon={I}
                      selected={answers.studyFocus === value}
                      onClick={() => setAnswers((p) => ({ ...p, studyFocus: value }))}
                      testid={`focus-${value}`}
                    />
                  ))}
                </div>
              )}

              {/* ---- EPPP eligibility (conditional) ---- */}
              {stepId === "eppp" && (
                <div className="space-y-3">
                  {EPPP_INTEREST_OPTIONS.map(({ value, hint }) => (
                    <OptionRow
                      key={value}
                      label={value}
                      hint={hint}
                      selected={answers.epppInterest === value}
                      onClick={() => setAnswers((p) => ({ ...p, epppInterest: value }))}
                      testid={`eppp-${value}`}
                    />
                  ))}
                </div>
              )}

              {/* ---- Tier ---- */}
              {stepId === "tier" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tierCards.map((card) => (
                    <TierOption
                      key={`${card.tier}-${card.priceId ?? "free"}`}
                      card={card}
                      selected={answers.selectedTier === card.tier}
                      onSelect={() =>
                        setAnswers((p) => ({
                          ...p,
                          selectedTier: card.tier,
                          selectedProduct: card.name,
                          selectedPriceId: card.priceId,
                        }))
                      }
                    />
                  ))}
                </div>
              )}

              {/* ---- Summary ---- */}
              {stepId === "summary" && (
                <SummaryBody
                  firstName={firstName}
                  answers={answers}
                  showEppp={showEppp}
                  tierCards={tierCards}
                />
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={idx <= 1 || submitting}
                className="rounded-md px-4"
                data-testid="button-back"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>

              {stepId === "summary" ? (
                <div className="flex items-center gap-2">
                  {isPaid && !alreadyHasAccess && (
                    <Button
                      variant="outline"
                      onClick={handleEnterFree}
                      disabled={submitting}
                      className="rounded-md px-4"
                      data-testid="button-skip-checkout"
                    >
                      Enter PsychPro for now
                    </Button>
                  )}
                  <Button
                    onClick={handleFinish}
                    disabled={submitting}
                    className="rounded-md px-5"
                    data-testid="button-finish"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    ) : null}
                    {ctaLabel}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid(stepId) || upsert.isPending}
                  className="rounded-md px-5"
                  data-testid="button-next"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function OptionTile({
  label,
  icon: I,
  selected,
  onClick,
  multi,
  testid,
}: {
  label: string;
  icon: Icon;
  selected: boolean;
  onClick: () => void;
  multi?: boolean;
  testid: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      data-testid={slug(testid)}
      className={`ob-tile ${selected ? "ob-tile--on" : ""}`}
    >
      <span className="ob-tile-icon">
        <I className="w-4 h-4" />
      </span>
      <span className="ob-tile-label">{label}</span>
      <span className={`ob-check ${multi ? "ob-check--box" : ""}`}>
        {selected && <Check className="w-3.5 h-3.5" />}
      </span>
    </button>
  );
}

function OptionRow({
  label,
  hint,
  selected,
  onClick,
  testid,
}: {
  label: string;
  hint: string;
  selected: boolean;
  onClick: () => void;
  testid: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      data-testid={slug(testid)}
      className={`ob-row ${selected ? "ob-tile--on" : ""}`}
    >
      <span className="flex-1 min-w-0 text-left">
        <span className="ob-row-label">{label}</span>
        <span className="ob-row-hint">{hint}</span>
      </span>
      <span className="ob-check">{selected && <Check className="w-3.5 h-3.5" />}</span>
    </button>
  );
}

function TierOption({
  card,
  selected,
  onSelect,
}: {
  card: TierCard;
  selected: boolean;
  onSelect: () => void;
}) {
  const I = card.icon;
  const price =
    card.tier === "free"
      ? "Free"
      : `${fmtMoney(card.amount, card.currency)}${card.interval === "month" ? "/mo" : ""}`;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      data-testid={slug(`tier-${card.tier}`)}
      className={`ob-plan ${selected ? "ob-plan--on" : ""} ${card.eppp ? "ob-plan--eppp" : ""}`}
    >
      {card.eppp && <span className="ob-plan-badge">EPPP</span>}
      <span className="ob-plan-head">
        <span className={`ob-plan-icon ${card.eppp ? "ob-plan-icon--eppp" : ""}`}>
          <I className="w-4 h-4" />
        </span>
        <span className="ob-plan-name">{card.name}</span>
        <span className="ob-check">{selected && <Check className="w-3.5 h-3.5" />}</span>
      </span>
      <span className="ob-plan-price">{price}</span>
      <span className="ob-plan-blurb">{card.blurb}</span>
      <span className="ob-plan-feats">
        {card.features.map((f) => (
          <span key={f} className="ob-plan-feat">
            <Check className="w-3 h-3 flex-shrink-0" />
            {f}
          </span>
        ))}
      </span>
    </button>
  );
}

function SummaryBody({
  firstName,
  answers,
  showEppp,
  tierCards,
}: {
  firstName: string;
  answers: Answers;
  showEppp: boolean;
  tierCards: TierCard[];
}) {
  const planCard = tierCards.find((c) => c.tier === answers.selectedTier);
  const planLabel =
    planCard?.tier === "free"
      ? "Free"
      : planCard
        ? `${planCard.name}${planCard.interval === "month" ? ` · ${fmtMoney(planCard.amount, planCard.currency)}/mo` : ""}`
        : answers.selectedProduct || "Free";

  return (
    <div className="space-y-4" data-testid="onboarding-summary">
      {firstName && (
        <p className="ob-greeting">
          Welcome aboard, <span style={{ color: P.surf }}>{firstName}</span>.
        </p>
      )}
      <div className="ob-summary-grid">
        <SummaryItem icon={GraduationCap} label="I am a" value={answers.learnerRole || "—"} />
        <SummaryItem
          icon={Target}
          label="Goals"
          value={answers.learningGoals.length ? answers.learningGoals.join(", ") : "—"}
        />
        <SummaryItem icon={Compass} label="Study focus" value={answers.studyFocus || "—"} />
        {showEppp && (
          <SummaryItem icon={ClipboardCheck} label="EPPP" value={answers.epppInterest || "—"} />
        )}
        <SummaryItem icon={Star} label="Plan" value={planLabel} />
      </div>
    </div>
  );
}

function SummaryItem({ icon: I, label, value }: { icon: Icon; label: string; value: string }) {
  return (
    <div className="ob-summary-item">
      <span className="ob-summary-icon">
        <I className="w-4 h-4" />
      </span>
      <span className="min-w-0">
        <span className="ob-summary-label">{label}</span>
        <span className="ob-summary-value">{value}</span>
      </span>
    </div>
  );
}

function slug(s: string) {
  return s.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
}

// ---------------------------------------------------------------------------
// Scoped styles — glass surfaces on the locked cerulean palette (no pills).
// ---------------------------------------------------------------------------
const styles = `
.ob-brand-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 38px; height: 38px; border-radius: 11px;
  background: linear-gradient(135deg, ${P.teal}, ${P.surf});
  color: ${P.ink};
  box-shadow: 0 8px 22px -10px ${P.surf}aa, inset 0 1px 0 rgba(255,255,255,0.3);
}
.ob-brand-icon svg { width: 20px; height: 20px; }

.ob-progress-seg { flex: 1; height: 6px; border-radius: 999px; transition: background .3s ease; }

.ob-card {
  border-radius: 20px;
  background:
    radial-gradient(130% 90% at 50% 0%, rgba(118,228,247,0.12) 0%, rgba(118,228,247,0) 60%),
    linear-gradient(150deg, rgba(24,89,109,0.55), rgba(16,72,91,0.66));
  border: 1px solid rgba(118,228,247,0.26);
  backdrop-filter: blur(20px) saturate(135%);
  -webkit-backdrop-filter: blur(20px) saturate(135%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.12),
    0 30px 70px -34px rgba(0,0,0,0.7);
}

.ob-eyebrow {
  font-size: 11px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase;
  color: ${P.surf};
}
.ob-title {
  font-size: 1.5rem; line-height: 1.2; font-weight: 700; margin-top: 6px;
  color: ${P.cloud};
  text-shadow: 0 1px 2px rgba(0,0,0,0.4);
}
.ob-sub { margin-top: 8px; font-size: 0.9rem; color: ${P.mistSoft}; }

.ob-tile {
  position: relative;
  display: flex; align-items: center; gap: 11px;
  width: 100%; padding: 13px 14px; text-align: left;
  border-radius: 12px;
  border: 1px solid rgba(118,228,247,0.18);
  background: linear-gradient(150deg, rgba(16,72,91,0.5), rgba(10,60,77,0.6));
  color: ${P.mist};
  transition: transform .15s ease, border-color .15s ease, background .15s ease, box-shadow .15s ease;
}
.ob-tile:hover { transform: translateY(-1px); border-color: rgba(118,228,247,0.4); }
.ob-tile--on {
  border-color: ${P.surf};
  background:
    radial-gradient(120% 100% at 0% 0%, rgba(118,228,247,0.22), rgba(118,228,247,0) 60%),
    linear-gradient(150deg, rgba(24,89,109,0.7), rgba(16,72,91,0.78));
  box-shadow: inset 0 0 0 1px rgba(118,228,247,0.4), 0 0 26px -12px ${P.surf}cc;
}
.ob-tile-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
  background: linear-gradient(135deg, ${P.tealDeep}, ${P.teal});
  color: ${P.cloud};
}
.ob-tile-label { flex: 1; min-width: 0; font-size: 0.875rem; font-weight: 600; }
.ob-check {
  display: inline-flex; align-items: center; justify-content: center;
  width: 20px; height: 20px; border-radius: 999px; flex-shrink: 0;
  background: linear-gradient(135deg, ${P.teal}, ${P.surf}); color: ${P.ink};
}
.ob-check:empty { background: transparent; }
.ob-check--box { border-radius: 6px; }
.ob-check--box:empty { box-shadow: inset 0 0 0 1.5px rgba(118,228,247,0.4); }

.ob-row {
  display: flex; align-items: center; gap: 12px; width: 100%;
  padding: 14px 16px; border-radius: 12px;
  border: 1px solid rgba(118,228,247,0.18);
  background: linear-gradient(150deg, rgba(16,72,91,0.5), rgba(10,60,77,0.6));
  transition: transform .15s ease, border-color .15s ease, box-shadow .15s ease;
}
.ob-row:hover { transform: translateY(-1px); border-color: rgba(118,228,247,0.4); }
.ob-row-label { display: block; font-size: 0.9rem; font-weight: 600; color: ${P.mist}; }
.ob-row-hint { display: block; font-size: 0.78rem; margin-top: 2px; color: ${P.mistSoft}; }

.ob-plan {
  position: relative; display: flex; flex-direction: column; gap: 8px;
  padding: 18px; border-radius: 16px; text-align: left;
  border: 1px solid rgba(118,228,247,0.18);
  background: linear-gradient(155deg, rgba(16,72,91,0.55), rgba(10,60,77,0.66));
  transition: transform .15s ease, border-color .15s ease, box-shadow .15s ease;
}
.ob-plan:hover { transform: translateY(-2px); border-color: rgba(118,228,247,0.42); }
.ob-plan--on {
  border-color: ${P.surf};
  box-shadow: inset 0 0 0 1px rgba(118,228,247,0.45), 0 0 32px -14px ${P.surf}cc;
}
.ob-plan--eppp {
  border-color: rgba(167,243,255,0.4);
  background:
    radial-gradient(130% 100% at 100% 0%, rgba(167,243,255,0.2), rgba(167,243,255,0) 55%),
    linear-gradient(155deg, rgba(24,89,109,0.7), rgba(8,45,60,0.82));
}
.ob-plan--eppp.ob-plan--on {
  box-shadow: inset 0 0 0 1px rgba(167,243,255,0.6), 0 0 38px -12px rgba(167,243,255,0.7);
}
.ob-plan-badge {
  position: absolute; top: 12px; right: 12px;
  font-size: 10px; font-weight: 700; letter-spacing: .12em;
  padding: 3px 8px; border-radius: 6px;
  background: linear-gradient(135deg, ${P.teal}, ${P.surf}); color: ${P.ink};
}
.ob-plan-head { display: flex; align-items: center; gap: 10px; }
.ob-plan-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
  background: linear-gradient(135deg, ${P.tealDeep}, ${P.teal}); color: ${P.cloud};
}
.ob-plan-icon--eppp { background: linear-gradient(135deg, ${P.surf}, ${P.mist}); color: ${P.ink}; }
.ob-plan-name { flex: 1; min-width: 0; font-size: 1rem; font-weight: 700; color: ${P.cloud}; }
.ob-plan-price { font-size: 1.35rem; font-weight: 800; color: ${P.surf}; }
.ob-plan-blurb { font-size: 0.82rem; color: ${P.mistSoft}; }
.ob-plan-feats { display: flex; flex-direction: column; gap: 5px; margin-top: 4px; }
.ob-plan-feat { display: flex; align-items: center; gap: 7px; font-size: 0.8rem; color: ${P.mist}; }
.ob-plan-feat svg { color: ${P.surf}; }

.ob-greeting { font-size: 1rem; color: ${P.mist}; }
.ob-summary-grid { display: flex; flex-direction: column; gap: 10px; }
.ob-summary-item {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 13px 15px; border-radius: 12px;
  border: 1px solid rgba(118,228,247,0.18);
  background: linear-gradient(150deg, rgba(16,72,91,0.5), rgba(10,60,77,0.6));
}
.ob-summary-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
  background: linear-gradient(135deg, ${P.tealDeep}, ${P.teal}); color: ${P.cloud};
}
.ob-summary-label { display: block; font-size: 0.72rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: ${P.surf}; }
.ob-summary-value { display: block; font-size: 0.9rem; color: ${P.mist}; margin-top: 2px; word-break: break-word; }
`;
