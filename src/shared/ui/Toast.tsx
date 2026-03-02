/**
 * @fileoverview 전역 토스트 컨테이너. useToastStore의 toasts 렌더링. success/error/info 스타일.
 * @참조 App.tsx (전역 마운트)
 * @라우팅 전역
 * @상태 useToastStore (toasts, dismiss)
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore } from '../model/toastStore';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const STYLES = {
  success: 'bg-primary-lime text-text-inverse',
  error: 'bg-semantic-error text-white',
  info: 'bg-surface-alt text-text-primary border border-border-default',
};

/** 토스트 컨테이너. useToastStore toasts 렌더링. @참조 App.tsx @상태 useToastStore */
export const ToastContainer: React.FC = () => {
  const { toasts, dismiss } = useToastStore();

  return (
    <div className="fixed bottom-24 left-0 right-0 flex flex-col items-center gap-2 z-toast pointer-events-none px-4">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-full shadow-elevated font-medium text-sm max-w-xs ${STYLES[toast.type]}`}
            >
              <Icon size={16} className="flex-shrink-0" />
              <span className="flex-1">{toast.message}</span>
              <button
                onClick={() => dismiss(toast.id)}
                className="ml-1 opacity-70 hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
