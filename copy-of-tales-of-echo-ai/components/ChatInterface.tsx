import React, { useState, useEffect, useRef } from 'react';
import { 
    Send, 
    Paperclip, 
    ArrowUp, 
    Plus, 
    Mic2,
    Sliders,
    Layers,
    FileAudio,
    FileMusic,
    Radio,
    Piano,
    Activity,
    Settings,
    Disc,
    Shuffle,
    Palette,
    Waves,
    Zap,
    Music,
    FileType
} from 'lucide-react';
import Sidebar from './Sidebar';
import LibraryView from './LibraryView';
import MusicPlayerBlock from './MusicPlayerBlock';
import { ChatSession, Message } from '../types';
import { generateResponse } from '../services/geminiService';
import AudioVisualizer from './AudioVisualizer';
import { CyberpunkMic } from './CyberpunkMic';
import { CyberpunkLogo } from './CyberpunkLogo';

type LanguageCode = 'en' | 'zh' | 'es' | 'fr' | 'pt';

const translations = {
  en: {
    heroTitle: "Echorya Engine",
    heroSubtitle: "Semantic Audio Intelligence & Production",
    placeholder: "Conduct the engine...",
    generateBtn: "Run Engine",
    studioTools: "Engine Capabilities",
    betaBadge: "v1.0",
    features: {
      stems: { label: "Split Stems", desc: "ISOLATE VOCALS/INSTRUMENTS" },
      chords: { label: "Analyze Chords", desc: "GET HARMONY DATA" },
      analysis: { label: "Music Analysis", desc: "STRUCTURE & KEY" },
      vocals: { label: "Separate Vocals", desc: "VOICE EXTRACTION" },
      mp3: { label: "To MP3", desc: "FORMAT CONVERSION" },
      wav: { label: "To WAV", desc: "LOSSLESS CONVERSION" },
      lyrics: { label: "Lyrics", desc: "GENERATE TEXT" },
      musicFromLyrics: { label: "Music Gen", desc: "FROM LYRICS" },
      midi: { label: "To MIDI", desc: "AUDIO TRANSCRIPTION" },
      jianpu: { label: "To Jianpu", desc: "NOTATION CONVERT" },
      sheetJianpu: { label: "Sheet Scan", desc: "SCORE TO JIANPU" },
      prod: { label: "Production", desc: "FULL TRACK GEN" },
      remix: { label: "Remix Workflow", desc: "CREATIVE RE-IMAGINING" },
      style: { label: "Style Analysis", desc: "GENRE & MOOD ID" },
    }
  },
  zh: {
    heroTitle: "Echorya 引擎",
    heroSubtitle: "语义音频智能与制作",
    placeholder: "指挥引擎...",
    generateBtn: "运行引擎",
    studioTools: "引擎核心能力",
    betaBadge: "v1.0",
    features: {
      stems: { label: "音频分轨", desc: "分离人声与乐器" },
      chords: { label: "和弦分析", desc: "获取和声数据" },
      analysis: { label: "音乐分析", desc: "结构与调性" },
      vocals: { label: "人声分离", desc: "单独提取人声" },
      mp3: { label: "转 MP3", desc: "格式转换" },
      wav: { label: "转 WAV", desc: "无损转换" },
      lyrics: { label: "歌词生成", desc: "AI 辅助写作" },
      musicFromLyrics: { label: "歌词生曲", desc: "从文本到音乐" },
      midi: { label: "转 MIDI", desc: "音频转写" },
      jianpu: { label: "转简谱", desc: "记谱转换" },
      sheetJianpu: { label: "乐谱扫描", desc: "五线谱转简谱" },
      prod: { label: "全曲制作", desc: "完整曲目生成" },
      remix: { label: "混音工作流", desc: "创意重构" },
      style: { label: "风格分析", desc: "流派与情绪" },
    }
  },
  // ... other languages
};

// Helper function to detect and parse the specific "asset" text format
const parseAssetData = (text: string) => {
  if (!text || typeof text !== 'string') return null;
  const trimmed = text.trim();
  
  if (trimmed.startsWith("{'type': 'asset'") || trimmed.startsWith("{'type': 'asset'")) {
    try {
      let jsonStr = trimmed
        .replace(/'/g, '"')
        .replace(/True/g, 'true')
        .replace(/False/g, 'false')
        .replace(/None/g, 'null');
        
      const data = JSON.parse(jsonStr);
      
      if (data.type === 'asset' && data.key === 'mp3_urls' && Array.isArray(data.value)) {
        return data;
      }
    } catch (e) {
      console.warn("Failed to parse asset data strictly, trying regex fallback");
      try {
         const styleMatch = trimmed.match(/'style':\s*'([^']+)'/);
         const style = styleMatch ? styleMatch[1] : 'Unknown';
         const urlMatches = trimmed.matchAll(/https?:\/\/[^']+\.mp3/g);
         const urls = Array.from(urlMatches, m => m[0]);
         if (urls.length > 0) {
            return {
               type: 'asset',
               key: 'mp3_urls',
               value: urls,
               metadata: { style }
            };
         }
      } catch (e2) {
         return null;
      }
    }
  }
  return null;
};

// Helper for unique IDs
const generateId = () => Date.now().toString() + Math.random().toString(36).substring(2, 9);

interface ChatInterfaceProps {
  initialPrompt: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialPrompt }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // View State Management
  const [currentView, setCurrentView] = useState<'chat' | 'library'>('chat');
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>("en");
  
  const t = translations[currentLanguage] || translations['en'];

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize with one session if empty
  useEffect(() => {
    if (sessions.length === 0) {
      const newSession: ChatSession = {
        id: generateId(),
        title: "New Session",
        messages: [],
        createdAt: Date.now()
      };
      setSessions([newSession]);
      setCurrentSessionId(newSession.id);
    } else if (currentSessionId && !sessions.find(s => s.id === currentSessionId)) {
      // If current session was deleted, switch to the last available one
      setCurrentSessionId(sessions[sessions.length - 1].id);
    }
  }, [sessions, currentSessionId]);

  useEffect(() => {
    if (initialPrompt) {
      setTimeout(() => {
        setInput(initialPrompt);
      }, 100);
    }
  }, [initialPrompt]); 

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [sessions, currentSessionId, currentView]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: generateId(),
      title: "New Session",
      messages: [],
      createdAt: Date.now()
    };
    setSessions(prev => [...prev, newSession]);
    setCurrentSessionId(newSession.id);
    setInput("");
  };

  const handleGoHome = () => {
    setCurrentView('chat');
    
    // 1. If currently on an empty session, just reset input (already home)
    const currentSession = sessions.find(s => s.id === currentSessionId);
    if (currentSession && currentSession.messages.length === 0) {
        setInput("");
        return;
    }

    // 2. Find any other empty session to reuse (prefer the latest one)
    const emptySession = [...sessions].reverse().find(s => s.messages.length === 0);
    
    if (emptySession) {
        setCurrentSessionId(emptySession.id);
        setInput("");
    } else {
        // 3. No empty session exists, create one
        createNewSession();
    }
  };

  const updateSessionMessages = (sessionId: string, newMessages: Message[]) => {
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        let title = s.title;
        if (s.title === "New Session" && newMessages.length > 0) {
           title = newMessages[0].text.slice(0, 25) + (newMessages[0].text.length > 25 ? "..." : "");
        }
        return { ...s, messages: newMessages, title };
      }
      return s;
    }));
  };

  const handleRenameSession = (id: string, newTitle: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
  };

  const handleDeleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    // The useEffect hook will handle creating a new session if list becomes empty,
    // or switching to a valid session ID if the current one was deleted.
  };

  const handleSend = async () => {
    if (!input.trim() || !currentSessionId) return;

    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    const currentSession = sessions.find(s => s.id === currentSessionId);
    if (!currentSession) return;

    const updatedMessages = [...currentSession.messages, userMsg];
    updateSessionMessages(currentSessionId, updatedMessages);
    setInput("");
    setIsGenerating(true);

    const history = currentSession.messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    try {
      const [responseText] = await Promise.all([
        generateResponse(userMsg.text, history),
        new Promise(resolve => setTimeout(resolve, 3000))
      ]);

      const modelMsg: Message = {
        id: generateId(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };

      updateSessionMessages(currentSessionId, [...updatedMessages, modelMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = currentLanguage === 'zh' ? 'zh-CN' : 'en-US'; 
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      setInput(prev => (prev ? prev + ' ' : '') + speechResult);
    };
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

  const isDashboard = messages.length === 0;

  const features = [
    { icon: Layers, key: 'stems' },
    { icon: Music, key: 'chords' },
    { icon: Activity, key: 'analysis' },
    { icon: Mic2, key: 'vocals' },
    { icon: FileAudio, key: 'mp3' },
    { icon: FileType, key: 'wav' },
    { icon: Settings, key: 'lyrics' },
    { icon: Radio, key: 'musicFromLyrics' },
    { icon: Piano, key: 'midi' },
    { icon: Sliders, key: 'jianpu' },
    { icon: FileMusic, key: 'sheetJianpu' },
    { icon: Disc, key: 'prod' },
    { icon: Shuffle, key: 'remix' },
    { icon: Palette, key: 'style' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#050608] overflow-hidden font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Sidebar 
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={setCurrentSessionId}
        onNewSession={createNewSession}
        onRenameSession={handleRenameSession}
        onDeleteSession={handleDeleteSession}
        projects={[]}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        onGoHome={handleGoHome}
        currentView={currentView}
        onChangeView={setCurrentView}
      />
      
      <main className="flex-1 flex flex-col relative min-w-0 bg-slate-50 dark:bg-[#050608]">
        {currentView === 'library' ? (
           <LibraryView />
        ) : (
           <>
              {/* Cinematic Background Texture */}
              <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.03] staff-pattern pointer-events-none mix-blend-overlay dark:mix-blend-overlay text-slate-900 dark:text-white"></div>
              
              {/* Organic Floating Particles */}
              <div className="absolute top-10 right-20 w-1 h-1 bg-echorya-500 rounded-full animate-float blur-[1px] opacity-40 pointer-events-none"></div>
              <div className="absolute bottom-20 left-40 w-2 h-2 bg-teal-300 rounded-full animate-float-slow blur-[2px] opacity-20 pointer-events-none"></div>
              <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-slate-400 dark:bg-white rounded-full animate-pulse-slow opacity-30 pointer-events-none"></div>

              {/* Ambient Glows */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-echorya-200/20 dark:bg-echorya-900/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow mix-blend-multiply dark:mix-blend-screen"></div>
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-200/20 dark:bg-teal-900/10 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen"></div>
              
              {/* Header */}
              <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
                  <div className="flex items-center gap-3">
                      <CyberpunkLogo size={32} />
                      <div className="flex flex-col">
                        <div className="text-lg font-bold text-slate-800 dark:text-white tracking-wide font-serif drop-shadow-md">
                            Echorya
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/5 text-[10px] font-mono text-echorya-600 dark:text-echorya-400 tracking-widest uppercase">{t.betaBadge}</span>
                  </div>
              </header>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto px-4 scroll-smooth custom-scrollbar flex flex-col relative z-10">
                
                {isDashboard ? (
                  <div className="min-h-full flex flex-col items-center justify-center py-12 w-full max-w-7xl mx-auto">
                    
                    {/* Hero Text */}
                    <div className="text-center mb-10 animate-fadeIn relative">
                      <h1 
                        className="text-5xl md:text-7xl font-medium font-serif mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-echorya-600 via-echorya-400 to-echorya-600 dark:from-echorya-100 dark:via-echorya-300 dark:to-echorya-100 animate-text-shimmer bg-[length:200%_auto] drop-shadow-lg"
                      >
                        {t.heroTitle}
                      </h1>
                      <p className="text-slate-600 dark:text-slate-500 font-light text-xl tracking-wide animate-fadeInUp mix-blend-multiply dark:mix-blend-screen" style={{ animationDelay: '0.2s' }}>
                        {t.heroSubtitle}
                      </p>
                    </div>
                    
                    {/* Main Input Box */}
                    <div className="w-full max-w-3xl relative z-10 animate-fadeInUp shadow-2xl shadow-echorya-900/5 dark:shadow-echorya-900/10 rounded-2xl mb-12" style={{ animationDelay: '0.3s' }}>
                       <div className="absolute -inset-0.5 bg-gradient-to-r from-echorya-500/20 to-teal-500/20 rounded-2xl blur-lg opacity-40 dark:opacity-60 animate-breathing"></div>
                       <div className="relative bg-white/80 dark:bg-[#0A0B10]/90 backdrop-blur-xl rounded-2xl p-2 border border-slate-200 dark:border-white/10 group focus-within:border-echorya-500/50 transition-colors synth-pad-glow">
                          <textarea
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              onKeyDown={handleKeyDown}
                              placeholder={t.placeholder}
                              className="w-full min-h-[140px] p-6 text-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 bg-transparent outline-none resize-none font-serif leading-relaxed"
                          />
                          
                          <div className="flex justify-between items-center px-4 pb-2 mt-2 border-t border-slate-100 dark:border-white/5 pt-3">
                             <div className="flex items-center gap-2">
                                <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors" title="Upload Audio">
                                   <Plus size={18} />
                                </button>
                                
                                <button 
                                  className={`group p-2 rounded-lg transition-all border border-transparent ${
                                    isRecording 
                                      ? 'bg-echorya-50 dark:bg-echorya-900 border-echorya-500/30' 
                                      : 'hover:bg-slate-100 dark:hover:bg-white/5'
                                  }`} 
                                  onClick={handleMicClick}
                                  title="Voice Input"
                                >
                                   <CyberpunkMic 
                                     size={20} 
                                     isRecording={isRecording} 
                                     className={isRecording ? "text-echorya-600 dark:text-echorya-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-white"} 
                                   />
                                </button>
                             </div>
                             
                             <button 
                               onClick={handleSend}
                               disabled={!input.trim()}
                               className={`flex items-center gap-2 px-8 py-2.5 rounded-full font-bold text-xs transition-all transform active:scale-95 uppercase tracking-[0.1em] ${
                                  input.trim() 
                                   ? 'bg-echorya-600 text-white hover:bg-echorya-500 shadow-[0_0_15px_rgba(20,184,166,0.3)] border border-transparent dark:border-white/10' 
                                   : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                               }`}
                             >
                                <span>{t.generateBtn}</span>
                                <Zap size={14} className={input.trim() ? "fill-white" : ""} />
                             </button>
                          </div>
                       </div>
                    </div>

                    {/* Feature Grid - Synth Pads Style */}
                    <div className="w-full max-w-6xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-px bg-slate-200 dark:bg-white/5 flex-1 bg-gradient-to-r from-transparent to-slate-200 dark:to-white/10"></div>
                            <span className="text-[10px] font-bold text-echorya-600 dark:text-echorya-500 uppercase tracking-[0.3em] shadow-echorya-500/20 dark:shadow-echorya-500/50 drop-shadow-[0_0_5px_rgba(20,184,166,0.2)] dark:drop-shadow-[0_0_5px_rgba(20,184,166,0.5)]">{t.studioTools}</span>
                            <div className="h-px bg-slate-200 dark:bg-white/5 flex-1 bg-gradient-to-l from-transparent to-slate-200 dark:to-white/10"></div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
                            {features.map((feature, idx) => {
                                const featData = (t.features as any)[feature.key];
                                return (
                                  <div 
                                      key={idx}
                                      onClick={() => setInput(featData.label)}
                                      className="relative bg-white dark:bg-[#0E1014] p-4 rounded-xl border border-slate-200 dark:border-white/5 hover:border-echorya-500/50 transition-all duration-300 cursor-pointer group flex flex-col items-center text-center gap-3 hover:-translate-y-1 h-full shadow-lg hover:shadow-[0_0_20px_rgba(20,184,166,0.15)] synth-pad-glow active:scale-95 active:shadow-inner"
                                  >
                                      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 dark:from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none"></div>
                                      
                                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-[#050608] border border-slate-200 dark:border-white/5 text-slate-400 flex items-center justify-center group-hover:text-echorya-600 dark:group-hover:text-echorya-400 transition-colors shadow-inner group-hover:shadow-[0_0_10px_rgba(20,184,166,0.2)]">
                                          <feature.icon size={20} strokeWidth={1.5} />
                                      </div>
                                      <div>
                                          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-black dark:group-hover:text-white mb-1.5 leading-tight min-h-[2.5em] flex items-center justify-center tracking-wide">{featData.label}</h3>
                                          <p className="text-[9px] text-slate-400 dark:text-slate-600 group-hover:text-slate-500 uppercase tracking-widest hidden sm:block scale-90">{featData.desc}</p>
                                      </div>
                                  </div>
                                );
                            })}
                        </div>
                    </div>

                  </div>
                ) : (
                  <div className="w-full max-w-3xl mx-auto flex flex-col gap-8 py-8 pb-32">
                    {messages.map((msg) => {
                      const musicData = parseAssetData(msg.text);
                      return (
                        <div 
                          key={msg.id} 
                          className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeInUp`}
                        >
                          {msg.role === 'model' && (
                             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-echorya-600 to-teal-800 shadow-md flex-shrink-0 flex items-center justify-center text-white mt-1 border border-white/10">
                               <CyberpunkLogo size={16} />
                             </div>
                          )}
                          
                          {musicData ? (
                             <MusicPlayerBlock data={musicData} />
                          ) : (
                             <div 
                               className={`max-w-[85%] px-6 py-4 rounded-2xl leading-relaxed whitespace-pre-wrap shadow-sm text-[15px] font-light backdrop-blur-sm ${
                                 msg.role === 'user' 
                                   ? 'bg-slate-800 dark:bg-white/10 text-white border border-transparent dark:border-white/5 rounded-tr-sm shadow-[0_0_15px_rgba(0,0,0,0.2)]' 
                                   : 'bg-white/90 dark:bg-[#12141A]/90 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 rounded-tl-sm synth-pad-glow'
                               }`}
                             >
                               {msg.text}
                             </div>
                          )}
                        </div>
                      );
                    })}
                    <AudioVisualizer isGenerating={isGenerating} />
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {!isDashboard && (
                <div className="w-full px-4 pb-6 pt-2 bg-gradient-to-t from-slate-50 via-slate-50 dark:from-[#050608] dark:via-[#050608] to-transparent flex-shrink-0 z-10 transition-colors duration-300">
                  <div className="max-w-3xl mx-auto flex flex-col gap-2">
                    <div className="relative bg-white/90 dark:bg-[#0A0B10]/90 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/50 focus-within:border-echorya-500/50 transition-all synth-pad-glow">
                      <button 
                        className="absolute left-4 top-4 text-slate-400 dark:text-slate-500 hover:text-echorya-600 dark:hover:text-echorya-400 transition-colors"
                        onClick={() => document.getElementById('file-upload-chat')?.click()}
                      >
                        <Paperclip size={18} />
                      </button>
                      <input type="file" id="file-upload-chat" className="hidden" />
                      
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Input command..."
                        rows={1}
                        className="w-full bg-transparent text-slate-800 dark:text-white pl-12 pr-20 py-4 max-h-[200px] outline-none resize-none custom-scrollbar placeholder-slate-400 dark:placeholder-slate-600 text-sm font-medium font-serif"
                        style={{ minHeight: '56px' }}
                      />

                      <div className="absolute right-2 top-2.5 flex items-center gap-1">
                          <button
                            onClick={handleMicClick}
                            className={`p-2 rounded-lg transition-all border border-transparent ${
                                isRecording 
                                  ? 'bg-echorya-50 dark:bg-echorya-900 border-echorya-500/30' 
                                  : 'hover:bg-slate-100 dark:hover:bg-white/5'
                            }`}
                          >
                            <CyberpunkMic 
                               size={18} 
                               isRecording={isRecording}
                               className={isRecording ? "text-echorya-600 dark:text-echorya-400" : "text-slate-400 dark:text-slate-500"} 
                            />
                          </button>

                          <button 
                          onClick={handleSend}
                          disabled={!input.trim() || isGenerating}
                          className={`p-2 rounded-xl transition-all ${
                              input.trim() ? 'bg-echorya-600 text-white hover:bg-echorya-500 shadow-lg shadow-echorya-500/20' : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-600'
                          }`}
                          >
                          <ArrowUp size={18} />
                          </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
           </>
        )}
      </main>
    </div>
  );
};

export default ChatInterface;