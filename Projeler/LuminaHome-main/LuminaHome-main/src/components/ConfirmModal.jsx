import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Emin misiniz?', 
  message = 'Bu işlemi geri alamayacaksınız.', 
  confirmText = 'Evet, Sil', 
  cancelText = 'Vazgeç' 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="w-full max-w-sm glass-panel rounded-3xl p-6 border border-[#f8d7e7] dark:border-[#6f5260] shadow-2xl space-y-4 animate-zoom-in text-[#3f2a35] dark:text-[#fff7fb] bg-white dark:bg-[#2a2029]">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 text-rose-500">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-display font-extrabold text-base tracking-tight">{title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message */}
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2.5 justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-xs shadow-md shadow-rose-500/20 cursor-pointer transition-colors"
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmModal;
