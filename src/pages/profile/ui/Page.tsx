import React from 'react';
import { H1, H2 } from '../../../shared/ui/Typography';
import { Button } from '../../../shared/ui/Button';
import { Settings } from 'lucide-react';
import { SettingsMenu } from '../../../widgets/profile/SettingsMenu';
import { useModalStore } from '../../../shared/model/modalStore';
import { PageContainer } from '../../../shared/ui/PageContainer';

export const Profile: React.FC = () => {
  const { openModal } = useModalStore();

  const handleUpgrade = () => {
    openModal('SUBSCRIPTION', { currentPlan: 'basic' });
  };

  return (
    <PageContainer className="space-y-8">
      {/* Header */}
      <header className="flex justify-between items-center">
        <H1 className="text-white">Profile</H1>
        <button className="text-gray-400 hover:text-white transition-colors"><Settings size={20} /></button>
      </header>

      {/* User Info */}
      <div className="flex items-center gap-4">
         <div className="w-20 h-20 rounded-full bg-dark-800 border-2 border-lime-400 p-1">
            <div className="w-full h-full rounded-full bg-gray-600 overflow-hidden">
               <img src="https://picsum.photos/200/200" className="w-full h-full object-cover" />
            </div>
         </div>
         <div>
            <H2 className="text-white text-xl">Design Master</H2>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-xs text-dark-900 bg-lime-400 px-2 py-0.5 rounded-full font-bold">Basic Plan</span>
               <span className="text-xs text-gray-400">High School 3rd Year</span>
            </div>
         </div>
      </div>

      {/* Subscription Card */}
      <div className="bg-dark-800 rounded-2xl p-5 border border-white/5 relative overflow-hidden shadow-soft group">
         <div className="absolute -right-4 -top-4 w-24 h-24 bg-lime-400/10 rounded-full blur-2xl group-hover:bg-lime-400/20 transition-all duration-500" />
         
         <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
               <div className="text-sm text-gray-400 mb-1">Available Credits</div>
               <div className="text-3xl font-sans font-bold text-white">12</div>
            </div>
            <Button className="h-9 text-xs px-3" onClick={handleUpgrade}>Upgrade</Button>
         </div>
         
         <div className="w-full bg-dark-900 h-2 rounded-full overflow-hidden mb-2 relative z-10">
            <div className="bg-lime-400 h-full rounded-full" style={{ width: '60%' }} />
         </div>
         <div className="text-xs text-gray-500 relative z-10">
            Resets on Mar 18, 2025
         </div>
      </div>

      {/* Settings Menu Widget */}
      <SettingsMenu />
    </PageContainer>
  );
};