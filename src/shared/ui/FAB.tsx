import React, { ReactNode } from 'react';
import { Plus } from 'lucide-react';

interface FABProps {
  icon?: ReactNode;
  onClick: () => void;
  className?: string;
  bottomOffset?: number; // Distance from bottom in px (default usually accounts for bottom nav)
}

export const FAB: React.FC<FABProps> = ({ 
  icon = <Plus size={28} strokeWidth={2.5} />, 
  onClick, 
  className = '',
  bottomOffset = 96 // Default bottom-24 (6rem = 96px)
}) => {
  return (
    <button 
      onClick={onClick}
      style={{ bottom: `${bottomOffset}px` }}
      className={`fixed right-5 w-14 h-14 bg-lime-400 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(194,249,112,0.4)] text-dark-900 z-40 hover:scale-105 active:scale-95 transition-transform duration-200 animate-spring-up ${className}`}
    >
      {icon}
    </button>
  );
};