import React, { useState } from 'react';
import { 
  Music, 
  FileAudio, 
  FileMusic, 
  Search, 
  Filter, 
  Clock, 
  HardDrive, 
  MoreVertical, 
  Play, 
  Pause, 
  Download, 
  Cloud, 
  Trash2,
  Share2,
  Mic2,
  Piano,
  Layers,
  Disc
} from 'lucide-react';

interface LibraryItem {
  id: string;
  name: string;
  type: 'audio' | 'midi' | 'stem' | 'project';
  format: string;
  size: string;
  duration?: string;
  bpm?: number;
  key?: string;
  date: string;
  tags: string[];
}

// Mock Data for the Library
const MOCK_LIBRARY: LibraryItem[] = [
  { id: '1', name: 'Neon Tokyo - Main Vocal', type: 'audio', format: 'WAV', size: '24.5 MB', duration: '03:42', bpm: 128, key: 'Am', date: '2 hrs ago', tags: ['Vocal', 'Raw'] },
  { id: '2', name: 'Cyberpunk Bass Loop', type: 'midi', format: 'MID', size: '4 KB', duration: '00:16', bpm: 128, key: 'Am', date: '5 hrs ago', tags: ['Bass', 'Synth'] },
  { id: '3', name: 'Ethereal Pad Texture', type: 'audio', format: 'MP3', size: '8.2 MB', duration: '02:10', date: '1 day ago', tags: ['Atmosphere', 'Pad'] },
  { id: '4', name: 'Project Alpha - Master', type: 'project', format: 'ZIP', size: '145 MB', date: '2 days ago', tags: ['Release', 'Final'] },
  { id: '5', name: 'Glitch Drums', type: 'stem', format: 'STEM', size: '45 MB', duration: '03:42', bpm: 128, date: '3 days ago', tags: ['Drums', 'Processed'] },
  { id: '6', name: 'Acoustic Guitar Riff', type: 'audio', format: 'WAV', size: '12 MB', duration: '00:45', bpm: 95, key: 'G', date: '1 week ago', tags: ['Guitar', 'Loop'] },
  { id: '7', name: 'Analog Synth Lead', type: 'audio', format: 'WAV', size: '18 MB', duration: '01:20', key: 'Cm', date: '1 week ago', tags: ['Synth', 'Lead'] },
  { id: '8', name: 'Orchestral Swell', type: 'stem', format: 'STEM', size: '32 MB', duration: '00:30', date: '2 weeks ago', tags: ['Strings', 'Cinematic'] },
];

const LibraryView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'audio' | 'midi' | 'stems'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const togglePlay = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
  };

  const filteredItems = MOCK_LIBRARY.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = 
      activeTab === 'all' ? true :
      activeTab === 'audio' ? item.type === 'audio' :
      activeTab === 'midi' ? item.type === 'midi' :
      activeTab === 'stems' ? item.type === 'stem' : true;
    return matchesSearch && matchesTab;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'audio': return <FileAudio size={20} className="text-teal-500" />;
      case 'midi': return <Piano size={20} className="text-pink-500" />;
      case 'stem': return <Layers size={20} className="text-purple-500" />;
      case 'project': return <Disc size={20} className="text-amber-500" />;
      default: return <FileMusic size={20} className="text-slate-500" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#050608] overflow-hidden animate-fadeIn">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] staff-pattern"></div>
      
      {/* Header */}
      <div className="px-8 py-8 flex flex-col gap-6 relative z-10">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-800 dark:text-white mb-2 tracking-tight">Asset Library</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-light">
              Manage your generated stems, compositions, and uploaded samples.
            </p>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#12141A] rounded-lg border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-500">
                <HardDrive size={14} />
                <span>1.2 GB / 5.0 GB</span>
             </div>
          </div>
        </div>

        {/* Upload Zone */}
        <div className="w-full h-32 border-2 border-dashed border-slate-300 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-600 hover:border-echorya-500/50 hover:bg-echorya-50 dark:hover:bg-echorya-900/10 transition-all cursor-pointer group">
           <Cloud size={32} className="text-slate-300 dark:text-slate-700 group-hover:text-echorya-500 transition-colors" />
           <span className="text-xs uppercase tracking-widest font-bold">Drop Audio / MIDI to Analyze</span>
           <span className="text-[10px] opacity-60">Supports WAV, MP3, MIDI, MusicXML</span>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/50 dark:bg-[#0A0B10]/50 backdrop-blur-sm p-2 rounded-xl border border-slate-200 dark:border-white/5">
          {/* Tabs */}
          <div className="flex p-1 bg-slate-200 dark:bg-white/5 rounded-lg">
            {(['all', 'audio', 'midi', 'stems'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab 
                    ? 'bg-white dark:bg-[#12141A] text-echorya-600 dark:text-echorya-400 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-echorya-500 transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Search assets..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#12141A] border border-slate-200 dark:border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs outline-none focus:border-echorya-500/50 transition-all text-slate-700 dark:text-slate-200"
            />
          </div>
        </div>
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-y-auto px-8 pb-10 custom-scrollbar relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className={`group relative bg-white dark:bg-[#0E1014] border rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
                playingId === item.id 
                  ? 'border-echorya-500/50 shadow-[0_0_15px_rgba(20,184,166,0.15)]' 
                  : 'border-slate-200 dark:border-white/5 hover:border-echorya-500/30'
              }`}
            >
              {/* Playing Progress Bar (Fake) */}
              {playingId === item.id && (
                <div className="absolute bottom-0 left-0 h-1 bg-echorya-500/20 w-full rounded-b-xl overflow-hidden">
                   <div className="h-full bg-echorya-500 animate-[progress_10s_linear_infinite] w-full origin-left"></div>
                </div>
              )}

              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    onClick={() => togglePlay(item.id)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                      playingId === item.id 
                        ? 'bg-echorya-500 text-white' 
                        : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-white/10 group-hover:text-slate-800 dark:group-hover:text-white'
                    }`}
                  >
                     {playingId === item.id ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate max-w-[150px]">{item.name}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-wider font-mono mt-0.5">
                       <span>{item.format}</span>
                       <span>•</span>
                       <span>{item.size}</span>
                    </div>
                  </div>
                </div>
                
                <button className="text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>

              {/* Waveform Visualization (CSS only) */}
              <div className="h-8 flex items-end gap-1 mb-4 opacity-30 group-hover:opacity-60 transition-opacity">
                 {Array.from({ length: 20 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`flex-1 rounded-full ${playingId === item.id ? 'bg-echorya-500 animate-equalizer' : 'bg-slate-800 dark:bg-white'}`}
                      style={{ 
                        height: `${Math.random() * 80 + 20}%`,
                        animationDelay: `${i * 0.05}s`
                      }}
                    ></div>
                 ))}
              </div>

              {/* Footer Metadata */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                 <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {(item.bpm || item.key) && (
                      <div className="flex items-center gap-2">
                        {item.bpm && <span className="text-echorya-600 dark:text-echorya-400">{item.bpm} BPM</span>}
                        {item.key && <span>{item.key}</span>}
                      </div>
                    )}
                    {!item.bpm && !item.key && <span>{item.duration}</span>}
                 </div>
                 
                 <div className="flex gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors" title="Delete">
                       <Trash2 size={14} />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-echorya-500 dark:hover:text-echorya-400 transition-colors" title="Share">
                       <Share2 size={14} />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-echorya-500 dark:hover:text-echorya-400 transition-colors" title="Download">
                       <Download size={14} />
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LibraryView;