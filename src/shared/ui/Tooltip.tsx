import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  placement?: 'top' | 'bottom';
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, placement = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => setIsVisible(!isVisible)} // Mobile tap support
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: placement === 'top' ? 5 : -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`absolute left-1/2 -translate-x-1/2 z-50 w-max max-w-[200px] px-3 py-1.5 bg-gray-800 border border-white/10 text-white text-xs rounded-lg shadow-lg pointer-events-none ${
              placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
            }`}
          >
            {content}
            {/* Arrow */}
            <div 
              className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 border-r border-b border-white/10 rotate-45 ${
                placement === 'top' ? '-bottom-1 border-t-0 border-l-0' : '-top-1 border-b-0 border-r-0 rotate-[225deg]'
              }`} 
            />
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
};