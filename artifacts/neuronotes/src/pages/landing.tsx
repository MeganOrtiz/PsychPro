import { useLocation } from "wouter";
import { SignIn, SignUp, useUser } from "@clerk/react";
import { useState, useEffect } from "react";
import {
  Brain,
  BookOpen,
  Layers,
  Trophy,
  CheckCircle,
  Zap,
  Sparkles,
  GraduationCap,
  Clock,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const REAL_TOPICS = [
  "Psychological Disorders", "Personality Disorders", "Neurodevelopmental Disorders",
  "Neurocognitive Disorders", "ADHD & Medications", "Psychopharmacology",
  "Quantitative Statistics & Research Methods", "Qualitative Research Designs",
  "Validity & Effort Testing", "Sleep & Circadian Rhythms",
  "Limbic System & Motivation", "Sensory Pathways",
  "Language Processing & Aphasia", "Apraxia & Agnosia",
  "Cell Biology & Neuron Anatomy", "Neurotransmitters & Synaptic Transmission",
  "Cranial Nerves", "Vascular System of the Brain", "Neuropsychology Overview",
];

const SAMPLE_FLASHCARD = {
  front: "What is the difference between Type I and Type II error in hypothesis testing?",
  back: "Type I error (α) is rejecting a true null hypothesis — a false positive. Type II error (β) is failing to reject a false null hypothesis — a false negative. Power (1 − β) reflects the ability to detect a real effect when one exists.",
};

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [, navigate] = useLocation();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate("/dashboard");
    }
  }, [isSignedIn, isLoaded, navigate]);

  if (showSignIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <button
            className="text-muted-foreground hover:text-foreground mb-4 text-sm flex items-center gap-1"
            onClick={() => setShowSignIn(false)}
          >
            ← Back
          </button>
          <SignIn fallbackRedirectUrl="/dashboard" signUpUrl="/sign-up" />
        </div>
      </div>
    );
  }

  if (showSignUp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <button
            className="text-muted-foreground hover:text-foreground mb-4 text-sm flex items-center gap-1"
            onClick={() => setShowSignUp(false)}
          >
            ← Back
          </button>
          <SignUp fallbackRedirectUrl="/onboarding" signInUrl="/sign-in" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden" data-testid="landing-page">
      {/* Nav */}
      <header className="border-b border-border/60 bg-card/70 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-7 h-7 text-primary" />
            <span className="font-bold text-xl text-foreground">PsychPro</span>
          </div>
          <a
            href="#pricing"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:inline"
          >
            Pricing
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Decorative gradient backdrop */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[800px] h-[600px] bg-primary/10 rounded-full blur-3xl opacity-60" aria-hidden />
        <div className="absolute top-40 right-10 -z-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" aria-hidden />
        <div className="absolute top-20 left-10 -z-10 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl" aria-hidden />

        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur border border-primary/20 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6 shadow-sm">
            <Sparkles className="w-4 h-4" />
            Built for psychology students & clinicians
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-[1.05] tracking-tight">
            Study smarter.
            <br />
            <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Practice with purpose.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Adaptive flashcards, quizzes, study guides, and timed practice exams —
            covering the breadth of clinical psychology, from foundations to specialty topics.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button
              size="lg"
              onClick={() => setShowSignUp(true)}
              data-testid="button-start-free"
              className="text-base px-8 h-12 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
            >
              Start for Free
            </Button>
            <Button
              size="lg"
              variant="ghost"
              onClick={() => setShowSignIn(true)}
              data-testid="button-sign-in-hero"
              className="text-base px-8 h-12"
            >
              Sign In
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-5 flex items-center justify-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-primary" />
            10 free interactions — no credit card required
          </p>

          {/* Floating mini value props */}
          <div className="mt-14 flex flex-wrap justify-center gap-2.5 max-w-3xl mx-auto">
            {[
              { icon: GraduationCap, label: "Real coursework" },
              { icon: Target, label: "Exam-ready" },
              { icon: Clock, label: "Minutes a day" },
              { icon: Sparkles, label: "AI custom decks" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 bg-card/70 backdrop-blur border border-border/60 rounded-full px-4 py-2 text-sm text-foreground/80 shadow-sm"
              >
                <item.icon className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Stats Bar */}
      <section className="border-y border-border bg-muted/30 py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">27+</div>
              <div className="text-sm text-muted-foreground mt-1">Topics covered</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">1,200+</div>
              <div className="text-sm text-muted-foreground mt-1">Practice questions</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">27+</div>
              <div className="text-sm text-muted-foreground mt-1">Study guides</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Everything you need to study</h2>
          <p className="text-muted-foreground">Four study modes designed to reinforce learning and prepare you for exams.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Layers, title: "Flashcards", description: "Flip through hundreds of high-yield cards, sorted by difficulty.", color: "text-blue-500", bg: "bg-blue-500/10" },
            { icon: BookOpen, title: "Quizzes", description: "10-question multiple-choice quizzes with detailed clinical explanations.", color: "text-green-500", bg: "bg-green-500/10" },
            { icon: Brain, title: "Study Guides", description: "Comprehensive notes with tables and frameworks for every topic.", color: "text-purple-500", bg: "bg-purple-500/10" },
            { icon: Trophy, title: "Practice Exams", description: "25 or 50-question timed exams to prepare for boards and finals.", color: "text-amber-500", bg: "bg-amber-500/10" },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className={`w-11 h-11 rounded-lg ${feature.bg} flex items-center justify-center mb-4`}>
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sample Flashcard */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-3">
              <Layers className="w-3.5 h-3.5" /> Try it now
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-3">A real flashcard, on the house</h2>
            <p className="text-muted-foreground mb-5 leading-relaxed">
              Tap the card to flip it. Every topic has 55+ cards covering key concepts,
              clinical reasoning, and exam-ready content.
            </p>
            <Button onClick={() => setShowSignUp(true)} size="lg" className="mt-2" data-testid="button-try-now">
              Get Full Access Free
            </Button>
          </div>
          <div
            className="cursor-pointer select-none group"
            onClick={() => setFlipped(f => !f)}
            data-testid="sample-flashcard"
          >
            <div className="relative bg-gradient-to-br from-card to-card/60 border-2 border-primary/20 rounded-2xl p-8 min-h-44 flex flex-col justify-center shadow-lg group-hover:shadow-xl group-hover:border-primary/40 group-hover:-translate-y-0.5 transition-all">
              <div className="absolute top-3 right-3 text-xs text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
                {flipped ? "Answer" : "Question — tap to flip"}
              </div>
              <p className="text-foreground text-center leading-relaxed font-medium">
                {flipped ? SAMPLE_FLASHCARD.back : SAMPLE_FLASHCARD.front}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="bg-muted/30 border-y border-border py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Topics covered</h2>
            <p className="text-muted-foreground">Foundations, assessment, intervention, research methods, and clinical specialties — all in one place.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            {REAL_TOPICS.map((topic) => (
              <div
                key={topic}
                className="flex items-center gap-2 text-sm text-muted-foreground bg-card border border-border rounded-lg px-3 py-2 hover:border-primary/30 hover:text-foreground transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className="truncate">{topic}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 text-sm text-primary font-medium bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
              <Zap className="w-3.5 h-3.5 flex-shrink-0" />
              <span>+ More being added</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-5xl mx-auto px-4 py-20 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Simple, transparent pricing</h2>
          <p className="text-muted-foreground">Start free. Upgrade when you're ready for more.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              name: "Free",
              price: "$0",
              period: "forever",
              features: ["10 free interactions", "All topics accessible", "Flashcards & quizzes"],
              cta: "Get Started",
              highlight: false,
            },
            {
              name: "Pro",
              price: "$9.99",
              period: "/ month",
              features: ["Unlimited interactions", "All study guides", "Practice exams", "Progress tracking"],
              cta: "Start Free Trial",
              highlight: true,
            },
            {
              name: "Scholar",
              price: "$19.99",
              period: "/ month",
              features: ["Everything in Pro", "AI-generated custom decks", "Upload your own notes", "Priority access to new content"],
              cta: "Go Scholar",
              highlight: false,
            },
          ].map(plan => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-6 flex flex-col transition-shadow ${
                plan.highlight
                  ? "border-primary bg-gradient-to-b from-primary/5 to-card shadow-lg shadow-primary/10 md:-translate-y-2"
                  : "border-border bg-card hover:shadow-md"
              }`}
            >
              {plan.highlight && (
                <div className="text-xs font-semibold text-primary bg-primary/10 rounded-full px-3 py-0.5 self-start mb-3">
                  Most Popular
                </div>
              )}
              <h3 className="font-bold text-lg text-foreground">{plan.name}</h3>
              <div className="mt-1 mb-4">
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.highlight ? "default" : "outline"}
                className="w-full"
                onClick={() => setShowSignUp(true)}
                data-testid={`button-plan-${plan.name.toLowerCase()}`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary via-primary to-blue-600" />
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" aria-hidden />
        <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" aria-hidden />
        <div className="max-w-2xl mx-auto text-center px-4 py-20 text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to start studying?</h2>
          <p className="text-primary-foreground/85 mb-8 text-lg">
            Join now and get 10 free interactions — no credit card required.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => setShowSignUp(true)}
            data-testid="button-cta"
            className="text-base px-8 h-12 shadow-lg"
          >
            Create Free Account
          </Button>
        </div>
      </section>
    </div>
  );
}
