import React from 'react';
import { H2, BodyText } from '../../ui/Typography';
import { Button } from '../../ui/Button';
import { useModalStore } from '../../model/modalStore';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isDestructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
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
    if (onCancel) onCancel();
    closeModal();
  };

  return (
    <div className="p-6 text-center space-y-4">
      <div>
        <H2 className={isDestructive ? 'text-red-500' : 'text-white'}>{title}</H2>
        <BodyText className="mt-2 text-sm text-gray-400">{message}</BodyText>
      </div>
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" fullWidth onClick={handleCancel}>
          {cancelLabel}
        </Button>
        <Button 
          fullWidth 
          onClick={handleConfirm}
          className={isDestructive ? 'bg-red-500 hover:bg-red-600 text-white shadow-none' : ''}
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
};