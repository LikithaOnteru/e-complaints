import React from 'react';
import { StatusType } from '../../types';
import { Clock, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface StatusBadgeProps {
  status: StatusType;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showIcon = true, size = 'md' }) => {
  const { t } = useApp();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  };

  const getDetails = () => {
    switch (status) {
      case 'Pending':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          icon: Clock,
          iconColor: 'text-amber-500',
          label: t.statusPending || 'Pending'
        };
      case 'In Progress':
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
          icon: Loader2,
          iconColor: 'text-blue-500 animate-spin',
          label: t.statusInProgress || 'In Progress'
        };
      case 'Resolved':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          icon: CheckCircle2,
          iconColor: 'text-emerald-500',
          label: t.statusResolved || 'Resolved'
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
          icon: XCircle,
          iconColor: 'text-rose-500',
          label: t.statusRejected || 'Rejected'
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: Clock,
          iconColor: 'text-slate-400',
          label: status
        };
    }
  };

  const { bg, icon: Icon, iconColor, label } = getDetails();

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border shadow-xs ${bg} ${sizeClasses[size]}`}>
      {showIcon && <Icon className={`w-3.5 h-3.5 ${iconColor}`} />}
      <span>{label}</span>
    </span>
  );
};

