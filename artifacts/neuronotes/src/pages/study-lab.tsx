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

// Pool of long-form recall prompts for the Active Recall technique.
// Each prompt is paired with the topic it belongs to so the user
// always sees the domain context in the box header.
const RECALL_PROMPTS: { topic: string; prompt: string; answer: string }[] = [
  {
    topic: "Cognitive Domain — Executive Function",
    prompt:
      "Define executive function in your own words and list at least three sub-processes a clinician would assess.",
    answer:
      "Executive function is the set of top-down cognitive processes that coordinate goal-directed behavior. Core sub-processes include: (1) working memory — holding and manipulating information online, (2) response inhibition — suppressing prepotent or automatic responses, (3) cognitive flexibility — shifting set in response to changing demands, and often (4) planning/organization and (5) self-monitoring. Performance-based and report-based measures are typically combined because they capture different aspects of the construct.",
  },
  {
    topic: "Mood Disorders — Major Depression",
    prompt:
      "What features distinguish a major depressive episode from grief or normative sadness, and why does anhedonia matter diagnostically?",
    answer:
      "A major depressive episode requires ≥2 weeks of depressed mood or anhedonia plus a constellation of neurovegetative, cognitive, and motivational symptoms causing significant impairment. Grief is wave-like, tied to the loss, with preserved self-esteem and capacity for positive affect between waves. Anhedonia carries diagnostic weight because it reflects disrupted mesolimbic reward processing — a core neural feature that distinguishes MDD from transient sadness.",
  },
  {
    topic: "Anxiety Disorders — GAD",
    prompt:
      "How would you differentiate generalized anxiety disorder (GAD) from a specific phobia or panic disorder in a clinical interview?",
    answer:
      "GAD is characterized by excessive, hard-to-control worry across multiple life domains (work, health, finances, family) most days for ≥6 months, with somatic symptoms like muscle tension and sleep disturbance. Specific phobia involves a circumscribed fear of a defined object/situation with avoidance. Panic disorder centers on recurrent unexpected panic attacks plus persistent worry about future attacks or behavioral change to avoid them — the worry is *about the attacks*, not generalized.",
  },
  {
    topic: "Neurodevelopmental — ADHD",
    prompt:
      "Name the two symptom dimensions that define ADHD presentations and describe the executive-function profile most consistently affected.",
    answer:
      "The two dimensions are inattention and hyperactivity-impulsivity; either or both can dominate, yielding predominantly inattentive, predominantly hyperactive-impulsive, or combined presentations. The executive-function profile most consistently shows deficits in working memory, response inhibition, sustained attention, and self-regulation of arousal — sometimes summarized as 'cool' (cognitive) versus 'hot' (motivational/affective) executive control deficits.",
  },
  {
    topic: "Autism Spectrum Disorder",
    prompt:
      "Why are restricted/repetitive behaviors considered a *core* feature of ASD rather than a secondary consequence of social-communication difficulty?",
    answer:
      "Restricted, repetitive patterns of behavior, interests, or activities are conceptualized as one of two core dimensions because they reflect the same underlying difference in neural prediction, sensory processing, and cognitive flexibility that drives social-communication features. Both dimensions are two expressions of one phenotype, not cause and effect — which is why DSM-5 requires symptoms in both domains for diagnosis.",
  },
  {
    topic: "Personality Disorders — Borderline",
    prompt:
      "What are the four core symptom clusters of borderline personality disorder, and which one is most predictive of treatment response?",
    answer:
      "The four clusters are: (1) emotion dysregulation — intense, rapidly shifting affect; (2) interpersonal instability — alternating idealization/devaluation, fear of abandonment; (3) identity disturbance — unstable self-image, chronic emptiness; (4) behavioral dyscontrol — impulsivity, self-harm, suicidality. Emotion dysregulation is the most predictive of treatment response — modalities like DBT that directly target it produce the largest effect sizes.",
  },
  {
    topic: "Trauma — PTSD",
    prompt:
      "List the four DSM-5 PTSD symptom clusters and explain how avoidance maintains the disorder over time.",
    answer:
      "The four clusters are: (1) intrusion — flashbacks, nightmares, intrusive memories; (2) avoidance — of trauma-related stimuli, thoughts, or feelings; (3) negative alterations in cognition and mood; (4) alterations in arousal and reactivity — hypervigilance, exaggerated startle, sleep disturbance. Avoidance maintains the disorder by preventing corrective learning: the feared associations are never disconfirmed, so the fear network stays intact and often generalizes — which is why exposure-based treatments are first-line.",
  },
  {
    topic: "Psychotic Disorders — Schizophrenia",
    prompt:
      "Distinguish positive, negative, and cognitive symptom domains of schizophrenia, and explain why negative symptoms are often more functionally disabling.",
    answer:
      "Positive symptoms add to normal experience — hallucinations, delusions, disorganized speech/behavior. Negative symptoms reflect a loss or reduction — avolition, alogia, anhedonia, asociality, blunted affect. Cognitive symptoms include deficits in working memory, attention, and processing speed. Negative and cognitive symptoms are typically more functionally disabling because they interfere with sustained work, relationships, and self-care, and they respond poorly to first-generation antipsychotics — which is why functional outcome lags symptomatic remission.",
  },
];

export default function StudyLabPage() {
  const [active, setActive] = useState<TechId | null>(null);
  // Index into the RECALL_PROMPTS pool for the Active Recall technique.
  // Advanced via the BrainDump "Next prompt" button after reveal.
  const [recallIndex, setRecallIndex] = useState(0);

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

          {active === "active-recall" && (() => {
            const current = RECALL_PROMPTS[recallIndex % RECALL_PROMPTS.length];
            return (
              <BrainDump
                // Per-prompt storage key so each prompt remembers its own
                // partial brain-dump if the user navigates away and back.
                storageKey={`lab-recall-${recallIndex}`}
                topic={current.topic}
                prompt={current.prompt}
                answer={current.answer}
                onNext={() => setRecallIndex((i) => (i + 1) % RECALL_PROMPTS.length)}
              />
            );
          })()}
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
