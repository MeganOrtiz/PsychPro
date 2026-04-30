import React, { useState } from "react";
import { ChevronLeft, Layers, BookOpen, FileText, GraduationCap, Clock, Check, ChevronDown, Activity, Sparkles, Brain, Zap, FlaskConical, CircleDot, MoveRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const concepts = [
  {
    id: "action-potential",
    label: "Action Potential",
    x: 50,
    y: 15,
    definition: "An electrical signal that travels down the axon to the presynaptic terminal, triggering neurotransmitter release.",
    icon: Activity,
    hasDetails: true
  },
  {
    id: "vesicle-fusion",
    label: "Vesicle Fusion",
    x: 80,
    y: 25,
    definition: "The process where synaptic vesicles merge with the presynaptic membrane, emptying their contents into the cleft.",
    icon: CircleDot,
    hasDetails: true
  },
  {
    id: "cleft-diffusion",
    label: "Cleft Diffusion",
    x: 85,
    y: 50,
    hasDetails: false
  },
  {
    id: "receptor-binding",
    label: "Receptor Binding",
    x: 75,
    y: 75,
    definition: "Neurotransmitters attach to specific receptor proteins on the postsynaptic neuron, acting like a key in a lock.",
    icon: Zap,
    hasDetails: true
  },
  {
    id: "postsynaptic-response",
    label: "Postsynaptic Response",
    x: 50,
    y: 85,
    hasDetails: false
  },
  {
    id: "reuptake",
    label: "Reuptake",
    x: 25,
    y: 75,
    hasDetails: false
  },
  {
    id: "excitatory-inhibitory",
    label: "Excitatory / Inhibitory",
    x: 15,
    y: 50,
    hasDetails: false
  },
  {
    id: "neuromodulation",
    label: "Neuromodulation",
    x: 20,
    y: 25,
    hasDetails: false
  }
];

const studyModes = [
  { icon: Layers, title: "Flashcards", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
  { icon: BookOpen, title: "Quiz", color: "text-green-500", bg: "bg-green-50 dark:bg-green-950/30" },
  { icon: FileText, title: "Study Guide", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/30" },
  { icon: GraduationCap, title: "Practice Exam", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
];

export function ConceptMap() {
  const [openNode, setOpenNode] = useState<string | null>(null);

  return (
    <div className="min-h-full bg-background text-foreground flex flex-col font-sans" data-testid="concept-map-page">
      <div className="w-full max-w-3xl mx-auto p-4 md:p-6 flex flex-col gap-6">
        
        {/* Header */}
        <div>
          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2">
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span>Neurotransmitters</span>
            <span className="text-border">/</span>
            <span className="text-foreground font-medium">Synaptic Transmission</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            How neurons communicate via chemical signals at the synapse — action potential arrival, vesicle release, receptor binding, and reuptake.
          </p>
        </div>

        {/* Concept Map Hero */}
        <div className="relative w-full h-[480px] bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-border overflow-hidden select-none">
          
          {/* SVG connecting lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {concepts.map((node, i) => {
              // Draw a bezier curve from center (50, 50) to each node (node.x, node.y)
              const cx = 50;
              const cy = 50;
              const nx = node.x;
              const ny = node.y;
              
              // Midpoints for control points to make nice curves
              const cp1x = cx + (nx - cx) * 0.4;
              const cp1y = cy;
              const cp2x = nx - (nx - cx) * 0.4;
              const cp2y = ny;

              return (
                <path
                  key={node.id}
                  d={`M ${cx} ${cy} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${nx} ${ny}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-border dark:text-slate-800/80 stroke-dasharray-[1,1] opacity-50"
                />
              );
            })}
          </svg>

          {/* Central Node */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center p-4 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 cursor-pointer hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 mb-1.5 opacity-80" />
            <span className="font-bold text-center text-sm">Synaptic<br/>Transmission</span>
          </div>

          {/* Child Nodes */}
          {concepts.map((node) => {
            const isClickable = node.hasDetails;
            
            return (
              <Popover key={node.id} open={openNode === node.id} onOpenChange={(open) => setOpenNode(open ? node.id : null)}>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      "absolute -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-full border text-xs font-semibold whitespace-nowrap shadow-sm transition-all duration-300 z-20",
                      isClickable ? "hover:scale-105 hover:shadow-md cursor-pointer hover:border-violet-300" : "cursor-default opacity-80",
                      openNode === node.id 
                        ? "bg-violet-600 text-white border-violet-600 shadow-violet-500/20" 
                        : "bg-background text-foreground border-border"
                    )}
                    style={{ top: `${node.y}%`, left: `${node.x}%` }}
                    onClick={(e) => {
                      if (!isClickable) e.preventDefault();
                    }}
                  >
                    {node.label}
                  </button>
                </PopoverTrigger>
                {isClickable && node.definition && (
                  <PopoverContent 
                    className="w-64 p-4 rounded-xl shadow-xl animate-in zoom-in-95 data-[side=bottom]:slide-in-from-top-2 z-50 border-violet-100 dark:border-violet-900" 
                    sideOffset={10}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center shrink-0">
                        {node.icon && <node.icon className="w-5 h-5 text-violet-600 dark:text-violet-400" />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">{node.label}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{node.definition}</p>
                      </div>
                    </div>
                    <button className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 hover:bg-violet-50 dark:hover:bg-violet-950/50 py-2 rounded-lg transition-colors">
                      Study this concept <MoveRight className="w-3.5 h-3.5" />
                    </button>
                  </PopoverContent>
                )}
              </Popover>
            );
          })}
        </div>

        {/* Study Modes Action Bar */}
        <div className="flex flex-wrap md:flex-nowrap gap-2 items-center justify-between bg-card border border-border p-2 rounded-2xl shadow-sm">
          {studyModes.map((mode, i) => (
            <button
              key={mode.title}
              className="flex-1 min-w-[120px] flex items-center justify-center gap-2 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", mode.bg)}>
                <mode.icon className={cn("w-4 h-4", mode.color)} />
              </div>
              <span className="text-sm font-semibold text-foreground whitespace-nowrap">{mode.title}</span>
            </button>
          ))}
        </div>

        {/* Retention Plan */}
        <Collapsible className="border border-border bg-card rounded-2xl shadow-sm overflow-hidden mt-4">
          <CollapsibleTrigger className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Retention Plan</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Spaced repetition schedule for durable recall</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full hidden sm:inline-block">
                Review in 2 days
              </span>
              <ChevronDown className="w-5 h-5 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-5 pt-0 border-t border-border mt-2 animate-in fade-in zoom-in-95">
            <div className="relative pt-6 pb-2 pl-4">
              <div className="absolute left-6 top-6 bottom-4 w-0.5 bg-border rounded-full" />
              <div className="absolute left-6 top-6 h-1/4 w-0.5 bg-primary rounded-full z-10" />
              
              <ul className="space-y-6 relative z-20">
                <li className="flex items-center gap-4">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-sm shrink-0 border-2 border-background">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Day 1: Initial Learning</p>
                    <p className="text-xs text-muted-foreground">Completed today</p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-5 h-5 rounded-full bg-background border-2 border-primary flex items-center justify-center shadow-sm shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Day 3: First Review</p>
                    <p className="text-xs text-muted-foreground">Due in 2 days</p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-5 h-5 rounded-full bg-background border-2 border-border flex items-center justify-center shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Day 7: Second Review</p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-5 h-5 rounded-full bg-background border-2 border-border flex items-center justify-center shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Day 14: Final Review</p>
                  </div>
                </li>
              </ul>
            </div>
          </CollapsibleContent>
        </Collapsible>

      </div>
    </div>
  );
}
