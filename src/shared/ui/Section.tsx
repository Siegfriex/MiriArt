import React, { ReactNode } from 'react';
import { H2 } from './Typography';

interface SectionProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

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
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
};