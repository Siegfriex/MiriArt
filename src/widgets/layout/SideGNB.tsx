import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { H2 } from '../../shared/ui/Typography';
import { X, Plus, ChevronRight, ChevronLeft } from 'lucide-react';
import { SearchBar } from '../../shared/ui/SearchBar';

interface SideGNBProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
}

const springConfig = { stiffness: 300, damping: 30 };

export const SideGNB: React.FC<SideGNBProps> = ({ isOpen, onClose, onNewChat }) => {
  const [isFullWidth, setIsFullWidth] = useState(false);

  // Reset state when closed
  React.useEffect(() => {
    if (!isOpen) setIsFullWidth(false);
  }, [isOpen]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    
    // Dragging Right (Positive X) -> Expand or Close?
    // Current design: Left Drawer.
    // 0% (Left Edge) -> 100% (Right Edge)
    // Closed is -100%. Open is 0%.
    
    // If we are in Partial Mode (80% width)
    if (!isFullWidth) {
        // Drag right significantly -> Go Full
        if (offset.x > 50 || velocity.x > 200) {
            setIsFullWidth(true);
        }
        // Drag left significantly -> Close
        else if (offset.x < -50 || velocity.x < -200) {
            onClose();
        }
    } 
    // If we are in Full Mode
    else {
        // Drag left -> Go Partial
        if (offset.x < -50 || velocity.x < -200) {
            setIsFullWidth(false);
        }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ 
                x: '0%',
                width: isFullWidth ? '100%' : '80%'
            }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', ...springConfig }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }} // We handle snap via logic, constraint to avoid flying off
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            className="fixed top-0 left-0 h-full z-50 glass-panel border-r border-white/10 flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
               <div className="flex items-center gap-2">
                   <H2>Sessions</H2>
                   <span className="text-[10px] bg-lime-400/20 text-lime-400 px-1.5 py-0.5 rounded font-bold">
                       {isFullWidth ? 'FULL' : 'QUICK'}
                   </span>
               </div>
               <div className="flex items-center gap-2">
                   <button 
                     onClick={() => setIsFullWidth(!isFullWidth)} 
                     className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-full"
                   >
                     {isFullWidth ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                   </button>
                   <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full">
                     <X size={24} />
                   </button>
               </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
               {isFullWidth && (
                   <motion.div 
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     className="mb-4"
                   >
                       {/* Full Mode Generic Search Bar */}
                       <SearchBar placeholder="Search history..." />
                   </motion.div>
               )}

               <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-bold uppercase">Recent History</span>
               </div>
               
               {/* Mock Recent List */}
               {[1, 2, 3, 4, 5].map((i) => (
                 <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer border border-transparent hover:border-lime-400/30 transition-colors">
                    <div className="w-12 h-12 rounded-lg bg-gray-700 flex-shrink-0 overflow-hidden relative">
                        <img src={`https://picsum.photos/100/100?random=${i}`} className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <span className="text-xs font-bold text-white">A-</span>
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="text-sm text-white truncate font-medium">Composition Analysis {i}</div>
                       <div className="text-xs text-gray-500 truncate flex items-center gap-1">
                          <span>Hongik Univ.</span>
                          <span className="w-1 h-1 bg-gray-600 rounded-full" />
                          <span>2h ago</span>
                       </div>
                    </div>
                 </div>
               ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-md">
               <button 
                 onClick={onNewChat}
                 className="w-full py-3.5 rounded-xl bg-lime-400 text-dark-900 font-bold flex items-center justify-center gap-2 shadow-glow hover:brightness-110 transition-all active:scale-95"
               >
                 <Plus size={20} />
                 New Session
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};