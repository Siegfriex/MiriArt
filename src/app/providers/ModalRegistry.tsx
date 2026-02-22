/**
 * @fileoverview 모달 레지스트리. ModalType별 컴포넌트·레이아웃 매핑. MODAL_REGISTRY, LAYOUT_CONFIG export.
 * @참조 ModalProvider
 * @라우팅 전역
 * @상태 useModalStore
 */

import React from 'react';
import { ModalType, useModalStore } from '../../shared/model/modalStore';
import { GradeInputSheet } from '../../features/grade/ui/GradeInputSheet';
import { SubscriptionSheet } from '../../features/subscription/ui/SubscriptionSheet';
import { UploadFlow } from '../../features/upload/UploadFlow';
import { ConfirmDialog } from '../../shared/ui/modal/ConfirmDialog';
import { WritePostSheet } from '../../widgets/community/WritePostSheet';
import { H2, BodyText } from '../../shared/ui/Typography';
import { Button } from '../../shared/ui/Button';
import { STRINGS } from '../../shared/config/strings';

const ConfirmCreditModal: React.FC<{ cost: number; onConfirm: () => void; message?: string }> = ({
  cost,
  onConfirm,
  message,
}) => {
  const { closeModal } = useModalStore();
  return (
    <div className="p-6 text-center space-y-4">
      <div className="w-12 h-12 bg-primary-lime/20 rounded-full flex items-center justify-center mx-auto text-primary-lime font-bold text-xl">
        !
      </div>
      <div>
        <H2>{cost} 크레딧을 사용하시겠어요?</H2>
        <BodyText className="mt-2 text-sm">{message || '이 작업은 크레딧을 소모합니다.'}</BodyText>
      </div>
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" fullWidth onClick={closeModal}>
          {STRINGS.CANCEL}
        </Button>
        <Button fullWidth onClick={() => { onConfirm(); closeModal(); }}>
          {STRINGS.CONFIRM}
        </Button>
      </div>
    </div>
  );
};

/** 모달 타입별 컴포넌트 매핑 */
export const MODAL_REGISTRY: Record<ModalType, React.FC<any>> = {
  GRADE_INPUT: GradeInputSheet,
  SUBSCRIPTION: SubscriptionSheet,
  CONFIRM_CREDIT: ConfirmCreditModal,
  CONFIRM: ConfirmDialog,
  UPLOAD_FLOW: UploadFlow,
  WRITE_POST_SHEET: WritePostSheet,
};

/** 모달 타입별 레이아웃 (center | bottom-sheet | full) */
export const LAYOUT_CONFIG: Record<ModalType, 'center' | 'bottom-sheet' | 'full'> = {
  GRADE_INPUT: 'bottom-sheet',
  SUBSCRIPTION: 'bottom-sheet',
  CONFIRM_CREDIT: 'center',
  CONFIRM: 'center',
  UPLOAD_FLOW: 'full',
  WRITE_POST_SHEET: 'full',
};
