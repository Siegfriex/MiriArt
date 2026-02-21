import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'glass' | 'ghost' | 'solid';
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ 
  children, 
  variant = 'ghost', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "p-2 rounded-full transition-all duration-200 flex items-center justify-center active:scale-90";
  
  const variants = {
    glass: "bg-black/40 backdrop-blur-[20px] text-text-primary border border-white/10 hover:bg-black/60",
    ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/5",
    solid: "bg-dark-800 text-text-primary border border-white/10 hover:bg-dark-700"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};