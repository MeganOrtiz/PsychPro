import { useLocation } from "wouter";
import { SignIn, SignUp, useUser } from "@clerk/react";
import { useState, useEffect } from "react";
import { Brain, BookOpen, Layers, Trophy, CheckCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const REAL_TOPICS = [
  "Neuropsychology Overview", "Cell Biology & Neuron Anatomy", "Neurotransmitters & Synaptic Transmission",
  "Sensory Pathways", "Limbic System & Motivation", "Sleep & Circadian Rhythms",
  "Psychopharmacology", "Psychological Disorders", "Personality Disorders",
  "ADHD & Medications", "Language Processing & Aphasia", "Apraxia & Agnosia",
  "Neurocognitive Disorders", "Cranial Nerves", "Vascular System of the Brain",
  "Neurodevelopmental Disorders", "Quantitative Statistics & Research Methods",
  "Qualitative Research Designs", "Validity & Effort Testing",
];

const SAMPLE_FLASHCARD = {
  front: "What is the floor effect in performance validity test design?",
  back: "Well-designed PVTs are easy enough that even patients with genuine moderate-to-severe impairment score near ceiling — making failure by less-impaired examinees clearly non-credible.",
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
    <div className="min-h-screen bg-background" data-testid="landing-page">
      {/* Nav */}
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-7 h-7 text-primary" />
            <span className="font-bold text-xl text-foreground">PsychPro</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowSignIn(true)} data-testid="button-sign-in">
              Sign In
            </Button>
            <Button size="sm" onClick={() => setShowSignUp(true)} data-testid="button-get-started">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Brain className="w-4 h-4" />
          Built for neuropsychology students & clinicians
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
          Master Neuroscience &<br />
          <span className="text-primary">Neuropsychology</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Flashcards, quizzes, study guides, and practice exams — all built from real course content.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" onClick={() => setShowSignUp(true)} data-testid="button-start-free" className="text-base px-8">
            Start for Free
          </Button>
          <Button size="lg" variant="outline" onClick={() => setShowSignIn(true)} data-testid="button-sign-in-hero" className="text-base px-8">
            Sign In
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-4">10 free interactions — no credit card required</p>
      </section>

      {/* Live Stats Bar */}
      <section className="border-y border-border bg-muted/30 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">27+</div>
              <div className="text-sm text-muted-foreground mt-1">Topics covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">1,200+</div>
              <div className="text-sm text-muted-foreground mt-1">Practice questions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">27+</div>
              <div className="text-sm text-muted-foreground mt-1">Study guides</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10 text-foreground">Everything you need to study</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Layers, title: "Flashcards", description: "Flip through hundreds of high-yield cards, sorted by difficulty." },
            { icon: BookOpen, title: "Quizzes", description: "10-question multiple-choice quizzes with detailed clinical explanations." },
            { icon: Brain, title: "Study Guides", description: "Comprehensive notes with tables and frameworks for every topic." },
            { icon: Trophy, title: "Practice Exams", description: "25 or 50-question timed exams to prepare for boards and finals." },
          ].map((feature) => (
            <div key={feature.title} className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <feature.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sample Flashcard */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-3">Try a flashcard</h2>
            <p className="text-muted-foreground mb-4">Tap the card to flip it. Every topic has 55+ cards covering key concepts, clinical reasoning, and exam-ready content.</p>
            <Button onClick={() => setShowSignUp(true)} className="mt-2" data-testid="button-try-now">
              Get Full Access Free
            </Button>
          </div>
          <div
            className="cursor-pointer select-none"
            onClick={() => setFlipped(f => !f)}
            data-testid="sample-flashcard"
          >
            <div className="relative bg-card border-2 border-primary/20 rounded-2xl p-8 min-h-40 flex flex-col justify-center shadow-md hover:shadow-lg hover:border-primary/40 transition-all">
              <div className="absolute top-3 right-3 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
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
      <section className="bg-muted/30 border-y border-border py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-2 text-foreground">Topics Covered</h2>
          <p className="text-muted-foreground text-center mb-8 text-sm">From neuroscience foundations to advanced clinical assessment</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            {REAL_TOPICS.map((topic) => (
              <div key={topic} className="flex items-center gap-2 text-sm text-muted-foreground bg-card border border-border rounded-lg px-3 py-2">
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

      {/* Pricing hint */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-8 text-foreground">Simple, transparent pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
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
              className={`rounded-xl border p-6 flex flex-col ${
                plan.highlight
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border bg-card"
              }`}
            >
              {plan.highlight && (
                <div className="text-xs font-semibold text-primary bg-primary/10 rounded-full px-3 py-0.5 self-start mb-3">Most Popular</div>
              )}
              <h3 className="font-bold text-lg text-foreground">{plan.name}</h3>
              <div className="mt-1 mb-4">
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm ml-1">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    {f}
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
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to start studying?</h2>
          <p className="text-primary-foreground/80 mb-8">Join now and get 10 free interactions — no credit card required.</p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => setShowSignUp(true)}
            data-testid="button-cta"
            className="text-base px-8"
          >
            Create Free Account
          </Button>
        </div>
      </section>
    </div>
  );
}
