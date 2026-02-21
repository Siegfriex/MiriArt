import React from 'react';

interface FilterChipProps {
  label: string;
  selected?: boolean;
  onClick: () => void;
  className?: string;
}

export const FilterChip: React.FC<FilterChipProps> = ({ label, selected = false, onClick, className = '' }) => {
  return (
    <button 
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap border transition-colors ${
        selected 
          ? 'bg-lime-400 text-dark-900 border-lime-400 font-bold' 
          : 'bg-transparent text-gray-400 border-white/10 hover:border-white/20'
      } ${className}`}
    >
      {label}
    </button>
  );
};