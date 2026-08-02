import React from 'react';
import { useApp } from '../context/AppContext';
import { CategoryPieChart } from '../components/charts/CategoryPieChart';
import { MonthlyBarChart } from '../components/charts/MonthlyBarChart';
import { StatCard } from '../components/ui/StatCard';
import { BarChart2, TrendingUp, Clock, MapPin, Zap, ShieldCheck } from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const { complaints } = useApp();

  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const efficiencyRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Real-Time Analytics</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Deep insights into grievance trends, departmental efficiency, and high-density resolution zones.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-xs font-bold text-emerald-700 dark:text-emerald-300">
          Resolution Efficiency: {efficiencyRate}%
        </div>
      </div>

      {/* Analytics Insight Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Most Common Complaint"
          value="Road Damage"
          icon={TrendingUp}
          color="blue"
          subtitle="32% of total grievances"
        />
        <StatCard
          title="Average Resolution Time"
          value="2.4 Days"
          icon={Clock}
          color="emerald"
          trend="-15% faster vs last month"
        />
        <StatCard
          title="Highest Complaint Area"
          value="Rampur (Sector 3)"
          icon={MapPin}
          color="rose"
          subtitle="8 Active grievances"
        />
        <StatCard
          title="Resolution Efficiency"
          value={`${efficiencyRate}%`}
          icon={ShieldCheck}
          color="purple"
          subtitle="Target 90%+ resolution"
        />
      </div>

      {/* Recharts Data Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Domain Breakdown</h3>
          <CategoryPieChart complaints={complaints} />
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Village-wise Resolution Efficiency</h3>
          <MonthlyBarChart complaints={complaints} />
        </div>
      </div>
    </div>
  );
};
