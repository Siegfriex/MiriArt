/**
 * @fileoverview 글래스 카드. variant(default/panel/active), backdrop-blur. 카드형 UI.
 * @참조 Archive, ArtifactViewer 등
 * @라우팅 /app/archive
 * @상태 (직접 사용 안 함)
 */

import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'panel' | 'active';
  className?: string;
  onClick?: () => void;
}

/** 글래스 카드. variant, onClick. @참조 Archive, ArtifactViewer */
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'default',
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = 'rounded-large transition-all duration-300 border backdrop-blur-[20px]';

  const variants = {
    default: 'bg-white/5 border-white/10 shadow-soft',
    panel: 'bg-dark-800/80 border-white/5 shadow-soft',
    active: 'bg-primary-lime/10 border-primary-lime/30',
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};
