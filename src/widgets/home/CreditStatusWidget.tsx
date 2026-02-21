import React from 'react';
import { Button } from '../../shared/ui/Button';
import { Zap } from 'lucide-react';

interface CreditStatusWidgetProps {
  credits: number;
  maxCredits?: number;
  onUpgrade?: () => void;
}

export const CreditStatusWidget: React.FC<CreditStatusWidgetProps> = ({
  credits,
  maxCredits = 20,
  onUpgrade
}) => {
  const percentage = Math.min((credits / maxCredits) * 100, 100);

  return (
    <div className="rounded-xl bg-dark-800 p-4 border border-white/5 flex justify-between items-center relative overflow-hidden shadow-sm">
      {/* Background Progress Bar (Subtle) */}
      <div 
        className="absolute bottom-0 left-0 h-1 bg-lime-400/20" 
        style={{ width: `${percentage}%` }} 
      />
      
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-lime-400/10 flex items-center justify-center border border-lime-400/20">
          <Zap className="text-lime-400" size={20} fill="currentColor" />
        </div>
        <div>
           <div className="text-xs text-gray-400 mb-0.5">Available Credits</div>
           <div className="text-xl font-bold text-white font-sans leading-none">
             {credits} <span className="text-sm text-gray-600 font-normal">/ {maxCredits}</span>
           </div>
        </div>
      </div>
      
      <Button variant="secondary" className="px-4 py-2 h-auto text-xs" onClick={onUpgrade}>
        Charge
      </Button>
    </div>
  );
};