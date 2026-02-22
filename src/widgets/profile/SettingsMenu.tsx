/**
 * @fileoverview 설정 메뉴. 알림, 학력 수정, 계정, 도움말, 로그아웃. useModalStore GRADE_INPUT 호출.
 * @참조 Profile Page
 * @라우팅 /app/profile
 * @상태 useModalStore
 */

import React from 'react';
import { User, CreditCard, HelpCircle, LogOut, ChevronRight, Bell } from 'lucide-react';
import { useModalStore } from '../../shared/model/modalStore';
import { STRINGS } from '../../shared/config/strings';

/** 설정 메뉴. @참조 Profile Page @상태 useModalStore */
export const SettingsMenu: React.FC = () => {
  const { openModal } = useModalStore();

  const menuItems = [
    { icon: Bell, label: STRINGS.PROFILE_SETTINGS_NOTIFICATIONS, action: () => {} },
    {
      icon: User,
      label: STRINGS.PROFILE_ACADEMIC_EDIT,
      action: () => openModal('GRADE_INPUT'),
    },
    {
      icon: CreditCard,
      label: STRINGS.PROFILE_SETTINGS_ACCOUNT,
      action: () => {},
    },
    { icon: HelpCircle, label: STRINGS.PROFILE_SETTINGS_HELP, action: () => {} },
  ];

  return (
    <div className="space-y-1">
      {menuItems.map((item) => (
        <button
          key={item.label}
          onClick={item.action}
          className="w-full flex items-center justify-between p-4 bg-dark-800/50 rounded-xl hover:bg-dark-800 transition-colors border border-transparent hover:border-white/5 active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <item.icon size={20} className="text-text-mid" />
            <span className="text-sm text-white font-medium">{item.label}</span>
          </div>
          <ChevronRight size={16} className="text-text-low" />
        </button>
      ))}

      <button className="w-full flex items-center gap-3 p-4 mt-3 text-semantic-error hover:text-red-300 hover:bg-semantic-error/10 rounded-xl transition-colors">
        <LogOut size={20} />
        <span className="text-sm font-medium">{STRINGS.PROFILE_SETTINGS_LOGOUT}</span>
      </button>
    </div>
  );
};
