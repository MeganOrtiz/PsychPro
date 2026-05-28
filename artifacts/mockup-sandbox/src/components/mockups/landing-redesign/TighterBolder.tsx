import React from "react";
import { Search } from "lucide-react";

export default function TighterBolder() {
  return (
    <div 
      className="min-h-screen flex flex-col font-sans overflow-x-hidden selection:bg-[#76E4F7] selection:text-[#03151D]"
      style={{
        backgroundColor: "#03151D",
        color: "#F4FBFF"
      }}
    >
      <style>{`
        @keyframes pp-pulse-brain {
          0%, 100% { filter: drop-shadow(0 0 60px rgba(118, 228, 247, 0.4)) brightness(1); transform: scale(1) translateY(0); }
          50% { filter: drop-shadow(0 0 100px rgba(118, 228, 247, 0.7)) brightness(1.15); transform: scale(1.02) translateY(-10px); }
        }
        @keyframes pp-fade-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pp-slide-in {
          0% { opacity: 0; transform: translateX(-20px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .anim-fade-up { animation: pp-fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .anim-delay-1 { animation-delay: 0.1s; }
        .anim-delay-2 { animation-delay: 0.2s; }
        .anim-delay-3 { animation-delay: 0.3s; }
        .anim-delay-4 { animation-delay: 0.4s; }
        
        .brain-mask {
          mask-image: radial-gradient(ellipse 65% 65% at 50% 50%, black 30%, rgba(0,0,0,0.8) 55%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse 65% 65% at 50% 50%, black 30%, rgba(0,0,0,0.8) 55%, transparent 80%);
        }
      `}</style>

      {/* Background ambient light */}
      <div 
        className="fixed top-[-20%] left-[-10%] w-[120%] h-[100%] rounded-[100%] pointer-events-none opacity-40 blur-[120px]"
        style={{ background: "radial-gradient(ellipse at top, #083240 0%, transparent 60%)" }}
      />
      <div 
        className="fixed bottom-[-20%] right-[-10%] w-[80%] h-[80%] rounded-[100%] pointer-events-none opacity-30 blur-[150px]"
        style={{ background: "radial-gradient(circle at bottom right, #061F2B 0%, transparent 70%)" }}
      />

      {/* Nav */}
      <header className="relative z-20 px-8 py-6 flex items-center justify-between anim-fade-up">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <path d="M14 4c-3 0-5 2-5 4.5 0 1 .3 1.8.8 2.5C8 12 7 13.5 7 15.5c0 2.4 1.6 4 3.5 4.5 0 2.2 1.5 4 3.5 4s3.5-1.8 3.5-4c1.9-.5 3.5-2.1 3.5-4.5 0-2-1-3.5-2.8-4.5.5-.7.8-1.5.8-2.5C19 6 17 4 14 4z" stroke="#76E4F7" strokeWidth="1.5" />
            <path d="M14 4v20M9 11h10M9 17h10" stroke="#5EB0C8" strokeWidth="1" />
          </svg>
          <span className="font-semibold tracking-[0.25em] text-sm text-[#F4FBFF] drop-shadow-[0_0_8px_rgba(118,228,247,0.5)]">
            PSYCHPRO
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <button className="text-[#5EB0C8] hover:text-[#76E4F7] transition-colors" aria-label="Search">
            <Search size={20} strokeWidth={2.5} />
          </button>
          <button className="px-6 py-2 border border-[#5EB0C8]/40 bg-[#061F2B]/50 backdrop-blur-md rounded-full text-xs font-bold tracking-[0.2em] text-[#F4FBFF] hover:bg-[#5EB0C8]/20 hover:border-[#76E4F7] transition-all drop-shadow-[0_0_10px_rgba(94,176,200,0.2)]">
            LOG IN
          </button>
        </div>
      </header>

      {/* Main Hero Container */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-6 lg:px-12 pt-8 pb-16">
        
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
          
          {/* Left: Typography & CTAs */}
          <div className="flex flex-col items-start text-left order-2 lg:order-1 pt-8 lg:pt-0">
            <h2 className="anim-fade-up anim-delay-1 text-[#76E4F7] font-bold tracking-[0.3em] text-xs sm:text-sm mb-4 drop-shadow-[0_0_12px_rgba(118,228,247,0.4)]">
              LEARN. EXPAND. CONNECT.
            </h2>
            
            <h1 className="anim-fade-up anim-delay-2 font-black leading-[0.9] text-[clamp(3.5rem,8vw,6.5rem)] tracking-tight text-white drop-shadow-[0_0_40px_rgba(118,228,247,0.15)] mb-6">
              PSYCH<span className="text-[#A7F3FF]">PRO</span>
            </h1>
            
            <p className="anim-fade-up anim-delay-3 text-[#CCE5EC] text-lg sm:text-xl md:text-2xl font-light leading-relaxed max-w-2xl mb-10 border-l-2 border-[#5EB0C8]/40 pl-6">
              <strong className="font-semibold text-white">Master clinical psychology.</strong> Deeper understanding for topics in psychology, neuroscience, and intervention for real-world clinical application.
            </p>
            
            <div className="anim-fade-up anim-delay-4 flex flex-wrap items-center gap-5 w-full">
              <button className="px-8 py-4 bg-[#76E4F7] hover:bg-white text-[#03151D] font-bold rounded-full tracking-[0.1em] text-sm transition-all shadow-[0_0_30px_rgba(118,228,247,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] hover:scale-105 active:scale-95">
                JOIN NOW
              </button>
              <button className="px-8 py-4 bg-transparent border border-[#5EB0C8]/60 text-[#F4FBFF] hover:bg-[#5EB0C8]/10 font-semibold rounded-full tracking-[0.1em] text-sm transition-all backdrop-blur-md">
                EXPLORE TOPICS
              </button>
            </div>
            
            {/* Integrated Stats Band */}
            <div className="anim-fade-up anim-delay-4 mt-16 lg:mt-20 w-full">
              <div className="flex flex-wrap items-end gap-x-12 gap-y-8 border-t border-[#083240] pt-8">
                {[
                  { n: "39", l: "Core Topics" },
                  { n: "1,878", l: "Flashcards" },
                  { n: "1,125", l: "Quiz Questions" },
                  { n: "4", l: "Study Modes" }
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-[#A7F3FF] font-bold text-3xl tracking-tight leading-none mb-1 drop-shadow-[0_0_10px_rgba(167,243,255,0.3)]">{stat.n}</span>
                    <span className="text-[#5EB0C8] uppercase tracking-[0.15em] text-[10px] font-bold">{stat.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right: Floating Brain */}
          <div className="relative order-1 lg:order-2 flex items-center justify-center anim-fade-up min-h-[400px]">
            {/* Backglow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#76E4F7] rounded-full blur-[100px] opacity-10 mix-blend-screen" />
            
            <img 
              src="/__mockup/images/brain.png" 
              alt="Glowing conceptual brain" 
              className="w-full max-w-[500px] lg:max-w-none h-auto object-contain brain-mask mix-blend-screen"
              style={{ animation: "pp-pulse-brain 8s ease-in-out infinite" }}
              draggable={false}
            />
          </div>
          
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-[#061F2B] py-8 mt-auto anim-fade-up anim-delay-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#5EB0C8] text-xs font-medium tracking-wide">
            &copy; {new Date().getFullYear()} PsychPro. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service", "Contact"].map((link) => (
              <a key={link} href="#" className="text-[#5EB0C8] hover:text-[#76E4F7] text-xs font-semibold tracking-wider uppercase transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
      
    </div>
  );
}
