/**
 * @fileoverview 전역 모달 컨테이너. modalRegistry, layoutConfig로 모달 타입별 컴포넌트·레이아웃 매핑.
 * @참조 ModalProvider, ModalRegistry
 * @라우팅 전역
 * @상태 useModalStore (activeModal, modalProps, closeModal)
 */

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useModalStore, ModalType } from '../../model/modalStore';
import { X } from 'lucide-react';

/** GlobalModal props: modalRegistry, layoutConfig */
export interface GlobalModalProps {
  modalRegistry: Record<ModalType, React.FC<any>>;
  layoutConfig: Record<ModalType, 'center' | 'bottom-sheet' | 'full'>;
}

/** 전역 모달. modalRegistry, layoutConfig. @참조 ModalProvider @상태 useModalStore */
export const GlobalModal: React.FC<GlobalModalProps> = ({ modalRegistry, layoutConfig }) => {
  const { activeModal, modalProps, closeModal } = useModalStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // 모달 열림 시 배경 스크롤 잠금 (모바일에서 sticky/모달 겹침 방지)
  useEffect(() => {
    if (activeModal) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [activeModal]);

  if (!mounted) return null;

  const modalRoot = document.getElementById('modal-root') || document.body;
  const Component = activeModal ? modalRegistry[activeModal] : null;
  const layoutType = activeModal ? layoutConfig[activeModal] : 'center';
  const isBottomSheet = layoutType === 'bottom-sheet';
  const isFull = layoutType === 'full';

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
        <div
          className={`fixed inset-0 z-modal flex ${
            isBottomSheet ? 'items-end' : isFull ? '' : 'items-center justify-center'
          }`}
        >
          {/* 백드롭 */}
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

          {/* 모달 컨테이너 */}
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`
              relative z-10 w-full overflow-hidden shadow-2xl
              ${isBottomSheet
                ? 'rounded-t-large bg-surface-alt border-t border-border-default max-h-[90vh]'
                : isFull
                  ? 'h-full bg-surface'
                  : 'max-w-sm rounded-large bg-surface-alt border border-border-default m-4'
              }
            `}
          >
            {/* 드래그 핸들 (Bottom Sheet) */}
            {isBottomSheet && (
              <div className="w-full flex justify-center pt-3 pb-1 cursor-grab" onClick={closeModal}>
                <div className="w-12 h-1.5 bg-dark-600 rounded-full" />
              </div>
            )}

            {/* 닫기 버튼 (Center) */}
            {!isBottomSheet && !isFull && (
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-text-mid hover:text-text-primary z-20 transition-colors"
              >
                <X size={20} />
              </button>
            )}

            {/* 컴포넌트 렌더 */}
            <Component {...modalProps} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    modalRoot
  );
};
