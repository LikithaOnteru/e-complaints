import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CategoryType, PriorityType } from '../types';
import { detectAICategory, detectAIPriority, checkSmartDuplicate } from '../utils/aiHelper';
import { saveStoredDraft, getStoredDraft } from '../utils/storage';
import { 
  FilePlus, 
  Sparkles, 
  AlertTriangle, 
  MapPin, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  Save, 
  Info, 
  ShieldAlert,
  Image as ImageIcon
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

const SAMPLE_DEMO_PHOTOS = [
  { name: 'Road Pothole', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80' },
  { name: 'Water Pipe Leak', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80' },
  { name: 'Broken Streetlight', url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80' },
  { name: 'Garbage Dump', url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80' },
];

export const RegisterComplaintPage: React.FC = () => {
  const { currentUser, addComplaint, complaints, navigateTo, showToast } = useApp();

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<CategoryType>('Road Damage');
  const [village, setVillage] = useState<string>('Rampur');
  const [wardNumber, setWardNumber] = useState<string>('Ward 3');
  const [landmark, setLandmark] = useState<string>('');
  const [priority, setPriority] = useState<PriorityType>('Medium');
  const [imageUrl, setImageUrl] = useState<string>(SAMPLE_DEMO_PHOTOS[0].url);

  // AI states
  const [aiSuggestedCat, setAiSuggestedCat] = useState<{ suggestedCategory: CategoryType; confidence: number; reasoning: string } | null>(null);
  const [aiPriorityAlert, setAiPriorityAlert] = useState<{ suggestedPriority: PriorityType; reasons: string[] } | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<any | null>(null);

  // Success modal state
  const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false);
  const [generatedId, setGeneratedId] = useState<string>('');

  // Restore draft on mount
  useEffect(() => {
    const draft = getStoredDraft();
    if (draft) {
      setTitle(draft.title || '');
      setDescription(draft.description || '');
      if (draft.category) setCategory(draft.category);
      if (draft.village) setVillage(draft.village);
      if (draft.wardNumber) setWardNumber(draft.wardNumber);
      if (draft.priority) setPriority(draft.priority);
      if (draft.imageUrl) setImageUrl(draft.imageUrl);
    }
  }, []);

  // Real-time AI Categorization & Priority & Duplicate Detection
  useEffect(() => {
    if (description.length > 5 || title.length > 5) {
      // AI Category
      const catRes = detectAICategory(description, title);
      setAiSuggestedCat(catRes);

      // AI Priority
      const prioRes = detectAIPriority(description, title);
      setAiPriorityAlert(prioRes);
      if (prioRes.suggestedPriority === 'High') {
        setPriority('High');
      }

      // Duplicate Check
      const dup = checkSmartDuplicate(title, description, village, complaints);
      setDuplicateWarning(dup);
    } else {
      setAiSuggestedCat(null);
      setAiPriorityAlert(null);
      setDuplicateWarning(null);
    }
  }, [description, title, village, complaints]);

  // Auto save draft to LocalStorage
  const handleSaveDraft = () => {
    saveStoredDraft({ title, description, category, village, wardNumber, priority, imageUrl });
    showToast('Offline Draft saved successfully!', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      showToast('Please enter complaint title and description', 'warning');
      return;
    }

    const newId = addComplaint({
      title,
      description,
      category,
      village,
      wardNumber,
      landmark,
      priority,
      imageUrl,
      citizenName: currentUser?.name || 'Anonymous Citizen',
      citizenEmail: currentUser?.email || 'guest@ap.gov.in',
      coordinates: {
        lat: 25.3180 + (Math.random() - 0.5) * 0.02,
        lng: 82.9739 + (Math.random() - 0.5) * 0.02,
      },
    });

    // Clear draft
    saveStoredDraft(null);
    setGeneratedId(newId);
    setSuccessModalOpen(true);

    // Confetti Celebration
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FilePlus className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Register Grievance</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Submit your rural infrastructure complaint with photo evidence & AI categorization.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveDraft}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 transition-colors"
        >
          <Save className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          Save Offline Draft
        </button>
      </div>

      {/* Main Form Box */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700 shadow-xl space-y-6">
        
        {/* Smart Duplicate Warning Alert */}
        {duplicateWarning && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-2"
          >
            <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <span>Smart Duplicate Detection Warning</span>
            </div>
            <p>
              A similar complaint titled <strong>"{duplicateWarning.title}"</strong> ({duplicateWarning.id}) is already registered in <strong>{duplicateWarning.village}</strong>.
            </p>
            <button
              type="button"
              onClick={() => navigateTo('complaint_details', duplicateWarning.id)}
              className="font-bold underline text-blue-700 dark:text-blue-400 hover:text-blue-900"
            >
              View Existing Complaint {duplicateWarning.id} →
            </button>
          </motion.div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Complaint Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g., Severe pothole on Main Market Road near bank"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm font-semibold transition-all"
            required
          />
        </div>

        {/* Description & AI Suggestions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Detailed Description *
            </label>
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> AI Engine Active
            </span>
          </div>

          <textarea
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe the problem, exact spot, safety hazard, and duration (e.g., water pipe burst causing road flooding)..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm font-medium transition-all"
            required
          />

          {/* AI Category Suggestion Chip */}
          {aiSuggestedCat && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/80 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-slate-700 dark:text-slate-200">
                  AI Suggestion: <strong>{aiSuggestedCat.suggestedCategory}</strong> ({aiSuggestedCat.confidence}% confidence)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCategory(aiSuggestedCat.suggestedCategory)}
                className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-xs"
              >
                Apply Category
              </button>
            </motion.div>
          )}

          {/* AI Priority Detection Alert */}
          {aiPriorityAlert && aiPriorityAlert.suggestedPriority === 'High' && (
            <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-800 dark:text-red-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>
                <strong>AI Priority Alert:</strong> Auto-upgraded to High Priority due to critical safety triggers: {aiPriorityAlert.reasons.join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* Category Dropdown & Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Category Dropdown *
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as CategoryType)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold"
            >
              <option value="Road Damage">Road Damage</option>
              <option value="Drainage">Drainage</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Garbage">Garbage</option>
              <option value="Street Light">Street Light</option>
              <option value="Electricity">Electricity</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Priority Level *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Low', 'Medium', 'High'] as PriorityType[]).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    priority === p
                      ? p === 'High'
                        ? 'bg-red-600 text-white border-red-600 shadow-md'
                        : p === 'Medium'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                        : 'bg-slate-700 text-white border-slate-700'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Location details */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700 space-y-4">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            Location Details
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Village Name *
              </label>
              <select
                value={village}
                onChange={e => setVillage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold outline-none"
              >
                <option value="Rampur">Rampur</option>
                <option value="Sundarpur">Sundarpur</option>
                <option value="Gopalpur">Gopalpur</option>
                <option value="Haripur">Haripur</option>
                <option value="Belpur">Belpur</option>
                <option value="Krishnanagar">Krishnanagar</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Ward Number *
              </label>
              <input
                type="text"
                value={wardNumber}
                onChange={e => setWardNumber(e.target.value)}
                placeholder="Ward 3"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Landmark / Spot
              </label>
              <input
                type="text"
                value={landmark}
                onChange={e => setLandmark(e.target.value)}
                placeholder="Near Water Tank / Bank"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold outline-none"
              />
            </div>
          </div>
        </div>

        {/* Upload Image & Sample Demo Photos */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Upload Image Evidence
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50 dark:bg-slate-900">
              <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Drag & Drop photo or paste image URL
              </p>
              <input
                type="text"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="mt-3 w-full px-3 py-1.5 rounded-lg border text-xs bg-white dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Quick Preset Sample Photos */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Quick Demo Photos (Click to Select):
              </p>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_DEMO_PHOTOS.map(sample => (
                  <button
                    key={sample.name}
                    type="button"
                    onClick={() => setImageUrl(sample.url)}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      imageUrl === sample.url
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 ring-2 ring-blue-500/50'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <img src={sample.url} alt={sample.name} className="w-9 h-9 rounded-lg object-cover" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{sample.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black text-base shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 btn-ripple"
        >
          Submit Grievance Complaint
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>

      {/* Success Modal */}
      <Modal isOpen={successModalOpen} onClose={() => setSuccessModalOpen(false)} title="Complaint Registered Successfully!">
        <div className="text-center space-y-4 py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Your Complaint ID</p>
            <h3 className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">{generatedId}</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
            Your grievance has been assigned to the Gram Panchayat nodal officer. You can track progress using your Complaint ID.
          </p>

          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setSuccessModalOpen(false);
                navigateTo('track_complaint', generatedId);
              }}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
            >
              Track Complaint Progress →
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
