import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { H3, BodyText } from './Typography';

interface AccordionItemProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ title, subtitle, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-dark-800 rounded-xl border border-white/5 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="text-left">
          <div className="text-white font-medium text-sm">{title}</div>
          {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="text-gray-500" size={20} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="p-4 pt-0 border-t border-white/5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};