import React from 'react';
import { Inbox } from 'lucide-react';
import { H3, BodyText } from '../../shared/ui/Typography';
import { Button } from '../../shared/ui/Button';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ElementType;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = Inbox
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center h-full min-h-[300px]">
      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5">
        <Icon size={32} className="text-gray-500" />
      </div>
      <H3 className="text-white mb-2">{title}</H3>
      {description && <BodyText className="text-sm text-gray-400 mb-6 max-w-xs">{description}</BodyText>}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="secondary" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};