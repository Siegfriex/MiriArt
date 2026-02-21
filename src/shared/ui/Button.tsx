import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '', 
  isLoading,
  disabled,
  fullWidth = false,
  ...props 
}) => {
  // VID v1.1 §2.3 Radius Medium (12px)
  const baseStyles = "relative inline-flex items-center justify-center rounded-medium font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
  
  const variants = {
    // Primary: Lime #C2F970 + Inverse Text
    primary: "bg-primary-lime text-text-inverse hover:brightness-110 shadow-glow",
    // Secondary: Dark 800 + White Text
    secondary: "bg-dark-800 text-text-primary border border-white/10 hover:bg-dark-700",
    // Ghost: Transparent + Secondary Text
    ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/5",
    // Outline: Transparent + Lime Border
    outline: "bg-transparent border border-primary-lime text-primary-lime hover:bg-primary-lime/10"
  };

  const sizes = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-3 text-body",
    lg: "px-6 py-4 text-subhead",
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
      {children}
    </button>
  );
};