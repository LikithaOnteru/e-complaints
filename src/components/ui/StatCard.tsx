import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: 'blue' | 'amber' | 'emerald' | 'rose' | 'purple';
  trend?: string;
  subtitle?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
  subtitle,
  onClick,
}) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400',
      border: 'border-blue-100 dark:border-blue-900/50',
      accent: 'from-blue-500 to-blue-600',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
      border: 'border-amber-100 dark:border-amber-900/50',
      accent: 'from-amber-500 to-amber-600',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-100 dark:border-emerald-900/50',
      accent: 'from-emerald-500 to-emerald-600',
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400',
      border: 'border-rose-100 dark:border-rose-900/50',
      accent: 'from-rose-500 to-rose-600',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
      border: 'border-purple-100 dark:border-purple-900/50',
      accent: 'from-purple-500 to-purple-600',
    },
  };

  const currentTheme = colorMap[color];

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md border ${currentTheme.border} transition-all duration-200 group ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
          {trend && (
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
              {trend}
            </span>
          )}
        </div>
        <div className={`p-3.5 rounded-xl ${currentTheme.bg} transition-transform group-hover:scale-110 duration-200`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${currentTheme.accent}`} />
    </div>
  );
};
