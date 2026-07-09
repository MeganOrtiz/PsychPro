import React from 'react';
import { Play, TrendingUp, BookOpen, BrainCircuit, Search, ChevronRight, Activity, Layers, Target } from 'lucide-react';

export function TintedSurfaces() {
  return (
    <div className="tinted-theme min-h-screen w-full overflow-y-auto">
      <style>{`
        .tinted-theme {
          --bg: #000000;
          --surface: #04101f;
          --surface-border: #0b669a;
          --text-body: #e5e5e5;
          --text-muted: #a3a3a3;
          --cyan: #08a5d1;
          --cyan-light: #0bd4df;
          --icy: #aaedf0;
          --navy-deep: #052a58;
          
          background-color: var(--bg);
          color: var(--text-body);
          font-family: system-ui, -apple-system, sans-serif;
        }
        
        .tinted-card {
          background-color: var(--surface);
          border: 1px solid var(--surface-border);
        }
        
        .tinted-interactive {
          transition: transform 150ms ease-out, box-shadow 150ms ease-out, border-color 150ms ease-out;
        }
        
        .tinted-interactive:hover {
          transform: translateY(-1px) scale(1.01);
          box-shadow: 0 0 16px 0 rgba(8, 165, 209, 0.4);
          border-color: var(--cyan-light);
        }
        
        .tinted-interactive:active {
          transform: translateY(1px) scale(0.99);
          box-shadow: 0 0 6px 0 rgba(8, 165, 209, 0.6);
        }

        .btn-primary {
          background-color: var(--cyan);
          color: #000;
          border: 1px solid var(--cyan-light);
          font-weight: 600;
        }
        
        .btn-secondary {
          background-color: transparent;
          color: var(--icy);
          border: 1px solid var(--surface-border);
        }
        
        .nav-link {
          color: var(--text-body);
          transition: color 150ms ease-out;
        }
        .nav-link:hover {
          color: var(--icy);
        }
      `}</style>

      {/* Top Nav */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-[#0b669a]/30">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-[#08a5d1]" />
          <span className="font-bold tracking-widest text-[#aaedf0] text-sm">PSYCHPRO</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#" className="nav-link">Flashcards</a>
          <a href="#" className="nav-link">Courses</a>
          <a href="#" className="nav-link">EPPP Prep</a>
          <a href="#" className="nav-link">Pricing</a>
        </div>
        <div>
          <button className="tinted-interactive btn-secondary px-5 py-2 text-sm rounded-md font-medium">
            Sign In
          </button>
        </div>
      </nav>

      {/* Landing Hero */}
      <section className="flex flex-col items-center justify-center pt-16 pb-24 px-4 text-center">
        <div className="mb-8 w-full max-w-[520px] aspect-square flex items-center justify-center relative">
          <img 
            src="/__mockup/images/blue-brain-hero.jpg" 
            alt="Glowing blue brain" 
            className="w-full h-auto object-contain pointer-events-none"
          />
        </div>
        
        <span className="text-[#08a5d1] tracking-[0.3em] font-bold text-xs mb-4 uppercase">
          learn. expand. connect.
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold text-[#aaedf0] mb-6 tracking-tight">
          Learn Smarter. <br/>Not Harder.
        </h1>
        <p className="max-w-2xl text-[#a3a3a3] text-lg md:text-xl mb-10 leading-relaxed">
          Master psychological concepts with evidence-based study tools. 
          Spaced repetition, targeted practice exams, and comprehensive clinical courses designed for your brain.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button className="tinted-interactive btn-primary px-8 py-4 rounded-md text-base flex items-center gap-2">
            Start Learning Smarter
            <ChevronRight className="w-4 h-4" />
          </button>
          <button className="tinted-interactive btn-secondary px-8 py-4 rounded-md text-base">
            Explore the Platform
          </button>
        </div>
      </section>

      {/* App Dashboard Sample */}
      <section className="px-8 py-16 max-w-6xl mx-auto border-t border-[#0b669a]/30">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-[#aaedf0] mb-2">Welcome back, Dr. Sarah</h2>
          <p className="text-[#a3a3a3]">Your mastery is improving. Keep up the momentum.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="tinted-card tinted-interactive rounded-xl p-6 flex flex-col cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#052a58] rounded-md">
                <Activity className="w-5 h-5 text-[#08a5d1]" />
              </div>
              <span className="text-[#a3a3a3] font-medium text-sm">Current Streak</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-[#e5e5e5]">14</span>
              <span className="text-[#a3a3a3] mb-1">days</span>
            </div>
          </div>

          <div className="tinted-card tinted-interactive rounded-xl p-6 flex flex-col cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#052a58] rounded-md">
                <Layers className="w-5 h-5 text-[#08a5d1]" />
              </div>
              <span className="text-[#a3a3a3] font-medium text-sm">Cards Reviewed</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-[#e5e5e5]">1,248</span>
              <span className="text-[#a3a3a3] mb-1">total</span>
            </div>
          </div>

          <div className="tinted-card tinted-interactive rounded-xl p-6 flex flex-col cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#052a58] rounded-md">
                <Target className="w-5 h-5 text-[#08a5d1]" />
              </div>
              <span className="text-[#a3a3a3] font-medium text-sm">Overall Mastery</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-[#e5e5e5]">68</span>
              <span className="text-[#a3a3a3] mb-1">%</span>
            </div>
          </div>
        </div>

        {/* Courses Row */}
        <h3 className="text-xl font-semibold text-[#e5e5e5] mb-6">Continue Learning</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
          <div className="tinted-card tinted-interactive rounded-xl p-6 cursor-pointer flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-bold text-[#08a5d1] tracking-wider uppercase mb-1 block">Foundations</span>
                <h4 className="text-lg font-bold text-[#aaedf0]">Abnormal Psychology</h4>
              </div>
              <div className="w-10 h-10 rounded-full border border-[#0b669a] flex items-center justify-center text-[#08a5d1]">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-auto">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#a3a3a3]">Progress</span>
                <span className="text-[#e5e5e5] font-medium">45%</span>
              </div>
              <div className="h-2 w-full bg-[#000000] rounded-full overflow-hidden border border-[#0b669a]/50">
                <div className="h-full bg-[#08a5d1]" style={{ width: '45%' }}></div>
              </div>
            </div>
            <button className="mt-6 tinted-interactive btn-secondary w-full py-3 rounded-md text-sm font-medium">
              Resume Course
            </button>
          </div>

          <div className="tinted-card tinted-interactive rounded-xl p-6 cursor-pointer flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-bold text-[#08a5d1] tracking-wider uppercase mb-1 block">Clinical prep</span>
                <h4 className="text-lg font-bold text-[#aaedf0]">Cognitive Behavioral Therapy</h4>
              </div>
              <div className="w-10 h-10 rounded-full border border-[#0b669a] flex items-center justify-center text-[#08a5d1]">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-auto">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#a3a3a3]">Progress</span>
                <span className="text-[#e5e5e5] font-medium">12%</span>
              </div>
              <div className="h-2 w-full bg-[#000000] rounded-full overflow-hidden border border-[#0b669a]/50">
                <div className="h-full bg-[#08a5d1]" style={{ width: '12%' }}></div>
              </div>
            </div>
            <button className="mt-6 tinted-interactive btn-primary w-full py-3 rounded-md text-sm font-medium">
              Start Next Module
            </button>
          </div>

        </div>

      </section>
    </div>
  );
}
