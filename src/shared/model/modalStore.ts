/**
 * @fileoverview 전역 모달 타입 및 상태. GRADE_INPUT, SUBSCRIPTION, CONFIRM_CREDIT, CONFIRM, UPLOAD_FLOW.
 * @참조 ModalProvider, ModalRegistry, GlobalModal, GradeInputSheet, SubscriptionSheet, UploadFlow 등
 * @라우팅 (전역 - 모든 페이지에서 openModal 호출)
 * @상태 zustand (activeModal, modalProps)
 */

import { create } from 'zustand';

/** 사용 가능한 모달 타입 */
export type ModalType = 'GRADE_INPUT' | 'SUBSCRIPTION' | 'CONFIRM_CREDIT' | 'CONFIRM' | 'UPLOAD_FLOW' | 'WRITE_POST_SHEET';

/** 각 모달 타입별 props 매핑 */
export interface ModalPropsMap {
  GRADE_INPUT: Record<string, never>;
  SUBSCRIPTION: { currentPlan?: string };
  CONFIRM_CREDIT: { 
    cost: number; 
    onConfirm: () => void; 
    message?: string; 
  };
  CONFIRM: {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    isDestructive?: boolean;
  };
  UPLOAD_FLOW: {
    onComplete?: (file: File) => void;
  };
  WRITE_POST_SHEET: Record<string, never>;
}

interface ModalState {
  activeModal: ModalType | null;
  modalProps: any; // Type-safe at call-site via generic
  
  /** 타입 안전 open. ModalType에 맞는 props 필요 */
  openModal: <T extends ModalType>(type: T, props?: ModalPropsMap[T]) => void;
  closeModal: () => void;
}

/**
 * 모달 스토어 훅. openModal(type, props), closeModal() 제공.
 * @참조 ModalProvider, ModalRegistry, GlobalModal, GradeInputSheet, SubscriptionSheet, UploadFlow
 * @상태 activeModal, modalProps
 */
export const useModalStore = create<ModalState>((set) => ({
  activeModal: null,
  modalProps: {},
  openModal: (type, props) => set({ activeModal: type, modalProps: props || {} }),
  closeModal: () => set({ activeModal: null, modalProps: {} }),
}));