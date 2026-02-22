/**
 * @fileoverview 전역 모달 타입 및 상태. UPLOAD_FLOW, SUBSCRIPTION 등.
 * @참조 Home Page (openModal 호출)
 * @상태 zustand (activeModal, modalProps)
 */

import { create } from 'zustand';

/** 사용 가능한 모달 타입 (홈 탭에서 사용) */
export type ModalType = 'GRADE_INPUT' | 'SUBSCRIPTION' | 'CONFIRM_CREDIT' | 'CONFIRM' | 'UPLOAD_FLOW';

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
}

interface ModalState {
  activeModal: ModalType | null;
  modalProps: any;
  openModal: <T extends ModalType>(type: T, props?: ModalPropsMap[T]) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  activeModal: null,
  modalProps: {},
  openModal: (type, props) => set({ activeModal: type, modalProps: props || {} }),
  closeModal: () => set({ activeModal: null, modalProps: {} }),
}));
