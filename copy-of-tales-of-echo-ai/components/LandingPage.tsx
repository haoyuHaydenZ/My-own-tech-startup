import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  ArrowDown, 
  Mic2,
  Waves,
  Radio,
  FileMusic,
  Settings,
  Play,
  Music4,
  Sun,
  Moon
} from 'lucide-react';
import { CyberpunkLogo } from './CyberpunkLogo';
import { useTheme } from '../ThemeContext';

interface LandingPageProps {
  setInitialPrompt: (prompt: string) => void;
}

const RevealSection = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, { threshold: 0.1 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-12'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const LandingPage: React.FC<LandingPageProps> = ({ setInitialPrompt }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setInitialPrompt(inputValue);
      navigate('/login');
    }
  };

  // The 4 Core Pillars of Echorya
  const pillars = [
    {
      title: "Audio Understanding",
      desc: "Semantic analysis of harmony, structure, and timbre.",
      icon: Waves,
      features: ["Semantic Music Understanding", "Neural Harmony Engine", "Timbre Profiling", "Key & BPM Finder"]
    },
    {
      title: "Audio Generation",
      desc: "From lyrical concepts to full instrumental composition.",
      icon: Radio,
      features: ["Structure-aware Generation", "Vocal Synthesis", "Lyric Writing", "Backing Tracks"]
    },
    {
      title: "Audio Conversion",
      desc: "Bridging the gap between audio and notation.",
      icon: FileMusic,
      features: ["Universal Notation System", "Audio-to-MIDI", "Sheet-to-Jianpu", "Whistle-to-Score"]
    },
    {
      title: "Audio Editing",
      desc: "Surgical precision for source separation and remixing.",
      icon: Settings,
      features: ["Source Separation", "Remix Engine", "Mastering Chain", "Spectral Editing"]
    }
  ];

  // Musical Symbols for the animation
  const notes = ['♩', '♪', '♫', '♬', '♭', '♯', '1', '3', '5', '6', 'i'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050608] text-slate-600 dark:text-slate-300 font-sans flex flex-col relative overflow-x-hidden selection:bg-echorya-900 selection:text-white transition-colors duration-500">
      
      {/* --- CINEMATIC BACKGROUND ART --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
          {/* Deep ambient base */}
          <div className="absolute top-0 left-0 w-full h-[70vh] bg-gradient-to-b from-slate-200 via-slate-50 to-slate-50 dark:from-echorya-950/20 dark:via-[#050608]/80 dark:to-[#050608] transition-colors duration-500"></div>
          
          {/* Musical staff texture */}
          <div className="absolute inset-0 staff-pattern opacity-5 dark:opacity-10 mix-blend-multiply dark:mix-blend-overlay text-slate-800 dark:text-white"></div>
          
          {/* Resonance Field Animation (Ripples) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10">
             <div className="absolute inset-0 border border-echorya-500/20 rounded-full animate-ripple"></div>
             <div className="absolute inset-0 border border-echorya-500/20 rounded-full animate-ripple" style={{ animationDelay: '1s' }}></div>
             <div className="absolute inset-0 border border-echorya-500/20 rounded-full animate-ripple" style={{ animationDelay: '2s' }}></div>
          </div>

          {/* Floating Organic Particles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-echorya-400/20 rounded-full animate-float-slow blur-[1px]"></div>
          <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-teal-500/10 rounded-full animate-float-delayed blur-[2px]"></div>
          <div className="absolute bottom-1/4 left-10 w-1 h-1 bg-slate-800/20 dark:bg-white/20 rounded-full animate-float blur-[0.5px]"></div>

          {/* Color Blobs */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-echorya-100/40 dark:bg-echorya-900/10 rounded-full blur-[120px] animate-pulse-slow mix-blend-multiply dark:mix-blend-screen"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-100/40 dark:bg-teal-900/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-transparent ${scrolled ? 'bg-white/80 dark:bg-[#050608]/80 backdrop-blur-xl border-slate-200 dark:border-white/5 py-4' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center w-full">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
              <CyberpunkLogo size={36} />
              <div className="flex flex-col">
                <span className="text-xl font-serif font-bold tracking-tight text-slate-800 dark:text-white group-hover:text-echorya-600 dark:group-hover:text-echorya-400 transition-colors drop-shadow-lg">Echorya</span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500 hidden md:block">Tales of Echo</span>
              </div>
            </div>
            
            <div className="hidden md:flex gap-10 text-sm font-medium text-slate-500 dark:text-slate-400">
              <button className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-default tracking-wide uppercase text-xs">Engine</button>
              <button className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-default tracking-wide uppercase text-xs">Research</button>
              <button className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-default tracking-wide uppercase text-xs">Solutions</button>
            </div>

            <div className="flex items-center gap-6">
                <button 
                  onClick={toggleTheme}
                  className="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                >
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </button>
                <button onClick={() => navigate('/login')} className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Sign In</button>
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-slate-900 dark:bg-white text-white dark:text-black px-6 py-2 rounded-full font-bold hover:bg-slate-800 dark:hover:bg-echorya-50 transition-all shadow-lg hover:scale-105 active:scale-95 border border-transparent hover:border-echorya-300 text-[10px] tracking-widest uppercase"
                >
                  Enter Engine
                </button>
            </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 max-w-7xl mx-auto w-full text-center pt-24 z-10">
        
        <div className="animate-fadeInUp relative z-10 mb-12">
           {/* Breathing Badge */}
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-echorya-600 dark:text-echorya-300 mb-8 backdrop-blur-md animate-float shadow-lg hover:border-echorya-500/30 transition-colors cursor-default">
             <Sparkles size={12} className="text-echorya-500 dark:text-echorya-400 animate-pulse" />
             <span className="tracking-[0.2em] uppercase text-[9px] font-bold">Echorya Engine v1.0</span>
           </div>
           
           {/* Big Title */}
           <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-medium text-slate-900 dark:text-white tracking-tight mb-8 leading-[0.9] drop-shadow-2xl">
             The Harmonic <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-echorya-600 via-echorya-400 to-echorya-600 dark:from-echorya-100 dark:via-echorya-400 dark:to-echorya-100 bg-[length:200%_auto] animate-text-shimmer inline-block pb-2">Intelligence.</span>
           </h1>
           
           <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-light leading-relaxed animate-fadeIn mix-blend-multiply dark:mix-blend-screen" style={{ animationDelay: '0.4s' }}>
             Echorya — The world’s first comprehensive AI for music. <br className="hidden md:block" />
             It interprets audio like a trained musician, understanding harmony, structure, and timbre at a semantic level.
           </p>
        </div>

        {/* Hero Input Box with Breathing Glow */}
        <div className="w-full max-w-3xl relative z-20 animate-fadeInUp group" style={{ animationDelay: '0.6s' }}>
            {/* The "Breathing" Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-echorya-500/20 via-teal-400/20 to-echorya-500/20 rounded-2xl animate-glow-pulse blur-xl opacity-50 dark:opacity-100"></div>
            
            <div className="relative bg-white/80 dark:bg-[#0A0B10]/80 backdrop-blur-xl rounded-2xl p-2 border border-slate-200 dark:border-white/10 shadow-2xl transition-all duration-500 hover:border-echorya-500/30 hover:shadow-[0_0_40px_rgba(20,184,166,0.1)]">
                <form onSubmit={handleSubmit}>
                    <div className="relative">
                      <textarea
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Start your idea here..."
                          className="w-full min-h-[140px] p-6 text-2xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 bg-transparent outline-none resize-none font-serif leading-relaxed"
                      />
                      
                      {/* Suggestion Prompts - Interactive */}
                      {!inputValue && (
                        <div className="absolute top-28 left-6 flex gap-3 overflow-x-auto max-w-[90%] pb-2 no-scrollbar opacity-60 hover:opacity-100 transition-opacity">
                            <span 
                              onClick={() => setInputValue("Analyze the chord progression of this file")} 
                              className="px-4 py-1.5 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-200 dark:hover:bg-white/10 whitespace-nowrap border border-slate-200 dark:border-white/5 transition-transform hover:scale-105"
                            >
                              Analyze chords
                            </span>
                            <span 
                              onClick={() => setInputValue("Separate vocals from this track")} 
                              className="px-4 py-1.5 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-200 dark:hover:bg-white/10 whitespace-nowrap border border-slate-200 dark:border-white/5 transition-transform hover:scale-105"
                            >
                              Separate vocals
                            </span>
                            <span 
                              onClick={() => setInputValue("Generate a Lo-Fi beat at 85 BPM")} 
                              className="px-4 py-1.5 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider cursor-pointer hover:bg-slate-200 dark:hover:bg-white/10 whitespace-nowrap border border-slate-200 dark:border-white/5 transition-transform hover:scale-105"
                            >
                              Generate Lo-Fi
                            </span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center px-4 pb-3 mt-4 border-t border-slate-200 dark:border-white/5 pt-4">
                        <div className="flex items-center gap-3">
                           <button type="button" className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 dark:text-slate-500 hover:text-echorya-500 transition-colors">
                                <Mic2 size={20} />
                           </button>
                        </div>
                        <button 
                            type="submit"
                            disabled={!inputValue.trim()}
                            className={`flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-xs transition-all tracking-[0.1em] uppercase ${
                                inputValue.trim() 
                                    ? 'bg-echorya-600 text-white hover:bg-echorya-500 shadow-[0_0_20px_rgba(20,184,166,0.3)]' 
                                    : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                            }`}
                        >
                            <span>Begin Your Track</span>
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div className="mt-20 animate-bounce opacity-40 cursor-pointer hover:opacity-100 transition-opacity" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
           <ArrowDown size={24} className="text-echorya-600 dark:text-echorya-500" />
        </div>
      </section>

      {/* --- THE 4 PILLARS (Capability Modules) --- */}
      <section className="py-32 bg-slate-50 dark:bg-[#050608] relative z-10 transition-colors duration-500">
        <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6">
           <RevealSection>
             <div className="mb-20 text-center md:text-left">
               <h2 className="text-xs font-bold text-echorya-600 dark:text-echorya-500 uppercase tracking-[0.3em] mb-4 animate-pulse flex items-center justify-center md:justify-start gap-2">
                 <div className="w-8 h-px bg-echorya-600 dark:bg-echorya-500"></div> Echorya Engine
               </h2>
               <h3 className="text-4xl md:text-5xl font-serif text-slate-900 dark:text-white mb-6 drop-shadow-lg">Unified Audio Intelligence</h3>
               <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg font-light leading-relaxed">
                 We don't just stack tools. Echorya is a unified neural engine that understands the semantic language of music.
               </p>
             </div>
           </RevealSection>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pillars.map((pillar, i) => (
                <RevealSection key={i} delay={i * 100}>
                   <div 
                    onClick={() => { setInitialPrompt(pillar.title); navigate('/login'); }}
                    className="h-full p-8 rounded-2xl bg-white dark:bg-[#0A0B10] border border-slate-200 dark:border-white/5 hover:border-echorya-500/40 transition-all duration-500 group cursor-pointer hover:bg-slate-50 dark:hover:bg-[#0E1016] hover:-translate-y-2 relative overflow-hidden synth-pad-glow shadow-lg dark:shadow-none"
                   >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-echorya-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="w-14 h-14 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-echorya-600 dark:text-echorya-400 mb-8 group-hover:scale-110 transition-transform group-hover:bg-echorya-50 dark:group-hover:bg-echorya-900/20 group-hover:shadow-[0_0_20px_rgba(20,184,166,0.2)] border border-slate-200 dark:border-white/5 group-hover:border-echorya-200 dark:group-hover:border-echorya-500/30">
                        <pillar.icon size={28} strokeWidth={1.5} />
                      </div>
                      
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-echorya-700 dark:group-hover:text-echorya-300 transition-colors font-serif tracking-wide">{pillar.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-500 mb-8 leading-relaxed h-10">{pillar.desc}</p>
                      
                      <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-white/5">
                        {pillar.features.map((feature, idx) => (
                          <div key={idx} className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-600 flex items-center gap-2 group-hover:text-slate-700 dark:group-hover:text-slate-400 transition-colors">
                             <div className="w-1 h-1 rounded-full bg-echorya-600 dark:bg-echorya-600 group-hover:bg-echorya-400 transition-colors"></div>
                             {feature}
                          </div>
                        ))}
                      </div>
                   </div>
                </RevealSection>
              ))}
           </div>
        </div>
      </section>

      {/* --- CULTURAL NARRATIVE SECTION --- */}
      <section className="py-32 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50 dark:from-[#050608] dark:via-echorya-900/5 dark:to-[#050608] transition-colors duration-500"></div>
         <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-20">
            <div className="md:w-1/2">
               <RevealSection>
                  <div className="flex items-center gap-3 mb-6">
                     <span className="w-8 h-px bg-echorya-600 dark:bg-echorya-500"></span>
                     <span className="text-echorya-600 dark:text-echorya-400 text-xs font-bold uppercase tracking-[0.2em]">Universal Notation System</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-serif text-slate-900 dark:text-white mb-8 leading-tight drop-shadow-xl">
                    Bridging Eastern & <br/> Western Theory.
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 leading-relaxed font-light">
                    Music is a universal language, but notation isn't. Echorya is the only engine capable of real-time, bidirectional translation between standard staff notation, numbered musical notation (Jianpu), and MIDI data.
                  </p>
                  <button 
                    onClick={() => navigate('/login')}
                    className="group flex items-center gap-3 text-slate-900 dark:text-white font-bold hover:text-echorya-600 dark:hover:text-echorya-400 transition-colors uppercase text-xs tracking-widest"
                  >
                    <span className="border-b border-slate-300 dark:border-white/20 pb-1 group-hover:border-echorya-400 transition-all">Explore Conversion Tools</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
               </RevealSection>
            </div>
            
            <div className="md:w-1/2">
               <RevealSection delay={200}>
                  <div className="relative rounded-2xl bg-white dark:bg-[#0F1116] border border-slate-200 dark:border-white/10 p-2 shadow-2xl hover:shadow-echorya-900/20 transition-shadow duration-500 synth-pad-glow">
                     <div className="bg-slate-50 dark:bg-[#050608] rounded-xl overflow-hidden aspect-video flex items-center justify-center relative group isolate">
                        {/* Static Staff Background - More apparent for the animation */}
                        <div className="absolute inset-0 staff-pattern opacity-10 dark:opacity-30 text-slate-900 dark:text-white"></div>
                        
                        {/* Scanning Line - The "AI" reading the music */}
                        <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gradient-to-b from-transparent via-echorya-500 to-transparent z-30 shadow-[0_0_15px_rgba(20,184,166,0.8)] opacity-80"></div>

                        {/* Flowing Musical Notes Animation */}
                        <div className="absolute inset-0 z-10 overflow-hidden flex items-center">
                            {[...Array(20)].map((_, i) => {
                                const randomDelay = Math.random() * 5;
                                const randomTop = 20 + Math.random() * 60;
                                const randomSymbol = notes[Math.floor(Math.random() * notes.length)];
                                const isNumber = ['1', '3', '5', '6', 'i'].includes(randomSymbol);
                                
                                return (
                                    <div 
                                        key={i}
                                        className={`absolute text-xl md:text-2xl font-serif select-none animate-score-flow whitespace-nowrap ${isNumber ? 'text-slate-900 dark:text-white font-bold' : 'text-echorya-600 dark:text-echorya-400'}`}
                                        style={{
                                            top: `${randomTop}%`,
                                            left: '100%',
                                            animationDelay: `${randomDelay}s`,
                                            opacity: 0,
                                            textShadow: isNumber ? '0 0 10px rgba(255,255,255,0.5)' : '0 0 10px rgba(20,184,166,0.5)'
                                        }}
                                    >
                                        {randomSymbol}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center z-40 bg-white/10 dark:bg-black/10 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                           <div className="w-20 h-20 rounded-full bg-white/80 dark:bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/20 hover:scale-110 transition-transform cursor-pointer shadow-lg shadow-black/10 dark:shadow-black/40 hover:bg-white/90 dark:hover:bg-white/10">
                              <Play size={28} className="text-echorya-700 dark:text-white fill-current ml-1 drop-shadow-lg" />
                           </div>
                        </div>
                     </div>
                  </div>
               </RevealSection>
            </div>
         </div>
      </section>

      {/* --- EMOTIONAL CTA SECTION --- */}
      <section className="py-32 px-6 text-center relative">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-echorya-100/50 via-teal-100/30 to-slate-100/50 dark:from-echorya-600/10 dark:to-teal-900/10 rounded-full blur-[120px] pointer-events-none"></div>
         <div className="max-w-4xl mx-auto relative z-10">
            <RevealSection>
               <Music4 size={48} className="text-echorya-600 dark:text-echorya-500 mx-auto mb-8 opacity-80 animate-float" strokeWidth={1} />
               <h2 className="text-5xl md:text-7xl font-serif text-slate-900 dark:text-white mb-8 tracking-tight drop-shadow-2xl">
                 Start Music Journey <br/> with Echorya.
               </h2>
               <p className="text-xl text-slate-600 dark:text-slate-500 mb-12 max-w-2xl mx-auto font-light">
                 Join a new generation of composers and producers using semantic AI to push the boundaries of sound.
               </p>
               <button 
                 onClick={() => navigate('/login')}
                 className="bg-echorya-600 text-white px-12 py-5 rounded-full font-bold text-sm hover:bg-echorya-500 transition-all shadow-[0_0_30px_rgba(20,184,166,0.3)] hover:scale-105 hover:shadow-[0_0_50px_rgba(20,184,166,0.5)] tracking-[0.2em] uppercase border border-white/10"
               >
                 Begin Your Track
               </button>
            </RevealSection>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#050608] relative z-10 transition-colors duration-500">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
               <CyberpunkLogo size={28} />
               <div className="flex flex-col">
                  <span className="font-bold text-slate-800 dark:text-slate-200 tracking-wide font-serif">Echorya</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest">Tales of Echo</span>
               </div>
            </div>
            <div className="flex gap-8 text-xs text-slate-500 font-bold uppercase tracking-widest">
              <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Engine Status</a>
              <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms</a>
            </div>
            <p className="text-slate-400 dark:text-slate-600 text-[10px] font-mono tracking-wider">&copy; 2024 Tales of Echo AI.</p>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;