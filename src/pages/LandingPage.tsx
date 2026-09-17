import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  LogIn 
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="py-8 min-h-[75vh] flex items-center justify-center">
      {/* Hero Section */}
      <section className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-14 shadow-2xl text-center">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-emerald-300">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Government of Andhra Pradesh • Grama Sachivalayam Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Welcome to <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-300 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
              E-Rural Complaints AP
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            A secure digital portal for Andhra Pradesh Grama Sachivalayam services. Access your account to manage complaints, track updates, and connect with the appropriate authorities.
          </p>

          <div className="pt-4 space-y-4 flex flex-col items-center">
            <button
              onClick={() => navigateTo('login')}
              className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2.5"
            >
              <LogIn className="w-5 h-5" />
              Portal Login
            </button>

            <p className="text-xs text-slate-400 font-medium">
              New user?{' '}
              <button
                onClick={() => navigateTo('login')}
                className="text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer transition-colors"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

