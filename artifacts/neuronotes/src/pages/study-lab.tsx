import { useState } from "react";
import { Beaker, Brain, CalendarDays, Shuffle, Lightbulb, ArrowRight, ChevronLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import BrainDump from "@/components/learning/brain-dump";
import SpacedRepetitionScheduler from "@/components/learning/spaced-repetition";
import InterleavingMode, { type InterleaveCard } from "@/components/learning/interleaving-mode";
import ElaborationPanel from "@/components/learning/elaboration-panel";

const SAMPLE_CARDS: InterleaveCard[] = [
  {
    topic: "ADHD",
    question:
      "What two broad symptom dimensions define attention-deficit/hyperactivity disorder (ADHD) presentations?",
    answer:
      "Inattention and hyperactivity-impulsivity. Each can dominate independently, producing predominantly inattentive, predominantly hyperactive-impulsive, or combined presentations.",
  },
  {
    topic: "Mood Disorders",
    question: "Why does anhedonia carry diagnostic weight beyond low mood alone?",
    answer:
      "Anhedonia reflects disrupted reward processing in mesolimbic circuitry — a core feature that distinguishes major depressive disorder from transient sadness or grief responses.",
  },
  {
    topic: "Autism Spectrum",
    question:
      "How do social communication deficits in autism spectrum disorder (ASD) differ from social anxiety?",
    answer:
      "ASD involves reduced social reciprocity and difficulty reading social cues across contexts; social anxiety preserves social skill but inhibits expression due to fear of evaluation.",
  },
  {
    topic: "Anxiety",
    question:
      "What distinguishes generalized anxiety disorder (GAD) worry from worry tied to another disorder?",
    answer:
      "GAD worry is excessive, hard to control, and spans multiple life domains — finances, health, work, family — rather than being tied to a specific feared object, situation, or trauma.",
  },
  {
    topic: "ADHD",
    question: "Which executive function domains are most consistently affected in ADHD?",
    answer:
      "Working memory, response inhibition, sustained attention, and self-regulation of arousal — a profile sometimes summarized as 'cool' versus 'hot' executive control deficits.",
  },
  {
    topic: "Mood Disorders",
    question: "What feature differentiates a mixed mood episode from rapid cycling?",
    answer:
      "A mixed episode features depressive and manic-spectrum symptoms simultaneously within the same episode; rapid cycling refers to four or more discrete mood episodes within a year.",
  },
  {
    topic: "Autism Spectrum",
    question: "Why is restricted/repetitive behavior considered a core feature of ASD, not secondary?",
    answer:
      "Restricted, repetitive patterns of behavior, interests, or activities reflect the same underlying difference in neural prediction and flexibility that drives social-communication features — they're two expressions of one phenotype.",
  },
  {
    topic: "Anxiety",
    question: "How does avoidance maintain anxiety disorders over time?",
    answer:
      "Avoidance prevents corrective learning. The feared outcome is never disconfirmed, so the anxiety response stays intact and often generalizes to related cues.",
  },
];

type TechId = "active-recall" | "spaced" | "mixed" | "elaboration";

const TECHNIQUES: {
  id: TechId;
  icon: React.ElementType;
  title: string;
  blurb: string;
  longBlurb: string;
}[] = [
  {
    id: "active-recall",
    icon: Brain,
    title: "Active Recall",
    blurb: "Retrieve information to strengthen memory pathways.",
    longBlurb: "Pull the answer out of your head before checking — that retrieval effort is what makes the memory stick.",
  },
  {
    id: "spaced",
    icon: CalendarDays,
    title: "Spaced Repetition",
    blurb: "Review over time to build long-term retention.",
    longBlurb: "Review at expanding intervals (Day 1, 3, 7, 14) so each return interrupts the forgetting curve.",
  },
  {
    id: "mixed",
    icon: Shuffle,
    title: "Mixed Mode",
    blurb: "Mix topics over time to improve discrimination and flexibility.",
    longBlurb: "Interleaving forces your brain to choose the right strategy, not just repeat one — durable learning.",
  },
  {
    id: "elaboration",
    icon: Lightbulb,
    title: "Elaboration",
    blurb: "Connect ideas and explain why they make sense.",
    longBlurb: "Why does this make sense? How does it connect to what you already know? Generative answers consolidate it.",
  },
];

export default function StudyLabPage() {
  const [active, setActive] = useState<TechId | null>(null);

  if (active) {
    const tech = TECHNIQUES.find((t) => t.id === active)!;
    return (
      <div className="min-h-full study-page-bg" data-testid={`study-lab-detail-${active}`}>
        <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8">
          <button
            onClick={() => setActive(null)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 font-medium"
            data-testid="back-to-techniques"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Techniques
          </button>

          <header className="mb-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <tech.icon className="w-6 h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{tech.title}</h1>
              <p className="text-sm text-muted-foreground mt-1">{tech.longBlurb}</p>
            </div>
          </header>

          {active === "active-recall" && (
            <BrainDump
              storageKey="lab-executive-function"
              topic="Cognitive Domain — Executive Function"
              prompt="Define executive function in your own words and list at least three sub-processes a clinician would assess."
              answer="Executive function is the set of top-down cognitive processes that coordinate goal-directed behavior. Core sub-processes include: (1) working memory — holding and manipulating information online, (2) response inhibition — suppressing prepotent or automatic responses, (3) cognitive flexibility — shifting set in response to changing demands, and often (4) planning/organization and (5) self-monitoring. Performance-based and report-based measures are typically combined because they capture different aspects of the construct."
            />
          )}
          {active === "spaced" && (
            <SpacedRepetitionScheduler
              storageKey="lab-theory-of-mind"
              cardTitle="Theory of Mind — clinical relevance"
              cardSummary="The ability to attribute mental states to self and others; relevant across autism spectrum, schizophrenia spectrum, and frontal-lobe presentations."
            />
          )}
          {active === "mixed" && <InterleavingMode cards={SAMPLE_CARDS} />}
          {active === "elaboration" && (
            <ElaborationPanel
              storageKey="lab-elaboration"
              context="Use these prompts on whatever you studied most recently — the deeper you process it now, the easier it'll come back later."
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full study-page-bg" data-testid="study-lab-page">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Beaker className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Study Lab</h1>
          </div>
          <p className="text-sm md:text-base text-muted-foreground max-w-3xl">
            Four evidence-based techniques to study any topic in PsychPro. Choose a technique to get started.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {TECHNIQUES.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              data-testid={`tech-card-${t.id}`}
              className="group text-left rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <t.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1.5">{t.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-snug">{t.blurb}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                Start <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">
            Create Custom Tools
          </h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-xl mx-auto">
            Generate flashcards, quizzes, study guides, and practice exams from your own notes or text.
          </p>
          <Link href="/my-decks/new?tier=standard">
            <Button data-testid="study-lab-cta">
              Create Tools <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
