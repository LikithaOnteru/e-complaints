import React from 'react';

export const LoadingSkeleton: React.FC<{ type?: 'card' | 'table' | 'details' }> = ({ type = 'card' }) => {
  if (type === 'table') {
    return (
      <div className="w-full space-y-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-12 bg-slate-100 dark:bg-slate-700/60 rounded-xl skeleton-shimmer" />
        ))}
      </div>
    );
  }

  if (type === 'details') {
    return (
      <div className="space-y-6 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-2/3 skeleton-shimmer" />
        <div className="h-64 bg-slate-100 dark:bg-slate-700 rounded-xl skeleton-shimmer" />
        <div className="space-y-2">
          <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-full skeleton-shimmer" />
          <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-4/5 skeleton-shimmer" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-32 bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 space-y-3">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 skeleton-shimmer" />
          <div className="h-8 bg-slate-300 dark:bg-slate-600 rounded w-1/3 skeleton-shimmer" />
        </div>
      ))}
    </div>
  );
};
