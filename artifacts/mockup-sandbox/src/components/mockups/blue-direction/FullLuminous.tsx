import React from 'react';
import { Play, BookOpen, Brain, Activity, Clock, Zap, Target, ArrowRight, ChevronRight, BarChart3, GraduationCap } from "lucide-react";

export function FullLuminous() {
  return (
    <div className="bg-[#000000] text-[#e5e5e5] min-h-screen font-montserrat selection:bg-[#08a5d1] selection:text-[#000000] overflow-x-hidden flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Outfit:wght@200;300;400;500;600&display=swap');

        .font-outfit {
          font-family: 'Outfit', 'Inter', sans-serif;
        }
        .font-montserrat {
          font-family: 'Montserrat', 'Inter', sans-serif;
        }

        /* Full Luminous Interactive Elements - STRONG AT REST */
        .fl-primary-btn {
          transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
          background: linear-gradient(180deg, #0bd4df 0%, #089ebf 100%);
          color: #000000;
          border: 1px solid #000000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4);
          transform: translateY(0) scale(1);
        }
        .fl-primary-btn:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 0 25px rgba(11, 212, 223, 0.6), 0 0 10px rgba(11, 212, 223, 0.4);
          background: linear-gradient(180deg, #15e5f0 0%, #0ab1d6 100%);
        }
        .fl-primary-btn:active {
          transform: translateY(0) scale(0.98);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 30px rgba(11, 212, 223, 0.8);
        }

        .fl-ghost-btn {
          transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
          background: linear-gradient(180deg, #0e4e71 0%, #052a58 100%);
          border: 1px solid #0b669a;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transform: translateY(0) scale(1);
          color: #0bd4df;
        }
        .fl-ghost-btn:hover {
          transform: translateY(-2px) scale(1.02);
          background: linear-gradient(180deg, #135d85 0%, #083b75 100%);
          border-color: #0bd4df;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.15), inset 0 0 15px rgba(11, 212, 223, 0.2), 0 0 25px rgba(11, 212, 223, 0.4);
          color: #aaedf0;
        }
        .fl-ghost-btn:active {
          transform: translateY(0) scale(0.98);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 0 20px rgba(11, 212, 223, 0.3), 0 0 30px rgba(11, 212, 223, 0.6);
        }

        .fl-nav-link {
          transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
          text-shadow: 0 0 0 rgba(11, 212, 223, 0);
        }
        .fl-nav-link:hover {
          color: #aaedf0;
          text-shadow: 0 0 12px rgba(11, 212, 223, 0.6);
        }

        .fl-card {
          transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
          background: linear-gradient(180deg, #0b3d5e 0%, #031c3c 100%);
          border: 1px solid #0b669a;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08);
          transform: translateY(0) scale(1);
        }
        .fl-card:hover {
          transform: translateY(-2px) scale(1.01);
          border-color: #08a5d1;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 0 30px rgba(11, 212, 223, 0.2);
        }
        .fl-card:active {
          transform: translateY(0) scale(0.995);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 0 40px rgba(11, 212, 223, 0.3);
        }

        .fl-icon-box {
          background: linear-gradient(180deg, #052a58 0%, #000000 100%);
          border: 1px solid #0e4e71;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }
      `}</style>

      {/* 1. TOP NAV */}
      <header className="sticky top-0 z-50 bg-[#000000] border-b border-[#052a58] px-6 py-4 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-[#08a5d1]" />
            <span className="text-[#aaedf0] font-outfit font-medium text-xl tracking-[0.1em]">PSYCHPRO</span>
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
          <button className="fl-ghost-btn px-4 py-2 text-sm font-semibold rounded-md">
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
            <h1 className="text-5xl md:text-7xl font-outfit font-semibold text-[#aaedf0] tracking-tight">
              Learn Smarter.<br />Not Harder.
            </h1>
          </div>
          
          <p className="text-lg md:text-xl text-[#a3a3a3] max-w-2xl leading-relaxed">
            Master psychology with evidence-based study tools. Advanced flashcards, comprehensive courses, and specialized EPPP preparation designed for how the brain actually learns.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
            <button className="fl-primary-btn font-bold text-lg px-8 py-4 rounded-lg flex items-center gap-2">
              Start Learning Smarter <ArrowRight className="w-5 h-5" />
            </button>
            <button className="fl-ghost-btn font-bold text-lg px-8 py-4 rounded-lg flex items-center gap-2">
              Explore the Platform
            </button>
          </div>
        </div>
      </section>

      {/* 3. APP DASHBOARD SAMPLE */}
      <section className="w-full max-w-6xl mx-auto px-6 py-20 border-t border-[#0e4e71]">
        <div className="mb-10">
          <h2 className="text-3xl font-outfit font-semibold text-[#aaedf0] mb-2">Welcome back, Dr. Smith</h2>
          <p className="text-[#a3a3a3]">Here's your progress for today. Keep up the momentum!</p>
        </div>

        {/* Stat Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Tile 1 */}
          <div className="fl-card rounded-xl p-6 flex items-start justify-between cursor-pointer">
            <div>
              <div className="text-[#a3a3a3] text-sm font-medium mb-1">Current Streak</div>
              <div className="text-4xl font-outfit font-semibold text-[#aaedf0]">14 <span className="text-xl text-[#08a5d1] font-normal">days</span></div>
            </div>
            <div className="p-3 fl-icon-box rounded-lg">
              <Zap className="w-6 h-6 text-[#08a5d1]" />
            </div>
          </div>
          
          {/* Tile 2 */}
          <div className="fl-card rounded-xl p-6 flex items-start justify-between cursor-pointer">
            <div>
              <div className="text-[#a3a3a3] text-sm font-medium mb-1">Cards Reviewed</div>
              <div className="text-4xl font-outfit font-semibold text-[#aaedf0]">1,284</div>
            </div>
            <div className="p-3 fl-icon-box rounded-lg">
              <Target className="w-6 h-6 text-[#08a5d1]" />
            </div>
          </div>

          {/* Tile 3 */}
          <div className="fl-card rounded-xl p-6 flex items-start justify-between cursor-pointer">
            <div>
              <div className="text-[#a3a3a3] text-sm font-medium mb-1">Overall Mastery</div>
              <div className="text-4xl font-outfit font-semibold text-[#aaedf0]">76<span className="text-xl text-[#08a5d1] font-normal">%</span></div>
            </div>
            <div className="p-3 fl-icon-box rounded-lg">
              <BarChart3 className="w-6 h-6 text-[#08a5d1]" />
            </div>
          </div>
        </div>

        {/* Course Progress */}
        <h3 className="text-xl font-outfit font-semibold text-[#e5e5e5] mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#08a5d1]" /> Active Courses
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Course 1 */}
          <div className="fl-card rounded-xl p-6 flex flex-col cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-xs font-bold tracking-wider text-[#08a5d1] uppercase mb-2">EPPP Core</div>
                <h4 className="text-xl font-outfit font-semibold text-[#aaedf0]">Clinical Psychology</h4>
                <p className="text-[#a3a3a3] text-sm mt-1">Abnormal psychology & diagnostics</p>
              </div>
              <div className="p-2 fl-icon-box rounded-md">
                <Activity className="w-5 h-5 text-[#08a5d1]" />
              </div>
            </div>
            
            <div className="mt-auto">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#a3a3a3]">Progress</span>
                <span className="text-[#aaedf0] font-medium">68%</span>
              </div>
              <div className="w-full h-2 bg-[#000000] rounded-full overflow-hidden border border-[#052a58] shadow-inner">
                <div className="h-full bg-gradient-to-r from-[#08a5d1] to-[#0bd4df] rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button className="fl-ghost-btn flex items-center gap-2 text-sm font-medium px-4 py-2 rounded">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Course 2 */}
          <div className="fl-card rounded-xl p-6 flex flex-col cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-xs font-bold tracking-wider text-[#08a5d1] uppercase mb-2">Specialty</div>
                <h4 className="text-xl font-outfit font-semibold text-[#aaedf0]">Neuropsychology</h4>
                <p className="text-[#a3a3a3] text-sm mt-1">Brain behavior relationships</p>
              </div>
              <div className="p-2 fl-icon-box rounded-md">
                <GraduationCap className="w-5 h-5 text-[#08a5d1]" />
              </div>
            </div>
            
            <div className="mt-auto">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#a3a3a3]">Progress</span>
                <span className="text-[#aaedf0] font-medium">32%</span>
              </div>
              <div className="w-full h-2 bg-[#000000] rounded-full overflow-hidden border border-[#052a58] shadow-inner">
                <div className="h-full bg-gradient-to-r from-[#08a5d1] to-[#0bd4df] rounded-full" style={{ width: '32%' }}></div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button className="fl-ghost-btn flex items-center gap-2 text-sm font-medium px-4 py-2 rounded">
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
