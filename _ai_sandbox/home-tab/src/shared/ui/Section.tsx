/**
 * @fileoverview 섹션 UI. 제목, 부제목, 액션 버튼, children. 홈 등 페이지에서 사용.
 * @참조 pages/home/ui/Page
 * @상태 (직접 사용 안 함)
 */

import React, { ReactNode } from 'react';
import { H2 } from './Typography';

interface SectionProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** 섹션 컴포넌트. title, subtitle, action, children. */
export const Section: React.FC<SectionProps> = ({ 
  title, 
  subtitle, 
  action, 
  children, 
  className = '' 
}) => {
  return (
    <section className={`flex flex-col gap-4 ${className}`}>
      <div className="flex justify-between items-end">
        <div>
          <H2 className="text-white">{title}</H2>
          {subtitle && <p className="text-xs text-text-mid mt-1">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
};
