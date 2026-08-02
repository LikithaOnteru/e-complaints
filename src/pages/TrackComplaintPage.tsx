import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, CheckCircle2, Clock, ShieldCheck, Wrench, UserCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PriorityBadge } from '../components/ui/PriorityBadge';
import { motion } from 'framer-motion';

export const TrackComplaintPage: React.FC = () => {
  const { complaints, selectedComplaintId, navigateTo } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>(selectedComplaintId || 'ERC-2026-001');

  // Search logic
  const targetComplaint = complaints.find(
    c => c.id.toLowerCase() === searchQuery.trim().toLowerCase() ||
         c.title.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
         c.village.toLowerCase().includes(searchQuery.trim().toLowerCase())
  ) || complaints[0];

  const stages = ['Complaint Registered', 'Under Review', 'Assigned', 'Work Started', 'Resolved'];
  
  const getStageIndex = (status: string) => {
    switch (status) {
      case 'Pending': return 1;
      case 'In Progress': return 3;
      case 'Resolved': return 4;
      case 'Rejected': return -1;
      default: return 0;
    }
  };

  const currentStageIndex = targetComplaint ? getStageIndex(targetComplaint.status) : 0;
  const progressPercent = currentStageIndex === -1 ? 100 : ((currentStageIndex + 1) / stages.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header & Search Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 dark:border-slate-700 space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Track Grievance Progress</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search by Complaint ID (e.g. ERC-2026-001) to view real-time status and assigned field officer.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by Complaint ID (e.g., ERC-2026-001) or Village name..."
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm font-semibold transition-all shadow-xs"
          />
          <button
            onClick={() => {}}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
          >
            Search
          </button>
        </div>
      </div>

      {/* Complaint Details Card */}
      {targetComplaint && (
        <motion.div
          key={targetComplaint.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-xl space-y-8"
        >
          {/* Top Info Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/60 pb-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xl font-black text-blue-600 dark:text-blue-400">{targetComplaint.id}</span>
                <PriorityBadge priority={targetComplaint.priority} />
                <StatusBadge status={targetComplaint.status} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-2 leading-snug">
                {targetComplaint.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                📍 {targetComplaint.village} ({targetComplaint.wardNumber}) • Registered on {targetComplaint.createdAt}
              </p>
            </div>

            <button
              onClick={() => navigateTo('complaint_details', targetComplaint.id)}
              className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800 flex items-center gap-2"
            >
              Full Case Details
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Overall Resolution Progress</span>
              <span>{Math.round(progressPercent)}% Completed</span>
            </div>
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  targetComplaint.status === 'Resolved'
                    ? 'bg-emerald-500'
                    : targetComplaint.status === 'Rejected'
                    ? 'bg-rose-500'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Status Timeline */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Status Timeline Visualization
            </h4>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 dark:border-slate-700 space-y-8 my-4">
              {stages.map((stageName, idx) => {
                const isPassed = currentStageIndex >= idx;
                const isCurrent = currentStageIndex === idx;

                const timelineEvent = targetComplaint.timeline.find(t => t.stage.toLowerCase() === stageName.toLowerCase()) || 
                  (idx === 0 ? targetComplaint.timeline[0] : null);

                return (
                  <div key={stageName} className="relative group">
                    {/* Circle Node */}
                    <div
                      className={`absolute -left-[31px] sm:-left-[39px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                        isPassed
                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-md'
                          : isCurrent
                          ? 'bg-blue-600 border-blue-600 text-white animate-pulse'
                          : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400'
                      }`}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-bold">{idx + 1}</span>
                      )}
                    </div>

                    {/* Step Details */}
                    <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center justify-between gap-2">
                        <h5 className={`text-sm font-bold ${isPassed ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                          {stageName}
                        </h5>
                        {timelineEvent && (
                          <span className="text-[11px] font-semibold text-slate-400">{timelineEvent.timestamp}</span>
                        )}
                      </div>

                      {timelineEvent ? (
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{timelineEvent.description}</p>
                      ) : (
                        <p className="text-xs text-slate-400 italic mt-1">Pending stage completion</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assigned Officer Card */}
          {targetComplaint.assignedOfficer ? (
            <div className="p-5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Assigned Official</p>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{targetComplaint.assignedOfficer.name}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {targetComplaint.assignedOfficer.department} {targetComplaint.assignedOfficer.contact ? `• ${targetComplaint.assignedOfficer.contact}` : ''}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Officer assignment under process by Gram Panchayat Desk.</span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
