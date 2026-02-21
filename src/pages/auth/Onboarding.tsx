import React, { useState } from 'react';
import { H1, BodyText } from '../../../shared/ui/Typography';
import { Button } from '../../../shared/ui/Button';
import { useNavigate } from 'react-router-dom';

const SLIDES = [
  {
    title: "AI Analysis in 8s",
    desc: "Get instant feedback on your artwork composition and density.",
    image: "https://picsum.photos/400/400?random=101"
  },
  {
    title: "Acceptance Check",
    desc: "Predict your pass probability based on real university data.",
    image: "https://picsum.photos/400/400?random=102"
  },
  {
    title: "1:1 AI Mentor",
    desc: "Chat with an AI trained on top-tier art college curriculums.",
    image: "https://picsum.photos/400/400?random=103"
  }
];

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    if (current < SLIDES.length - 1) {
      setCurrent(current + 1);
    } else {
      navigate('/auth/signup');
    }
  };

  return (
    <div className="fixed inset-0 bg-dark-900 flex flex-col p-6 z-[90]">
      <div className="flex justify-end h-12 items-center">
        <button onClick={() => navigate('/auth/login')} className="text-gray-500 text-sm font-medium hover:text-white transition-colors">Skip</button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-10 text-center mt-4">
        <div className="relative w-72 h-80 rounded-[32px] overflow-hidden border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
           <img src={SLIDES[current].image} className="w-full h-full object-cover opacity-80" alt="Slide" />
           <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-90" />
           <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent">
             {/* Decorative element */}
             <div className="w-full h-1 bg-lime-400/50 rounded-full mb-2" />
           </div>
        </div>
        
        <div className="space-y-4 max-w-xs animate-fade-in" key={current}>
          <H1 className="text-white leading-tight text-3xl">{SLIDES[current].title}</H1>
          <BodyText className="text-gray-400 text-base">{SLIDES[current].desc}</BodyText>
        </div>
      </div>

      <div className="py-8 space-y-8">
        {/* Pagination Dots */}
        <div className="flex justify-center gap-2">
          {SLIDES.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-lime-400' : 'w-1.5 bg-gray-700'}`} 
            />
          ))}
        </div>

        <Button fullWidth onClick={handleNext} size="lg" className="text-base font-bold h-14 rounded-2xl">
          {current === SLIDES.length - 1 ? 'Get Started' : 'Next'}
        </Button>
      </div>
    </div>
  );
};