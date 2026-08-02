import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCircle2, ShieldCheck, Info, ExternalLink, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, navigateTo } = useApp();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Notifications Center</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time updates on status changes, officer assignments, and field progress.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === 'unread'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Unread ({notifications.filter(n => !n.read).length})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-700 text-slate-400">
            <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="font-bold text-sm">No notifications found</p>
          </div>
        ) : (
          filtered.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => {
                markNotificationRead(n.id);
                if (n.complaintId) navigateTo('complaint_details', n.complaintId);
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !n.read
                  ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/80 shadow-xs'
                  : 'bg-white dark:bg-slate-800 border-slate-200/80 dark:border-slate-700 opacity-80'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0">
                {n.type === 'resolved' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : n.type === 'officer_assigned' ? (
                  <ShieldCheck className="w-5 h-5" />
                ) : (
                  <Info className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{n.title}</h4>
                  <span className="text-[10px] text-slate-400 font-semibold">{n.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{n.message}</p>
              </div>

              <ExternalLink className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
