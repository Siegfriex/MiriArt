import React, { useEffect } from 'react';
import { H1 } from '../../../shared/ui/Typography';
import { useNavigate } from 'react-router-dom';

interface SplashProps {
  onFinish?: () => void; // Optional now handled by router
}

export const Splash: React.FC<SplashProps> = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[100]">
      <div className="text-center animate-fade-in flex flex-col items-center">
        <H1 className="text-lime-400 text-5xl mb-4 tracking-tighter">dysprime</H1>
        <div className="w-12 h-1 bg-lime-400 rounded-full animate-pulse" />
        <span className="text-gray-500 text-xs mt-4 tracking-widest uppercase">AI Art Mentor</span>
      </div>
    </div>
  );
};