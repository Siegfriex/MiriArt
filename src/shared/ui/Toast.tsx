import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Simple Toast store for demo (can be expanded to global store)
// For now, this is a UI component to be used where needed or controlled via props
interface ToastProps {
  message: string;
  isVisible: boolean;
  type?: 'success' | 'error' | 'info';
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, type = 'info' }) => {
  const bgColors = {
    success: 'bg-lime-400 text-dark-900',
    error: 'bg-red-500 text-white',
    info: 'bg-dark-800 text-white border border-white/10'
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-[60] px-4 py-2.5 rounded-full shadow-lg font-medium text-sm ${bgColors[type]}`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};