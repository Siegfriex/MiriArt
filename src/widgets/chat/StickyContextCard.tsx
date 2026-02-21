import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grade } from '../../shared/model/types';
import { Radar, Zap } from 'lucide-react';

interface StickyContextCardProps {
  grade: Grade;
  score: number;
  fixScope: 'StructureRebuild' | 'DetailTuning';
  isCollapsed: boolean;
}

const springConfig = { stiffness: 300, damping: 30 };

export const StickyContextCard: React.FC<StickyContextCardProps> = ({ 
  grade, 
  score, 
  fixScope, 
  isCollapsed 
}) => {
  return (
    <motion.div 
      className="absolute top-[3.5rem] left-0 w-full z-10 px-4"
      layout
      transition={springConfig}
    >
      <motion.div 
        className="glass rounded-xl overflow-hidden border border-white/10 shadow-soft"
        animate={{ 
          backgroundColor: isCollapsed ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
        }}
        layout
      >
        <AnimatePresence mode="wait">
          {isCollapsed ? (
            // COLLAPSED STATE (Min)
            <motion.div 
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-between items-center p-2.5 h-[48px]"
            >
               <div className="flex gap-3 items-center">
                   <div className="bg-lime-400 text-dark-900 font-extrabold rounded-md w-7 h-7 flex items-center justify-center text-xs shadow-glow">
                       {grade}
                   </div>
                   <div className="flex flex-col">
                       <span className="text-[10px] text-gray-400 leading-none">Score</span>
                       <span className="text-sm font-bold text-white leading-none">{score}</span>
                   </div>
               </div>
               
               <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wide ${
                    fixScope === 'StructureRebuild' 
                    ? 'border-red-500/30 text-red-400 bg-red-500/10' 
                    : 'border-lime-400/30 text-lime-400 bg-lime-400/10'
               }`}>
                    <Zap size={10} fill="currentColor" />
                    {fixScope === 'StructureRebuild' ? 'Rebuild' : 'Tuning'}
               </div>
            </motion.div>
          ) : (
            // EXPANDED STATE (Max)
            <motion.div 
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4"
            >
               <div className="flex justify-between items-start mb-3">
                   <div className="flex items-center gap-3">
                       <div className="bg-lime-400 text-dark-900 w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-extrabold shadow-glow">
                           {grade}
                       </div>
                       <div>
                           <div className="text-xs text-gray-400 font-medium">Total Score</div>
                           <div className="text-2xl font-bold text-white tracking-tight">{score}<span className="text-sm text-gray-500 font-normal">/100</span></div>
                       </div>
                   </div>
                   
                   {/* Mini Radar Placeholder */}
                   <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                       <Radar size={20} className="text-gray-400" />
                   </div>
               </div>

               <div className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 border ${
                    fixScope === 'StructureRebuild' 
                    ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                    : 'bg-lime-400/10 border-lime-400/20 text-lime-400'
               }`}>
                    <Zap size={14} fill="currentColor" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                        {fixScope === 'StructureRebuild' ? 'Structure Rebuild Required' : 'Detail Tuning Recommended'}
                    </span>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};