import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2, Globe, Check } from 'lucide-react';
import { CyberpunkLogo } from './CyberpunkLogo';

type LanguageCode = 'en' | 'zh' | 'es' | 'fr' | 'pt';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'pt', name: 'Português' }
];

const translations = {
  en: {
    back: "Back",
    welcome: "Welcome to Echorya",
    createAcc: "Create Engine ID",
    subtitleSignIn: "Authenticate to access the engine",
    subtitleSignUp: "Start your musical journey with Echorya",
    email: "Email",
    password: "Password",
    remember: "Remember session",
    forgot: "Reset password?",
    signIn: "Authenticate",
    signUp: "Register",
    signingIn: "Authenticating...",
    creating: "Registering...",
    noAccount: "New to Echorya?",
    hasAccount: "Already have an Engine ID?",
    placeholderEmail: "composer@talesofecho.ai",
    placeholderPass: "••••••••"
  },
  zh: {
    back: "返回",
    welcome: "欢迎来到 Echorya",
    createAcc: "创建引擎 ID",
    subtitleSignIn: "验证身份以访问引擎",
    subtitleSignUp: "开启您的 Echorya 音乐之旅",
    email: "邮箱",
    password: "密码",
    remember: "保持登录",
    forgot: "重置密码？",
    signIn: "验证登录",
    signUp: "注册",
    signingIn: "验证中...",
    creating: "注册中...",
    noAccount: "新用户？",
    hasAccount: "已有引擎 ID？",
    placeholderEmail: "composer@talesofecho.ai",
    placeholderPass: "••••••••"
  },
  // ... other languages
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const t = translations[currentLanguage] || translations['en'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsSubmitting(true);
      localStorage.setItem('user_email', email);
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/app');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0C10] text-slate-800 dark:text-slate-200 font-sans flex items-center justify-center relative overflow-hidden selection:bg-echorya-900 selection:text-white transition-colors duration-500">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-slate-200 to-transparent dark:from-echorya-900/10 dark:to-transparent opacity-40"></div>
          <div className="absolute w-full h-full opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255, 255, 255, 0.05) 20px)' }}></div>
      </div>
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors font-medium text-xs uppercase tracking-wider"
      >
        <ArrowLeft size={14} />
        <span>{t.back}</span>
      </button>

      {/* Language Selector */}
      <div className="absolute top-6 right-6 z-20">
        <button 
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className={`p-2 rounded-full transition-all border border-transparent hover:border-slate-300 dark:hover:border-white/10 ${
                isLangMenuOpen 
                ? 'bg-slate-200 dark:bg-white/10 text-echorya-600 dark:text-echorya-400' 
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
            title="Select Language"
        >
            <Globe size={18} />
        </button>
        
        {isLangMenuOpen && (
            <>
                <div className="fixed inset-0 z-30" onClick={() => setIsLangMenuOpen(false)}></div>
                <div className="absolute right-0 mt-2 bg-white dark:bg-[#12141A] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl w-48 overflow-hidden z-40 animate-fadeIn py-1">
                    {languages.map(lang => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                setCurrentLanguage(lang.code as LanguageCode);
                                setIsLangMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white flex items-center justify-between transition-colors"
                        >
                            <span className={currentLanguage === lang.code ? "font-bold text-slate-900 dark:text-white" : ""}>{lang.name}</span>
                            {currentLanguage === lang.code && <Check size={16} className="text-echorya-600 dark:text-echorya-500" />}
                        </button>
                    ))}
                </div>
            </>
        )}
      </div>

      <div className="bg-white dark:bg-[#12141A] p-8 md:p-10 rounded-2xl shadow-2xl shadow-slate-300/50 dark:shadow-black/50 w-full max-w-md relative z-10 border border-slate-200 dark:border-white/5 animate-fadeIn">
        
        <div className="flex flex-col items-center mb-8">
            <div className="mb-6">
                <CyberpunkLogo size={56} />
            </div>
            <h2 className="text-3xl font-serif text-slate-900 dark:text-white tracking-tight">
                {isSignUp ? t.createAcc : t.welcome}
            </h2>
            <p className="text-slate-500 text-sm mt-2 text-center font-light tracking-wide">
                {isSignUp ? t.subtitleSignUp : t.subtitleSignIn}
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.email}</label>
                <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-echorya-600 dark:group-focus-within:text-echorya-400 transition-colors" size={16} />
                    <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#0B0C10] border border-slate-200 dark:border-white/10 rounded-lg py-3 pl-10 pr-4 outline-none focus:border-echorya-500/50 focus:ring-1 focus:ring-echorya-500/50 transition-all text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-700"
                        placeholder={t.placeholderEmail}
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.password}</label>
                <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-echorya-600 dark:group-focus-within:text-echorya-400 transition-colors" size={16} />
                    <input 
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#0B0C10] border border-slate-200 dark:border-white/10 rounded-lg py-3 pl-10 pr-10 outline-none focus:border-echorya-500/50 focus:ring-1 focus:ring-echorya-500/50 transition-all text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-700"
                        placeholder={t.placeholderPass}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-400 outline-none"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0B0C10] text-echorya-600 dark:text-echorya-500 focus:ring-echorya-500 accent-echorya-500" />
                    <span className="text-xs text-slate-500 font-medium">{t.remember}</span>
                </label>
                {!isSignUp && (
                    <button type="button" className="text-xs font-bold text-echorya-600 dark:text-echorya-500 hover:text-echorya-500 dark:hover:text-echorya-400">
                        {t.forgot}
                    </button>
                )}
            </div>

            <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-echorya-600 text-white font-bold py-3.5 rounded-lg transition-all shadow-lg shadow-echorya-900/20 mt-2 active:scale-[0.98] flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-80 cursor-wait' : 'hover:bg-echorya-500'}`}
            >
                {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                <span>
                   {isSubmitting 
                     ? (isSignUp ? t.creating : t.signingIn) 
                     : (isSignUp ? t.signUp : t.signIn)
                   }
                </span>
            </button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
                {isSignUp ? t.hasAccount : t.noAccount}{" "}
                <button 
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="font-bold text-echorya-600 dark:text-echorya-400 hover:text-echorya-500 dark:hover:text-echorya-300 transition-colors"
                    disabled={isSubmitting}
                >
                    {isSignUp ? t.signIn : t.signUp}
                </button>
            </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;