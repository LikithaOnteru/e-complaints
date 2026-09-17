import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  LogOut, 
  Moon, 
  Sun, 
  Languages
} from 'lucide-react';
import { Language } from '../../data/translations';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    navigateTo, 
    darkMode, 
    toggleDarkMode, 
    logout, 
    language,
    setLanguage,
    t
  } = useApp();

  const handleNav = (view: any) => {
    navigateTo(view);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNav(currentUser?.role === 'admin' ? 'admin_dashboard' : currentUser?.role === 'citizen' || currentUser?.role === 'volunteer' ? 'citizen_dashboard' : 'landing')} 
            className="flex items-center gap-3 cursor-pointer group min-w-0 shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-700 to-green-500 p-0.5 shadow-md group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-black bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 bg-clip-text text-transparent tracking-tight truncate">
                {t.portalTitle}
              </h1>
              <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 -mt-1 tracking-wider uppercase truncate">
                {t.portalSubtitle}
              </p>
            </div>
          </div>

          {/* Right Actions: Language + Theme + Portal Login / Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Language Selector Dropdown */}
            <div className="relative flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <Languages className="w-3.5 h-3.5 text-blue-600 ml-1 mr-1 shrink-0" />
              <select
                value={language}
                onChange={e => setLanguage(e.target.value as Language)}
                className="bg-transparent font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer text-xs pr-1"
              >
                <option value="en" className="dark:bg-slate-900">English</option>
                <option value="te" className="dark:bg-slate-900">తెలుగు</option>
                <option value="hi" className="dark:bg-slate-900">हिंदी</option>
              </select>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {/* User Profile / Portal Login */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => handleNav('profile')}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-600 to-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden lg:block max-w-[140px]">
                    <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight truncate">{currentUser.name}</p>
                    <p className="text-[10px] font-medium text-blue-600 dark:text-blue-400 capitalize truncate">{currentUser.role}</p>
                  </div>
                </button>

                <button
                  onClick={logout}
                  title="Logout of Account"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 dark:text-rose-400 text-xs font-extrabold transition-all border border-rose-200 dark:border-rose-900/60 shadow-xs"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNav('login')}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 btn-ripple shrink-0"
              >
                Portal Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

