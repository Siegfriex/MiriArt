import React from 'react';
import { ModalType, useModalStore } from '../../shared/model/modalStore';
import { GradeInputSheet } from '../../features/grade/ui/GradeInputSheet';
import { SubscriptionSheet } from '../../features/subscription/ui/SubscriptionSheet';
import { UploadFlow } from '../../features/upload/UploadFlow';
import { ConfirmDialog } from '../../shared/ui/modal/ConfirmDialog';
import { H2, BodyText } from '../../shared/ui/Typography';
import { Button } from '../../shared/ui/Button';

// Internal: ConfirmCreditModal
const ConfirmCreditModal: React.FC<{ cost: number; onConfirm: () => void; message?: string }> = ({ 
  cost, 
  onConfirm, 
  message 
}) => {
  const { closeModal } = useModalStore();
  return (
    <div className="p-6 text-center space-y-4">
      <div className="w-12 h-12 bg-lime-400/20 rounded-full flex items-center justify-center mx-auto text-lime-400 font-bold text-xl">
        !
      </div>
      <div>
        <H2>Use {cost} Credit?</H2>
        <BodyText className="mt-2 text-sm">{message || "This action will consume credits."}</BodyText>
      </div>
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" fullWidth onClick={closeModal}>Cancel</Button>
        <Button fullWidth onClick={() => { onConfirm(); closeModal(); }}>Confirm</Button>
      </div>
    </div>
  );
};

// Maps key -> Component
export const MODAL_REGISTRY: Record<ModalType, React.FC<any>> = {
  GRADE_INPUT: GradeInputSheet,
  SUBSCRIPTION: SubscriptionSheet,
  CONFIRM_CREDIT: ConfirmCreditModal,
  CONFIRM: ConfirmDialog,
  UPLOAD_FLOW: UploadFlow,
};

// Maps key -> Layout Type
export const LAYOUT_CONFIG: Record<ModalType, 'center' | 'bottom-sheet' | 'full'> = {
  GRADE_INPUT: 'bottom-sheet',
  SUBSCRIPTION: 'bottom-sheet',
  CONFIRM_CREDIT: 'center',
  CONFIRM: 'center',
  UPLOAD_FLOW: 'full', // Handled as full screen overlay, but registry needs a key.
};