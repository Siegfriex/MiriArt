import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useModalStore, ModalType } from '../../model/modalStore';
import { X } from 'lucide-react';

export interface GlobalModalProps {
  modalRegistry: Record<ModalType, React.FC<any>>;
  layoutConfig: Record<ModalType, 'center' | 'bottom-sheet' | 'full'>;
}

export const GlobalModal: React.FC<GlobalModalProps> = ({ modalRegistry, layoutConfig }) => {
  const { activeModal, modalProps, closeModal } = useModalStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const modalRoot = document.getElementById('modal-root') || document.body;
  
  // Resolve Component & Layout from Props
  const Component = activeModal ? modalRegistry[activeModal] : null;
  const layoutType = activeModal ? layoutConfig[activeModal] : 'center';
  const isBottomSheet = layoutType === 'bottom-sheet';
  const isFull = layoutType === 'full';

  // Animation Variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const contentVariants = {
    hidden: isBottomSheet ? { y: '100%' } : isFull ? { opacity: 0 } : { scale: 0.9, opacity: 0 },
    visible: isBottomSheet 
      ? { y: 0, transition: { type: 'spring' as const, damping: 25, stiffness: 300 } } 
      : { scale: 1, opacity: 1, transition: { type: 'spring' as const, duration: 0.2 } },
    exit: isBottomSheet ? { y: '100%' } : isFull ? { opacity: 0 } : { scale: 0.9, opacity: 0 },
  };

  return createPortal(
    <AnimatePresence>
      {activeModal && Component && (
        <div className={`fixed inset-0 z-[100] flex ${isBottomSheet ? 'items-end' : isFull ? '' : 'items-center justify-center'}`}>
          {/* Backdrop (Skip for full screen if component handles its own background) */}
          {!isFull && (
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeModal}
            />
          )}

          {/* Modal Container */}
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`
              relative z-10 w-full overflow-hidden shadow-2xl
              ${isBottomSheet 
                ? 'rounded-t-[24px] bg-dark-800 border-t border-white/10 max-h-[90vh]' 
                : isFull 
                  ? 'h-full bg-dark-900' 
                  : 'max-w-sm rounded-[24px] bg-dark-800 border border-white/10 m-4'
              }
            `}
          >
            {/* Drag Handle (Bottom Sheet only) */}
            {isBottomSheet && (
              <div className="w-full flex justify-center pt-3 pb-1 cursor-grab" onClick={closeModal}>
                <div className="w-12 h-1.5 bg-gray-600 rounded-full opacity-50" />
              </div>
            )}

            {/* Close Button (Center only) */}
            {!isBottomSheet && !isFull && (
              <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-white z-20">
                <X size={20} />
              </button>
            )}

            {/* Render Registry Component with Props */}
            <Component {...modalProps} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    modalRoot
  );
};