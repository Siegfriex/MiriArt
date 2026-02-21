import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ containerClassName = '', className = '', ...props }) => {
  return (
    <div className={`relative ${containerClassName}`}>
       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
       <input 
          type="text" 
          className={`w-full bg-dark-800 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-lime-400 placeholder-gray-600 border border-white/5 ${className}`}
          {...props}
       />
    </div>
  );
};