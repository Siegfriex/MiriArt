import React from 'react';
import { H1, BodyText } from '../../../shared/ui/Typography';
import { Button } from '../../../shared/ui/Button';
import { UploadCloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useModalStore } from '../../../shared/model/modalStore';
import { Tooltip } from '../../../shared/ui/Tooltip';

export const FirstUploadTutorial: React.FC = () => {
  const navigate = useNavigate();
  const { openModal } = useModalStore();

  const handleStart = () => {
    navigate('/app/home');
    // We delay the modal open slightly to allow navigation to complete
    setTimeout(() => {
        openModal('UPLOAD_FLOW');
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-dark-900 z-[95] flex flex-col items-center justify-center p-8 text-center animate-fade-in">
       {/* Decorative Background */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-lime-400/5 rounded-full blur-3xl pointer-events-none" />

       <div className="relative z-10 flex flex-col items-center max-w-xs">
           <Tooltip content="Upload your work to start!">
               <div className="w-24 h-24 bg-dark-800 rounded-full flex items-center justify-center mb-8 border border-white/10 shadow-glow animate-pulse">
                  <UploadCloud className="text-lime-400" size={48} />
               </div>
           </Tooltip>
           
           <H1 className="text-white mb-4 leading-tight">Start Your First Analysis</H1>
           
           <BodyText className="text-gray-400 mb-10">
             Upload your artwork now to get an AI grade and pass probability prediction instantly.
           </BodyText>
           
           <Button size="lg" onClick={handleStart} className="w-full rounded-2xl h-14 text-base font-bold shadow-glow">
             Upload Now
           </Button>
       </div>
    </div>
  );
};