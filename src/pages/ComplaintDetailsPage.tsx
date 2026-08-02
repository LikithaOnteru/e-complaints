import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PriorityBadge } from '../components/ui/PriorityBadge';
import { RatingModal } from '../components/ui/RatingModal';
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  Clock, 
  Send, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';

export const ComplaintDetailsPage: React.FC = () => {
  const { complaints, selectedComplaintId, currentUser, navigateTo, addRemark } = useApp();
  const [newRemarkText, setNewRemarkText] = useState<string>('');
  const [ratingModalOpen, setRatingModalOpen] = useState<boolean>(false);

  const complaint = complaints.find(c => c.id === selectedComplaintId) || complaints[0];

  if (!complaint) return null;

  const handleAddRemark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRemarkText.trim()) return;
    addRemark(complaint.id, newRemarkText.trim());
    setNewRemarkText('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo(currentUser?.role === 'admin' ? 'admin_complaints' : 'my_complaints')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Complaints List
        </button>

        <div className="flex items-center gap-2">
          <PriorityBadge priority={complaint.priority} />
          <StatusBadge status={complaint.status} />
        </div>
      </div>

      {/* Main Details Box */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-xl space-y-8"
      >
        {/* Title Header */}
        <div className="space-y-2 border-b border-slate-100 dark:border-slate-700/60 pb-6">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800">
              {complaint.id}
            </span>
            <span className="text-xs font-semibold text-slate-500">{complaint.category}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
            {complaint.title}
          </h2>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-blue-600" />
              {complaint.village} ({complaint.wardNumber}) {complaint.landmark ? `• ${complaint.landmark}` : ''}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-slate-400" />
              Registered: {complaint.createdAt}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-4 h-4 text-slate-400" />
              By: {complaint.citizenName}
            </span>
          </div>
        </div>

        {/* Photo Evidence Preview */}
        {complaint.imageUrl && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Photo Evidence Uploaded
            </h4>
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 max-h-96">
              <img
                src={complaint.imageUrl}
                alt={complaint.title}
                className="w-full h-full object-cover max-h-96"
              />
            </div>
          </div>
        )}

        {/* Full Description */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Grievance Description
          </h4>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            {complaint.description}
          </div>
        </div>

        {/* Rate Service Banner (If Resolved) */}
        {complaint.status === 'Resolved' && (
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Grievance Resolved Successfully</span>
              </div>
              {complaint.rating ? (
                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                  You rated this service {complaint.rating} ★ {complaint.feedbackText ? `("${complaint.feedbackText}")` : ''}
                </p>
              ) : (
                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                  Please rate the resolution quality provided by the assigned department.
                </p>
              )}
            </div>

            {!complaint.rating && (
              <button
                onClick={() => setRatingModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 shrink-0"
              >
                <Star className="w-4 h-4 fill-white" />
                Rate Resolution Service
              </button>
            )}
          </div>
        )}

        {/* Timeline Log */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Official Timeline & Updates
          </h4>
          <div className="space-y-3">
            {complaint.timeline.map(t => (
              <div key={t.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 text-xs flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{t.stage}</p>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">{t.description}</p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">{t.timestamp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Remarks & Discussion Log */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            Remarks & Discussion Log ({complaint.remarks.length})
          </h4>

          {complaint.remarks.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No remarks posted yet.</p>
          ) : (
            <div className="space-y-3">
              {complaint.remarks.map(r => (
                <div
                  key={r.id}
                  className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                    r.role === 'admin'
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {r.author} {r.role === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />}
                    </span>
                    <span className="text-[10px] text-slate-400">{r.timestamp}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add Remark Input Form */}
          <form onSubmit={handleAddRemark} className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={newRemarkText}
              onChange={e => setNewRemarkText(e.target.value)}
              placeholder="Add additional remarks or update details..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-xs font-medium"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 shrink-0 btn-ripple"
            >
              <Send className="w-3.5 h-3.5" />
              Post Remark
            </button>
          </form>
        </div>
      </motion.div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
        complaintId={complaint.id}
      />
    </div>
  );
};
