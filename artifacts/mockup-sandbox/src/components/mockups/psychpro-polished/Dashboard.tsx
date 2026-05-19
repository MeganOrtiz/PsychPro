import React, { useState } from 'react';
import { 
  Brain, Bell, TrendingUp, ArrowUpRight, Sparkles, BookOpen, 
  ChevronRight, Star, Medal, Award, ShieldCheck, Flame, Trophy,
  Activity, CheckCircle2, Clock
} from 'lucide-react';

export function Dashboard() {
  const [activeTab] = useState('overview');

  return (
    <div 
      className="min-h-screen relative font-sans overflow-x-hidden"
      style={{ 
        backgroundColor: '#03151D',
        fontFamily: '"Outfit", "Inter", system-ui, sans-serif'
      }}
    >
      <style>{`
        .glass-card-light {
          background: rgba(244,251,255,0.94);
          border: 1px solid rgba(94,176,200,0.35);
          box-shadow: 0 20px 60px -20px rgba(42,115,135,.45), 0 0 0 1px rgba(118,228,247,.15);
        }
        .glass-card-dark {
          background: linear-gradient(145deg, rgba(10,45,61,0.8), rgba(6,31,43,0.95));
          border: 1px solid rgba(42,115,135,0.4);
          box-shadow: 0 20px 40px -10px rgba(3,21,29,0.8);
        }
        .text-glow {
          text-shadow: 0 0 20px rgba(118,228,247,0.4);
        }
        .icon-glow {
          filter: drop-shadow(0 0 8px rgba(118,228,247,0.6));
        }
        .bg-tile-pattern {
          background-image: url(/__mockup/images/cerulean-clouds-tile.png);
          background-repeat: repeat;
          background-size: clamp(640px, 95vw, 1400px);
          filter: brightness(0.78) saturate(1.15) hue-rotate(0deg) contrast(1.05);
        }
        .bg-scrim {
          background: rgba(3,21,29,0.18), radial-gradient(circle at top right, rgba(118,228,247,0.10) 0%, transparent 60%), linear-gradient(to bottom, rgba(6,32,44,0.15) 0%, rgba(6,32,44,0.35) 100%);
        }
        .brand-gradient {
          background: linear-gradient(135deg, #5EB0C8, #76E4F7);
        }
      `}</style>

      {/* Background Layers */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-tile-pattern" />
      <div className="fixed inset-0 z-0 pointer-events-none bg-scrim" />

      {/* Content Container */}
      <div className="relative z-10 max-w-[1400px] mx-auto p-6 lg:p-8">
        
        {/* Header */}
        <header className="relative flex flex-col items-center justify-center mb-10 pt-4">
          <div className="absolute right-0 top-4">
            <button className="w-12 h-12 rounded-full flex items-center justify-center bg-[#0A2D3D]/60 border border-[#2A7387]/40 hover:bg-[#0E3C50]/80 transition-colors backdrop-blur-md">
              <Bell className="w-5 h-5 text-[#76E4F7]" />
            </button>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <Brain className="w-7 h-7 text-[#76E4F7] mb-3 icon-glow" />
            <h1 
              className="font-light text-[#F4FBFF] text-glow leading-none m-0 pb-1"
              style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '0.42em', marginLeft: '0.42em' }}
            >
              PSYCHPRO
            </h1>
            <p 
              className="text-xs font-light text-[#A7F3FF] mt-2"
              style={{ letterSpacing: '0.32em', marginLeft: '0.32em' }}
            >
              ADVANCE YOUR MIND. ELEVATE CARE.
            </p>
          </div>
        </header>

        {/* Above-the-fold Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-12">
          
          {/* LEFT: Continue Your Journey */}
          <div className="glass-card-light rounded-[22px] p-6 lg:p-8 flex flex-col relative overflow-hidden group">
            {/* Subtle inner glow backdrop */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#CCE5EC] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#2A7387]" />
                </div>
                <h2 className="text-[#0A2D3D] font-semibold text-xl">Continue Your Journey</h2>
              </div>
              
              <div className="mb-8">
                <div className="flex justify-between items-end mb-3">
                  <h3 className="font-bold text-[#0A2D3D] text-2xl tracking-tight">Neuropsychology Overview</h3>
                  <span className="text-[#2A7387] font-semibold text-lg">72%</span>
                </div>
                <div className="h-2 w-full bg-[#CCE5EC] rounded-full overflow-hidden">
                  <div className="h-full rounded-full brand-gradient w-[72%]" />
                </div>
              </div>
              
              <div className="flex justify-between items-center border-t border-[#2A7387]/10 pt-6 mt-auto">
                <div className="flex gap-8">
                  <div>
                    <p className="text-xs text-[#2A7387] font-medium uppercase tracking-wider mb-1">Time Today</p>
                    <p className="text-[#0A2D3D] font-bold text-lg">42 min</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#2A7387] font-medium uppercase tracking-wider mb-1">Cards Reviewed</p>
                    <p className="text-[#0A2D3D] font-bold text-lg">18</p>
                  </div>
                </div>
                
                <button className="bg-[#2A7387] hover:bg-[#0A2D3D] text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-colors shadow-lg shadow-[#2A7387]/20">
                  Continue Studying
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Stack */}
          <div className="flex flex-col gap-6">
            {/* Streak Card */}
            <div className="glass-card-light rounded-[22px] p-6 relative">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-[#0A2D3D] font-semibold text-lg flex items-center gap-2">
                  Your Streak <span className="text-xl">🔥</span>
                </h3>
                <div className="flex items-baseline gap-1 text-[#F97316]">
                  <span className="text-3xl font-bold leading-none">5</span>
                  <span className="text-sm font-medium">days</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center px-2">
                {['S','M','T','W','T','F','S'].map((day, i) => {
                  const isLit = i >= 1 && i <= 5; // M-F
                  return (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isLit 
                          ? 'bg-[#F97316]/10 text-[#F97316]' 
                          : 'bg-[#0A2D3D]/5 text-[#0A2D3D]/40'
                      }`}>
                        {isLit ? <Flame className="w-4 h-4 text-[#F97316]" fill="currentColor" /> : <div className="w-2 h-2 rounded-full bg-[#0A2D3D]/20" />}
                      </div>
                      <span className={`text-[10px] font-bold uppercase ${isLit ? 'text-[#0A2D3D]' : 'text-[#0A2D3D]/40'}`}>{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Banner */}
            <div className="rounded-[22px] p-5 flex flex-col gap-4" style={{
              background: 'rgba(94,176,200,.12)',
              border: '1px solid rgba(118,228,247,.4)'
            }}>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#76E4F7]/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-[#5EB0C8]" />
                </div>
                <div>
                  <h4 className="text-[#F4FBFF] font-medium mb-1">You're close to your free limit</h4>
                  <p className="text-[#A7F3FF] text-sm font-light">8 of 10 free interactions used</p>
                </div>
              </div>
              <button className="w-full py-2.5 rounded-full border border-[#76E4F7]/50 text-[#76E4F7] font-medium text-sm hover:bg-[#76E4F7]/10 transition-colors">
                Upgrade to Unlimited
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Recommended */}
        <div className="mb-12">
          <div className="mb-4 ml-1">
            <h3 className="text-[11px] text-[#2A7387] font-bold tracking-[0.18em] uppercase">Recommended For You</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Executive Function', desc: 'Strengthen your foundation', icon: Brain },
              { title: 'Cognitive Therapy & CBT', desc: 'Strengthen your foundation', icon: BookOpen },
              { title: 'Neurophysiology', desc: 'Strengthen your foundation', icon: Sparkles }
            ].map((item, i) => (
              <div key={i} className="glass-card-light rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:-translate-y-0.5 transition-transform duration-300 group hover:shadow-[0_8px_30px_-10px_rgba(42,115,135,0.4)]">
                <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center shrink-0 shadow-inner">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[#0A2D3D] font-bold truncate">{item.title}</h4>
                  <p className="text-[#2A7387] text-xs truncate">{item.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#2A7387]/50 group-hover:text-[#2A7387] transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Spotlight */}
        <div className="mb-12">
          <div className="mb-4 ml-1">
            <h3 className="text-[11px] text-[#2A7387] font-bold tracking-[0.18em] uppercase">Spotlight</h3>
          </div>
          
          <div className="glass-card-dark rounded-2xl overflow-hidden relative">
            <div 
              className="absolute top-0 left-0 right-0 h-32 opacity-60"
              style={{
                backgroundImage: 'url(/__mockup/images/spotlight_cloud.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                maskImage: 'linear-gradient(to bottom, black, transparent)'
              }}
            />
            
            <div className="relative z-10 p-8 flex flex-col md:flex-row gap-8 items-center md:items-stretch">
              {/* Left Column: Author */}
              <div className="flex flex-col items-center text-center md:w-1/3 shrink-0">
                <Star className="w-6 h-6 text-[#76E4F7] mb-3 icon-glow" />
                <h4 className="text-white text-sm font-light tracking-[0.18em] uppercase mb-1">PsychPro</h4>
                <p className="text-[#A7F3FF] text-[10px] tracking-[0.22em] mb-6">LEARN. EXPAND. CONNECT.</p>
                
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden ring-3 ring-[#76E4F7] ring-offset-2 ring-offset-[#0A2D3D] shadow-[0_0_30px_rgba(118,228,247,0.4)]">
                    <img src="/__mockup/images/spotlight_avatar.png" alt="Sarah K." className="w-full h-full object-cover" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1">Sarah K.</h3>
                <p className="text-[#A7F3FF] text-sm">PsyD Candidate<br/>Clinical Neuropsychology</p>
              </div>
              
              {/* Right Column: Featured Work */}
              <div 
                className="flex-1 rounded-xl p-6 relative overflow-hidden group flex flex-col justify-between items-start w-full"
              >
                <div 
                  className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: 'url(/__mockup/images/spotlight_neuron.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#03151D]/90 via-[#061F2B]/80 to-transparent" />
                
                <div className="relative z-10">
                  <span className="inline-block text-[#76E4F7] text-[10px] font-bold tracking-[0.2em] mb-3 bg-[#0A2D3D]/50 px-2 py-1 rounded border border-[#2A7387]/30 backdrop-blur-sm">
                    FEATURED WORK
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-3 text-shadow max-w-lg leading-tight">
                    SOCIAL COGNITION IN CHILDREN WITH AUTISM SPECTRUM DISORDER
                  </h3>
                  <p className="text-[#A7F3FF] text-sm max-w-lg line-clamp-2 leading-relaxed mb-6">
                    A comprehensive review of the neurological underpinnings of social cognitive deficits in ASD, focusing on the default mode network and mirror neuron systems.
                  </p>
                </div>
                
                <button className="relative z-10 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 backdrop-blur-md transition-all">
                  View Feature
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Analytics + Recent */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Analytics */}
          <div className="glass-card-light rounded-[22px] p-6 flex flex-col md:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[#0A2D3D] font-bold text-xl">Study Analytics</h3>
              <span className="bg-[#2A7387]/10 text-[#2A7387] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">This Week</span>
            </div>
            
            <div className="h-48 w-full relative mb-6">
              <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#2A7387" />
                    <stop offset="100%" stopColor="#76E4F7" />
                  </linearGradient>
                  <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#76E4F7" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#76E4F7" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path 
                  d="M0,80 Q100,50 200,60 T400,30 T600,40 T800,20 T1000,40" 
                  fill="none" 
                  stroke="url(#lineGrad)" 
                  strokeWidth="4" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path 
                  d="M0,80 Q100,50 200,60 T400,30 T600,40 T800,20 T1000,40 L1000,100 L0,100 Z" 
                  fill="url(#fillGrad)" 
                />
                {[
                  {x:0, y:80}, {x:200, y:60}, {x:400, y:30}, {x:600, y:40}, {x:800, y:20}, {x:1000, y:40}
                ].map((pt, i) => (
                  <circle key={i} cx={pt.x} cy={pt.y} r="6" fill="#fff" stroke="#76E4F7" strokeWidth="3" />
                ))}
              </svg>
            </div>
            
            <div className="flex gap-8 border-t border-[#2A7387]/10 pt-6">
              <div>
                <p className="text-[#2A7387] text-xs font-bold uppercase tracking-wider mb-1">Average Score</p>
                <p className="text-[#0A2D3D] font-bold text-2xl">78%</p>
              </div>
              <div>
                <p className="text-[#2A7387] text-xs font-bold uppercase tracking-wider mb-1">Topics Studied</p>
                <p className="text-[#0A2D3D] font-bold text-2xl">14<span className="text-[#2A7387]/50 text-lg">/39</span></p>
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="glass-card-light rounded-[22px] p-6">
            <h3 className="text-[#0A2D3D] font-bold text-xl mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { topic: 'Neural Pathways', status: 'Completed Quiz', time: '2h ago', icon: Activity },
                { topic: 'Cognitive Assessment', status: 'Reviewed 20 cards', time: '5h ago', icon: BookOpen },
                { topic: 'Dementia Types', status: 'Mastered Topic', time: '1d ago', icon: CheckCircle2 }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 pb-4 border-b border-[#2A7387]/10 last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-lg bg-[#CCE5EC] flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-[#2A7387]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[#0A2D3D] font-semibold text-sm">{item.topic}</h4>
                    <p className="text-[#2A7387] text-xs">{item.status}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[#2A7387]/60 text-xs font-medium">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Achievements */}
          <div className="glass-card-light rounded-[22px] p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[#0A2D3D] font-bold text-xl">Achievements</h3>
              <span className="text-[#2A7387] text-sm font-semibold">3/6 Unlocked</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'First Steps', hint: 'Complete a topic', icon: Medal, unlocked: true },
                { label: 'Scholar', hint: 'Review 100 cards', icon: BookOpen, unlocked: true },
                { label: 'Hot Streak', hint: '5 day streak', icon: Flame, unlocked: true },
                { label: 'Master', hint: '100% on a quiz', icon: Award, unlocked: false },
                { label: 'Defender', hint: 'No wrong answers', icon: ShieldCheck, unlocked: false },
                { label: 'Champion', hint: 'Finish all topics', icon: Trophy, unlocked: false }
              ].map((achieve, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${achieve.unlocked ? 'bg-white border-[#5EB0C8]/30 shadow-sm' : 'bg-transparent border-dashed border-[#2A7387]/20 opacity-60 grayscale'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${achieve.unlocked ? 'bg-[#CCE5EC]' : 'bg-[#0A2D3D]/5'}`}>
                    <achieve.icon className={`w-4 h-4 ${achieve.unlocked ? 'text-[#2A7387]' : 'text-[#0A2D3D]/40'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold truncate ${achieve.unlocked ? 'text-[#0A2D3D]' : 'text-[#0A2D3D]/60'}`}>{achieve.label}</p>
                    <p className="text-[10px] text-[#2A7387] truncate">{achieve.hint}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
