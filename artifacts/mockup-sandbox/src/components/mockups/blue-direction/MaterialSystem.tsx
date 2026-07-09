import React from 'react';
import { BookOpen, Brain, Activity, Clock, CheckCircle2, AlertCircle, XCircle, Lock, ChevronRight } from 'lucide-react';

export function MaterialSystem() {
  return (
    <div className="bg-[#000000] text-[#e5e5e5] min-h-screen p-8 overflow-y-auto selection:bg-[#08a5d1] selection:text-[#000000] font-montserrat">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');

        .font-outfit {
          font-family: 'Outfit', sans-serif;
        }
        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }

        /* 1. OPAQUE: Structural Panels */
        /* Solid deep navy-tinted fill, hairline lit top bevel edge, soft black drop shadow. No glow. */
        .sys-opaque {
          background: linear-gradient(180deg, #071c33 0%, #04101f 100%);
          border: 1px solid #052a58;
          border-top-color: #0e4e71;
          box-shadow: inset 0 1px 0 rgba(14, 78, 113, 0.4), 0 16px 40px rgba(0, 0, 0, 0.8);
        }

        /* 2. GLASS: Content Tiles */
        /* Tinted translucent fill (rgba), NO backdrop-filter, brighter bevel, slightly saturated tint */
        .sys-glass {
          background: linear-gradient(180deg, rgba(11, 102, 154, 0.15) 0%, rgba(5, 42, 88, 0.25) 100%);
          border: 1px solid rgba(11, 102, 154, 0.3);
          border-top-color: rgba(13, 88, 162, 0.6);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 8px 24px rgba(0, 0, 0, 0.6);
          transition: transform 150ms ease-out, box-shadow 150ms ease-out;
        }
        .sys-glass:hover {
          transform: translateY(-2px);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 12px 32px rgba(0, 0, 0, 0.8), 0 0 24px rgba(8, 165, 209, 0.25);
          border-top-color: #08a5d1;
        }

        /* 3. GLOSS: Actions (Buttons) */
        /* Rich saturated cyan fill with glossy top highlight. Pressable at rest. Glows on hover. */
        .sys-gloss-btn {
          background: linear-gradient(180deg, #0bd4df 0%, #08a5d1 100%);
          color: #000000;
          border: 1px solid #0b669a;
          border-top-color: #aaedf0;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5), inset 0 -1px 0 rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.6);
          text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
          transition: transform 150ms ease-out, box-shadow 150ms ease-out, border-color 150ms ease-out;
        }
        .sys-gloss-btn:hover {
          transform: translateY(-2px);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6), inset 0 -1px 0 rgba(0, 0, 0, 0.1), 0 8px 20px rgba(0, 0, 0, 0.8), 0 0 20px rgba(11, 212, 223, 0.5);
          border-top-color: #ffffff;
        }
        .sys-gloss-btn:active {
          transform: translateY(1px);
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.5), 0 0 12px rgba(11, 212, 223, 0.3);
          background: linear-gradient(180deg, #08a5d1 0%, #0b669a 100%);
        }

        /* Secondary Button (Glass with gloss edge) */
        .sys-btn-secondary {
          background: linear-gradient(180deg, rgba(11, 102, 154, 0.2) 0%, rgba(5, 42, 88, 0.4) 100%);
          color: #aaedf0;
          border: 1px solid #052a58;
          border-top-color: #08a5d1;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 12px rgba(0, 0, 0, 0.5);
          transition: transform 150ms ease-out, box-shadow 150ms ease-out;
        }
        .sys-btn-secondary:hover {
          transform: translateY(-2px);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 8px 20px rgba(0, 0, 0, 0.7), 0 0 16px rgba(8, 165, 209, 0.3);
          border-top-color: #0bd4df;
          color: #ffffff;
        }
        .sys-btn-secondary:active {
          transform: translateY(1px);
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        /* Ghost Button (Outline only) */
        .sys-btn-ghost {
          background: transparent;
          color: #a3a3a3;
          border: 1px solid rgba(163, 163, 163, 0.2);
          transition: all 150ms ease-out;
        }
        .sys-btn-ghost:hover {
          border-color: #08a5d1;
          color: #aaedf0;
          box-shadow: inset 0 0 12px rgba(8, 165, 209, 0.1), 0 0 16px rgba(8, 165, 209, 0.2);
          transform: translateY(-1px);
        }

        /* Disabled Button */
        .sys-btn-disabled {
          background: rgba(163, 163, 163, 0.05);
          color: rgba(163, 163, 163, 0.4);
          border: 1px solid rgba(163, 163, 163, 0.1);
          cursor: not-allowed;
        }

        /* Semantic Glass Variants */
        .sys-glass-success {
          background: linear-gradient(180deg, rgba(34, 197, 94, 0.1) 0%, rgba(20, 83, 45, 0.2) 100%);
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-top-color: rgba(34, 197, 94, 0.5);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 8px 24px rgba(0, 0, 0, 0.6);
        }
        .sys-glass-error {
          background: linear-gradient(180deg, rgba(239, 68, 68, 0.1) 0%, rgba(127, 29, 29, 0.2) 100%);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-top-color: rgba(239, 68, 68, 0.5);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 8px 24px rgba(0, 0, 0, 0.6);
        }
        .sys-glass-warning {
          background: linear-gradient(180deg, rgba(245, 158, 11, 0.1) 0%, rgba(120, 53, 15, 0.2) 100%);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-top-color: rgba(245, 158, 11, 0.5);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 8px 24px rgba(0, 0, 0, 0.6);
        }

        /* Progress Bar */
        .sys-progress-track {
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(5, 42, 88, 0.3) 100%);
          border: 1px solid #052a58;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
        }
        .sys-progress-fill {
          background: linear-gradient(90deg, #08a5d1 0%, #0bd4df 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.4), 0 0 12px rgba(11, 212, 223, 0.4);
        }

        /* Tab Bar */
        .sys-tab-bar {
          background: rgba(4, 16, 31, 0.8);
          border: 1px solid #052a58;
        }
        .sys-tab {
          color: #a3a3a3;
          transition: all 150ms ease;
        }
        .sys-tab:hover {
          color: #aaedf0;
        }
        .sys-tab[data-state="active"] {
          background: rgba(11, 102, 154, 0.2);
          color: #ffffff;
          border-radius: 4px;
          box-shadow: 0 0 12px rgba(8, 165, 209, 0.2);
          border-bottom: 2px solid #0bd4df;
        }
      `}</style>

      <div className="max-w-[1200px] mx-auto pb-24">
        
        <header className="mb-12 border-b border-[#052a58] pb-6">
          <h1 className="font-outfit text-3xl font-light tracking-wide text-[#aaedf0] mb-2 uppercase">
            PsychPro <span className="font-bold">Material System</span>
          </h1>
          <p className="text-[#a3a3a3] font-montserrat">
            Canonical 3-tier material spec. Pure #000 floor. No backdrop-filter. No resting glow.
          </p>
        </header>

        {/* 1. OPAQUE PANEL (Contains Glass) */}
        <div className="relative mb-12">
          <div className="absolute -top-3 left-4 bg-[#000] px-2 text-[#a3a3a3] text-xs font-bold tracking-widest uppercase z-10">
            Opaque — Structural Panel
          </div>
          
          <section className="sys-opaque rounded-xl p-8 relative">
            
            <div className="flex items-center justify-between mb-8 border-b border-[#052a58] pb-4">
              <div>
                <h2 className="font-outfit text-2xl font-semibold text-[#aaedf0] tracking-tight">Neuroanatomy & Physiology</h2>
                <p className="text-[#a3a3a3] text-sm mt-1">Core foundational module</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[#e5e5e5] font-semibold font-outfit text-xl">82%</div>
                  <div className="text-[#a3a3a3] text-xs">Mastery</div>
                </div>
              </div>
            </div>

            {/* 2. GLASS TILES (Inside Opaque) */}
            <div className="relative">
              <div className="absolute -top-6 left-0 text-[#a3a3a3] text-xs font-bold tracking-widest uppercase">
                Glass — Content Tiles
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                
                {/* Tile 1 */}
                <div className="sys-glass rounded-lg p-6 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 rounded-md bg-[#052a58]/50 border border-[#0b669a]/50">
                      <Brain className="w-5 h-5 text-[#08a5d1]" />
                    </div>
                    <span className="sys-glass px-2 py-1 rounded text-xs font-semibold text-[#aaedf0] border-none shadow-none">
                      Module 1
                    </span>
                  </div>
                  <h3 className="font-outfit text-lg font-medium text-[#e5e5e5] mb-2">The Central Nervous System</h3>
                  <p className="text-[#a3a3a3] text-sm leading-relaxed mb-6 flex-grow">
                    Detailed mapping of cerebral structures, pathways, and functional localized zones.
                  </p>
                  
                  {/* Gloss Action */}
                  <div className="relative mt-auto">
                    <div className="absolute -top-8 -left-2 text-[#a3a3a3] text-[10px] font-bold tracking-widest uppercase opacity-70">
                      Gloss — Action
                    </div>
                    <button className="sys-gloss-btn w-full py-2.5 rounded-md text-sm font-semibold flex items-center justify-center gap-2">
                      Resume Study <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Tile 2 */}
                <div className="sys-glass rounded-lg p-6 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 rounded-md bg-[#052a58]/50 border border-[#0b669a]/50">
                      <Activity className="w-5 h-5 text-[#08a5d1]" />
                    </div>
                    <span className="sys-glass px-2 py-1 rounded text-xs font-semibold text-[#aaedf0] border-none shadow-none">
                      Module 2
                    </span>
                  </div>
                  <h3 className="font-outfit text-lg font-medium text-[#e5e5e5] mb-2">Neurotransmitters</h3>
                  <p className="text-[#a3a3a3] text-sm leading-relaxed mb-6 flex-grow">
                    Synaptic transmission, receptor binding, and the mechanisms of action for major neurochemicals.
                  </p>
                  <button className="sys-btn-secondary w-full py-2.5 rounded-md text-sm font-semibold flex items-center justify-center gap-2 mt-auto">
                    Review Flashcards
                  </button>
                </div>

                {/* Tile 3 */}
                <div className="sys-glass rounded-lg p-6 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 rounded-md bg-[#052a58]/50 border border-[#0b669a]/50">
                      <BookOpen className="w-5 h-5 text-[#08a5d1]" />
                    </div>
                    <span className="sys-glass px-2 py-1 rounded text-xs font-semibold text-[#a3a3a3] border-none shadow-none opacity-50">
                      Locked
                    </span>
                  </div>
                  <h3 className="font-outfit text-lg font-medium text-[#e5e5e5] mb-2">Psychopharmacology</h3>
                  <p className="text-[#a3a3a3] text-sm leading-relaxed mb-6 flex-grow">
                    Clinical applications, pharmacokinetics, and adverse effects of psychiatric medications.
                  </p>
                  <button className="sys-btn-disabled w-full py-2.5 rounded-md text-sm font-semibold flex items-center justify-center gap-2 mt-auto">
                    <Lock className="w-4 h-4" /> Locked
                  </button>
                </div>

              </div>
            </div>

            {/* Embedded Components Section */}
            <div className="mt-12 pt-8 border-t border-[#052a58]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                
                {/* Left Col: Buttons & Tabs */}
                <div className="space-y-8">
                  
                  {/* Button Family */}
                  <div>
                    <h4 className="text-[#a3a3a3] text-xs font-bold tracking-widest uppercase mb-4">Button Family</h4>
                    <div className="flex flex-wrap gap-4">
                      <button className="sys-gloss-btn px-6 py-2.5 rounded-md text-sm font-semibold">Primary Gloss</button>
                      <button className="sys-btn-secondary px-6 py-2.5 rounded-md text-sm font-semibold">Secondary Glass</button>
                      <button className="sys-btn-ghost px-6 py-2.5 rounded-md text-sm font-semibold">Ghost Outline</button>
                    </div>
                  </div>

                  {/* Tab Bar */}
                  <div>
                    <h4 className="text-[#a3a3a3] text-xs font-bold tracking-widest uppercase mb-4">Tab Bar & Chips</h4>
                    <div className="sys-tab-bar rounded-md p-1 inline-flex mb-4">
                      <button className="sys-tab px-4 py-1.5 text-sm font-medium" data-state="active">Study Mode</button>
                      <button className="sys-tab px-4 py-1.5 text-sm font-medium">Exam Mode</button>
                      <button className="sys-tab px-4 py-1.5 text-sm font-medium">Analytics</button>
                    </div>
                    <div className="flex gap-2">
                      <span className="sys-glass px-3 py-1 rounded-full text-xs font-medium text-[#aaedf0]">Spaced Repetition</span>
                      <span className="sys-glass px-3 py-1 rounded-full text-xs font-medium text-[#e5e5e5]">Active Recall</span>
                    </div>
                  </div>

                </div>

                {/* Right Col: Progress & Semantics */}
                <div className="space-y-8">
                  
                  {/* Progress Bar */}
                  <div>
                    <h4 className="text-[#a3a3a3] text-xs font-bold tracking-widest uppercase mb-4">Progress Track</h4>
                    <div className="sys-progress-track w-full h-3 rounded-full overflow-hidden">
                      <div className="sys-progress-fill h-full rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-[#a3a3a3] mt-2">
                      <span>Course Completion</span>
                      <span className="text-[#aaedf0] font-semibold">65%</span>
                    </div>
                  </div>

                  {/* Semantic Swatches */}
                  <div>
                    <h4 className="text-[#a3a3a3] text-xs font-bold tracking-widest uppercase mb-4">Semantic Glass Swatches</h4>
                    <div className="flex flex-col gap-3">
                      
                      <div className="sys-glass-success rounded-md p-3 flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        <span className="text-sm text-green-100 font-medium">Correct answer selected</span>
                      </div>
                      
                      <div className="sys-glass-error rounded-md p-3 flex items-center gap-3">
                        <XCircle className="w-5 h-5 text-red-400" />
                        <span className="text-sm text-red-100 font-medium">Incorrect. Review rationales below.</span>
                      </div>
                      
                      <div className="sys-glass-warning rounded-md p-3 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-400" />
                        <span className="text-sm text-amber-100 font-medium">Your subscription expires in 3 days.</span>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            </div>

          </section>
        </div>

      </div>
    </div>
  );
}

export default MaterialSystem;
