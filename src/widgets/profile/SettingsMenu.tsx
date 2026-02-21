import React from 'react';
import { User, CreditCard, HelpCircle, LogOut, ChevronRight, Bell, Shield } from 'lucide-react';
import { useModalStore } from '../../shared/model/modalStore';

export const SettingsMenu: React.FC = () => {
  const { openModal } = useModalStore();

  const handleAcademicInfo = () => {
    // Type-safe call: 'GRADE_INPUT' is checked against ModalType
    openModal('GRADE_INPUT');
  };

  const menuItems = [
    { icon: User, label: 'Academic Info', action: handleAcademicInfo },
    { icon: Bell, label: 'Notifications', action: () => {} },
    { icon: Shield, label: 'Privacy & Security', action: () => {} },
    { icon: HelpCircle, label: 'Help & Support', action: () => {} },
  ];

  return (
    <div className="space-y-2">
      {menuItems.map((item) => (
        <button 
          key={item.label} 
          onClick={item.action}
          className="w-full flex items-center justify-between p-4 bg-dark-800/50 rounded-xl hover:bg-dark-800 transition-colors border border-transparent hover:border-white/5 active:scale-[0.99]"
        >
            <div className="flex items-center gap-3">
              <item.icon size={20} className="text-gray-400" />
              <span className="text-sm text-white font-medium">{item.label}</span>
            </div>
            <ChevronRight size={16} className="text-gray-600" />
        </button>
      ))}
      
      <button className="w-full flex items-center justify-between p-4 mt-4 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors">
        <div className="flex items-center gap-3">
            <LogOut size={20} />
            <span className="text-sm font-medium">Log Out</span>
        </div>
      </button>
    </div>
  );
};