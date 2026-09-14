import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  FilePlus, 
  Search, 
  MapPin, 
  PhoneCall, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Users, 
  FileText, 
  BarChart2, 
  Award,
  Zap,
  Route,
  Droplets,
  Lightbulb,
  LogIn
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PriorityBadge } from '../components/ui/PriorityBadge';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const { complaints, navigateTo, language, t } = useApp();

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'Pending').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;

  const recentComplaints = complaints.slice(0, 3);

  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-12 shadow-2xl">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-emerald-300">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Government of Andhra Pradesh • Grama Sachivalayam Portal</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              E-Rural Grievance Redressal System
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Empowering rural citizens across Andhra Pradesh. Submit village grievances, track resolution timelines transparently, and connect directly with Gram Volunteers and Panchayat Officers.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigateTo('register_complaint')}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <FilePlus className="w-5 h-5" />
                Register Grievance
              </button>

              <button
                onClick={() => navigateTo('track_complaint')}
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm backdrop-blur-md border border-white/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Track Grievance
              </button>

              <button
                onClick={() => navigateTo('login')}
                className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Portal Sign In / Register
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center space-y-1">
              <p className="text-3xl font-black text-white">{total}</p>
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Total Grievances</p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-center space-y-1">
              <p className="text-3xl font-black text-emerald-300">{resolved}</p>
              <p className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">Resolved</p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-500/20 backdrop-blur-md border border-amber-400/30 text-center space-y-1">
              <p className="text-3xl font-black text-amber-300">{inProgress}</p>
              <p className="text-xs font-semibold text-amber-200 uppercase tracking-wider">In Progress</p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-center space-y-1">
              <p className="text-3xl font-black text-blue-300">15,004+</p>
              <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider">Gram Sachivalayams</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Grievance Highlights */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Recent Public Grievances
            </h2>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Live complaints being processed by AP Panchayat & Department Officers
            </p>
          </div>

          <button
            onClick={() => navigateTo('my_complaints')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View All Complaints</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentComplaints.map(item => (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              onClick={() => navigateTo('complaint_details', item.id)}
              className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg border border-slate-200/80 dark:border-slate-700 cursor-pointer space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                    {item.id}
                  </span>
                  <StatusBadge status={item.status} />
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-base line-clamp-1">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  <span>{item.village} ({item.wardNumber})</span>
                </div>
                <PriorityBadge priority={item.priority} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-base">Smart AI Categorization</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automatically detects category, priority, and duplicate grievances to speed up officer routing.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <MapPin className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-base">AP Village Map Integration</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Geotag potholes, water leaks, and streetlight issues directly on the interactive Leaflet map.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-base">Gram Volunteer Network</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Gram Volunteers assist senior citizens and record progress updates with photo evidence directly on ground.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <PhoneCall className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-base">24x7 Emergency Helplines</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Instant contact info for Grama Sachivalayam officers, electricity emergency (1912), and Spandana (1902).
          </p>
        </div>
      </section>
    </div>
  );
};
