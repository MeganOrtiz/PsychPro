import { Beaker, Brain, CalendarDays, Shuffle, Lightbulb, ArrowRight } from "lucide-react";
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

export default function StudyLabPage() {
  return (
    <div className="min-h-full study-page-bg" data-testid="study-lab-page">
      <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Beaker className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Study Lab</h1>
          </div>
          <p className="text-sm md:text-base text-muted-foreground max-w-3xl">
            Four evidence-based techniques you can use on any topic in PsychPro. Each one is here to try right now —
            nothing to set up.
          </p>
        </header>

        <nav className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
          {[
            { href: "#active-recall", icon: Brain, label: "Active Recall" },
            { href: "#spaced", icon: CalendarDays, label: "Spaced Repetition" },
            { href: "#interleaving", icon: Shuffle, label: "Mixed Mode" },
            { href: "#elaboration", icon: Lightbulb, label: "Elaboration" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/[0.06] backdrop-blur-sm hover:bg-white/[0.10] hover:border-white/20 transition-colors text-sm font-medium text-white"
              data-testid={`jump-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <span className="w-7 h-7 rounded-md flex items-center justify-center bg-white/10 text-white/80 border border-white/10">
                <item.icon className="w-4 h-4" />
              </span>
              <span className="truncate">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="space-y-8">
          <div id="active-recall" className="scroll-mt-6">
            <BrainDump
              storageKey="lab-executive-function"
              topic="Cognitive Domain — Executive Function"
              prompt="Define executive function in your own words and list at least three sub-processes a clinician would assess."
              answer="Executive function is the set of top-down cognitive processes that coordinate goal-directed behavior. Core sub-processes include: (1) working memory — holding and manipulating information online, (2) response inhibition — suppressing prepotent or automatic responses, (3) cognitive flexibility — shifting set in response to changing demands, and often (4) planning/organization and (5) self-monitoring. Performance-based and report-based measures are typically combined because they capture different aspects of the construct."
            />
          </div>

          <div id="spaced" className="scroll-mt-6">
            <SpacedRepetitionScheduler
              storageKey="lab-theory-of-mind"
              cardTitle="Theory of Mind — clinical relevance"
              cardSummary="The ability to attribute mental states to self and others; relevant across autism spectrum, schizophrenia spectrum, and frontal-lobe presentations."
            />
          </div>

          <div id="interleaving" className="scroll-mt-6">
            <InterleavingMode cards={SAMPLE_CARDS} />
          </div>

          <div id="elaboration" className="scroll-mt-6">
            <ElaborationPanel
              storageKey="lab-elaboration"
              context="Use these prompts on whatever you studied most recently — the deeper you process it now, the easier it'll come back later."
            />
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-md p-6 text-center shadow-xl">
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">
            Apply these to a real topic
          </h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-xl mx-auto">
            Pick a category and use these techniques on the actual flashcards, quizzes, and study guides for it.
          </p>
          <Link href="/topics">
            <Button data-testid="study-lab-cta">
              Browse Categories <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
