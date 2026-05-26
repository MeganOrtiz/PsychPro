import React, { useEffect, useState } from 'react';
import { Brain, Waves, Sparkles, Activity, ArrowRight, ChevronRight, Fingerprint } from 'lucide-react';

export function Landing() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Add Google Font for Outfit if not present
    if (!document.getElementById('outfit-font')) {
      const link = document.createElement('link');
      link.id = 'outfit-font';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700;800&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans selection:bg-cyan-500/30">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulseGlow {
          0% { transform: scale(1); filter: drop-shadow(0 0 20px rgba(34, 211, 238, 0.4)) brightness(1); }
          50% { transform: scale(1.04); filter: drop-shadow(0 0 50px rgba(103, 232, 249, 0.8)) brightness(1.18); }
          100% { transform: scale(1); filter: drop-shadow(0 0 20px rgba(34, 211, 238, 0.4)) brightness(1); }
        }
        @keyframes breatheGlow {
          0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.3; }
        }
        @keyframes slowDrift {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(2%, 3%) scale(1.05); }
          66% { transform: translate(-1%, 4%) scale(1.02); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes slowDriftReverse {
          0% { transform: translate(0, 0) scale(1.05); }
          33% { transform: translate(-2%, -2%) scale(1); }
          66% { transform: translate(1%, -3%) scale(1.08); }
          100% { transform: translate(0, 0) scale(1.05); }
        }
        @keyframes mistDrift {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        @keyframes godrayBreathe {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .font-display {
          font-family: 'Outfit', sans-serif;
        }
        .text-glow {
          text-shadow: 0 0 15px rgba(34, 211, 238, 0.5);
        }
        .text-glow-strong {
          text-shadow: 0 0 30px rgba(103, 232, 249, 0.9), 0 0 10px rgba(34, 211, 238, 0.6);
        }
        .box-glow {
          box-shadow: inset 0 0 20px rgba(34, 211, 238, 0.1), 0 0 15px rgba(34, 211, 238, 0.1);
        }
        .box-glow-strong {
          box-shadow: inset 0 0 30px rgba(103, 232, 249, 0.2), 0 0 25px rgba(34, 211, 238, 0.3);
        }
        .border-cyan-faint {
          border-color: rgba(34, 211, 238, 0.1);
        }
        .glass-panel {
          background: rgba(3, 16, 42, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .animate-brain {
          animation: pulseGlow 3.5s ease-in-out infinite;
        }
        .animate-breathe {
          animation: breatheGlow 7s ease-in-out infinite;
        }
        .animate-drift {
          animation: slowDrift 30s ease-in-out infinite;
        }
        .animate-drift-reverse {
          animation: slowDriftReverse 45s ease-in-out infinite;
        }
        .animate-godray {
          animation: godrayBreathe 12s ease-in-out infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .particle {
          position: absolute;
          background: #a5f3fc;
          border-radius: 50%;
          box-shadow: 0 0 10px 2px rgba(103, 232, 249, 0.6);
          animation: twinkle 4s infinite ease-in-out;
        }
      `}} />

      {/* Layer 0: Solid base */}
      <div className="fixed inset-0 z-0 bg-[#020617]"></div>

      {/* Layer 1: Cinematic Backdrop */}
      <div className="fixed inset-0 z-0 opacity-40 mix-blend-screen animate-drift">
        <img 
          src="/__mockup/images/cinematic-backdrop.png" 
          alt="" 
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Layer 2: Radial Glows & Parallax Mist */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Top center dominant glow */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[120vw] h-[100vh] bg-cyan-500/10 blur-[120px] rounded-full animate-drift-reverse"></div>
        
        {/* Bottom left deep glow */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vh] bg-[#03102a] blur-[100px] rounded-full"></div>
        
        {/* Right accent glow */}
        <div className="absolute top-[30%] right-[-20%] w-[80vw] h-[80vh] bg-cyan-900/20 blur-[150px] rounded-full animate-drift"></div>

        {/* CSS mist overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at center, transparent 0%, #020617 100%), repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(34,211,238,0.03) 10px, rgba(34,211,238,0.03) 20px)',
          backgroundSize: '200% 200%',
          animation: 'mistDrift 60s linear infinite'
        }}></div>

        {/* God Rays */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[80vh] bg-gradient-to-b from-cyan-400/5 to-transparent blur-3xl animate-godray transform -skew-x-12 scale-150 origin-top"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[90vh] bg-gradient-to-b from-cyan-300/10 to-transparent blur-2xl animate-godray transform skew-x-12 scale-125 origin-top" style={{ animationDelay: '-6s' }}></div>
      </div>

      {/* Layer 3: Particle Starfield */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div 
            key={i}
            className="particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 3 + 3}s`
            }}
          />
        ))}
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-cyan-faint/50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-cyan-300 flex items-center justify-center box-glow-strong">
                <Brain className="w-4 h-4 text-[#020617]" />
              </div>
              <span className="font-display font-semibold text-xl tracking-wide text-cyan-50 text-glow">
                PSYCH<span className="text-cyan-400">PRO</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 font-medium text-sm tracking-wider text-cyan-100/70">
              <a href="#platform" className="hover:text-cyan-300 hover:text-glow transition-all">PLATFORM</a>
              <a href="#science" className="hover:text-cyan-300 hover:text-glow transition-all">NEUROSCIENCE</a>
              <a href="#outcomes" className="hover:text-cyan-300 hover:text-glow transition-all">OUTCOMES</a>
            </div>

            <div className="flex items-center gap-4">
              <button className="hidden sm:block text-sm font-medium tracking-wide text-cyan-200/80 hover:text-cyan-100 transition-colors">
                LOG IN
              </button>
              <button className="relative group overflow-hidden rounded-full p-[1px]">
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full animate-drift"></span>
                <div className="relative px-6 py-2 bg-[#020617]/80 backdrop-blur-md rounded-full text-sm font-semibold tracking-wider text-cyan-300 group-hover:text-cyan-100 transition-colors flex items-center gap-2">
                  INITIATE
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-4">
          <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center text-center mt-10">
            
            {/* The Brain Assembly */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8 animate-float">
              {/* Outer Breathing Halo */}
              <div className="absolute top-1/2 left-1/2 w-[150%] h-[150%] rounded-full bg-cyan-500/20 blur-3xl animate-breathe mix-blend-screen"></div>
              
              {/* Inner intense glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-cyan-300/30 blur-2xl"></div>
              
              {/* The Anatomical Brain Image */}
              <img 
                src="/__mockup/images/cinematic-brain.png" 
                alt="Neural rendering"
                className="absolute inset-0 w-full h-full object-contain animate-brain drop-shadow-[0_0_25px_rgba(34,211,238,0.6)]"
              />
              
              {/* Foreground light flare */}
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[20%] h-[10%] bg-cyan-200/40 blur-xl rounded-full mix-blend-screen"></div>
            </div>

            {/* Typography */}
            <div className={`transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-500/50 mb-6 text-glow-strong leading-[1.1]">
                Master Your<br/>Cognitive Architecture
              </h1>
              <p className="max-w-2xl mx-auto text-lg md:text-xl text-cyan-100/60 font-light leading-relaxed mb-12">
                PsychPro is the deep-immersion mental performance platform. 
                Rewire your habitual pathways, optimize neuroplasticity, and enter a state of luminous focus.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button className="relative group rounded-full p-[1px] overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-b from-cyan-300 to-cyan-600 rounded-full animate-drift"></span>
                  <div className="relative px-8 py-4 bg-gradient-to-b from-cyan-500/20 to-cyan-900/40 backdrop-blur-md rounded-full text-base font-semibold tracking-widest text-cyan-50 group-hover:bg-cyan-500/30 transition-all box-glow-strong flex items-center gap-3">
                    ENTER THE LAB
                    <Activity className="w-5 h-5 text-cyan-300" />
                  </div>
                </button>
                <button className="px-8 py-4 rounded-full text-base font-semibold tracking-widest text-cyan-300 hover:text-cyan-100 hover:bg-cyan-900/20 transition-all border border-cyan-500/20 hover:border-cyan-400/50 flex items-center gap-3">
                  EXPLORE SCIENCE
                  <Fingerprint className="w-5 h-5 opacity-70" />
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Capabilities Section */}
        <section id="platform" className="relative z-10 py-32 border-t border-cyan-faint bg-gradient-to-b from-transparent to-[#03102a]/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-sm font-bold tracking-[0.3em] text-cyan-400/80 uppercase mb-4 text-glow">The Neural Framework</h2>
              <p className="font-display text-3xl md:text-5xl text-cyan-50 font-medium">Tools for absolute clarity.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Waves className="w-8 h-8" />,
                  title: "Deep State Induction",
                  desc: "Acoustic and visual entrainment protocols designed to shift brainwave states smoothly into Theta and Alpha frequencies."
                },
                {
                  icon: <Sparkles className="w-8 h-8" />,
                  title: "Plasticity Engine",
                  desc: "Adaptive learning modules that challenge cognitive heuristics, forcing structural reorganization and mental flexibility."
                },
                {
                  icon: <Activity className="w-8 h-8" />,
                  title: "Biometric Integration",
                  desc: "Connect your wearables to track vagal tone, HRV, and physiological readiness in real-time, mapping body to mind."
                }
              ].map((card, i) => (
                <div key={i} className="glass-panel border border-cyan-faint rounded-3xl p-8 hover:border-cyan-400/40 transition-all duration-500 group box-glow relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="w-16 h-16 rounded-2xl bg-cyan-950/50 flex items-center justify-center text-cyan-400 mb-8 border border-cyan-500/20 group-hover:scale-110 group-hover:text-cyan-200 transition-all duration-500 group-hover:box-glow-strong">
                    {card.icon}
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-cyan-100 mb-4">{card.title}</h3>
                  <p className="text-cyan-200/50 leading-relaxed font-light">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Immersive Quote/Stat Band */}
        <section className="relative z-10 py-32 flex items-center justify-center overflow-hidden border-y border-cyan-faint">
          <div className="absolute inset-0 bg-[#020617]/80"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 via-cyan-400/5 to-cyan-900/10 mix-blend-screen"></div>
          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <Brain className="w-12 h-12 text-cyan-500/40 mx-auto mb-8 animate-float" />
            <p className="font-display text-3xl md:text-5xl font-light text-cyan-50/90 leading-tight mb-8">
              "PsychPro doesn't just track your metrics. It alters the fundamental texture of your consciousness."
            </p>
            <div className="text-sm font-semibold tracking-widest text-cyan-400/70 uppercase">
              Dr. E. Aris — Cognitive Neuroscientist
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-cyan-faint bg-[#020617] pt-20 pb-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Brain className="w-3 h-3 text-cyan-400" />
                </div>
                <span className="font-display font-semibold tracking-wider text-cyan-200">PSYCHPRO</span>
              </div>
              <div className="flex gap-8 text-sm font-medium tracking-wider text-cyan-200/50">
                <a href="#" className="hover:text-cyan-300 transition-colors">Manifesto</a>
                <a href="#" className="hover:text-cyan-300 transition-colors">Research</a>
                <a href="#" className="hover:text-cyan-300 transition-colors">Privacy</a>
              </div>
            </div>
            <div className="text-center text-xs text-cyan-500/30">
              © {new Date().getFullYear()} PsychPro Neural Systems. All rights reserved.
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
