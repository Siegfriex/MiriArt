import React from 'react';
import { motion } from 'framer-motion';

const ITEMS = [
  "🔥 User293 just got an 'A' Grade on Basic Design!",
  "🎓 Hongik Univ. acceptance probability calculated for User102.",
  "✨ New analysis completed in 7.2 seconds.",
  "🚀 Premium Plan upgrade by User888."
];

export const LiveTicker: React.FC = () => {
  return (
    <div className="w-full overflow-hidden bg-lime-400/5 border-y border-lime-400/10 py-2 mb-4">
      <motion.div 
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        {[...ITEMS, ...ITEMS, ...ITEMS].map((text, i) => (
          <span key={i} className="text-xs font-medium text-lime-400/80 inline-flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
             {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
};