import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ModernDropdown({ value, onChange, options, placeholder, className = "", direction = "down" }) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  let posClass = 'mt-2 top-full';
  let initY = -10;

  if (direction === 'up') {
    posClass = 'bottom-full mb-2';
    initY = 10;
  } else if (direction === 'responsive-up') {
    posClass = 'bottom-full mb-2 lg:bottom-auto lg:top-full lg:mb-0 lg:mt-2';
    initY = 0;
  }

  return (
    <div className={`relative ${isOpen ? 'z-[60]' : 'z-10'} ${className}`}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-900 border-2 border-slate-600 hover:border-blue-500 rounded-lg p-3 text-left text-white focus:outline-none focus:border-blue-500 font-medium shadow-sm transition flex justify-between items-center"
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <svg className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform ${isOpen ? (direction === 'up' || direction === 'responsive-up' ? '-rotate-180' : 'rotate-180') : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: initY }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: initY }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 w-full ${posClass} bg-slate-800 border border-slate-600 rounded-lg shadow-xl overflow-hidden`}
          >
            <div className="max-h-80 overflow-y-auto py-1">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${value === opt.value ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-700'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>}
    </div>
  );
}
