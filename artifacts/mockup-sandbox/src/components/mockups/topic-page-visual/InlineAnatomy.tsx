import React, { useState } from "react";
import { 
  ChevronLeft, 
  Layers, 
  BookOpen, 
  FileText, 
  GraduationCap, 
  Beaker, 
  Check, 
  Clock, 
  CalendarDays, 
  RefreshCw 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const REGIONS = {
  presynaptic: { id: "presynaptic", name: "Presynaptic Terminal", desc: "The axon terminal that releases neurotransmitters into the cleft." },
  vesicles: { id: "vesicles", name: "Synaptic Vesicles", desc: "Membrane-bound sacs containing neurotransmitter molecules ready for release." },
  calcium: { id: "calcium", name: "Calcium Channels", desc: "Voltage-gated channels that allow Ca2+ influx, triggering vesicle fusion." },
  cleft: { id: "cleft", name: "Synaptic Cleft", desc: "The 20-40nm gap between neurons where chemical signaling occurs." },
  receptors: { id: "receptors", name: "Postsynaptic Receptors", desc: "Proteins that bind neurotransmitters to initiate a response in the receiving cell." },
  postsynaptic: { id: "postsynaptic", name: "Postsynaptic Neuron", desc: "The receiving dendritic spine where the signal continues." }
};

export function InlineAnatomy() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  const topic = {
    name: "Synaptic Transmission",
    category: "Neurotransmitters",
    description: "How neurons communicate via chemical signals at the synapse — action potential arrival, vesicle release, receptor binding, and reuptake.",
    flashcardCount: 24,
    quizCount: 18
  };

  const studyModes = [
    {
      icon: Layers,
      title: "Flashcards",
      description: "Tap to flip and test your recall",
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-200 dark:border-blue-800",
    },
    {
      icon: BookOpen,
      title: "Quiz",
      description: "Multiple-choice with explanations",
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-950/30",
      border: "border-green-200 dark:border-green-800",
    },
    {
      icon: FileText,
      title: "Study Guide",
      description: "Comprehensive scrollable notes",
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-950/30",
      border: "border-purple-200 dark:border-purple-800",
    },
    {
      icon: GraduationCap,
      title: "Practice Exam",
      description: "Timed or untimed full exam",
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/30",
      border: "border-amber-200 dark:border-amber-800",
    },
  ];

  const handleRegionHover = (id: string) => setActiveRegion(id);
  const handleRegionLeave = () => setActiveRegion(null);

  const getOpacity = (id: string) => {
    if (!activeRegion) return 1;
    return activeRegion === id ? 1 : 0.3;
  };

  return (
    <div className="min-h-full bg-background text-foreground pb-12 font-sans" data-testid="variant-a">
      <div className="max-w-2xl mx-auto md:p-6 lg:p-8">
        
        <div className="px-4 pt-4 md:px-0">
          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back to Topics
          </button>
        </div>

        {/* HERO DIAGRAM */}
        <div className="bg-violet-50/50 dark:bg-violet-950/10 md:rounded-2xl border-y md:border border-border overflow-hidden mb-6">
          <div className="p-4 md:p-6 flex flex-col items-center">
            
            <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">
              <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-sm">
                <defs>
                  <linearGradient id="axonGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(262, 80%, 85%)" />
                    <stop offset="100%" stopColor="hsl(262, 60%, 70%)" />
                  </linearGradient>
                  <linearGradient id="dendriteGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(270, 70%, 75%)" />
                    <stop offset="100%" stopColor="hsl(270, 80%, 85%)" />
                  </linearGradient>
                  <radialGradient id="vesicleGrad" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="white" />
                    <stop offset="100%" stopColor="hsl(280, 80%, 70%)" />
                  </radialGradient>
                </defs>

                {/* Presynaptic Terminal */}
                <g 
                  className="cursor-pointer transition-opacity duration-300"
                  style={{ opacity: getOpacity("presynaptic") }}
                  onMouseEnter={() => handleRegionHover("presynaptic")}
                  onMouseLeave={handleRegionLeave}
                  onClick={() => handleRegionHover("presynaptic")}
                >
                  <path 
                    d="M100 0 C100 80, 50 120, 50 180 C50 250, 120 280, 200 280 C280 280, 350 250, 350 180 C350 120, 300 80, 300 0 Z" 
                    fill="url(#axonGrad)" 
                    stroke="hsl(262, 50%, 60%)" 
                    strokeWidth="4" 
                  />
                </g>

                {/* Calcium Channels */}
                <g 
                  className="cursor-pointer transition-opacity duration-300"
                  style={{ opacity: getOpacity("calcium") }}
                  onMouseEnter={() => handleRegionHover("calcium")}
                  onMouseLeave={handleRegionLeave}
                  onClick={() => handleRegionHover("calcium")}
                >
                  {/* Left Channel */}
                  <rect x="70" y="160" width="16" height="30" rx="4" fill="hsl(199, 84%, 60%)" stroke="hsl(199, 84%, 40%)" strokeWidth="2" transform="rotate(-30 78 175)" />
                  <circle cx="65" cy="155" r="4" fill="hsl(199, 84%, 80%)" />
                  <circle cx="60" cy="140" r="4" fill="hsl(199, 84%, 80%)" />
                  
                  {/* Right Channel */}
                  <rect x="314" y="160" width="16" height="30" rx="4" fill="hsl(199, 84%, 60%)" stroke="hsl(199, 84%, 40%)" strokeWidth="2" transform="rotate(30 322 175)" />
                  <circle cx="335" cy="155" r="4" fill="hsl(199, 84%, 80%)" />
                  <circle cx="340" cy="140" r="4" fill="hsl(199, 84%, 80%)" />
                </g>

                {/* Vesicles */}
                <g 
                  className="cursor-pointer transition-opacity duration-300"
                  style={{ opacity: getOpacity("vesicles") }}
                  onMouseEnter={() => handleRegionHover("vesicles")}
                  onMouseLeave={handleRegionLeave}
                  onClick={() => handleRegionHover("vesicles")}
                >
                  <circle cx="160" cy="120" r="18" fill="url(#vesicleGrad)" stroke="hsl(280, 60%, 60%)" strokeWidth="2" />
                  <circle cx="240" cy="100" r="18" fill="url(#vesicleGrad)" stroke="hsl(280, 60%, 60%)" strokeWidth="2" />
                  <circle cx="200" cy="160" r="18" fill="url(#vesicleGrad)" stroke="hsl(280, 60%, 60%)" strokeWidth="2" />
                  <circle cx="140" cy="180" r="18" fill="url(#vesicleGrad)" stroke="hsl(280, 60%, 60%)" strokeWidth="2" />
                  <circle cx="260" cy="170" r="18" fill="url(#vesicleGrad)" stroke="hsl(280, 60%, 60%)" strokeWidth="2" />
                  
                  {/* Fusing vesicle */}
                  <path d="M185 280 C185 260, 215 260, 215 280" fill="none" stroke="hsl(262, 50%, 60%)" strokeWidth="4" />
                  <circle cx="200" cy="270" r="4" fill="hsl(280, 80%, 70%)" />
                  <circle cx="190" cy="285" r="4" fill="hsl(280, 80%, 70%)" />
                  <circle cx="210" cy="285" r="4" fill="hsl(280, 80%, 70%)" />
                </g>

                {/* Synaptic Cleft (The gap) */}
                <g 
                  className="cursor-pointer transition-opacity duration-300"
                  style={{ opacity: getOpacity("cleft") }}
                  onMouseEnter={() => handleRegionHover("cleft")}
                  onMouseLeave={handleRegionLeave}
                  onClick={() => handleRegionHover("cleft")}
                >
                  <rect x="100" y="285" width="200" height="30" fill="transparent" />
                  {/* Neurotransmitters in cleft */}
                  <circle cx="160" cy="295" r="4" fill="hsl(280, 80%, 70%)" />
                  <circle cx="180" cy="305" r="4" fill="hsl(280, 80%, 70%)" />
                  <circle cx="230" cy="295" r="4" fill="hsl(280, 80%, 70%)" />
                  <circle cx="250" cy="305" r="4" fill="hsl(280, 80%, 70%)" />
                  <circle cx="200" cy="310" r="4" fill="hsl(280, 80%, 70%)" />
                </g>

                {/* Postsynaptic Neuron */}
                <g 
                  className="cursor-pointer transition-opacity duration-300"
                  style={{ opacity: getOpacity("postsynaptic") }}
                  onMouseEnter={() => handleRegionHover("postsynaptic")}
                  onMouseLeave={handleRegionLeave}
                  onClick={() => handleRegionHover("postsynaptic")}
                >
                  <path 
                    d="M30 400 C30 350, 80 320, 200 320 C320 320, 370 350, 370 400 Z" 
                    fill="url(#dendriteGrad)" 
                    stroke="hsl(270, 50%, 65%)" 
                    strokeWidth="4" 
                  />
                </g>

                {/* Receptors */}
                <g 
                  className="cursor-pointer transition-opacity duration-300"
                  style={{ opacity: getOpacity("receptors") }}
                  onMouseEnter={() => handleRegionHover("receptors")}
                  onMouseLeave={handleRegionLeave}
                  onClick={() => handleRegionHover("receptors")}
                >
                  <path d="M140 320 L140 335 M132 320 L148 320" stroke="hsl(290, 70%, 50%)" strokeWidth="6" strokeLinecap="round" />
                  <path d="M180 320 L180 335 M172 320 L188 320" stroke="hsl(290, 70%, 50%)" strokeWidth="6" strokeLinecap="round" />
                  <path d="M220 320 L220 335 M212 320 L228 320" stroke="hsl(290, 70%, 50%)" strokeWidth="6" strokeLinecap="round" />
                  <path d="M260 320 L260 335 M252 320 L268 320" stroke="hsl(290, 70%, 50%)" strokeWidth="6" strokeLinecap="round" />
                  {/* Bound neurotransmitters */}
                  <circle cx="140" cy="315" r="4" fill="hsl(280, 80%, 70%)" />
                  <circle cx="220" cy="315" r="4" fill="hsl(280, 80%, 70%)" />
                </g>

              </svg>
              
              {/* Floating description for active region */}
              {activeRegion && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background/95 backdrop-blur shadow-lg border border-border p-3 rounded-xl text-center w-3/4 max-w-[250px] pointer-events-none animate-in fade-in zoom-in-95 duration-200">
                  <p className="font-bold text-violet-700 dark:text-violet-400 text-sm mb-1">{REGIONS[activeRegion as keyof typeof REGIONS].name}</p>
                  <p className="text-xs text-muted-foreground leading-tight">{REGIONS[activeRegion as keyof typeof REGIONS].desc}</p>
                </div>
              )}
            </div>

            <div className="w-full mt-4 flex flex-wrap justify-center gap-2">
              {Object.values(REGIONS).map((region) => (
                <Badge
                  key={region.id}
                  variant="outline"
                  className={`cursor-pointer transition-colors ${activeRegion === region.id ? 'bg-violet-100 border-violet-300 text-violet-800 dark:bg-violet-900/40 dark:border-violet-700 dark:text-violet-300' : 'bg-background hover:bg-muted text-muted-foreground'}`}
                  onMouseEnter={() => handleRegionHover(region.id)}
                  onMouseLeave={handleRegionLeave}
                  onClick={() => handleRegionHover(region.id)}
                >
                  {region.name}
                </Badge>
              ))}
            </div>

          </div>
        </div>

        {/* Content details */}
        <div className="px-4 md:px-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400 mb-1">{topic.category}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-3">{topic.name}</h1>
          <p className="text-muted-foreground leading-relaxed mb-5">{topic.description}</p>

          <div className="flex gap-4 mb-8 text-sm font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-violet-500" />{topic.flashcardCount} flashcards</span>
            <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-violet-500" />{topic.quizCount} questions</span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Study Modes</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
            {studyModes.map(mode => (
              <button
                key={mode.title}
                className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card text-left hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${mode.bg} transition-colors group-hover:scale-105 duration-300`}>
                  <mode.icon className={`w-6 h-6 ${mode.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{mode.title}</p>
                  <p className="text-sm text-muted-foreground">{mode.description}</p>
                </div>
                <ChevronLeft className="w-4 h-4 text-muted-foreground rotate-180 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Beaker className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Retention Plan</h2>
            </div>
            <span className="text-xs text-primary hover:underline cursor-pointer">
              Why this works →
            </span>
          </div>
          
          {/* Simplified Retention Plan */}
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <header className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <CalendarDays className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">Spaced Repetition</h3>
                <p className="text-xs text-muted-foreground">
                  Spacing reviews across days strengthens long-term recall.
                </p>
              </div>
              <span className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-primary text-primary-foreground">
                <Clock className="w-3.5 h-3.5" />
                Ready now
              </span>
            </header>

            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground font-medium">
              <span>0 of 4 intervals complete</span>
              <span>0%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mb-6">
              <div className="bg-primary h-2 rounded-full w-0" />
            </div>

            <ol className="relative grid grid-cols-4 gap-2 mb-6">
              {[1, 3, 7, 14].map((days, idx) => (
                <li key={days} className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold bg-background transition-colors ${idx === 0 ? "border-primary text-primary ring-4 ring-primary/15" : "border-border text-muted-foreground"}`}>
                    {idx + 1}
                  </div>
                  <span className={`text-[11px] font-medium ${idx === 0 ? "text-foreground" : "text-muted-foreground"}`}>
                    Day {days}
                  </span>
                </li>
              ))}
            </ol>

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
      </div>
    </div>
  );
}
