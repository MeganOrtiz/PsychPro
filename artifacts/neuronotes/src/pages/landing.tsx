import { useLocation } from "wouter";
import { SignIn, SignUp, useUser } from "@clerk/react";
import { useState, useEffect } from "react";
import { Brain, BookOpen, Layers, Trophy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [, navigate] = useLocation();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

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
          <SignIn
            fallbackRedirectUrl="/dashboard"
            signUpUrl="/sign-up"
          />
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
          <SignUp
            fallbackRedirectUrl="/onboarding"
            signInUrl="/sign-in"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="landing-page">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-7 h-7 text-primary" />
            <span className="font-bold text-xl text-foreground">NeuroNotes</span>
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

      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Brain className="w-4 h-4" />
          Built for neuroscience students
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
          Master Neuroscience &<br />
          <span className="text-primary">Neuropsychology</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Flashcards, quizzes, study guides, and practice exams covering 20+ neuroscience topics.
          Designed for students, clinicians, and researchers.
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

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8 text-foreground">Everything you need to study</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Layers, title: "Flashcards", description: "Tap to flip and test your recall on 90+ neuroscience flashcards." },
            { icon: BookOpen, title: "Quizzes", description: "Multiple-choice questions with detailed explanations for each answer." },
            { icon: Brain, title: "Study Guides", description: "Comprehensive, scrollable study notes for every major topic." },
            { icon: Trophy, title: "Practice Exams", description: "Timed and untimed exams to prepare for boards and finals." },
          ].map((feature) => (
            <div key={feature.title} className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <feature.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8 text-foreground">Topics Covered</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            "Neuron Anatomy", "Cerebral Cortex", "Limbic System", "Basal Ganglia",
            "Cerebellum", "Brainstem", "Sensory Pathways", "Motor Control",
            "Sleep & Circadian Rhythms", "Dementia & Alzheimer's", "Multiple Sclerosis",
            "Psychopharmacology", "Psychopathology", "Visual System", "Vestibular System",
            "Pain & Nociception", "Neuroradiology", "CNS Development", "Neurogenetics", "And more..."
          ].map((topic) => (
            <div key={topic} className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
              {topic}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-16 mt-12">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to start studying?</h2>
          <p className="text-primary-foreground/80 mb-8">Join now and get 10 free interactions to try all features.</p>
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
