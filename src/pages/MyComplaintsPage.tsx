import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PriorityBadge } from '../components/ui/PriorityBadge';
import { FileText, Search, Filter, ExternalLink, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export const MyComplaintsPage: React.FC = () => {
  const { complaints, currentUser, navigateTo } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const citizenComplaints = complaints.filter(
    c => c.citizenEmail === currentUser?.email || c.citizenName === currentUser?.name
  );

  const filtered = citizenComplaints.filter(c => {
    const matchCat = filterCategory === 'All' || c.category === filterCategory;
    const matchStatus = filterStatus === 'All' || c.status === filterStatus;
    const matchSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.village.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">My Grievances History</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Complete history of grievances submitted by you with status tracking & officer remarks.
          </p>
        </div>

        <button
          onClick={() => navigateTo('register_complaint')}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all hover:scale-105 btn-ripple"
        >
          <Plus className="w-4 h-4" />
          Register New Complaint
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search title, ID, village..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold outline-none"
          />
        </div>

        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold outline-none"
        >
          <option value="All">All Categories</option>
          <option value="Road Damage">Road Damage</option>
          <option value="Drainage">Drainage</option>
          <option value="Water Supply">Water Supply</option>
          <option value="Garbage">Garbage</option>
          <option value="Street Light">Street Light</option>
          <option value="Electricity">Electricity</option>
          <option value="Sanitation">Sanitation</option>
          <option value="Others">Others</option>
        </select>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Complaint Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-700 space-y-3">
          <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Complaints Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No grievances match your selected filters. Try clearing search filters or file a new complaint.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map(c => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigateTo('complaint_details', c.id)}
              className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-xl transition-all duration-200 cursor-pointer space-y-4 flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{c.id}</span>
                  <StatusBadge status={c.status} size="sm" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{c.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={c.priority} size="sm" />
                  <span>📍 {c.village}</span>
                </div>
                <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  View <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
