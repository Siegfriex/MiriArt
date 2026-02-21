import React, { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  hasBottomNav?: boolean;
}

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