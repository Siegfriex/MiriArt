import { create } from 'zustand';

// 1. Define available Modal Types
export type ModalType = 'GRADE_INPUT' | 'SUBSCRIPTION' | 'CONFIRM_CREDIT' | 'CONFIRM' | 'UPLOAD_FLOW';

// 2. Define Props for each Modal
export interface ModalPropsMap {
  GRADE_INPUT: { initialData?: any };
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

// 3. Store State Interface
interface ModalState {
  activeModal: ModalType | null;
  modalProps: any; // Type-safe at call-site via generic
  
  /**
   * Type-safe open function.
   * Requires props matching the specific ModalType.
   */
  openModal: <T extends ModalType>(type: T, props?: ModalPropsMap[T]) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  activeModal: null,
  modalProps: {},
  openModal: (type, props) => set({ activeModal: type, modalProps: props || {} }),
  closeModal: () => set({ activeModal: null, modalProps: {} }),
}));