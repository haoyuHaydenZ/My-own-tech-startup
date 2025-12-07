import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

interface AudioVisualizerProps {
  isGenerating: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isGenerating }) => {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);

  const logs = [
    "Initializing neural engine...",
    "Analyzing spectral footprint...",
    "Deconstructing audio stems...",
    "Synthesizing harmonics...",
    "Refining spatial audio...",
    "Rendering waveform...",
    "Finalizing output..."
  ];

  useEffect(() => {
    if (!isGenerating) {
      setProgress(0);
      setLogIndex(0);
      return;
    }

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 98) return 98; // Hold at 98% until done
        // Randomized increment for natural feel
        const increment = Math.random() * 1.5 + 0.2;
        return Math.min(prev + increment, 98);
      });
    }, 50);

    // Cycle through logs
    const logInterval = setInterval(() => {
      setLogIndex(prev => (prev + 1) % logs.length);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(logInterval);
    };
  }, [isGenerating]);

  if (!isGenerating) return null;

  return (
    <div className="w-full max-w-2xl mx-auto my-8 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-2xl shadow-emerald-500/10 animate-fadeIn relative font-mono">
      {/* Top Bar: Controls decoration */}
      <div className="bg-slate-950 px-4 py-2 flex items-center justify-between border-b border-slate-800">
         <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
               <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
            </div>
            <span className="text-[10px] text-slate-500 ml-2 uppercase tracking-widest">Processing Node: ALPHA-01</span>
         </div>
         <div className="text-emerald-500 animate-pulse flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider">
            <span>Live</span>
            <Activity size={14} />
         </div>
      </div>

      <div className="p-6 relative">
         {/* Background Grid */}
         <div className="absolute inset-0 opacity-10 pointer-events-none" 
              style={{ 
                  backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', 
                  backgroundSize: '20px 20px' 
              }}>
         </div>

         {/* Visualizer Area */}
         <div className="flex items-center justify-center mb-8 relative z-10 h-24 bg-slate-950/50 rounded-lg border border-slate-800/50 backdrop-blur-sm overflow-hidden px-4">
            {/* Animated Bars */}
            <div className="flex items-end justify-center gap-1.5 h-16 w-full opacity-90">
               {Array.from({ length: 24 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="w-1.5 bg-gradient-to-t from-emerald-600 via-emerald-400 to-cyan-300 rounded-t-sm"
                    style={{ 
                        height: '20%',
                        animation: `equalizer ${0.5 + Math.random() * 0.5}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 0.5}s`
                    }}
                  ></div>
               ))}
            </div>
         </div>

         {/* Terminal Log */}
         <div className="space-y-1 mb-6 relative z-10 h-14 flex flex-col justify-end">
            <div className="text-slate-600 opacity-60 flex items-center gap-2 text-xs">
               <span>&gt;</span> {logs[(logIndex - 1 + logs.length) % logs.length]}
            </div>
            <div className="text-emerald-400 font-bold flex items-center gap-2 text-sm shadow-emerald-500/20 drop-shadow-sm">
               <span>&gt;</span> {logs[logIndex]} <span className="animate-pulse w-2 h-4 bg-emerald-500 block"></span>
            </div>
         </div>

         {/* Progress Bar */}
         <div className="relative z-10">
            <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-wider">
               <span>Processing Task</span>
               <span className="text-emerald-500">{Math.floor(progress)}%</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
               <div 
                 className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-cyan-400 relative transition-all duration-200 ease-out"
                 style={{ width: `${progress}%` }}
               >
                  {/* Glitch/Shine effect on bar */}
                  <div className="absolute inset-0 bg-white/30 animate-[glitch_2s_infinite] opacity-50"></div>
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]"></div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AudioVisualizer;