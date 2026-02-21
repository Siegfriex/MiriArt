import React, { useState } from 'react';
import { H2, BodyText } from '../../shared/ui/Typography';
import { Button } from '../../shared/ui/Button';
import { X, Image as ImageIcon, AlertCircle, ArrowLeft } from 'lucide-react';
import { useModalStore } from '../../shared/model/modalStore';

interface UploadFlowProps {
  onComplete?: (image: File) => void;
}

export const UploadFlow: React.FC<UploadFlowProps> = ({ onComplete }) => {
  const { closeModal } = useModalStore();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [type, setType] = useState<'basic' | 'major'>('basic');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      setStep(2);
    }
  };

  const handleAnalysisStart = () => {
    setStep(4);
    // Simulate AI Analysis Time
    setTimeout(() => {
      if (selectedImage) {
        if (onComplete) onComplete(selectedImage);
        closeModal();
      }
    }, 3000);
  };

  // Step 1: Image Picker
  if (step === 1) {
    return (
      <div className="fixed inset-0 z-[60] bg-dark-900 flex flex-col">
        <header className="h-14 flex items-center justify-between px-4 border-b border-white/5">
           <button onClick={closeModal}><X className="text-white" /></button>
           <span className="text-white font-medium">New Analysis</span>
           <div className="w-6" />
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
           <div className="text-center space-y-2">
             <H2 className="text-white">Select Artwork</H2>
             <BodyText>Choose a photo from your gallery.</BodyText>
           </div>
           
           <label className="w-full max-w-xs aspect-[3/4] rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-lime-400/50 hover:bg-white/5 transition-colors">
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              <div className="w-16 h-16 rounded-full bg-lime-400/10 flex items-center justify-center mb-4">
                 <ImageIcon className="text-lime-400" size={32} />
              </div>
              <span className="text-lime-400 font-medium">Open Gallery</span>
           </label>
        </div>
      </div>
    );
  }

  // Step 2: Optional Info
  if (step === 2) {
    return (
      <div className="fixed inset-0 z-[60] bg-dark-900 flex flex-col">
        <header className="h-14 flex items-center justify-between px-4 border-b border-white/5">
           <button onClick={() => setStep(1)}><ArrowLeft className="text-white" /></button>
           <span className="text-white font-medium">Details</span>
           <div className="w-6" />
        </header>
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
           {selectedImage && (
             <div className="w-32 h-32 rounded-lg overflow-hidden border border-white/10 mx-auto">
               <img src={URL.createObjectURL(selectedImage)} className="w-full h-full object-cover" />
             </div>
           )}

           <div className="space-y-4">
             <div>
               <label className="text-sm text-gray-400 block mb-2">Subject Type</label>
               <div className="flex bg-dark-800 p-1 rounded-xl">
                 <button 
                    onClick={() => setType('basic')}
                    className={`flex-1 py-2 text-sm rounded-lg transition-colors ${type === 'basic' ? 'bg-lime-400 text-dark-900 font-bold' : 'text-gray-400'}`}
                 >
                   Composition
                 </button>
                 <button 
                    onClick={() => setType('major')}
                    className={`flex-1 py-2 text-sm rounded-lg transition-colors ${type === 'major' ? 'bg-lime-400 text-dark-900 font-bold' : 'text-gray-400'}`}
                 >
                   Basic Design
                 </button>
               </div>
             </div>

             <div>
               <label className="text-sm text-gray-400 block mb-2">Problem / Context (Optional)</label>
               <textarea 
                 value={text}
                 onChange={(e) => setText(e.target.value)}
                 className="w-full bg-dark-800 text-white rounded-xl p-4 min-h-[120px] focus:ring-1 focus:ring-lime-400 outline-none text-sm"
                 placeholder="Enter the problem statement or your intent..."
                 maxLength={500}
               />
               <div className="text-right text-xs text-gray-600 mt-1">{text.length}/500</div>
             </div>
           </div>
        </div>
        <div className="p-4 border-t border-white/5">
           <Button className="w-full" onClick={() => setStep(3)}>Next</Button>
        </div>
      </div>
    );
  }

  // Step 3: Credit Confirm
  if (step === 3) {
    return (
      <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
        <div className="bg-dark-800 w-full max-w-md rounded-t-3xl p-6 space-y-6 animate-slide-up border-t border-white/10">
           <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-lime-400/20 flex items-center justify-center mb-2">
                 <AlertCircle className="text-lime-400" />
              </div>
              <H2 className="text-white">Use 1 Credit?</H2>
              <BodyText>
                You have 12 credits remaining.<br/>
                Analysis takes about 8 seconds.
              </BodyText>
           </div>
           
           <div className="flex gap-3">
             <Button variant="secondary" className="flex-1" onClick={closeModal}>Cancel</Button>
             <Button className="flex-1" onClick={handleAnalysisStart}>Confirm</Button>
           </div>
           <div className="h-4" />
        </div>
      </div>
    );
  }

  // Step 4: Loading
  if (step === 4) {
    return (
      <div className="fixed inset-0 z-[60] bg-dark-900 flex flex-col items-center justify-center p-8 text-center">
         <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
            <div className="absolute inset-0 border-4 border-lime-400 rounded-full border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-lime-400 font-bold text-xl animate-pulse">
               AI
            </div>
         </div>
         <H2 className="text-white mb-2 animate-pulse">Analyzing Artwork...</H2>
         <BodyText>Checking composition, density, and form.</BodyText>
      </div>
    );
  }

  return null;
};