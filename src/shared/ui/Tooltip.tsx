/**
 * @fileoverview 툴팁. hover/click 시 content 표시. placement: top | bottom.
 * @참조 ArtworkGrid
 * @라우팅 /app/archive
 * @상태 useState (isVisible)
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  placement?: 'top' | 'bottom';
}

/** 툴팁 컴포넌트. content, placement. @참조 ArtworkGrid */
export const Tooltip: React.FC<TooltipProps> = ({ content, children, placement = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => setIsVisible((v) => !v)}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: placement === 'top' ? 5 : -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`absolute left-1/2 -translate-x-1/2 z-toast w-max max-w-[220px] px-3 py-1.5 bg-surface-alt border border-border-default text-text-primary text-xs rounded-lg shadow-elevated pointer-events-none ${
              placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
            }`}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
};
