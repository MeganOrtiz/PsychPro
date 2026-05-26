import React, { useEffect, useState } from 'react';
import { Brain, Waves, Sparkles, Activity, Zap, Fingerprint, ChevronRight } from 'lucide-react';

export function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Add Google Font for Outfit and Inter if not present
    if (!document.getElementById('outfit-inter-fonts')) {
      const link = document.createElement('link');
      link.id = 'outfit-inter-fonts';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700&family=Inter:wght@300;400;500&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div className="relative w-[1920px] h-[1080px] bg-[#01060f] text-slate-200 overflow-hidden font-sans selection:bg-cyan-500/30">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes kenBurns {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.05) translate(-1%, 1%); }
          100% { transform: scale(1) translate(0, 0); }
        }
        @keyframes twinkleStar {
          0%, 100% { opacity: 0.1; transform: scale(0.5); }
          50% { opacity: 0.9; transform: scale(1.2); }
        }
        @keyframes godRayDrift {
          0% { transform: translateX(-20%) skewX(-15deg); opacity: 0.3; }
          50% { transform: translateX(20%) skewX(-5deg); opacity: 0.6; }
          100% { transform: translateX(-20%) skewX(-15deg); opacity: 0.3; }
        }
        @keyframes godRayDriftReverse {
          0% { transform: translateX(20%) skewX(15deg); opacity: 0.2; }
          50% { transform: translateX(-20%) skewX(5deg); opacity: 0.5; }
          100% { transform: translateX(20%) skewX(15deg); opacity: 0.2; }
        }
        @keyframes mistDrift {
          0% { transform: translateX(-10%) translateY(0) scale(1); }
          50% { transform: translateX(5%) translateY(-2%) scale(1.1); }
          100% { transform: translateX(-10%) translateY(0) scale(1); }
        }
        @keyframes brainPulse {
          0% { transform: scale(1); filter: drop-shadow(0 0 15px rgba(34,211,238,0.3)) brightness(1); }
          50% { transform: scale(1.035); filter: drop-shadow(0 0 40px rgba(103,232,249,0.7)) brightness(1.18); }
          100% { transform: scale(1); filter: drop-shadow(0 0 15px rgba(34,211,238,0.3)) brightness(1); }
        }
        @keyframes outerHaloBreathe {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.9; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
        }
        @keyframes innerHaloPulse {
          0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.05); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.5; }
        }
        @keyframes orbitRotate {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes orbitRotateReverse {
          0% { transform: translate(-50%, -50%) rotate(360deg); }
          100% { transform: translate(-50%, -50%) rotate(0deg); }
        }
        @keyframes synapseSpark {
          0%, 100% { opacity: 0; transform: scale(0.5) translate(0, 0); }
          50% { opacity: 1; transform: scale(1.5) translate(10px, -10px); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .font-display { font-family: 'Outfit', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .text-glow-display { text-shadow: 0 0 18px rgba(103,232,249,0.6), 0 0 60px rgba(34,211,238,0.35); }
        .glass-nav { background: rgba(2, 13, 34, 0.4); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(34, 211, 238, 0.12); box-shadow: 0 4px 30px rgba(0,0,0,0.5); }
        .glass-panel { background: rgba(5, 26, 59, 0.3); backdrop-filter: blur(12px); border: 1px solid rgba(34, 211, 238, 0.12); }
        .btn-glow { box-shadow: inset 0 0 20px rgba(34,211,238,0.2), 0 0 25px rgba(34,211,238,0.3); border: 1px solid rgba(103,232,249,0.5); }
      `}} />

      {/* BACKGROUND LAYERS */}
      
      {/* 1. Base Backdrop Image with Ken Burns */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen" style={{ animation: 'kenBurns 40s ease-in-out infinite' }}>
        <img src="/__mockup/images/luminous-backdrop.png" alt="" className="w-full h-full object-cover object-center" />
      </div>

      {/* 2. Vignette Gradient */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_0%,#01060f_85%)] pointer-events-none"></div>

      {/* 3. Distant Starfield */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-[#cffafe] shadow-[0_0_8px_2px_rgba(103,232,249,0.8)]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animation: `twinkleStar ${Math.random() * 4 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* 4. God Rays */}
      <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-1/4 w-[150%] h-[150%] bg-[conic-gradient(from_180deg_at_50%_0%,rgba(34,211,238,0)_0deg,rgba(34,211,238,0.08)_15deg,rgba(34,211,238,0)_30deg)] blur-3xl transform-gpu origin-top" style={{ animation: 'godRayDrift 25s ease-in-out infinite' }}></div>
        <div className="absolute top-[-10%] right-1/4 w-[150%] h-[150%] bg-[conic-gradient(from_180deg_at_50%_0%,rgba(103,232,249,0)_0deg,rgba(103,232,249,0.05)_20deg,rgba(103,232,249,0)_40deg)] blur-2xl transform-gpu origin-top" style={{ animation: 'godRayDriftReverse 35s ease-in-out infinite' }}></div>
      </div>

      {/* 5. Volumetric Mist */}
      <div className="absolute inset-0 z-[4] pointer-events-none mix-blend-screen opacity-60">
        <div className="absolute top-[20%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(14,77,138,0.4)_0%,transparent_70%)] blur-[100px]" style={{ animation: 'mistDrift 45s ease-in-out infinite' }}></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-[radial-gradient(circle,rgba(26,111,184,0.3)_0%,transparent_70%)] blur-[120px]" style={{ animation: 'mistDrift 60s ease-in-out infinite reverse' }}></div>
      </div>

      {/* 6. Scanline/Grain Overlay */}
      <div className="absolute inset-0 z-[50] pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]"></div>

      {/* CONTENT LAYERS */}
      
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-40 glass-nav h-[80px] flex items-center justify-between px-12">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border border-cyan-400/30 flex items-center justify-center bg-cyan-950/40 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <Brain className="w-5 h-5 text-cyan-300" />
          </div>
          <span className="font-display font-semibold text-2xl tracking-[0.2em] text-[#cffafe] text-shadow-[0_0_10px_rgba(165,243,252,0.5)]">
            PSYCH<span className="text-cyan-500">PRO</span>
          </span>
        </div>
        
        <div className="flex items-center gap-12 font-body text-xs font-medium tracking-[0.3em] text-cyan-100/70">
          <span className="hover:text-cyan-300 hover:text-shadow-[0_0_8px_rgba(103,232,249,0.6)] cursor-pointer transition-all">NEURAL LAB</span>
          <span className="hover:text-cyan-300 hover:text-shadow-[0_0_8px_rgba(103,232,249,0.6)] cursor-pointer transition-all">RESEARCH</span>
          <span className="hover:text-cyan-300 hover:text-shadow-[0_0_8px_rgba(103,232,249,0.6)] cursor-pointer transition-all">PROTOCOL</span>
        </div>

        <button className="relative overflow-hidden rounded-full font-body text-xs font-semibold tracking-[0.2em] text-[#01060f] bg-[#67e8f9] px-8 py-3 hover:bg-[#a5f3fc] transition-colors shadow-[0_0_20px_rgba(103,232,249,0.4)] flex items-center gap-2 group">
          BEGIN SEQUENCE
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </nav>

      {/* Main Composition Container */}
      <div className="absolute inset-0 z-20 flex flex-col items-center pt-[140px]">
        
        {/* Brain Assembly (Upper Center) */}
        <div className="relative w-[340px] h-[340px] mb-6 flex items-center justify-center">
          
          {/* Outer Breathing Radial Glow */}
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.15)_0%,transparent_70%)] blur-[40px] mix-blend-screen" style={{ animation: 'outerHaloBreathe 6s ease-in-out infinite' }}></div>
          
          {/* Inner Fast Pulse Glow */}
          <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle,rgba(103,232,249,0.3)_0%,transparent_60%)] blur-[20px] mix-blend-screen" style={{ animation: 'innerHaloPulse 3.5s ease-in-out infinite' }}></div>
          
          {/* Orbital Rings */}
          <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px]" style={{ animation: 'orbitRotate 60s linear infinite' }}>
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-[0.12] overflow-visible">
              <ellipse cx="50" cy="50" rx="48" ry="20" fill="none" stroke="#67e8f9" strokeWidth="0.2" transform="rotate(30 50 50)" />
            </svg>
          </div>
          <div className="absolute top-1/2 left-1/2 w-[650px] h-[650px]" style={{ animation: 'orbitRotateReverse 80s linear infinite' }}>
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-[0.08] overflow-visible">
              <ellipse cx="50" cy="50" rx="49" ry="15" fill="none" stroke="#22d3ee" strokeWidth="0.15" transform="rotate(-45 50 50)" />
            </svg>
          </div>

          {/* Synaptic Sparks */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div 
              key={`spark-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full bg-[#cffafe] shadow-[0_0_10px_3px_rgba(165,243,252,0.8)]"
              style={{
                top: `${40 + Math.random() * 20}%`,
                left: `${30 + Math.random() * 40}%`,
                animation: `synapseSpark ${2 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`
              }}
            ></div>
          ))}

          {/* Brain Image */}
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <img 
              src="/__mockup/images/luminous-brain.png" 
              alt="Neural Structure" 
              className="w-[85%] h-[85%] object-contain"
              style={{ animation: 'brainPulse 3.5s ease-in-out infinite' }}
            />
          </div>
        </div>

        {/* Typography */}
        <div className={`text-center transition-all duration-[1500ms] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="font-display font-light text-[90px] leading-[1.05] tracking-tight text-[#f8fafc] mb-6 text-glow-display max-w-[1200px] mx-auto">
            Achieve Luminous<br/>Cognitive Resonance
          </h1>
          <p className="font-body text-xl text-cyan-100/70 font-light max-w-[700px] mx-auto leading-relaxed mb-12">
            The world's most advanced neurological entrainment protocol. Rewire synaptic pathways and sustain peak performance states through precision-engineered audio-visual stimulus.
          </p>

          <div className="flex items-center justify-center gap-6">
            <button className="relative group rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(103,232,249,0.8)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative px-10 py-5 bg-[#020d22]/80 backdrop-blur-md rounded-full font-body text-sm font-semibold tracking-[0.25em] text-[#cffafe] btn-glow flex items-center gap-3">
                INITIATE PROTOCOL
                <Activity className="w-5 h-5 text-[#67e8f9]" />
              </div>
            </button>
            
            <button className="px-10 py-5 rounded-full font-body text-sm font-medium tracking-[0.25em] text-cyan-200/80 border border-cyan-500/30 hover:border-[#67e8f9]/70 hover:bg-cyan-900/30 hover:text-[#cffafe] transition-all flex items-center gap-3">
              EXPLORE RESEARCH
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Metrics Band */}
      <div className="absolute bottom-[40px] left-0 right-0 z-30 flex justify-center">
        <div className="glass-panel rounded-full px-10 py-4 flex items-center gap-16 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          {[
            { label: 'COGNITIVE LOAD', value: 'OPTIMAL', icon: <Brain className="w-4 h-4 text-[#67e8f9]" /> },
            { label: 'NEURAL SYNC', value: '98.4%', icon: <Waves className="w-4 h-4 text-[#67e8f9]" /> },
            { label: 'RESPONSE LATENCY', value: '204ms', icon: <Zap className="w-4 h-4 text-[#67e8f9]" /> },
            { label: 'SYSTEM STATUS', value: 'LUMINOUS', icon: <Sparkles className="w-4 h-4 text-[#67e8f9]" /> }
          ].map((metric, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[#0a2756]/50 border border-cyan-500/20 flex items-center justify-center">
                {metric.icon}
              </div>
              <div className="flex flex-col">
                <span className="font-body text-[10px] font-medium tracking-[0.2em] text-cyan-200/50 uppercase">{metric.label}</span>
                <span className="font-display text-lg font-semibold tracking-wide text-[#cffafe] text-shadow-[0_0_8px_rgba(103,232,249,0.4)]">{metric.value}</span>
              </div>
              {i < 3 && <div className="w-px h-8 bg-cyan-500/10 ml-8"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Corner Status Pill */}
      <div className="absolute bottom-6 right-8 z-30 flex items-center gap-3 glass-panel px-4 py-2 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.4)]">
        <div className="w-2 h-2 rounded-full bg-[#67e8f9] shadow-[0_0_8px_2px_rgba(103,232,249,0.8)]" style={{ animation: 'twinkleStar 2s infinite' }}></div>
        <span className="font-body text-[10px] font-medium tracking-[0.25em] text-cyan-200/60 uppercase">
          V3.0 · NEURAL CORE · LIVE
        </span>
      </div>

    </div>
  );
}
