import React from 'react';
import { Play, BookOpen, Brain, Activity, Clock, Zap, Target, ArrowRight, ChevronRight, BarChart3, GraduationCap } from "lucide-react";

export function FullLuminous() {
  return (
    <div className="bg-[#000000] text-[#e5e5e5] min-h-screen font-sans selection:bg-[#08a5d1] selection:text-[#000000] overflow-x-hidden flex flex-col">
      <style>{`
        /* Full Luminous Interactive Elements */
        .fl-primary-btn {
          transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 0px rgba(11, 212, 223, 0);
          transform: translateY(0) scale(1);
        }
        .fl-primary-btn:hover {
          transform: translateY(-1px) scale(1.02);
          box-shadow: 0 0 20px rgba(11, 212, 223, 0.6), 0 0 10px rgba(11, 212, 223, 0.4);
          background-color: #0bd4df;
        }
        .fl-primary-btn:active {
          transform: translateY(0) scale(0.98);
          box-shadow: 0 0 30px rgba(11, 212, 223, 0.8), 0 0 15px rgba(11, 212, 223, 0.6);
        }

        .fl-ghost-btn {
          transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 0px rgba(11, 212, 223, 0);
          transform: translateY(0) scale(1);
        }
        .fl-ghost-btn:hover {
          transform: translateY(-1px) scale(1.02);
          box-shadow: inset 0 0 15px rgba(11, 212, 223, 0.2), 0 0 20px rgba(11, 212, 223, 0.4);
          background-color: rgba(11, 212, 223, 0.1);
          border-color: #0bd4df;
          color: #aaedf0;
        }
        .fl-ghost-btn:active {
          transform: translateY(0) scale(0.98);
          box-shadow: inset 0 0 20px rgba(11, 212, 223, 0.3), 0 0 30px rgba(11, 212, 223, 0.6);
        }

        .fl-nav-link {
          transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
          text-shadow: 0 0 0 rgba(11, 212, 223, 0);
        }
        .fl-nav-link:hover {
          color: #aaedf0;
          text-shadow: 0 0 10px rgba(11, 212, 223, 0.5);
        }

        .fl-card {
          transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 0px rgba(11, 212, 223, 0);
          transform: translateY(0) scale(1);
        }
        .fl-card:hover {
          transform: translateY(-1px) scale(1.01);
          box-shadow: 0 0 25px rgba(11, 212, 223, 0.15);
          border-color: #08a5d1;
        }
        .fl-card:active {
          transform: translateY(0) scale(0.995);
          box-shadow: 0 0 30px rgba(11, 212, 223, 0.25);
        }
      `}</style>

      {/* 1. TOP NAV */}
      <header className="sticky top-0 z-50 bg-[#000000] border-b border-[#052a58] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-[#08a5d1]" />
            <span className="text-[#aaedf0] font-bold text-xl tracking-tight">PSYCHPRO</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="fl-nav-link text-sm font-medium text-[#a3a3a3]">Flashcards</a>
            <a href="#" className="fl-nav-link text-sm font-medium text-[#a3a3a3]">Courses</a>
            <a href="#" className="fl-nav-link text-sm font-medium text-[#a3a3a3]">EPPP Prep</a>
            <a href="#" className="fl-nav-link text-sm font-medium text-[#a3a3a3]">Pricing</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="fl-nav-link text-sm font-medium text-[#e5e5e5]">Sign In</a>
          <button className="fl-ghost-btn px-4 py-2 text-sm font-semibold border border-[#0b669a] rounded-md text-[#08a5d1] bg-[#052a58]">
            Get Started
          </button>
        </div>
      </header>

      {/* 2. LANDING HERO */}
      <section className="relative w-full max-w-5xl mx-auto px-6 pt-12 pb-24 flex flex-col items-center text-center">
        {/* Brain Image - strictly natural aspect, centered, ~500px */}
        <div className="w-full max-w-[520px] mb-8">
          <img 
            src="/__mockup/images/blue-brain-hero.jpg" 
            alt="Glowing blue brain" 
            className="w-full h-auto object-contain block"
          />
        </div>

        <div className="space-y-6 max-w-3xl flex flex-col items-center">
          <div className="space-y-2">
            <div className="text-[#08a5d1] text-sm font-bold tracking-[0.2em] uppercase">learn. expand. connect.</div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-[#aaedf0] tracking-tight">
              Learn Smarter.<br />Not Harder.
            </h1>
          </div>
          
          <p className="text-lg md:text-xl text-[#a3a3a3] max-w-2xl leading-relaxed">
            Master psychology with evidence-based study tools. Advanced flashcards, comprehensive courses, and specialized EPPP preparation designed for how the brain actually learns.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
            <button className="fl-primary-btn bg-[#08a5d1] text-[#000000] font-bold text-lg px-8 py-4 rounded-lg flex items-center gap-2">
              Start Learning Smarter <ArrowRight className="w-5 h-5" />
            </button>
            <button className="fl-ghost-btn bg-[#052a58] border-2 border-[#0b669a] text-[#0bd4df] font-bold text-lg px-8 py-4 rounded-lg flex items-center gap-2">
              Explore the Platform
            </button>
          </div>
        </div>
      </section>

      {/* 3. APP DASHBOARD SAMPLE */}
      <section className="w-full max-w-6xl mx-auto px-6 py-20 border-t border-[#0e4e71]">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-[#aaedf0] mb-2">Welcome back, Dr. Smith</h2>
          <p className="text-[#a3a3a3]">Here's your progress for today. Keep up the momentum!</p>
        </div>

        {/* Stat Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Tile 1 */}
          <div className="fl-card bg-gradient-to-br from-[#052a58] to-[#0e4e71] border border-[#0b669a] rounded-xl p-6 flex items-start justify-between cursor-pointer">
            <div>
              <div className="text-[#a3a3a3] text-sm font-medium mb-1">Current Streak</div>
              <div className="text-4xl font-bold text-[#aaedf0]">14 <span className="text-xl text-[#08a5d1] font-normal">days</span></div>
            </div>
            <div className="p-3 bg-[#000000] rounded-lg border border-[#052a58]">
              <Zap className="w-6 h-6 text-[#08a5d1]" />
            </div>
          </div>
          
          {/* Tile 2 */}
          <div className="fl-card bg-gradient-to-br from-[#052a58] to-[#0e4e71] border border-[#0b669a] rounded-xl p-6 flex items-start justify-between cursor-pointer">
            <div>
              <div className="text-[#a3a3a3] text-sm font-medium mb-1">Cards Reviewed</div>
              <div className="text-4xl font-bold text-[#aaedf0]">1,284</div>
            </div>
            <div className="p-3 bg-[#000000] rounded-lg border border-[#052a58]">
              <Target className="w-6 h-6 text-[#08a5d1]" />
            </div>
          </div>

          {/* Tile 3 */}
          <div className="fl-card bg-gradient-to-br from-[#052a58] to-[#0e4e71] border border-[#0b669a] rounded-xl p-6 flex items-start justify-between cursor-pointer">
            <div>
              <div className="text-[#a3a3a3] text-sm font-medium mb-1">Overall Mastery</div>
              <div className="text-4xl font-bold text-[#aaedf0]">76<span className="text-xl text-[#08a5d1] font-normal">%</span></div>
            </div>
            <div className="p-3 bg-[#000000] rounded-lg border border-[#052a58]">
              <BarChart3 className="w-6 h-6 text-[#08a5d1]" />
            </div>
          </div>
        </div>

        {/* Course Progress */}
        <h3 className="text-xl font-bold text-[#e5e5e5] mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#08a5d1]" /> Active Courses
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course 1 */}
          <div className="fl-card bg-[#052a58] border border-[#0b669a] rounded-xl p-6 flex flex-col cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-xs font-bold tracking-wider text-[#08a5d1] uppercase mb-2">EPPP Core</div>
                <h4 className="text-xl font-bold text-[#aaedf0]">Clinical Psychology</h4>
                <p className="text-[#a3a3a3] text-sm mt-1">Abnormal psychology & diagnostics</p>
              </div>
              <div className="p-2 bg-[#000000] rounded-md border border-[#0e4e71]">
                <Activity className="w-5 h-5 text-[#08a5d1]" />
              </div>
            </div>
            
            <div className="mt-auto">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#a3a3a3]">Progress</span>
                <span className="text-[#aaedf0] font-medium">68%</span>
              </div>
              <div className="w-full h-2 bg-[#000000] rounded-full overflow-hidden border border-[#052a58]">
                <div className="h-full bg-[#08a5d1] rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button className="fl-ghost-btn flex items-center gap-2 text-sm font-medium text-[#0bd4df] border border-[#0b669a] px-4 py-2 rounded bg-[#000000]">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Course 2 */}
          <div className="fl-card bg-[#052a58] border border-[#0b669a] rounded-xl p-6 flex flex-col cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-xs font-bold tracking-wider text-[#08a5d1] uppercase mb-2">Specialty</div>
                <h4 className="text-xl font-bold text-[#aaedf0]">Neuropsychology</h4>
                <p className="text-[#a3a3a3] text-sm mt-1">Brain behavior relationships</p>
              </div>
              <div className="p-2 bg-[#000000] rounded-md border border-[#0e4e71]">
                <GraduationCap className="w-5 h-5 text-[#08a5d1]" />
              </div>
            </div>
            
            <div className="mt-auto">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#a3a3a3]">Progress</span>
                <span className="text-[#aaedf0] font-medium">32%</span>
              </div>
              <div className="w-full h-2 bg-[#000000] rounded-full overflow-hidden border border-[#052a58]">
                <div className="h-full bg-[#08a5d1] rounded-full" style={{ width: '32%' }}></div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button className="fl-ghost-btn flex items-center gap-2 text-sm font-medium text-[#0bd4df] border border-[#0b669a] px-4 py-2 rounded bg-[#000000]">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}

export default FullLuminous;
