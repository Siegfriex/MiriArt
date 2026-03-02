/**
 * @fileoverview 체크리스트 뷰. items, 진행률 바, 토글. ArtifactViewer 내부에서 사용.
 * @참조 ArtifactViewer
 * @라우팅 (모달/아티팩트 내부)
 * @상태 useState (items)
 */

import React, { useState } from 'react';
import { BodyText } from '../../../shared/ui/Typography';
import { Check } from 'lucide-react';

/** 체크리스트 항목: id, label, checked */
export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

/** 체크리스트 뷰. items. @참조 ArtifactViewer @상태 items */
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
             <span className="text-text-mid">진행률</span>
             <span className="text-primary-lime font-bold">{progress}%</span>
          </div>
          <div className="h-2 bg-surface-tertiary rounded-full overflow-hidden border border-border-default">
             <div className="h-full bg-primary-lime transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
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
                   ? 'bg-primary-lime/5 border-primary-lime/20' 
                   : 'bg-surface-alt/50 border-border-default hover:bg-surface-alt'
               }`}
             >
                <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                   item.checked
                     ? 'bg-primary-lime border-primary-lime'
                     : 'border-text-low group-hover:border-text-mid'
                }`}>
                   {item.checked && <Check size={14} className="text-text-inverse stroke-[3]" />}
                </div>
                <BodyText className={`${item.checked ? 'text-text-mid line-through' : 'text-text-primary'} text-sm`}>
                   {item.label}
                </BodyText>
             </div>
          ))}
       </div>
    </div>
  );
};
