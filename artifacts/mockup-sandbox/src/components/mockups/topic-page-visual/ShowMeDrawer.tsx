import React, { useState } from "react";
import { ChevronLeft, Play, Layers, BookOpen, FileText, GraduationCap, CalendarDays, Check, Clock, RefreshCw, Beaker, Zap, Activity, Pill } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import "./_group.css";

const TOPIC = {
  id: 1,
  name: "Synaptic Transmission",
  category: "Neurotransmitters",
  description: "How neurons communicate via chemical signals at the synapse — action potential arrival, vesicle release, receptor binding, and reuptake.",
  flashcardCount: 24,
  quizCount: 18,
};

const STUDY_MODES = [
  {
    icon: Layers,
    title: "Flashcards",
    description: "Tap to flip and test your recall",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: BookOpen,
    title: "Quiz",
    description: "Multiple-choice with explanations",
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-950/30",
  },
  {
    icon: FileText,
    title: "Study Guide",
    description: "Comprehensive scrollable notes",
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    icon: GraduationCap,
    title: "Practice Exam",
    description: "Timed or untimed full exam",
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/30",
  },
];

const DEMOS = [
  {
    id: "action-potential",
    title: "Action potential reaches the terminal",
    duration: "25-sec demo",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    SvgDemo: () => (
      <div className="w-full h-64 bg-slate-900 rounded-xl overflow-hidden relative flex items-center justify-center">
        <svg viewBox="0 0 400 300" className="w-full h-full">
          {/* Axon Terminal Background */}
          <path d="M150,0 C150,100 50,150 50,300 L350,300 C350,150 250,100 250,0 Z" fill="#1e293b" stroke="#334155" strokeWidth="4" />
          {/* Action Potential traveling down */}
          <circle cx="200" cy="50" r="8" fill="#fbbf24" className="animate-action-potential shadow-[0_0_15px_#fbbf24]" />
          {/* Secondary signal */}
          <circle cx="200" cy="120" r="8" fill="#fbbf24" className="animate-action-potential shadow-[0_0_15px_#fbbf24]" style={{ animationDelay: "1s" }} />
        </svg>
      </div>
    )
  },
  {
    id: "vesicle-fusion",
    title: "Vesicle fusion and neurotransmitter release",
    duration: "30-sec demo",
    icon: Activity,
    color: "text-rose-500",
    bg: "bg-rose-50 dark:bg-rose-950/30",
    SvgDemo: () => (
      <div className="w-full h-64 bg-slate-900 rounded-xl overflow-hidden relative flex items-center justify-center">
        <svg viewBox="0 0 400 300" className="w-full h-full">
          {/* Axon Terminal Background */}
          <path d="M50,0 C50,150 50,200 150,200 L250,200 C350,200 350,150 350,0 Z" fill="#1e293b" stroke="#334155" strokeWidth="4" />
          {/* Synaptic Cleft */}
          <rect x="50" y="220" width="300" height="80" fill="#0f172a" />
          {/* Postsynaptic Density */}
          <path d="M50,300 C50,250 150,250 200,250 C250,250 350,250 350,300 Z" fill="#1e293b" stroke="#334155" strokeWidth="4" />
          
          {/* Vesicles */}
          <g className="animate-vesicle-move">
            <circle cx="200" cy="150" r="25" fill="#0ea5e9" fillOpacity="0.2" stroke="#0ea5e9" strokeWidth="2" />
            <circle cx="195" cy="145" r="4" fill="#38bdf8" />
            <circle cx="205" cy="155" r="4" fill="#38bdf8" />
            <circle cx="190" cy="155" r="4" fill="#38bdf8" />
          </g>

          {/* Neurotransmitters releasing */}
          <g className="animate-neurotransmitter-release">
            <circle cx="180" cy="200" r="4" fill="#38bdf8" className="animate-neurotransmitter-release" style={{ animationDelay: "0s" }} />
            <circle cx="200" cy="200" r="4" fill="#38bdf8" className="animate-neurotransmitter-release" style={{ animationDelay: "0.2s" }} />
            <circle cx="220" cy="200" r="4" fill="#38bdf8" className="animate-neurotransmitter-release" style={{ animationDelay: "0.4s" }} />
          </g>
        </svg>
      </div>
    )
  },
  {
    id: "receptor-binding",
    title: "Receptor binding and reuptake cycle",
    duration: "45-sec demo",
    icon: Pill,
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    SvgDemo: () => (
      <div className="w-full h-64 bg-slate-900 rounded-xl overflow-hidden relative flex items-center justify-center">
        <div className="text-muted-foreground text-sm flex items-center gap-2">
          <Activity className="w-4 h-4 animate-pulse" />
          Animation Demo (Receptor Binding)
        </div>
      </div>
    )
  }
];

function CategoryHero({ category, topicName }: { category: string; topicName: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-violet-100 via-purple-50 to-transparent dark:from-violet-950/40 dark:via-purple-950/20 mb-4">
      <div className="absolute inset-0 pointer-events-none opacity-60" aria-hidden>
        <span className="absolute top-3 right-6 w-1.5 h-1.5 rounded-full bg-violet-400/40" />
        <span className="absolute top-10 right-16 w-1 h-1 rounded-full bg-violet-400/40" />
      </div>
      <div className="relative flex items-center gap-4 px-5 py-5 md:px-6 md:py-6">
        <div className="relative shrink-0">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center shadow-sm text-violet-600 dark:text-violet-400">
            <Pill className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.6} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">{category}</p>
          <h1 className="text-xl md:text-2xl font-bold text-foreground leading-tight">{topicName}</h1>
        </div>
      </div>
    </div>
  );
}

export function ShowMeDrawer() {
  const [activeDemo, setActiveDemo] = useState<typeof DEMOS[0] | null>(null);

  return (
    <div className="min-h-full bg-background font-sans" data-testid="topic-detail-page">
      <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8">
        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to Topics
        </button>

        <CategoryHero category={TOPIC.category} topicName={TOPIC.name} />
        <p className="text-muted-foreground mb-4 text-base">{TOPIC.description}</p>

        <div className="flex gap-4 mb-8 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><Layers className="w-4 h-4" />{TOPIC.flashcardCount} flashcards</span>
          <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" />{TOPIC.quizCount} questions</span>
        </div>

        {/* Show Me Demo Section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Play className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-foreground">Visual Demos</h2>
          </div>
          <div className="flex flex-col gap-2.5">
            {DEMOS.map(demo => (
              <button
                key={demo.id}
                onClick={() => setActiveDemo(demo)}
                className="group flex items-center gap-4 p-3 pr-4 rounded-xl border border-border bg-card text-left hover:border-primary/30 hover:bg-primary/[0.02] transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", demo.bg)}>
                  <demo.icon className={cn("w-5 h-5", demo.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                    <Play className="w-3 h-3 fill-current opacity-70" />
                    {demo.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{demo.duration}</p>
                </div>
                <ChevronLeft className="w-4 h-4 text-muted-foreground rotate-180 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Study Modes Section */}
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-foreground">Study Modes</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 mb-10">
          {STUDY_MODES.map(mode => (
            <button
              key={mode.title}
              className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card text-left hover:border-primary/40 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${mode.bg}`}>
                <mode.icon className={`w-5 h-5 ${mode.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">{mode.title}</p>
                <p className="text-sm text-muted-foreground">{mode.description}</p>
              </div>
              <ChevronLeft className="w-4 h-4 text-muted-foreground rotate-180 shrink-0" />
            </button>
          ))}
        </div>

        {/* Retention Plan */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Beaker className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-foreground">Retention Plan</h2>
          </div>
          <span className="text-xs text-primary hover:underline cursor-pointer">
            Why this works →
          </span>
        </div>
        
        <section className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-sm">
          <header className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <CalendarDays className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground">Spaced Repetition</h3>
              <p className="text-xs text-muted-foreground italic">
                Spacing reviews across days strengthens long-term recall.
              </p>
            </div>
            <span className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-primary text-primary-foreground">
              <Clock className="w-3.5 h-3.5" />
              Ready now
            </span>
          </header>

          <div className="mb-4">
            <div className="text-sm font-medium text-foreground mb-0.5">{TOPIC.name}</div>
            <p className="text-xs text-muted-foreground">Mark this topic as reviewed each time you finish a study session.</p>
          </div>

          <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>0 of 4 intervals complete</span>
            <span>0%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 mb-5">
            <div className="bg-primary h-1.5 rounded-full transition-all duration-500 w-[0%]" />
          </div>

          <div className="relative mb-6">
            <div className="absolute top-3.5 left-3 right-3 h-0.5 bg-border" />
            <ol className="relative grid grid-cols-4 gap-2">
              {[1, 3, 7, 14].map((days, idx) => (
                <li key={days} className="flex flex-col items-center gap-2">
                  <div className={cn(
                    "w-7 h-7 rounded-full border-2 flex items-center justify-center text-[11px] font-semibold bg-background transition-colors",
                    idx === 0 ? "border-primary text-primary ring-4 ring-primary/15" : "border-border text-muted-foreground"
                  )}>
                    {idx + 1}
                  </div>
                  <span className={cn("text-[11px] font-medium", idx === 0 ? "text-foreground" : "text-muted-foreground")}>
                    Day {days}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button>
              <Check className="w-4 h-4 mr-1.5" />
              Mark as Reviewed
            </Button>
            <Button variant="ghost" size="sm">
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Reset
            </Button>
          </div>
        </section>

      </div>

      <Sheet open={!!activeDemo} onOpenChange={(open) => !open && setActiveDemo(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col h-[100dvh] bg-background border-l border-border">
          {activeDemo && (
            <>
              <div className="p-6 border-b border-border bg-card shrink-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn("w-8 h-8 rounded-md flex items-center justify-center", activeDemo.bg)}>
                    <activeDemo.icon className={cn("w-4 h-4", activeDemo.color)} />
                  </div>
                  <SheetTitle className="text-lg leading-tight flex-1 pr-6">{activeDemo.title}</SheetTitle>
                </div>
                <SheetDescription className="text-xs text-muted-foreground">
                  {activeDemo.duration} loop • Synaptic Transmission
                </SheetDescription>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-background">
                <div className="mb-6 rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                  <activeDemo.SvgDemo />
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm text-foreground">Key Takeaways</h4>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span>When the action potential arrives, voltage-gated calcium channels open.</span>
                    </li>
                    <li className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span>Calcium influx triggers vesicles to fuse with the presynaptic membrane.</span>
                    </li>
                    <li className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span>Neurotransmitters are released into the synaptic cleft.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-6 border-t border-border bg-card shrink-0 mt-auto">
                <div className="flex flex-col gap-3">
                  <Button className="w-full" onClick={() => setActiveDemo(null)}>
                    Got it — back to topic
                  </Button>
                  <Button variant="outline" className="w-full text-muted-foreground">
                    Open as flashcard
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
