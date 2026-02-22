/**
 * @fileoverview 플로팅 액션 버튼. 우측 하단 고정, 클릭 시 액션. 기본 Plus 아이콘.
 * @참조 Home, Archive, SessionListPanel
 * @라우팅 /app/home, /app/archive, /app/chat
 * @상태 (직접 사용 안 함)
 */

import React, { ReactNode } from 'react';
import { Plus } from 'lucide-react';

interface FABProps {
  icon?: ReactNode;
  onClick: () => void;
  className?: string;
  bottomOffset?: number;
}

/** FAB 컴포넌트. icon, onClick, bottomOffset. */
export const FAB: React.FC<FABProps> = ({ 
  icon = <Plus size={28} strokeWidth={2.5} />, 
  onClick, 
  className = '',
  bottomOffset = 96
}) => {
  return (
    <button 
      onClick={onClick}
      style={{ bottom: `${bottomOffset}px` }}
      className={`fixed right-5 w-14 h-14 bg-primary-lime rounded-full flex items-center justify-center shadow-glow text-text-inverse z-nav hover:scale-105 active:scale-95 transition-transform duration-200 animate-spring-up ${className}`}
    >
      {icon}
    </button>
  );
};
