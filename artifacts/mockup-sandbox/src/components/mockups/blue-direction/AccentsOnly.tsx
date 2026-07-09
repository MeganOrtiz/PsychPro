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
    <div className="min-h-screen bg-black text-[#e5e5e5] font-sans selection:bg-[#08a5d1] selection:text-white">
      <style>{`
        :root {
          --color-black: #000000;
          --color-panel-dark: #0a0a0a;
          --color-panel-light: #171717;
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

        .interactive-flat {
          transition: transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease;
          box-shadow: none;
          transform: translateY(0) scale(1);
        }

        .btn-primary {
          background-color: var(--color-blue-cyan-1);
          color: black;
          font-weight: 600;
        }

        .btn-primary:hover {
          transform: translateY(-1px) scale(1.01);
          box-shadow: 0 0 15px 0 var(--color-blue-cyan-1);
          background-color: var(--color-blue-cyan-2);
        }
        
        .btn-primary:active {
          transform: translateY(0) scale(0.98);
          box-shadow: 0 0 5px 0 var(--color-blue-cyan-1);
        }

        .btn-ghost {
          background-color: transparent;
          border: 1px solid var(--color-border);
          color: var(--color-text-body);
        }

        .btn-ghost:hover {
          transform: translateY(-1px) scale(1.01);
          border-color: var(--color-blue-cyan-1);
          color: var(--color-blue-cyan-1);
          box-shadow: inset 0 0 10px 0 rgba(8, 165, 209, 0.2), 0 0 10px 0 rgba(8, 165, 209, 0.2);
        }
        
        .btn-ghost:active {
          transform: translateY(0) scale(0.98);
          box-shadow: inset 0 0 5px 0 rgba(8, 165, 209, 0.2), 0 0 5px 0 rgba(8, 165, 209, 0.2);
        }

        .interactive-card {
          background-color: var(--color-panel-dark);
          border: 1px solid var(--color-border);
        }

        .interactive-card:hover {
          transform: translateY(-1px);
          border-color: var(--color-blue-cyan-1);
          box-shadow: 0 0 12px 0 rgba(8, 165, 209, 0.15);
        }

        .interactive-card:active {
          transform: translateY(0);
        }
        
        .progress-fill {
          background: linear-gradient(90deg, var(--color-blue-ocean-1), var(--color-blue-cyan-1));
        }
        
        .accent-text {
          color: var(--color-blue-cyan-1);
        }
      `}</style>

      {/* Top Nav */}
      <nav className="border-b border-[#262626] bg-black/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 accent-text" />
            <span className="font-bold tracking-widest text-lg">PSYCHPRO</span>
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
      <section className="pt-12 pb-24 px-6 relative overflow-hidden flex flex-col items-center text-center border-b border-[#262626]">
        {/* Brain Image - The only glowing thing at rest */}
        <div className="mb-12 relative z-10 w-full max-w-[520px]">
          <img 
            src="/__mockup/images/blue-brain-hero.jpg" 
            alt="Glowing blue brain" 
            className="w-full h-auto object-contain block mix-blend-screen"
            style={{ filter: 'contrast(1.1) brightness(1.1)' }}
          />
        </div>

        <div className="relative z-20 max-w-3xl mx-auto flex flex-col items-center">
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-[#a3a3a3] mb-4">
            learn. expand. connect.
          </p>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white">
            Learn Smarter. <br className="hidden md:block" />
            <span className="text-[#a3a3a3]">Not Harder.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#a3a3a3] mb-10 max-w-2xl leading-relaxed">
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
      <section className="py-20 px-6 bg-[#000000]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Welcome back, Dr. Sarah</h2>
              <p className="text-[#a3a3a3]">Let's continue your cognitive behavioral therapy review.</p>
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
                  <div className="text-[#a3a3a3] text-sm font-medium">{stat.label}</div>
                  <stat.icon className="w-5 h-5 text-[#262626]" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs accent-text font-medium">{stat.trend}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Course Progress */}
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#a3a3a3]" />
            Active Courses
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="interactive-card interactive-flat p-6 rounded-lg">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Cognitive Psychology</h4>
                  <p className="text-sm text-[#a3a3a3]">Module 4: Memory & Attention</p>
                </div>
                <div className="bg-[#171717] px-3 py-1 rounded text-sm font-medium border border-[#262626]">
                  68%
                </div>
              </div>
              <div className="w-full bg-[#171717] h-2 rounded-full overflow-hidden border border-[#262626]">
                <div className="progress-fill h-full rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>

            <div className="interactive-card interactive-flat p-6 rounded-lg">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Abnormal Psychology</h4>
                  <p className="text-sm text-[#a3a3a3]">Module 2: Mood Disorders</p>
                </div>
                <div className="bg-[#171717] px-3 py-1 rounded text-sm font-medium border border-[#262626]">
                  42%
                </div>
              </div>
              <div className="w-full bg-[#171717] h-2 rounded-full overflow-hidden border border-[#262626]">
                <div className="progress-fill h-full rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
