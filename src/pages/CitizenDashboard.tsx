import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PriorityBadge } from '../components/ui/PriorityBadge';
import { ProgressUpdateModal } from '../components/ui/ProgressUpdateModal';
import { CategoryType, Complaint } from '../types';
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
  ExternalLink,
  Users,
  Camera,
  PlusCircle,
  CheckSquare
} from 'lucide-react';
import { motion } from 'framer-motion';

export const CitizenDashboard: React.FC = () => {
  const { currentUser, complaints, navigateTo } = useApp();
  const [selectedComplaintForProgress, setSelectedComplaintForProgress] = useState<Complaint | null>(null);

  const isVolunteer = currentUser?.role === 'volunteer';

  // Filter complaints
  // For citizens: complaints submitted by them
  // For volunteers: complaints in their village or assigned to them, or all demo complaints
  const userComplaints = complaints.filter(c => {
    if (isVolunteer) {
      return true; // Volunteers can monitor all grievances in their village / ward
    }
    return c.citizenEmail === currentUser?.email || c.citizenName === currentUser?.name;
  });

  const total = userComplaints.length;
  const pending = userComplaints.filter(c => c.status === 'Pending').length;
  const inProgress = userComplaints.filter(c => c.status === 'In Progress').length;
  const resolved = userComplaints.filter(c => c.status === 'Resolved').length;

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
      <div className={`rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden text-white ${
        isVolunteer 
          ? 'bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700' 
          : 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700'
      }`}>
        <div className="relative z-10 space-y-2 max-w-2xl">
          <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs flex items-center gap-1.5 w-max">
            {isVolunteer ? <Users className="w-3.5 h-3.5" /> : null}
            {isVolunteer ? 'Grama Sachivalayam Volunteer Work Hub' : 'Citizen Dashboard'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Namaste, {currentUser?.name || 'User'}! 👋
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed">
            {isVolunteer
              ? `You are logged in as Grama Sachivalayam Volunteer for ${currentUser?.village || 'Undavalli Village'}. Monitor field grievances, post progress status updates, and attach proof photos.`
              : `Welcome to your digital grievance management portal for ${currentUser?.village || 'Penumaka Village'} (${currentUser?.ward || 'Ward 4'}). You can file new complaints, check live progress, and access village helpline numbers.`
            }
          </p>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title={isVolunteer ? "Village Grievances" : "Total Complaints"}
          value={total}
          icon={FileText}
          color="blue"
          subtitle="Grievances registered"
          onClick={() => navigateTo('my_complaints')}
        />
        <StatCard
          title="Pending Action"
          value={pending}
          icon={Clock}
          color="amber"
          subtitle="Awaiting inspection"
        />
        <StatCard
          title="Work In Progress"
          value={inProgress}
          icon={Loader2}
          color="purple"
          subtitle="Field work underway"
        />
        <StatCard
          title="Resolved & Verified"
          value={resolved}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Fixed with proof"
        />
      </div>

      {/* VOLUNTEER SPECIFIC HUB: Post Progress & Attach Proof */}
      {isVolunteer && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border-2 border-purple-200 dark:border-purple-800/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Volunteer Field Action Hub</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inspect open grievances, post work progress updates, and upload visual proof photos.
              </p>
            </div>

            <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-extrabold text-xs">
              {userComplaints.filter(c => c.status !== 'Resolved').length} Open Tasks
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {userComplaints.slice(0, 5).map(c => (
              <div key={c.id} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">{c.id}</span>
                    <StatusBadge status={c.status} size="sm" />
                    <PriorityBadge priority={c.priority} size="sm" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{c.title}</h4>
                  <p className="text-xs text-slate-500">📍 {c.village} ({c.wardNumber}) • Citizen: {c.citizenName}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    onClick={() => navigateTo('complaint_details', c.id)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => setSelectedComplaintForProgress(c)}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Update Progress & Proof
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
            const catCount = userComplaints.filter(c => c.category === cat.title).length;
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

      {/* Recent Grievances List */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Grievances</h3>
          <button
            onClick={() => navigateTo('my_complaints')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            View All ({total})
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
          {userComplaints.slice(0, 4).map(c => (
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

      {/* Progress Update Modal for Volunteer */}
      {selectedComplaintForProgress && (
        <ProgressUpdateModal
          isOpen={!!selectedComplaintForProgress}
          onClose={() => setSelectedComplaintForProgress(null)}
          complaint={selectedComplaintForProgress}
        />
      )}
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
