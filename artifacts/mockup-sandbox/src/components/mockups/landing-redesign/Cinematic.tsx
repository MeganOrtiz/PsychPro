import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

const P = {
  ink: "#03151D",
  bg: "#061F2B",
  bgSoft: "#083240",
  steel: "#2A7387",
  tealDeep: "#2A7387",
  teal: "#5EB0C8",
  surf: "#76E4F7",
  mist: "#A7F3FF",
  mistSoft: "#7FBFD0",
  cloud: "#F4FBFF",
  paper: "#F4FBFF",
  paperSoft: "#CCE5EC",
  inkSoft: "#A9C6CF",
};

const STATS = [
  { target: 39, label: "Core Topics", prefix: "" },
  { target: 1878, label: "Flashcards", prefix: "" },
  { target: 1125, label: "Quiz Questions", prefix: "" },
  { target: 4, label: "Study Modes", prefix: "" },
];

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return <span>{count.toLocaleString()}</span>;
}

export default function CinematicLanding() {
  return (
    <div
      className="relative w-full min-h-screen overflow-hidden flex flex-col font-sans"
      style={{
        backgroundColor: P.ink,
        color: P.cloud,
      }}
    >
      <style>{`
        @keyframes cine-breathe {
          0%, 100% { transform: scale(1) translateY(0); filter: drop-shadow(0 0 100px ${P.surf}80) brightness(1) saturate(1); }
          50%      { transform: scale(1.04) translateY(-10px); filter: drop-shadow(0 0 160px ${P.surf}B3) brightness(1.1) saturate(1.2); }
        }
        @keyframes cine-aura {
          0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
          50%      { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes cine-drift-left {
          0%   { transform: translateX(0) scale(1.1); }
          100% { transform: translateX(-5%) scale(1.15); }
        }
        @keyframes cine-drift-right {
          0%   { transform: translateX(-5%) scale(1.1); }
          100% { transform: translateX(0) scale(1.15); }
        }
        @keyframes cine-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up-1 { animation: cine-fade-up 0.9s 0.05s both cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-fade-up-2 { animation: cine-fade-up 0.9s 0.15s both cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-fade-up-3 { animation: cine-fade-up 0.9s 0.30s both cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-fade-up-4 { animation: cine-fade-up 0.9s 0.45s both cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-fade-up-5 { animation: cine-fade-up 0.9s 0.60s both cubic-bezier(0.16, 1, 0.3, 1); }
        
        .cine-glass {
          background: ${P.bgSoft}55;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid ${P.teal}33;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5), inset 0 0 0 1px ${P.surf}11;
        }
      `}</style>

      {/* Atmospheric Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-50 mix-blend-screen"
          style={{
            background: `radial-gradient(circle at 50% 40%, ${P.bgSoft} 0%, transparent 70%)`,
          }}
        />
        
        {/* Deep aura */}
        <div
          className="absolute top-[40%] left-1/2 w-[120vw] h-[120vw] max-w-[1400px] max-h-[1400px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${P.teal}40 0%, ${P.surf}10 30%, transparent 60%)`,
            filter: "blur(100px)",
            transform: "translate(-50%, -50%)",
            animation: "cine-aura 10s ease-in-out infinite",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-20 px-8 py-6 flex items-center justify-between animate-fade-up-1">
        <div className="flex items-center gap-3">
          <span
            className="font-light text-lg tracking-[0.4em]"
            style={{
              color: P.cloud,
              textShadow: `0 0 15px ${P.surf}88`,
            }}
          >
            PSYCHPRO
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-white/60 hover:text-white transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button
            className="px-6 py-2.5 rounded-full text-xs font-bold tracking-[0.25em] transition-all hover:bg-white/10"
            style={{
              color: P.cloud,
              border: `1px solid ${P.surf}40`,
            }}
          >
            LOG IN
          </button>
        </div>
      </header>

      {/* Hero Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-6 pt-10 pb-20">
        
        {/* Massive Cinematic Brain */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[-1] mt-[-5%] overflow-hidden">
          <img
            src="/__mockup/images/brain.png"
            alt=""
            className="w-[140%] max-w-[1400px] h-auto object-contain mix-blend-screen"
            style={{
              opacity: 0.72,
              animation: "cine-breathe 8s ease-in-out infinite",
              WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, black 30%, transparent 70%)",
              maskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, black 30%, transparent 70%)",
            }}
          />
        </div>

        {/* Readability scrim — darkens the brain directly behind the copy so the
            tagline / blurb / CTAs stay legible over the bright glow. */}
        <div
          className="absolute left-1/2 top-1/2 pointer-events-none z-0"
          style={{
            width: "min(1300px, 96%)",
            height: "78%",
            transform: "translate(-50%, -40%)",
            background: `radial-gradient(ellipse 58% 62% at 50% 50%, ${P.ink}F2 0%, ${P.ink}E0 30%, ${P.ink}99 52%, transparent 75%)`,
          }}
        />

        <div className="text-center z-10 max-w-4xl mx-auto flex flex-col items-center mt-32">
          {/* Main Title */}
          <h1
            className="animate-fade-up-2 font-extralight uppercase leading-none"
            style={{
              fontSize: "clamp(60px, 12vw, 150px)",
              letterSpacing: "0.25em",
              textShadow: `0 0 60px ${P.surf}80, 0 0 120px ${P.teal}60`,
              marginLeft: "0.25em", // offset tracking
            }}
          >
            PSYCHPRO
          </h1>
          
          {/* Tagline */}
          <h2
            className="animate-fade-up-3 mt-6 mb-8 text-sm md:text-xl font-light tracking-[0.6em] text-transparent bg-clip-text"
            style={{
              backgroundImage: `linear-gradient(90deg, ${P.mist}, ${P.surf}, ${P.mist})`,
            }}
          >
            LEARN. EXPAND. CONNECT.
          </h2>
          
          {/* Blurb */}
          <p
            className="animate-fade-up-4 text-base md:text-xl font-light leading-relaxed max-w-2xl text-center"
            style={{ color: P.paperSoft }}
          >
            Master clinical psychology. Deeper understanding for topics in psychology, neuroscience, and intervention for real-world clinical application.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up-5 mt-12 flex flex-col sm:flex-row items-center gap-6">
            <button
              className="group relative px-10 py-4 rounded-full overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${P.tealDeep}, ${P.surf})`,
                boxShadow: `0 0 40px ${P.tealDeep}80`,
              }}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative font-bold text-sm tracking-[0.3em] text-ink" style={{ color: P.ink }}>
                JOIN NOW
              </span>
            </button>
            
            <button
              className="px-10 py-4 rounded-full font-bold text-sm tracking-[0.3em] transition-all"
              style={{
                color: P.cloud,
                border: `1px solid ${P.surf}60`,
                background: "rgba(0,0,0,0.3)",
                backdropFilter: "blur(10px)",
              }}
            >
              EXPLORE TOPICS
            </button>
          </div>
        </div>

        {/* Stats Band integrated into hero */}
        <div className="animate-fade-up-5 mt-32 w-full max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-4 relative z-20">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="cine-glass rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1 duration-300"
            >
              <div
                className="text-4xl md:text-5xl font-light mb-2"
                style={{
                  color: P.surf,
                  textShadow: `0 0 20px ${P.surf}80`,
                }}
              >
                <AnimatedCounter target={stat.target} />
              </div>
              <div
                className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase"
                style={{ color: P.mistSoft }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full py-8 border-t" style={{ borderColor: `${P.teal}20`, background: P.ink }}>
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[10px] tracking-[0.2em] font-light" style={{ color: P.mistSoft }}>
            © 2026 PSYCHPRO. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-8 text-[10px] tracking-[0.2em] font-medium">
            <a href="#" className="hover:text-white transition-colors" style={{ color: P.mistSoft }}>PRIVACY POLICY</a>
            <a href="#" className="hover:text-white transition-colors" style={{ color: P.mistSoft }}>TERMS OF SERVICE</a>
            <a href="#" className="hover:text-white transition-colors" style={{ color: P.mistSoft }}>CONTACT</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
