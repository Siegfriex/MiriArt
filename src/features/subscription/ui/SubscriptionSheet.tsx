import React, { useState } from 'react';
import { H2, H3, BodyText } from '../../../shared/ui/Typography';
import { Button } from '../../../shared/ui/Button';
import { useModalStore } from '../../../shared/model/modalStore';
import { Check, Crown, Zap } from 'lucide-react';

interface SubscriptionSheetProps {
  currentPlan?: string;
}

export const SubscriptionSheet: React.FC<SubscriptionSheetProps> = ({ currentPlan = 'free' }) => {
  const { closeModal } = useModalStore();
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium'>('premium');

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '₩19,900',
      period: '/mo',
      features: ['20 Credits / Month', 'Standard Analysis', 'Archive Access'],
      icon: Zap,
      color: 'border-white/10',
      activeColor: 'border-white text-white'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '₩49,900',
      period: '/mo',
      features: ['Unlimited Credits', 'Detail Tuning Scope', '1:1 Mentor Chat', 'Acceptance Prediction'],
      icon: Crown,
      color: 'border-lime-400/50 bg-lime-400/5',
      activeColor: 'border-lime-400 text-lime-400',
      badge: 'Best Value'
    }
  ];

  const handleSubscribe = () => {
    console.log(`Subscribing to ${selectedPlan}`); 
    closeModal();
  };

  return (
    <div className="p-6 space-y-6 pb-10">
      <div className="text-center space-y-2">
        <H2>Upgrade Plan</H2>
        <BodyText className="text-sm text-gray-400">
          Current Plan: <span className="text-lime-400 font-bold uppercase">{currentPlan}</span>
        </BodyText>
      </div>

      <div className="space-y-4">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const isCurrent = currentPlan?.toLowerCase() === plan.id;
          const Icon = plan.icon;
          
          return (
            <div 
              key={plan.id}
              onClick={() => !isCurrent && setSelectedPlan(plan.id as any)}
              className={`relative rounded-2xl p-5 border-2 transition-all duration-200 cursor-pointer ${
                isSelected 
                  ? `${plan.activeColor} bg-white/5` 
                  : isCurrent
                    ? 'border-gray-600 bg-dark-800 opacity-50 cursor-default'
                    : 'border-white/10 bg-dark-900 hover:border-white/20'
              }`}
            >
              {plan.badge && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-lime-400 text-dark-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-glow">
                  {plan.badge}
                </div>
              )}
              
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Current Plan
                </div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/10' : 'bg-dark-800'}`}>
                      <Icon size={20} className={isSelected ? 'text-lime-400' : 'text-gray-400'} />
                    </div>
                    <div>
                        <H3 className={isSelected ? 'text-white' : 'text-gray-300'}>{plan.name}</H3>
                    </div>
                 </div>
                 <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected ? 'border-lime-400 bg-lime-400' : 'border-gray-600'
                 }`}>
                    {isSelected && <Check size={14} className="text-dark-900 stroke-[3]" />}
                 </div>
              </div>

              <div className="flex items-baseline gap-1 mb-4">
                 <span className="text-2xl font-bold text-white font-sans">{plan.price}</span>
                 <span className="text-xs text-gray-500">{plan.period}</span>
              </div>

              <div className="h-px w-full bg-white/5 mb-4" />

              <ul className="space-y-3">
                 {plan.features.map((feat, i) => (
                   <li key={i} className="flex items-center gap-3 text-xs text-gray-300">
                      <div className="w-4 h-4 rounded-full bg-lime-400/10 flex items-center justify-center flex-shrink-0">
                        <Check size={10} className="text-lime-400" />
                      </div>
                      {feat}
                   </li>
                 ))}
              </ul>
            </div>
          );
        })}
      </div>

      <Button fullWidth onClick={handleSubscribe} size="lg" disabled={currentPlan === selectedPlan}>
        {currentPlan === selectedPlan ? 'Current Plan' : `Subscribe to ${selectedPlan === 'basic' ? 'Basic' : 'Premium'}`}
      </Button>
    </div>
  );
};