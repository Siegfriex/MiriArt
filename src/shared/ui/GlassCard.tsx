import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'panel' | 'active';
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  variant = 'default', 
  className = '',
  onClick,
  ...props 
}) => {
  // VID v1.1 §1.1 Ethereal Utility
  // backdrop-blur-[20px] is strictly enforced
  const baseStyles = "rounded-large transition-all duration-300 border backdrop-blur-[20px]";
  
  const variants = {
    // Default: Light glass overlay on dark background
    default: "bg-white/5 border-white/10 shadow-soft",
    // Panel: Darker glass for drawers/modals
    panel: "bg-dark-800/80 border-white/5 shadow-soft",
    // Active: Lime tint for selected states
    active: "bg-primary-lime/10 border-primary-lime/30",
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