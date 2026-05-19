import React from "react";
import { Brain, BookOpen, Users, GraduationCap, Wrench, Award, Globe, Search } from "lucide-react";

export function Landing() {
  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden font-sans selection:bg-[#76E4F7] selection:text-[#03151D]" style={{ fontFamily: '"Outfit", "Inter", system-ui, sans-serif', backgroundColor: '#03151D' }}>
      <style>{`
        :root {
          --hero-bg-h: clamp(220px, 35.5vw, 70vh);
        }
      `}</style>

      {/* Layer 0: solid floor */}
      <div className="fixed inset-0 z-[-50] bg-[#03151D]" />

      {/* Layer 1: cloud tile background */}
      <div 
        className="fixed inset-0 z-[-40]"
        style={{
          backgroundImage: 'url(/__mockup/images/cerulean-clouds-tile.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: 'clamp(640px, 95vw, 1400px) clamp(640px, 95vw, 1400px)',
          filter: 'brightness(0.78) saturate(1.15) hue-rotate(0deg) contrast(1.05)',
          maskImage: 'linear-gradient(180deg, transparent 0, transparent calc(var(--hero-bg-h) * 0.35), #000 calc(var(--hero-bg-h) + 30vh), #000 50%, transparent 92%)',
          WebkitMaskImage: 'linear-gradient(180deg, transparent 0, transparent calc(var(--hero-bg-h) * 0.35), #000 calc(var(--hero-bg-h) + 30vh), #000 50%, transparent 92%)'
        }}
      />

      {/* Layer 2: top hero brain */}
      <div 
        className="fixed top-0 left-0 w-full z-[-30]"
        style={{
          backgroundImage: 'url(/__mockup/images/hero_brain.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          height: 'var(--hero-bg-h)',
          maskImage: 'linear-gradient(180deg, #000 0, #000 70%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg, #000 0, #000 70%, transparent 100%)'
        }}
      />

      {/* Top Nav */}
      <nav className="relative z-20 w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <Brain className="w-7 h-7 text-[#76E4F7]" style={{ filter: 'drop-shadow(0 0 8px rgba(118,228,247,0.6))' }} />
            <span className="text-[#F4FBFF] font-light text-base tracking-[0.28em] group-hover:text-[#76E4F7] transition-colors">PSYCHPRO</span>
          </div>

          {/* Center */}
          <div className="hidden md:flex items-center gap-8">
            {['HOME', 'COURSES', 'RESOURCES', 'COMMUNITY', 'ABOUT'].map((link, i) => (
              <a 
                key={link} 
                href="#"
                className={`text-xs font-light tracking-[0.28em] transition-all relative py-2 ${i === 0 ? 'text-[#F4FBFF]' : 'text-[#A9C6CF] hover:text-[#F4FBFF]'}`}
              >
                {link}
                {i === 0 && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#76E4F7]" style={{ boxShadow: '0 0 8px #76E4F7' }} />
                )}
              </a>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-105"
              style={{
                background: 'rgba(10,45,61,.62)',
                border: '1px solid rgba(118,228,247,.45)',
                boxShadow: 'inset 0 0 10px rgba(118,228,247,0.2), 0 0 15px rgba(118,228,247,0.1)'
              }}>
              <Search className="w-4 h-4 text-[#76E4F7]" />
            </button>
            <button className="h-10 px-6 rounded-full flex items-center justify-center text-[#76E4F7] text-xs font-light tracking-[0.28em] transition-transform hover:scale-105"
              style={{
                background: 'rgba(10,45,61,.62)',
                border: '1px solid rgba(118,228,247,.45)',
                boxShadow: 'inset 0 0 10px rgba(118,228,247,0.2), 0 0 15px rgba(118,228,247,0.1)'
              }}>
              LOG IN
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 w-full pb-32">
        {/* Hero Block */}
        <div className="w-full flex flex-col items-center justify-start text-center px-4" style={{ marginTop: 'calc(var(--hero-bg-h) * 0.4)' }}>
          <h1 className="font-light text-[#F4FBFF] tracking-[0.42em] leading-tight mb-4"
              style={{ 
                fontSize: 'clamp(44px,7.5vw,88px)',
                textShadow: '0 0 40px rgba(118,228,247,0.4), 0 0 80px rgba(118,228,247,0.2)' 
              }}>
            PSYCHPRO
          </h1>
          <p className="text-sm md:text-base font-light text-[#A7F3FF] tracking-[0.32em] mb-8" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
            LEARN. EXPAND. CONNECT.
          </p>
          <p className="max-w-2xl text-[17px] leading-relaxed font-light text-[#A9C6CF] mb-12" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9)' }}>
            Your all-in-one platform for mastering clinical psychology — cut study time in half and actually retain it with clinically grounded tools built for students and professionals.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <button className="h-12 px-8 rounded-full flex items-center gap-3 text-[#76E4F7] text-xs font-light tracking-[0.28em] transition-all hover:scale-105 hover:bg-[rgba(118,228,247,0.1)]"
              style={{
                background: 'rgba(10,45,61,.62)',
                border: '1px solid rgba(118,228,247,.45)',
                boxShadow: 'inset 0 0 15px rgba(118,228,247,0.3), 0 0 20px rgba(118,228,247,0.2)'
              }}>
              <BookOpen className="w-4 h-4" />
              EXPLORE COURSES
            </button>
            <button className="h-12 px-8 rounded-full flex items-center gap-3 text-[#76E4F7] text-xs font-light tracking-[0.28em] transition-all hover:scale-105 hover:bg-[rgba(118,228,247,0.1)]"
              style={{
                background: 'rgba(10,45,61,.62)',
                border: '1px solid rgba(118,228,247,.45)',
                boxShadow: 'inset 0 0 15px rgba(118,228,247,0.3), 0 0 20px rgba(118,228,247,0.2)'
              }}>
              <Users className="w-4 h-4" />
              JOIN COMMUNITY
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="max-w-7xl mx-auto mt-24 mb-16 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(118,228,247,.35), transparent)' }} />

        {/* Feature Cards */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: GraduationCap, title: 'EXPERT-LED COURSES', desc: 'Curated by leading professionals in the field.' },
              { icon: Brain, title: 'EVIDENCE-BASED', desc: 'Rooted in the latest psychological research.' },
              { icon: Wrench, title: 'PRACTICAL TOOLS', desc: 'Resources you can apply immediately.' },
              { icon: Users, title: 'PROFESSIONAL COMMUNITY', desc: 'Connect with peers and mentors worldwide.' }
            ].map((feature, i) => (
              <div key={i} className="group relative rounded-xl p-7 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(6,32,44,.58)',
                  border: '1px solid rgba(118,228,247,.38)',
                  backdropFilter: 'blur(18px) saturate(140%)',
                  boxShadow: '0 24px 50px rgba(0,0,0,.45), inset 0 0 0 1px rgba(118,228,247,.05)'
                }}>
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ boxShadow: 'inset 0 0 20px rgba(118,228,247,0.1)' }} />
                <feature.icon className="w-10 h-10 text-[#76E4F7] mb-6" strokeWidth={1.25} style={{ filter: 'drop-shadow(0 0 10px rgba(118,228,247,0.6))' }} />
                <h3 className="text-[#F4FBFF] text-xs font-light tracking-[0.28em] uppercase mb-3">{feature.title}</h3>
                <p className="text-[#A9C6CF] text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="max-w-7xl mx-auto mt-20 mb-20 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(118,228,247,.35), transparent)' }} />

        {/* Trust Stats Band */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-xl overflow-hidden"
            style={{
              background: 'rgba(6,32,44,.4)',
              border: '1px solid rgba(118,228,247,.2)',
              backdropFilter: 'blur(12px)'
            }}>
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[rgba(118,228,247,.22)]">
              {[
                { icon: BookOpen, num: '39+', label: 'TOPICS' },
                { icon: GraduationCap, num: '1,612+', label: 'FLASHCARDS' },
                { icon: Award, num: '935+', label: 'QUIZ QUESTIONS' },
                { icon: Globe, num: '738+', label: 'EXAM QUESTIONS' }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-8 text-center">
                  <stat.icon className="w-6 h-6 text-[#76E4F7] mb-4 opacity-70" />
                  <div className="text-[#F4FBFF] font-light text-3xl mb-2">{stat.num}</div>
                  <div className="text-[#A9C6CF] text-[10px] tracking-[0.32em] uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="max-w-7xl mx-auto mt-20 mb-20 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(118,228,247,.35), transparent)' }} />

        {/* Upgraded Testimonial */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="rounded-2xl p-8 md:p-10 relative overflow-hidden"
            style={{
              background: 'rgba(6,32,44,.58)',
              border: '1px solid rgba(118,228,247,.38)',
              backdropFilter: 'blur(18px) saturate(140%)',
              boxShadow: '0 0 60px rgba(118,228,247,.22), 0 24px 60px rgba(0,0,0,.5), inset 0 0 0 1px rgba(118,228,247,.05)'
            }}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-center">
              <div className="md:col-span-2 flex justify-center md:justify-end">
                <div className="w-[160px] h-[160px] rounded-full overflow-hidden shrink-0"
                  style={{
                    boxShadow: '0 0 0 3px rgba(118,228,247,.7), 0 0 28px rgba(118,228,247,.45)'
                  }}>
                  <img src="/__mockup/images/spotlight_avatar.png" alt="Sarah K." className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="md:col-span-3 text-center md:text-left">
                <blockquote className="text-[#F4FBFF] text-xl leading-relaxed italic mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                  "PsychPro changed how I prepare. The spaced repetition and clinical framing made my EPPP prep feel effortless."
                </blockquote>
                <div className="text-[#A7F3FF] text-sm tracking-[0.18em] uppercase">
                  — Sarah K., PsyD Candidate · Clinical Neuropsychology
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full pt-16 pb-8 border-t border-[rgba(118,228,247,.15)] bg-[rgba(3,21,29,.8)] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Brain className="w-6 h-6 text-[#76E4F7]" />
                <span className="text-[#F4FBFF] font-light tracking-[0.28em] text-sm">PSYCHPRO</span>
              </div>
              <p className="text-[#A9C6CF] text-sm leading-relaxed max-w-xs">
                Empowering the next generation of clinical psychologists with evidence-based study tools.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <a href="#" className="text-[#F4FBFF] text-xs tracking-[0.1em] hover:text-[#76E4F7] transition-colors">Courses</a>
                <a href="#" className="text-[#A9C6CF] text-xs tracking-[0.1em] hover:text-[#76E4F7] transition-colors">Study Tools</a>
                <a href="#" className="text-[#A9C6CF] text-xs tracking-[0.1em] hover:text-[#76E4F7] transition-colors">Pricing</a>
              </div>
              <div className="flex flex-col gap-4">
                <a href="#" className="text-[#F4FBFF] text-xs tracking-[0.1em] hover:text-[#76E4F7] transition-colors">About</a>
                <a href="#" className="text-[#A9C6CF] text-xs tracking-[0.1em] hover:text-[#76E4F7] transition-colors">Contact</a>
                <a href="#" className="text-[#A9C6CF] text-xs tracking-[0.1em] hover:text-[#76E4F7] transition-colors">Blog</a>
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end">
              <div className="text-[#F4FBFF] text-xs tracking-[0.1em] mb-4">CONNECT</div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full border border-[rgba(118,228,247,.3)] flex items-center justify-center text-[#76E4F7] hover:bg-[rgba(118,228,247,.1)] transition-colors cursor-pointer">
                  X
                </div>
                <div className="w-8 h-8 rounded-full border border-[rgba(118,228,247,.3)] flex items-center justify-center text-[#76E4F7] hover:bg-[rgba(118,228,247,.1)] transition-colors cursor-pointer">
                  in
                </div>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-[rgba(118,228,247,.08)] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-[#A9C6CF] text-[10px] tracking-[0.1em]">
              © {new Date().getFullYear()} PSYCHPRO. ALL RIGHTS RESERVED.
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-[#A9C6CF] text-[10px] tracking-[0.1em] hover:text-[#76E4F7]">PRIVACY POLICY</a>
              <a href="#" className="text-[#A9C6CF] text-[10px] tracking-[0.1em] hover:text-[#76E4F7]">TERMS OF SERVICE</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
