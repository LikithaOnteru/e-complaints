import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-500 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/90 dark:bg-emerald-950/90',
    info: 'border-blue-200 dark:border-blue-800 bg-blue-50/90 dark:bg-blue-950/90',
    warning: 'border-amber-200 dark:border-amber-800 bg-amber-50/90 dark:bg-amber-950/90',
    error: 'border-rose-200 dark:border-rose-800 bg-rose-50/90 dark:bg-rose-950/90',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md text-slate-800 dark:text-slate-100 min-w-[280px] max-w-md ${borders[toast.type]}`}
        >
          {icons[toast.type]}
          <p className="text-sm font-medium flex-1">{toast.message}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
