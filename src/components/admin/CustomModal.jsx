import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================
// TOAST NOTIFICATION (auto-dismiss success/error/warning)
// ============================================================
export function Toast({ isOpen, type = 'success', message, onClose }) {
  const config = {
    success: {
      icon: '✅',
      bg: 'bg-emerald-900/90 border-emerald-500/40',
      text: 'text-emerald-300',
    },
    error: {
      icon: '❌',
      bg: 'bg-red-900/90 border-red-500/40',
      text: 'text-red-300',
    },
    warning: {
      icon: '⚠️',
      bg: 'bg-amber-900/90 border-amber-500/40',
      text: 'text-amber-300',
    },
  };

  const c = config[type] || config.success;

  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => onClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`fixed top-6 right-6 z-[500] ${c.bg} backdrop-blur-xl border rounded-xl px-5 py-4 shadow-2xl max-w-sm flex items-start gap-3 cursor-pointer`}
          onClick={onClose}
        >
          <span className="text-xl flex-shrink-0 mt-0.5">{c.icon}</span>
          <div>
            <p className={`text-sm font-medium ${c.text} leading-relaxed`}>{message}</p>
            <p className="text-[10px] text-slate-500 mt-1">Klik untuk menutup</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// CONFIRM MODAL (replaces window.confirm)
// ============================================================
export function ConfirmModal({ isOpen, title, message, confirmText = 'Ya, Lanjutkan', cancelText = 'Batal', onConfirm, onCancel, variant = 'danger' }) {
  if (!isOpen) return null;

  const variants = {
    danger: {
      icon: '🗑️',
      iconBg: 'bg-red-500/20 border-red-500/30',
      iconText: 'text-red-500',
      btn: 'bg-red-600 hover:bg-red-700 shadow-red-900/50',
    },
    warning: {
      icon: '⚠️',
      iconBg: 'bg-amber-500/20 border-amber-500/30',
      iconText: 'text-amber-500',
      btn: 'bg-amber-600 hover:bg-amber-700 shadow-amber-900/50',
    },
    info: {
      icon: 'ℹ️',
      iconBg: 'bg-blue-500/20 border-blue-500/30',
      iconText: 'text-blue-500',
      btn: 'bg-blue-600 hover:bg-blue-700 shadow-blue-900/50',
    },
  };

  const v = variants[variant] || variants.danger;

  return (
    <div className="fixed inset-0 z-[500] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl"
      >
        <div className={`w-16 h-16 ${v.iconBg} ${v.iconText} rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border`}>
          {v.icon}
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2.5 px-4 rounded-xl transition border border-slate-700"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 ${v.btn} text-white font-medium py-2.5 px-4 rounded-xl transition shadow-lg`}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
