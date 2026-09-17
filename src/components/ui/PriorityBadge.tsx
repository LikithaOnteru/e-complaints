import React from 'react';
import { PriorityType } from '../../types';
import { AlertCircle, AlertTriangle, ArrowDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface PriorityBadgeProps {
  priority: PriorityType;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const { t } = useApp();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
  };

  const getStyle = () => {
    switch (priority) {
      case 'High':
        return {
          bg: 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/80',
          icon: AlertCircle,
          iconColor: 'text-red-600 dark:text-red-400',
          label: t.priorityHigh || 'High Priority'
        };
      case 'Medium':
        return {
          bg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/80',
          icon: AlertTriangle,
          iconColor: 'text-amber-600 dark:text-amber-400',
          label: t.priorityMedium || 'Medium Priority'
        };
      case 'Low':
        return {
          bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          icon: ArrowDown,
          iconColor: 'text-slate-500',
          label: t.priorityLow || 'Low Priority'
        };
    }
  };

  const { bg, icon: Icon, iconColor, label } = getStyle();

  return (
    <span className={`inline-flex items-center gap-1 rounded-md border ${bg} ${sizeClasses[size]}`}>
      <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
      <span>{label}</span>
    </span>
  );
};

