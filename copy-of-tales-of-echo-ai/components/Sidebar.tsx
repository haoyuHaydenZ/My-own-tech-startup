import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  MessageSquare, 
  Library, 
  Settings, 
  LogOut, 
  Edit2, 
  Folder as FolderIcon,
  LayoutGrid,
  Disc,
  PanelLeftClose,
  PanelLeftOpen,
  Globe,
  Check,
  Sparkles,
  FileText,
  User,
  HelpCircle,
  Sun,
  Moon,
  Trash2
} from 'lucide-react';
import { ChatSession, Project } from '../types';
import { CyberpunkLogo } from './CyberpunkLogo';
import { useTheme } from '../ThemeContext';

// --- Translation Support ---
type LanguageCode = 'en' | 'zh' | 'es' | 'fr' | 'pt';

const sidebarTranslations = {
  en: {
    newProject: "New Project",
    dashboard: "Engine Dashboard",
    library: "Library",
    plugins: "Plugins",
    folders: "Folders",
    recent: "Recent",
    proLicense: "Pro License",
    settings: "Settings",
    language: "Language",
    appName: "Echorya",
    appSub: "Tales of Echo",
    deleteConfirm: "Delete this session?",
  },
  zh: {
    newProject: "新建项目",
    dashboard: "引擎控制台",
    library: "媒体库",
    plugins: "插件",
    folders: "文件夹",
    recent: "最近打开",
    proLicense: "专业版许可",
    settings: "设置",
    language: "语言",
    appName: "Echorya",
    appSub: "Tales of Echo",
    deleteConfirm: "删除此会话？",
  },
  // Other languages omitted for brevity but would follow same pattern
};

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onDeleteSession: (id: string) => void;
  projects: Project[];
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onGoHome: () => void;
  currentView: 'chat' | 'library';
  onChangeView: (view: 'chat' | 'library') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  sessions, 
  currentSessionId, 
  onSelectSession, 
  onNewSession,
  onRenameSession,
  onDeleteSession,
  projects,
  currentLanguage = 'en',
  onLanguageChange,
  onGoHome,
  currentView,
  onChangeView
}) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const t = sidebarTranslations[currentLanguage] || sidebarTranslations['en'];
  
  // Collapse State
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Language Menu State
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  // Profile Menu State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Session Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // User Identity State
  const [userEmail, setUserEmail] = useState<string>('producer@talesofecho.ai');

  useEffect(() => {
    const storedEmail = localStorage.getItem('user_email');
    if (storedEmail) setUserEmail(storedEmail);
  }, []);

  const getUserName = () => {
    const namePart = userEmail.split('@')[0];
    return namePart
      .split(/[._-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getUserHandle = () => {
    const namePart = userEmail.split('@')[0];
    return `@${namePart.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  };

  const getInitials = () => {
    const name = getUserName();
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // --- Session Editing Handlers ---
  const startEditing = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditValue(session.title);
  };

  const saveEditing = () => {
    if (editingId && editValue.trim()) {
      onRenameSession(editingId, editValue);
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') saveEditing();
    if (e.key === 'Escape') setEditingId(null);
  };

  const displayedSessions = [...sessions].reverse();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: '中文' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'pt', name: 'Português' }
  ];

  return (
    <div className={`h-full bg-white dark:bg-[#0B0C10] flex flex-col transition-all duration-300 ease-in-out flex-shrink-0 z-20 shadow-xl border-r border-slate-200 dark:border-white/5 ${isCollapsed ? 'w-[72px]' : 'w-[260px]'}`}>
      
      {/* Header */}
      <div className={`p-5 flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3'} border-b border-slate-200 dark:border-white/5 cursor-pointer h-[73px] transition-all`} onClick={() => { onGoHome(); onChangeView('chat'); }}>
         <CyberpunkLogo size={isCollapsed ? 26 : 30} />
         {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-slate-800 dark:text-white text-lg tracking-wide whitespace-nowrap overflow-hidden animate-fadeIn font-serif">
                {t.appName}
              </span>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest whitespace-nowrap">{t.appSub}</span>
            </div>
         )}
      </div>

      <div className={`px-4 pt-6 pb-6 ${isCollapsed ? 'px-2' : ''}`}>
         <button 
          onClick={() => { onNewSession(); onChangeView('chat'); }}
          className={`w-full flex items-center justify-center gap-2 py-3 bg-echorya-600 hover:bg-echorya-500 text-white rounded-lg transition-all shadow-md shadow-echorya-900/20 font-semibold text-sm ${isCollapsed ? 'px-0' : 'px-4'}`}
          title={t.newProject}
         >
           <Plus size={16} />
           {!isCollapsed && <span className="whitespace-nowrap">{t.newProject}</span>}
         </button>
      </div>

      {/* Navigation Links */}
      <div className={`px-2 mb-4 flex flex-col gap-1 ${isCollapsed ? 'items-center' : ''}`}>
          <button 
            onClick={() => onChangeView('library')}
            className={`flex items-center gap-3 py-2 rounded-lg transition-colors text-sm font-medium ${isCollapsed ? 'justify-center w-10 px-0' : 'px-3 w-full'} ${currentView === 'library' ? 'bg-slate-100 dark:bg-white/10 text-echorya-600 dark:text-white' : 'text-slate-600 dark:text-slate-400 hover:text-echorya-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'}`} 
            title={t.library}
          >
             <Library size={18} />
             {!isCollapsed && <span>{t.library}</span>}
          </button>

          {/* Folders - "Extinguished"/Grayed out state */}
          <div className={`group relative flex items-center gap-3 py-2 rounded-lg transition-colors text-sm font-medium cursor-not-allowed select-none ${isCollapsed ? 'justify-center w-10 px-0' : 'px-3 w-full'}`} title="Coming Soon">
             {/* Diagonal stripe overlay to indicate disabled status */}
             <div className="absolute inset-0 bg-[image:repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(0,0,0,0.03)_5px,rgba(0,0,0,0.03)_10px)] dark:bg-[image:repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(255,255,255,0.02)_5px,rgba(255,255,255,0.02)_10px)] opacity-50 rounded-lg pointer-events-none"></div>
             
             <FolderIcon size={18} className="text-slate-300 dark:text-slate-700 relative z-10" />
             
             {!isCollapsed && (
               <div className="flex items-center justify-between flex-1 relative z-10">
                 <span className="text-slate-300 dark:text-slate-700">{t.folders}</span>
                 {/* Pulsing Badge */}
                 <span className="text-[8px] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest animate-pulse">
                   Soon
                 </span>
               </div>
             )}
             
             {isCollapsed && (
               <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 dark:bg-white text-slate-200 dark:text-black text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl transition-opacity">
                 Coming Soon
               </div>
             )}
          </div>
          
          {/* Plugins - "Extinguished"/Grayed out state */}
          <div className={`group relative flex items-center gap-3 py-2 rounded-lg transition-colors text-sm font-medium cursor-not-allowed select-none ${isCollapsed ? 'justify-center w-10 px-0' : 'px-3 w-full'}`} title="Coming Soon">
             {/* Diagonal stripe overlay to indicate disabled status */}
             <div className="absolute inset-0 bg-[image:repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(0,0,0,0.03)_5px,rgba(0,0,0,0.03)_10px)] dark:bg-[image:repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(255,255,255,0.02)_5px,rgba(255,255,255,0.02)_10px)] opacity-50 rounded-lg pointer-events-none"></div>
             
             <Disc size={18} className="text-slate-300 dark:text-slate-700 relative z-10" />
             
             {!isCollapsed && (
               <div className="flex items-center justify-between flex-1 relative z-10">
                 <span className="text-slate-300 dark:text-slate-700">{t.plugins}</span>
                 {/* Pulsing Badge */}
                 <span className="text-[8px] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest animate-pulse">
                   Soon
                 </span>
               </div>
             )}
             
             {isCollapsed && (
               <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 dark:bg-white text-slate-200 dark:text-black text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl transition-opacity">
                 Coming Soon
               </div>
             )}
          </div>
      </div>

      {/* RECENT CHATS SECTION */}
      {!isCollapsed ? (
        <div className="flex-1 overflow-y-auto px-2 custom-scrollbar space-y-6 opacity-100 transition-opacity duration-300">
            <div>
                <div className="flex items-center justify-between px-3 mb-2">
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-600 uppercase tracking-wider">
                        {t.recent}
                    </div>
                </div>
                
                <div className="space-y-0.5">
                    {displayedSessions.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-slate-500 dark:text-slate-600 italic">No recent projects.</div>
                    ) : (
                        displayedSessions.map(session => (
                        <div 
                            key={session.id}
                            onClick={() => { onSelectSession(session.id); onChangeView('chat'); }}
                            className={`group flex items-center justify-between gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-all duration-200 border border-transparent ${
                            currentSessionId === session.id && currentView === 'chat'
                            ? 'bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white font-medium shadow-sm border-slate-300 dark:border-white/5' 
                            : 'text-slate-600 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-300'
                            }`}
                        >
                            {editingId === session.id ? (
                            <input 
                                autoFocus
                                className="bg-white dark:bg-[#12141A] border border-slate-300 dark:border-slate-700 rounded px-2 py-1 w-full outline-none text-slate-800 dark:text-white text-xs"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={saveEditing}
                                onKeyDown={handleKeyDown}
                                onClick={(e) => e.stopPropagation()}
                            />
                            ) : (
                            <>
                                <div className="flex items-center gap-3 overflow-hidden">
                                <MessageSquare size={14} className={currentSessionId === session.id && currentView === 'chat' ? "text-echorya-600 dark:text-echorya-400" : "opacity-50"} />
                                <span className="truncate">
                                    {session.title}
                                </span>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                                    <button 
                                    onClick={(e) => startEditing(session, e)}
                                    className="p-1 hover:bg-slate-300 dark:hover:bg-white/10 rounded text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                                    title="Rename"
                                    >
                                    <Edit2 size={12} />
                                    </button>
                                    <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        if (window.confirm(t.deleteConfirm || "Delete this session?")) {
                                            onDeleteSession(session.id);
                                        }
                                    }}
                                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors z-10"
                                    title="Delete Session"
                                    >
                                    <Trash2 size={13} />
                                    </button>
                                </div>
                            </>
                            )}
                        </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      ) : (
         <div className="flex-1"></div>
      )}

      {/* Footer Controls */}
      <div className={`px-4 py-2 flex items-center ${isCollapsed ? 'flex-col gap-4 justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-1">
            <div className="relative">
                <button
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    className={`p-2 rounded-lg transition-colors ${
                        isLangMenuOpen 
                        ? 'text-echorya-600 dark:text-echorya-400 bg-slate-100 dark:bg-white/10' 
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                    title={t.language}
                >
                    <Globe size={18} />
                </button>
                
                {isLangMenuOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsLangMenuOpen(false)}></div>
                        <div 
                            className={`absolute bottom-full mb-2 ${isCollapsed ? 'left-full ml-2' : 'left-0'} bg-white dark:bg-[#12141A] border border-slate-200 dark:border-white/10 rounded-lg shadow-xl w-40 overflow-hidden z-50`}
                        >
                            {languages.map(lang => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        onLanguageChange(lang.code as LanguageCode);
                                        setIsLangMenuOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white flex items-center justify-between"
                                >
                                    <span>{lang.name}</span>
                                    {currentLanguage === lang.code && <Check size={14} className="text-echorya-500" />}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <button
                onClick={toggleTheme}
                className="p-2 rounded-lg transition-colors text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                title="Toggle Theme"
            >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
        </div>

        <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
            {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Profile Section */}
      <div className={`relative p-4 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#0B0C10]/50 flex flex-col gap-2 ${isCollapsed ? 'items-center px-2' : ''}`}>
        
        {isProfileOpen && (
            <>
                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                <div className={`absolute z-50 w-64 bg-white dark:bg-[#12141A] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden transform transition-all duration-200 origin-bottom-left animate-fadeInUp
                    ${isCollapsed ? 'left-16 bottom-0' : 'bottom-full left-0 right-0 mx-3 mb-2'}
                `}>
                   <div className="p-4 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-echorya-600 to-teal-800 flex items-center justify-center text-sm font-bold text-white shadow-md border border-white/10">
                            {getInitials()}
                        </div>
                        <div className="overflow-hidden">
                            <div className="font-bold text-slate-800 dark:text-white text-sm truncate">{getUserName()}</div>
                            <div className="text-xs text-slate-500 truncate font-mono">{getUserHandle()}</div>
                        </div>
                     </div>
                   </div>
                   
                   <div className="p-1.5 space-y-0.5">
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors text-left group">
                         <Sparkles size={16} className="text-echorya-600 dark:text-echorya-500 group-hover:text-echorya-500 dark:group-hover:text-echorya-400" />
                         <span>Upgrade plan</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors text-left">
                         <FileText size={16} />
                         <span>Orders</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors text-left">
                         <User size={16} />
                         <span>Personalization</span>
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors text-left">
                         <Settings size={16} />
                         <span>{t.settings}</span>
                      </button>
                   </div>
                   
                   <div className="h-px bg-slate-200 dark:bg-white/5 mx-2 my-1"></div>
                   
                   <div className="p-1.5 space-y-0.5">
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors text-left">
                         <HelpCircle size={16} />
                         <span>Help</span>
                      </button>
                      <button 
                         onClick={() => navigate('/login')}
                         className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors text-left"
                      >
                         <LogOut size={16} />
                         <span>Log out</span>
                      </button>
                   </div>
                </div>
            </>
        )}

        <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center gap-3 rounded-lg cursor-pointer transition-colors group hover:bg-slate-200 dark:hover:bg-white/5 ${isCollapsed ? 'justify-center p-1' : 'px-2 py-2'} ${isProfileOpen ? 'bg-slate-200 dark:bg-white/5' : ''}`}
        >
           <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-echorya-600 to-teal-800 flex items-center justify-center text-xs font-bold text-white shadow-md border border-white/10 flex-shrink-0">
              {getInitials()}
           </div>
           {!isCollapsed && (
               <div className="flex flex-col min-w-0 animate-fadeIn text-left">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-black dark:group-hover:text-white">{getUserName()}</span>
                  <span className="text-[10px] text-echorya-600 dark:text-echorya-500 uppercase font-bold tracking-wider">{t.proLicense}</span>
               </div>
           )}
        </div>
      </div>

    </div>
  );
};

export default Sidebar;