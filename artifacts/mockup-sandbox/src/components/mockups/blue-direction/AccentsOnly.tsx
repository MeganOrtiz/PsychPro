import React from "react";
import { 
  BarChart3, 
  BrainCircuit, 
  ChevronRight, 
  Layers, 
  PlayCircle, 
  Zap,
  TrendingUp,
  Target
} from "lucide-react";

export function AccentsOnly() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] font-sans selection:bg-[#08a5d1] selection:text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Outfit:wght@200;300;400;500;600&display=swap');
        
        :root {
          --color-black: #050505;
          --color-panel-dark: #0a0a0a;
          --color-panel-light: #1a1a1a;
          --color-border: #262626;
          
          --color-blue-navy-1: #052a58;
          --color-blue-navy-2: #0e4e71;
          --color-blue-ocean-1: #0b669a;
          --color-blue-ocean-2: #0d58a2;
          --color-blue-cyan-1: #08a5d1;
          --color-blue-cyan-2: #0bd4df;
          --color-blue-icy: #aaedf0;
          
          --color-text-body: #e5e5e5;
          --color-text-muted: #a3a3a3;
        }

        .font-heading {
          font-family: 'Outfit', sans-serif;
        }

        .interactive-flat {
          transition: transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease, background 150ms ease;
        }

        .btn-primary {
          background: linear-gradient(180deg, var(--color-blue-cyan-2) 0%, var(--color-blue-cyan-1) 100%);
          color: #000;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.4);
          border: 1px solid rgba(0,0,0,0.2);
          text-shadow: 0 1px 0 rgba(255,255,255,0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 8px 24px rgba(0,0,0,0.6), 0 0 20px 0 var(--color-blue-cyan-1), inset 0 1px 0 rgba(255,255,255,0.5);
          background: linear-gradient(180deg, #2ae0ea 0%, var(--color-blue-cyan-2) 100%);
        }
        
        .btn-primary:active {
          transform: translateY(0) scale(0.98);
          box-shadow: 0 2px 8px rgba(0,0,0,0.6), 0 0 8px 0 var(--color-blue-cyan-1), inset 0 1px 0 rgba(255,255,255,0.2);
        }

        .btn-ghost {
          background: linear-gradient(180deg, var(--color-panel-light) 0%, var(--color-panel-dark) 100%);
          border: 1px solid var(--color-border);
          color: var(--color-text-body);
          box-shadow: 0 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05);
        }

        .btn-ghost:hover {
          transform: translateY(-2px) scale(1.01);
          border-color: var(--color-blue-cyan-1);
          color: white;
          box-shadow: 0 8px 24px rgba(0,0,0,0.6), inset 0 0 15px 0 rgba(8, 165, 209, 0.2), 0 0 15px 0 rgba(8, 165, 209, 0.3), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        
        .btn-ghost:active {
          transform: translateY(0) scale(0.98);
          box-shadow: 0 2px 8px rgba(0,0,0,0.6), inset 0 0 8px 0 rgba(8, 165, 209, 0.3), 0 0 8px 0 rgba(8, 165, 209, 0.3);
        }

        .interactive-card {
          background: linear-gradient(180deg, #141414 0%, var(--color-panel-dark) 100%);
          border: 1px solid var(--color-border);
          box-shadow: 0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04);
        }

        .interactive-card:hover {
          transform: translateY(-2px);
          border-color: rgba(8, 165, 209, 0.5);
          box-shadow: 0 12px 40px rgba(0,0,0,0.7), 0 0 20px 0 rgba(8, 165, 209, 0.15), inset 0 1px 0 rgba(255,255,255,0.06);
        }

        .interactive-card:active {
          transform: translateY(0);
        }
        
        .progress-fill {
          background: linear-gradient(90deg, var(--color-blue-ocean-1), var(--color-blue-cyan-1));
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.3);
        }
        
        .progress-track {
          background: linear-gradient(180deg, #050505 0%, #111 100%);
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.8);
        }
        
        .accent-text {
          color: var(--color-blue-cyan-1);
        }
      `}</style>

      {/* Top Nav */}
      <nav className="border-b border-[#262626] bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-50 shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 accent-text drop-shadow-[0_0_8px_rgba(8,165,209,0.3)]" />
            <span className="font-heading font-medium tracking-[0.2em] text-lg text-white">PSYCHPRO</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#a3a3a3]">
            <a href="#" className="hover:text-white transition-colors duration-150">Features</a>
            <a href="#" className="hover:text-white transition-colors duration-150">Content</a>
            <a href="#" className="hover:text-white transition-colors duration-150">Pricing</a>
            <button className="interactive-flat btn-primary px-5 py-2 rounded text-sm">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Landing Hero */}
      <section className="pt-12 pb-24 px-6 relative overflow-hidden flex flex-col items-center text-center border-b border-[#262626] bg-black">
        {/* Brain Image - The only glowing thing at rest */}
        <div className="mb-12 w-full max-w-[520px]">
          <img 
            src="/__mockup/images/blue-brain-hero.jpg" 
            alt="Glowing blue brain" 
            className="w-full h-auto object-contain block mix-blend-screen"
          />
        </div>

        <div className="relative z-20 max-w-3xl mx-auto flex flex-col items-center">
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-[#a3a3a3] mb-4">
            learn. expand. connect.
          </p>
          
          <h1 className="font-heading text-5xl md:text-7xl font-semibold tracking-tight mb-6 text-white drop-shadow-xl">
            Learn Smarter. <br className="hidden md:block" />
            <span className="text-[#888]">Not Harder.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#a3a3a3] mb-10 max-w-2xl leading-relaxed font-medium">
            Master psychology concepts and conquer the EPPP with evidence-based study tools. 
            Spaced repetition, targeted mastery, and clinical scenarios designed for your brain.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button className="interactive-flat btn-primary w-full sm:w-auto px-8 py-4 rounded-md text-base flex items-center justify-center gap-2">
              Start Learning Smarter
              <Zap className="w-4 h-4" />
            </button>
            <button className="interactive-flat btn-ghost w-full sm:w-auto px-8 py-4 rounded-md text-base flex items-center justify-center gap-2">
              Explore the Platform
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* App Dashboard Sample */}
      <section className="py-20 px-6 bg-[#050505]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-heading text-3xl font-medium text-white mb-2">Welcome back, Dr. Sarah</h2>
              <p className="text-[#a3a3a3] font-medium">Let's continue your cognitive behavioral therapy review.</p>
            </div>
            <button className="interactive-flat btn-primary px-4 py-2 rounded text-sm flex items-center gap-2">
              <PlayCircle className="w-4 h-4" />
              Resume Study
            </button>
          </div>

          {/* Stat Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: "Current Streak", value: "14 Days", icon: Zap, trend: "+2 this week" },
              { label: "Cards Reviewed", value: "1,248", icon: Layers, trend: "Top 10% of users" },
              { label: "Overall Mastery", value: "76%", icon: Target, trend: "+4% from last exam" },
            ].map((stat, i) => (
              <div key={i} className="interactive-card interactive-flat p-6 rounded-lg flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-[#a3a3a3] text-sm font-semibold">{stat.label}</div>
                  <stat.icon className="w-5 h-5 text-[#444]" />
                </div>
                <div>
                  <div className="font-heading text-4xl font-medium text-white mb-1">{stat.value}</div>
                  <div className="text-xs accent-text font-semibold">{stat.trend}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Course Progress */}
          <h3 className="font-heading text-xl font-medium text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#a3a3a3]" />
            Active Courses
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="interactive-card interactive-flat p-6 rounded-lg">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-heading text-xl font-medium text-white mb-1">Cognitive Psychology</h4>
                  <p className="text-sm text-[#a3a3a3] font-medium">Module 4: Memory & Attention</p>
                </div>
                <div className="bg-[#111] px-3 py-1 rounded text-sm font-semibold border border-[#262626] shadow-inner">
                  68%
                </div>
              </div>
              <div className="w-full progress-track h-2 rounded-full border border-[#222]">
                <div className="progress-fill h-full rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>

            <div className="interactive-card interactive-flat p-6 rounded-lg">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-heading text-xl font-medium text-white mb-1">Abnormal Psychology</h4>
                  <p className="text-sm text-[#a3a3a3] font-medium">Module 2: Mood Disorders</p>
                </div>
                <div className="bg-[#111] px-3 py-1 rounded text-sm font-semibold border border-[#262626] shadow-inner">
                  42%
                </div>
              </div>
              <div className="w-full progress-track h-2 rounded-full border border-[#222]">
                <div className="progress-fill h-full rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
