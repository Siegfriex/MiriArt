import React, { useState } from 'react';
import { BodyText } from '../../../shared/ui/Typography';
import { Check } from 'lucide-react';

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export const ChecklistView: React.FC<{ items: ChecklistItem[] }> = ({ items: initialItems }) => {
  const [items, setItems] = useState(initialItems);

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const checkedCount = items.filter(i => i.checked).length;
  const progress = items.length > 0 ? Math.round((checkedCount / items.length) * 100) : 0;

  return (
    <div className="p-6 space-y-6">
       {/* Progress Bar */}
       <div className="space-y-2">
          <div className="flex justify-between text-xs">
             <span className="text-gray-400">Progress</span>
             <span className="text-lime-400 font-bold">{progress}%</span>
          </div>
          <div className="h-2 bg-dark-900 rounded-full overflow-hidden border border-white/5">
             <div className="h-full bg-lime-400 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
       </div>

       {/* List */}
       <div className="space-y-3">
          {items.map((item) => (
             <div 
               key={item.id} 
               onClick={() => toggleItem(item.id)}
               className={`group flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                 item.checked 
                   ? 'bg-lime-400/5 border-lime-400/20' 
                   : 'bg-dark-800/50 border-white/5 hover:bg-dark-800'
               }`}
             >
                <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                   item.checked ? 'bg-lime-400 border-lime-400' : 'border-gray-500 group-hover:border-gray-400'
                }`}>
                   {item.checked && <Check size={14} className="text-dark-900 stroke-[3]" />}
                </div>
                <BodyText className={`${item.checked ? 'text-gray-400 line-through' : 'text-gray-200'} text-sm`}>
                   {item.label}
                </BodyText>
             </div>
          ))}
       </div>
    </div>
  );
};