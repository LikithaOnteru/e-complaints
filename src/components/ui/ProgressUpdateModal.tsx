import React, { useState } from 'react';
import { Modal } from './Modal';
import { Complaint, StatusType } from '../../types';
import { useApp } from '../../context/AppContext';
import { Camera, Upload, CheckCircle2, FileImage } from 'lucide-react';

interface ProgressUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint;
}

const SAMPLE_PROOF_PHOTOS = [
  {
    name: 'Road Repair Completed',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Drain Cleared & Cleaned',
    url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Street Light Fixed',
    url: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Garbage Cleared',
    url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800',
  },
];

export const ProgressUpdateModal: React.FC<ProgressUpdateModalProps> = ({
  isOpen,
  onClose,
  complaint,
}) => {
  const { addProgressUpdate, showToast } = useApp();

  const [stage, setStage] = useState<string>('Work Progress Updated');
  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState<StatusType>(complaint.status === 'Pending' ? 'In Progress' : complaint.status);
  const [progressPercent, setProgressPercent] = useState<number>(50);
  const [proofUrl, setProofUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file size should be less than 5MB', 'warning');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setProofUrl(reader.result as string);
      setIsUploading(false);
      showToast('Proof photo uploaded successfully!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      showToast('Please provide details about the work progress', 'warning');
      return;
    }

    addProgressUpdate(complaint.id, {
      stage: stage || 'Progress Update',
      description: description.trim(),
      status,
      proofUrl: proofUrl || undefined,
      progressPercent,
    });

    onClose();
    // Reset form
    setDescription('');
    setProofUrl('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Post Grievance Progress: ${complaint.id}`}>
      <form onSubmit={handleSubmit} className="space-y-5 text-xs text-slate-800 dark:text-slate-200">
        {/* Complaint info summary */}
        <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-1">
          <p className="font-bold text-blue-950 dark:text-blue-100">{complaint.title}</p>
          <p className="text-[11px] text-slate-600 dark:text-slate-300">
            📍 {complaint.village} ({complaint.wardNumber}) • Current Status: <strong>{complaint.status}</strong>
          </p>
        </div>

        {/* Update Title / Stage */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Progress Stage / Title
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
            {[
              'Site Inspected',
              'Material Deployed',
              'Work Started',
              '50% Completed',
              'Final Repair Done',
              'Resolved & Verified',
            ].map(preset => (
              <button
                key={preset}
                type="button"
                onClick={() => setStage(preset)}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all text-center ${
                  stage === preset
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={stage}
            onChange={e => setStage(e.target.value)}
            placeholder="e.g. Field team deployed asphalt patch"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Update Status & Progress Percentage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Update Status
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as StatusType)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold outline-none"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Progress Completed
              </label>
              <span className="font-extrabold text-blue-600 dark:text-blue-400">{progressPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={progressPercent}
              onChange={e => setProgressPercent(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Progress Notes / Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Field Progress Description / Notes
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe what work was carried out by the team, materials used, next steps, or confirmation details..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Upload Proof Photo */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-purple-600" />
              Attach Proof Picture / Field Photo
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Optional but recommended</span>
          </label>

          {/* Upload input */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <label className="w-full flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl border-2 border-dashed border-purple-300 dark:border-purple-800/80 bg-purple-50/50 dark:bg-purple-950/30 hover:bg-purple-100/50 cursor-pointer transition-colors text-purple-700 dark:text-purple-300 font-bold">
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'Uploading Image...' : 'Upload Photo from Device'}</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {/* Proof URL Input */}
          <div className="pt-1">
            <input
              type="text"
              value={proofUrl}
              onChange={e => setProofUrl(e.target.value)}
              placeholder="Or paste image URL (https://...)"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs outline-none"
            />
          </div>

          {/* Preset Sample Proof Photos */}
          <div className="space-y-1.5 pt-1">
            <p className="text-[11px] font-semibold text-slate-500">Or select a sample proof photo:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAMPLE_PROOF_PHOTOS.map(sample => (
                <button
                  key={sample.name}
                  type="button"
                  onClick={() => {
                    setProofUrl(sample.url);
                    showToast(`Selected "${sample.name}" proof image`, 'info');
                  }}
                  className={`group relative rounded-xl overflow-hidden border text-left transition-all h-20 ${
                    proofUrl === sample.url
                      ? 'ring-2 ring-purple-600 border-purple-600'
                      : 'border-slate-200 dark:border-slate-700 hover:border-purple-400'
                  }`}
                >
                  <img src={sample.url} alt={sample.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent p-1.5 flex items-end">
                    <span className="text-[10px] font-bold text-white leading-tight truncate">{sample.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Image Preview Box */}
          {proofUrl && (
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                  <FileImage className="w-3.5 h-3.5" />
                  Proof Photo Attached
                </span>
                <button
                  type="button"
                  onClick={() => setProofUrl('')}
                  className="text-[10px] text-rose-500 font-bold hover:underline"
                >
                  Remove Photo
                </button>
              </div>
              <div className="relative rounded-xl overflow-hidden max-h-48 bg-black">
                <img src={proofUrl} alt="Attached Proof" className="w-full h-48 object-cover" />
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold shadow-lg shadow-purple-500/25 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Post Progress & Proof
          </button>
        </div>
      </form>
    </Modal>
  );
};
