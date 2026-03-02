/**
 * @fileoverview 확인 다이얼로그. title, message, onConfirm, onCancel. useModalStore CONFIRM 타입용.
 * @참조 ModalRegistry, GlobalModal (CONFIRM 모달로 등록)
 * @라우팅 전역 (모달)
 * @상태 useModalStore (closeModal)
 */

import React from 'react';
import { H2, BodyText } from '../../ui/Typography';
import { Button } from '../../ui/Button';
import { useModalStore } from '../../model/modalStore';
import { STRINGS } from '../../config/strings';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isDestructive?: boolean;
}

/** 확인 다이얼로그. title, message, onConfirm, onCancel, isDestructive. @참조 ModalRegistry @상태 useModalStore */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  confirmLabel = STRINGS.CONFIRM,
  cancelLabel = STRINGS.CANCEL,
  onConfirm,
  onCancel,
  isDestructive = false,
}) => {
  const { closeModal } = useModalStore();

  const handleConfirm = () => {
    onConfirm();
    closeModal();
  };

  const handleCancel = () => {
    onCancel?.();
    closeModal();
  };

  return (
    <div className="p-6 text-center space-y-4">
      <div>
        <H2 className={isDestructive ? 'text-semantic-error' : 'text-text-primary'}>{title}</H2>
        <BodyText className="mt-2 text-sm text-text-mid">{message}</BodyText>
      </div>
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" fullWidth onClick={handleCancel}>
          {cancelLabel}
        </Button>
        <Button
          fullWidth
          onClick={handleConfirm}
          className={isDestructive ? 'bg-semantic-error hover:brightness-110 text-white shadow-none' : ''}
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
};
