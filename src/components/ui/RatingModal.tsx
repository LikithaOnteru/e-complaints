import React, { useState } from 'react';
import { Modal } from './Modal';
import { useApp } from '../../context/AppContext';
import { Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaintId: string;
}

export const RatingModal: React.FC<RatingModalProps> = ({ isOpen, onClose, complaintId }) => {
  const { addRating, t } = useApp();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRating(complaintId, rating, feedback);
    
    // Confetti explosion for review submission!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.ratingTitle}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {t.ratingPrompt} ({complaintId})
        </p>

        <div className="flex items-center justify-center gap-2 py-4">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-transform hover:scale-125 focus:outline-none"
            >
              <Star
                className={`w-8 h-8 ${
                  (hoverRating || rating) >= star
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
              />
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {t.description}
          </label>
          <textarea
            rows={3}
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder="..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all active:scale-95 btn-ripple"
          >
            {t.ratingSubmit}
          </button>
        </div>
      </form>
    </Modal>
  );
};

