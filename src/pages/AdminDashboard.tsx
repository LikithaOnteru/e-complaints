import React from 'react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/ui/StatCard';
import { CategoryPieChart } from '../components/charts/CategoryPieChart';
import { MonthlyBarChart } from '../components/charts/MonthlyBarChart';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PriorityBadge } from '../components/ui/PriorityBadge';
import { 
  ShieldCheck, 
  FileText, 
  Clock, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  BarChart2, 
  MapPin, 
  ArrowRight,
  ExternalLink,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminDashboard: React.FC = () => {
  const { complaints, navigateTo, t } = useApp();

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'Pending').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const critical = complaints.filter(c => c.priority === 'High' && c.status !== 'Resolved').length;

  const urgentComplaints = complaints.filter(c => c.priority === 'High' && c.status !== 'Resolved');

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Admin Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            Local Authority Control Panel
          </span>
          <h2 className="text-3xl font-black">{t.adminDashboardTitle}</h2>
          <p className="text-slate-400 text-sm">
            Managing rural grievances across Andhra Pradesh Grama Sachivalayams. Real-time statistics & officer assignment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('admin_complaints')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all btn-ripple"
          >
            {t.myComplaints} ({total})
          </button>
        </div>
      </div>

      {/* Statistics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title={t.totalComplaints}
          value={total}
          icon={FileText}
          color="blue"
          onClick={() => navigateTo('admin_complaints')}
        />
        <StatCard
          title={t.pendingCount}
          value={pending}
          icon={Clock}
          color="amber"
        />
        <StatCard
          title={t.inProgressCount}
          value={inProgress}
          icon={Loader2}
          color="purple"
        />
        <StatCard
          title={t.resolvedCount}
          value={resolved}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title={t.highPriority}
          value={critical}
          icon={AlertCircle}
          color="rose"
          subtitle={t.statusPending}
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart: Complaints by Category */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Complaints by Category</h3>
              <p className="text-xs text-slate-500">Distribution across civic utility domains</p>
            </div>
            <BarChart2 className="w-5 h-5 text-blue-600" />
          </div>
          <CategoryPieChart complaints={complaints} />
        </div>

        {/* Bar Chart: Complaints by Village */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Grievances per Village Sector</h3>
              <p className="text-xs text-slate-500">Comparing total vs resolved count</p>
            </div>
            <Users className="w-5 h-5 text-emerald-600" />
          </div>
          <MonthlyBarChart complaints={complaints} />
        </div>
      </div>

      {/* Urgent Unassigned / High Priority Table Snippet */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Urgent High-Priority Issues ({urgentComplaints.length})</h3>
          </div>

          <button
            onClick={() => navigateTo('admin_complaints')}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            View Full List →
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
          {urgentComplaints.slice(0, 5).map(c => (
            <div
              key={c.id}
              onClick={() => navigateTo('complaint_details', c.id)}
              className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/40 px-3 rounded-xl transition-colors cursor-pointer"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-red-600">{c.id}</span>
                  <PriorityBadge priority={c.priority} size="sm" />
                  <StatusBadge status={c.status} size="sm" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{c.title}</h4>
                <p className="text-xs text-slate-500">📍 {c.village} ({c.wardNumber}) • {c.createdAt}</p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateTo('admin_complaints');
                }}
                className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700 shrink-0"
              >
                Assign / Action
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
