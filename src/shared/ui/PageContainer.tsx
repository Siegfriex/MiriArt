/**
 * @fileoverview 페이지 컨테이너. 레이아웃, padding, BottomNav 여백(hasBottomNav).
 * @참조 Home, Archive, Profile
 * @라우팅 /app/home, /app/archive, /app/profile
 * @상태 (직접 사용 안 함)
 */

import React, { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  hasBottomNav?: boolean;
}

/** 페이지 컨테이너. children, hasBottomNav. @참조 Home, Archive, Profile */
export const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className = '', 
  hasBottomNav = true 
}) => {
  return (
    <div 
      className={`
        flex flex-col min-h-full px-5 py-6 space-y-6 relative 
        ${hasBottomNav ? 'pb-24' : 'pb-6'} 
        ${className}
      `}
    >
      {children}
    </div>
  );
};