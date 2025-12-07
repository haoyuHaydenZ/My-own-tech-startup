import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, Volume2, VolumeX, MoreVertical, Disc, Music, Share2 } from 'lucide-react';

interface MusicData {
  type: string;
  key: string;
  value: string[];
  metadata?: {
    style?: string;
    source_tool?: string;
    song_id?: string;
    [key: string]: any;
  };
}

interface MusicPlayerBlockProps {
  data: MusicData;
}

const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const MusicPlayerBlock: React.FC<MusicPlayerBlockProps> = ({ data }) => {
  const tracks = data.value;
  const style = data.metadata?.style || "Generated Audio";
  
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    // Reset state when track changes
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    // Auto play when switching tracks if it was playing? Optional. 
    // Let's keep it manual for better UX or auto if user explicitly clicked a track.
  }, [currentTrackIndex]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !audioRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div className="w-full max-w-xl my-4 animate-fadeInUp">
      {/* Main Card Container with Glassmorphism and Glow */}
      <div className="relative group rounded-2xl overflow-hidden bg-[#0E1014] border border-slate-800/60 shadow-2xl shadow-black/40">
        
        {/* Animated Background Gradient */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-echorya-600 via-teal-400 to-echorya-600 opacity-80"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

        {/* Header Info */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-white/5 relative z-10">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-echorya-900 to-slate-900 flex items-center justify-center border border-white/10 shadow-inner">
                <Music size={14} className="text-echorya-400" />
             </div>
             <div>
               <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Echorya Audio Engine</h3>
               <div className="flex items-center gap-2">
                 <span className="text-[10px] text-echorya-500 font-mono">Style: {style}</span>
                 <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                 <span className="text-[10px] text-slate-500">{tracks.length} Variations</span>
               </div>
             </div>
          </div>
          <div className="flex gap-2">
             <button className="p-1.5 text-slate-500 hover:text-white transition-colors"><Share2 size={14} /></button>
             <button className="p-1.5 text-slate-500 hover:text-white transition-colors"><MoreVertical size={14} /></button>
          </div>
        </div>

        {/* Player Visualization Area */}
        <div className="px-6 py-6 relative z-10">
          <div className="flex items-center justify-between mb-6">
             {/* Spinning Disc Animation */}
             <div className={`relative w-16 h-16 rounded-full border-2 border-slate-800 flex items-center justify-center shadow-xl bg-black ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
                <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent,rgba(20,184,166,0.2),transparent)]"></div>
                <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                   <div className="w-2 h-2 rounded-full bg-echorya-500/50"></div>
                </div>
                {/* Glow effect when playing */}
                {isPlaying && <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(20,184,166,0.3)] animate-pulse"></div>}
             </div>

             {/* Dynamic Waveform (CSS Simulated) */}
             <div className="flex-1 ml-6 h-12 flex items-center gap-1 opacity-80 mask-image-linear-to-r">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-full transition-all duration-300 ${
                        isPlaying 
                        ? 'bg-gradient-to-t from-echorya-600 to-teal-300 animate-equalizer' 
                        : 'bg-slate-800'
                    }`}
                    style={{ 
                      height: isPlaying ? `${Math.max(20, Math.random() * 100)}%` : '20%',
                      animationDelay: `-${Math.random()}s`
                    }}
                  ></div>
                ))}
             </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-2 group">
            <div 
                ref={progressBarRef}
                className="h-1.5 w-full bg-slate-800 rounded-full cursor-pointer relative overflow-hidden"
                onClick={handleProgressClick}
            >
                <div 
                    className="h-full bg-gradient-to-r from-echorya-600 to-teal-400 relative"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] scale-0 group-hover:scale-100 transition-transform"></div>
                </div>
            </div>
            <div className="flex justify-between mt-1.5 text-[10px] font-mono text-slate-500">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-4">
             {/* Volume Control */}
             <div className="flex items-center gap-2 group">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <div className="w-0 overflow-hidden group-hover:w-20 transition-all duration-300">
                   <input 
                     type="range" 
                     min="0" 
                     max="1" 
                     step="0.01" 
                     value={isMuted ? 0 : volume}
                     onChange={(e) => {
                       setVolume(parseFloat(e.target.value));
                       setIsMuted(false);
                     }}
                     className="w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                   />
                </div>
             </div>

             {/* Play/Pause Main Control */}
             <div className="absolute left-1/2 -translate-x-1/2 top-auto">
                <button 
                    onClick={togglePlay}
                    className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(20,184,166,0.4)]"
                >
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                </button>
             </div>

             {/* Download */}
             <a 
               href={tracks[currentTrackIndex]} 
               download 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-slate-400 hover:text-echorya-400 transition-colors flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5"
             >
                <span>MP3</span>
                <Download size={14} />
             </a>
          </div>
        </div>

        {/* Track List */}
        <div className="bg-[#050608]/50 border-t border-white/5 max-h-40 overflow-y-auto custom-scrollbar">
           {tracks.map((url, idx) => (
             <div 
               key={idx}
               onClick={() => setCurrentTrackIndex(idx)}
               className={`px-5 py-3 flex items-center justify-between cursor-pointer transition-colors border-b border-white/5 last:border-0 ${
                 currentTrackIndex === idx 
                   ? 'bg-white/5 text-echorya-400' 
                   : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
               }`}
             >
                <div className="flex items-center gap-3">
                   <span className="text-[10px] font-mono opacity-50">{(idx + 1).toString().padStart(2, '0')}</span>
                   <span className="text-xs font-medium">
                      Track Version {idx + 1}
                   </span>
                   {currentTrackIndex === idx && isPlaying && (
                      <div className="flex gap-0.5 items-end h-3 ml-2">
                        <div className="w-0.5 bg-echorya-500 animate-[equalizer_0.5s_infinite] h-2"></div>
                        <div className="w-0.5 bg-echorya-500 animate-[equalizer_0.5s_infinite_0.1s] h-3"></div>
                        <div className="w-0.5 bg-echorya-500 animate-[equalizer_0.5s_infinite_0.2s] h-1"></div>
                      </div>
                   )}
                </div>
                {currentTrackIndex === idx && <div className="text-[10px] uppercase tracking-wider font-bold">Playing</div>}
             </div>
           ))}
        </div>

        {/* Hidden Audio Element */}
        <audio
            ref={audioRef}
            src={tracks[currentTrackIndex]}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
        />
      </div>
    </div>
  );
};

export default MusicPlayerBlock;
