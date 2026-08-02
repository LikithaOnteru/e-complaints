import React from 'react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PriorityBadge } from '../components/ui/PriorityBadge';
import { CategoryType } from '../types';
import { 
  FileText, 
  Clock, 
  Loader2, 
  CheckCircle2, 
  FilePlus, 
  Search, 
  History, 
  PhoneCall, 
  Route, 
  Droplets, 
  Trash2, 
  Lightbulb, 
  Zap, 
  Sparkles, 
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Award,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

export const CitizenDashboard: React.FC = () => {
  const { currentUser, complaints, navigateTo } = useApp();

  // Filter complaints submitted by or relevant to current citizen
  const citizenComplaints = complaints.filter(
    c => c.citizenEmail === currentUser?.email || c.citizenName === currentUser?.name
  );

  const total = citizenComplaints.length;
  const pending = citizenComplaints.filter(c => c.status === 'Pending').length;
  const inProgress = citizenComplaints.filter(c => c.status === 'In Progress').length;
  const resolved = citizenComplaints.filter(c => c.status === 'Resolved').length;

  const categories: { title: CategoryType; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
    { title: 'Road Damage', icon: Route, color: 'bg-blue-500 text-white' },
    { title: 'Drainage', icon: Droplets, color: 'bg-cyan-500 text-white' },
    { title: 'Water Supply', icon: Droplets, color: 'bg-teal-500 text-white' },
    { title: 'Garbage', icon: Trash2, color: 'bg-emerald-500 text-white' },
    { title: 'Street Light', icon: Lightbulb, color: 'bg-amber-500 text-white' },
    { title: 'Electricity', icon: Zap, color: 'bg-purple-500 text-white' },
    { title: 'Sanitation', icon: Sparkles, color: 'bg-rose-500 text-white' },
    { title: 'Others', icon: HelpCircle, color: 'bg-slate-600 text-white' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            Citizen Dashboard
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Namaste, {currentUser?.name || 'Villager'}! 👋
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed">
            Welcome to your digital grievance management portal for <strong>{currentUser?.village || 'Rampur'}</strong> ({currentUser?.ward || 'Ward 3'}). You can file new complaints, check live progress, and access village helpline numbers.
          </p>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Complaints"
          value={total}
          icon={FileText}
          color="blue"
          subtitle="Grievances submitted"
          onClick={() => navigateTo('my_complaints')}
        />
        <StatCard
          title="Pending"
          value={pending}
          icon={Clock}
          color="amber"
          subtitle="Awaiting officer review"
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          icon={Loader2}
          color="purple"
          subtitle="Field team on ground"
        />
        <StatCard
          title="Resolved"
          value={resolved}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Issues fixed & verified"
        />
      </div>

      {/* Quick Action Buttons */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <QuickActionButton
            label="Register Complaint"
            desc="Upload issue details & photo"
            icon={FilePlus}
            color="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25"
            onClick={() => navigateTo('register_complaint')}
          />
          <QuickActionButton
            label="Track Complaint"
            desc="Search by ERC ID"
            icon={Search}
            color="bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white shadow-md"
            onClick={() => navigateTo('track_complaint')}
          />
          <QuickActionButton
            label="View History"
            desc="All previous grievances"
            icon={History}
            color="bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
            onClick={() => navigateTo('my_complaints')}
          />
          <QuickActionButton
            label="Emergency Contacts"
            desc="Village helpline numbers"
            icon={PhoneCall}
            color="bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100"
            onClick={() => navigateTo('emergency_contacts')}
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">File Complaint by Category</h3>
          <span className="text-xs text-slate-500 font-semibold">Click to select category</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map(cat => {
            const Icon = cat.icon;
            const catCount = citizenComplaints.filter(c => c.category === cat.title).length;
            return (
              <div
                key={cat.title}
                onClick={() => navigateTo('register_complaint')}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer flex items-center gap-3.5 group"
              >
                <div className={`p-3 rounded-xl ${cat.color} shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {cat.title}
                  </h4>
                  <p className="text-[11px] font-semibold text-slate-400">{catCount} Submitted</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Community Achievements Badges Snippet */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-4 border border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            <h3 className="text-lg font-bold">Community Helper Badges</h3>
          </div>
          <button onClick={() => navigateTo('profile')} className="text-xs font-bold text-blue-400 hover:underline">
            View All Badges →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <div>
              <p className="text-xs font-bold">Active Reporter</p>
              <p className="text-[10px] text-slate-400">Unlocked</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
            <Award className="w-6 h-6 text-amber-400" />
            <div>
              <p className="text-xs font-bold">Community Helper</p>
              <p className="text-[10px] text-slate-400">Unlocked</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <div>
              <p className="text-xs font-bold">Eco Guardian</p>
              <p className="text-[10px] text-slate-400">Unlocked</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-3 opacity-60">
            <Award className="w-6 h-6 text-slate-500" />
            <div>
              <p className="text-xs font-bold">5-Star Citizen</p>
              <p className="text-[10px] text-slate-400">Locked</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Grievances Table Snippet */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">My Recent Complaints</h3>
          <button
            onClick={() => navigateTo('my_complaints')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            View All ({total})
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
          {citizenComplaints.slice(0, 4).map(c => (
            <div
              key={c.id}
              onClick={() => navigateTo('complaint_details', c.id)}
              className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/40 px-3 rounded-xl transition-colors cursor-pointer"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{c.id}</span>
                  <PriorityBadge priority={c.priority} size="sm" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{c.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  📍 {c.village} ({c.wardNumber}) • {c.createdAt}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge status={c.status} />
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const QuickActionButton: React.FC<{
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  onClick: () => void;
}> = ({ label, desc, icon: Icon, color, onClick }) => (
  <button
    onClick={onClick}
    className={`p-5 rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-95 flex flex-col justify-between h-32 ${color}`}
  >
    <Icon className="w-6 h-6" />
    <div>
      <h4 className="text-sm font-bold leading-tight">{label}</h4>
      <p className="text-[11px] opacity-80 mt-0.5">{desc}</p>
    </div>
  </button>
);
