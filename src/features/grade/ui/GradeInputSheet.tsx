import React, { useState } from 'react';
import { H2, BodyText } from '../../../shared/ui/Typography';
import { Button } from '../../../shared/ui/Button';
import { useModalStore } from '../../../shared/model/modalStore';

interface GradeInputSheetProps {
  initialData?: {
    korean: number;
    math: number;
    english: number;
    inquiry: number;
  };
}

export const GradeInputSheet: React.FC<GradeInputSheetProps> = ({ initialData }) => {
  const { closeModal } = useModalStore();
  
  // Use initialData from props or default values
  const [grades, setGrades] = useState(initialData || {
    korean: 3,
    math: 4,
    english: 2,
    inquiry: 3
  });

  const handleChange = (subject: keyof typeof grades, val: number) => {
    setGrades(prev => ({ ...prev, [subject]: val }));
  };

  const handleSave = () => {
    // API Call logic here
    console.log("Saving grades:", grades);
    closeModal();
  };

  return (
    <div className="p-6 space-y-6 pb-8">
      <div className="text-center">
        <H2>Academic Grades</H2>
        <BodyText className="text-sm mt-1">
          Input your mock exam grades for accurate acceptance prediction.
        </BodyText>
      </div>

      <div className="space-y-6">
         <div className="grid grid-cols-2 gap-4">
            {(['korean', 'english', 'math', 'inquiry'] as const).map((subject) => (
              <div key={subject} className="bg-white/5 rounded-xl p-3 flex flex-col items-center">
                 <span className="text-gray-400 text-xs mb-2 capitalize">{subject}</span>
                 <input 
                   type="number" 
                   min="1" max="9"
                   value={grades[subject]}
                   onChange={(e) => handleChange(subject, parseInt(e.target.value) || 0)}
                   className="bg-dark-900 w-12 h-12 text-center rounded-lg text-white font-bold text-lg focus:ring-1 focus:ring-lime-400 outline-none"
                 />
              </div>
            ))}
         </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="secondary" fullWidth onClick={closeModal}>Skip</Button>
        <Button fullWidth onClick={handleSave}>Save Grades</Button>
      </div>
    </div>
  );
};