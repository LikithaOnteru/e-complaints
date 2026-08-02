import React, { useState } from 'react';
import { useApp, ActiveView } from '../../context/AppContext';
import { 
  Building2, 
  LayoutDashboard, 
  FilePlus, 
  Search, 
  Bell, 
  User, 
  LogOut, 
  Moon, 
  Sun, 
  PhoneCall, 
  BarChart2, 
  FileText, 
  MapPin, 
  Menu, 
  X,
  RotateCcw,
  Languages
} from 'lucide-react';
import { Language } from '../../data/translations';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    activeView, 
    navigateTo, 
    darkMode, 
    toggleDarkMode, 
    logout, 
    notifications,
    resetDemoData,
    language,
    setLanguage,
    t
  } = useApp();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNav = (view: ActiveView) => {
    navigateTo(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNav(currentUser?.role === 'admin' ? 'admin_dashboard' : currentUser?.role === 'citizen' || currentUser?.role === 'volunteer' ? 'citizen_dashboard' : 'landing')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-700 to-green-500 p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 bg-clip-text text-transparent tracking-tight">
                {t.portalTitle}
              </h1>
              <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 -mt-1 tracking-wider uppercase">
                {t.portalSubtitle}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {(currentUser?.role === 'citizen' || currentUser?.role === 'volunteer') && (
              <>
                <NavButton active={activeView === 'citizen_dashboard'} onClick={() => handleNav('citizen_dashboard')} icon={LayoutDashboard} label={t.dashboard} />
                <NavButton active={activeView === 'register_complaint'} onClick={() => handleNav('register_complaint')} icon={FilePlus} label={t.registerComplaint} highlight />
                <NavButton active={activeView === 'my_complaints'} onClick={() => handleNav('my_complaints')} icon={FileText} label={t.myComplaints} />
                <NavButton active={activeView === 'track_complaint'} onClick={() => handleNav('track_complaint')} icon={Search} label={t.trackComplaint} />
                <NavButton active={activeView === 'village_map'} onClick={() => handleNav('village_map')} icon={MapPin} label={t.villageMap} />
                <NavButton active={activeView === 'emergency_contacts'} onClick={() => handleNav('emergency_contacts')} icon={PhoneCall} label={t.emergency} />
              </>
            )}

            {currentUser?.role === 'admin' && (
              <>
                <NavButton active={activeView === 'admin_dashboard'} onClick={() => handleNav('admin_dashboard')} icon={LayoutDashboard} label={t.dashboard} />
                <NavButton active={activeView === 'admin_complaints'} onClick={() => handleNav('admin_complaints')} icon={FileText} label="Grievances" />
                <NavButton active={activeView === 'admin_analytics'} onClick={() => handleNav('admin_analytics')} icon={BarChart2} label={t.analytics} />
                <NavButton active={activeView === 'village_map'} onClick={() => handleNav('village_map')} icon={MapPin} label={t.villageMap} />
                <NavButton active={activeView === 'admin_reports'} onClick={() => handleNav('admin_reports')} icon={FileText} label={t.reports} />
              </>
            )}

            {(!currentUser || currentUser.role === 'guest') && (
              <>
                <NavButton active={activeView === 'landing'} onClick={() => handleNav('landing')} icon={LayoutDashboard} label={t.home} />
                <NavButton active={activeView === 'village_map'} onClick={() => handleNav('village_map')} icon={MapPin} label={t.villageMap} />
                <NavButton active={activeView === 'emergency_contacts'} onClick={() => handleNav('emergency_contacts')} icon={PhoneCall} label={t.emergency} />
              </>
            )}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center gap-2">
            {/* Language Selector Dropdown */}
            <div className="relative flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <Languages className="w-3.5 h-3.5 text-blue-600 ml-1 mr-1" />
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

            {/* Reset Demo Data Button */}
            <button
              onClick={resetDemoData}
              title="Reset AP Demo Data"
              className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications Button */}
            {currentUser && (
              <button
                onClick={() => handleNav('notifications')}
                className={`relative p-2.5 rounded-xl transition-colors ${
                  activeView === 'notifications'
                    ? 'bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* User Profile / Login */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => handleNav('profile')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight">{currentUser.name}</p>
                    <p className="text-[10px] font-medium text-blue-600 dark:text-blue-400 capitalize">{currentUser.role}</p>
                  </div>
                </button>

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNav('login')}
                className="ml-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 btn-ripple"
              >
                Portal Login
              </button>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Language Picker */}
            <select
              value={language}
              onChange={e => setLanguage(e.target.value as Language)}
              className="bg-slate-100 dark:bg-slate-800 text-xs font-bold px-2 py-1 rounded-lg text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
            >
              <option value="en">EN</option>
              <option value="te">TE</option>
              <option value="hi">HI</option>
            </select>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {(currentUser?.role === 'citizen' || currentUser?.role === 'volunteer') && (
            <>
              <MobileNavButton onClick={() => handleNav('citizen_dashboard')} icon={LayoutDashboard} label={t.dashboard} />
              <MobileNavButton onClick={() => handleNav('register_complaint')} icon={FilePlus} label={t.registerComplaint} />
              <MobileNavButton onClick={() => handleNav('my_complaints')} icon={FileText} label={t.myComplaints} />
              <MobileNavButton onClick={() => handleNav('track_complaint')} icon={Search} label={t.trackComplaint} />
              <MobileNavButton onClick={() => handleNav('village_map')} icon={MapPin} label={t.villageMap} />
              <MobileNavButton onClick={() => handleNav('emergency_contacts')} icon={PhoneCall} label={t.emergency} />
              <MobileNavButton onClick={() => handleNav('profile')} icon={User} label="Profile" />
            </>
          )}

          {currentUser?.role === 'admin' && (
            <>
              <MobileNavButton onClick={() => handleNav('admin_dashboard')} icon={LayoutDashboard} label={t.dashboard} />
              <MobileNavButton onClick={() => handleNav('admin_complaints')} icon={FileText} label="Manage Complaints" />
              <MobileNavButton onClick={() => handleNav('admin_analytics')} icon={BarChart2} label={t.analytics} />
              <MobileNavButton onClick={() => handleNav('village_map')} icon={MapPin} label={t.villageMap} />
              <MobileNavButton onClick={() => handleNav('admin_reports')} icon={FileText} label={t.reports} />
            </>
          )}

          {!currentUser && (
            <>
              <MobileNavButton onClick={() => handleNav('landing')} icon={LayoutDashboard} label={t.home} />
              <MobileNavButton onClick={() => handleNav('village_map')} icon={MapPin} label={t.villageMap} />
              <MobileNavButton onClick={() => handleNav('emergency_contacts')} icon={PhoneCall} label={t.emergency} />
              <MobileNavButton onClick={() => handleNav('login')} icon={User} label={t.signInBtn} />
            </>
          )}

          {currentUser && (
            <button
              onClick={() => { logout(); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-sm font-semibold"
            >
              <LogOut className="w-5 h-5" />
              {t.logout}
            </button>
          )}
        </div>
      )}
    </header>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  highlight?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon: Icon, label, highlight }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
      highlight
        ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
        : active
        ? 'bg-slate-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
    }`}
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </button>
);

const MobileNavButton: React.FC<{ onClick: () => void; icon: React.ComponentType<{ className?: string }>; label: string }> = ({
  onClick,
  icon: Icon,
  label,
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold"
  >
    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
    {label}
  </button>
);
