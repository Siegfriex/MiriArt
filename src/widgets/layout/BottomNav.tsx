/**
 * @fileoverview 하단 네비게이션. 홈/아카이브/AI상담/프로필 탭. useNavStore로 표시 제어, 채팅 탭 시 SideGNB 열림.
 * @참조 App.tsx (전역 마운트)
 * @라우팅 /app/home, /app/archive, /app/chat, /app/profile
 * @상태 useSideGNBStore, useNavStore
 */

import React from 'react';
import { Home, Grid, MessageCircle, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSideGNBStore } from '../../shared/model/sideGNBStore';
import { useNavStore } from '../../shared/model/navStore';

/** 하단 네비게이션. @참조 App @상태 useSideGNBStore, useNavStore */
export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { open: openSideGNB, close: closeSideGNB, mode: sideGNBMode } = useSideGNBStore();
  const { isBottomNavVisible } = useNavStore();

  const tabs = [
    { id: 'home', path: '/app/home', icon: Home, label: '홈' },
    { id: 'archive', path: '/app/archive', icon: Grid, label: '아카이브' },
    { id: 'chat', path: '/app/chat', icon: MessageCircle, label: 'AI 상담' },
    { id: 'profile', path: '/app/profile', icon: User, label: '프로필' },
  ];

  const handleTabPress = (tab: typeof tabs[number]) => {
    if (tab.id === 'chat') {
      // AI 상담 탭 — SideGNB State 2 (Full) 즉시 오픈
      openSideGNB('full');
      return;
    }
    // 다른 탭 클릭 시 열려있는 SideGNB 닫기
    if (sideGNBMode !== 'closed') {
      closeSideGNB();
    }
    navigate(tab.path);
  };

  const isChatActive =
    location.pathname.startsWith('/app/chat') || sideGNBMode === 'full';

  return (
    <motion.nav
      animate={{ y: isBottomNavVisible ? 0 : '100%' }}
      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
      className="fixed bottom-0 w-full z-nav bg-dark-900/90 backdrop-blur-xl border-t border-white/5 pb-safe"
    >
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.id === 'chat'
              ? isChatActive
              : location.pathname.startsWith(tab.path);
          return (
            <button
              key={tab.id}
              onClick={() => handleTabPress(tab)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-primary-lime' : 'text-text-mid'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
};
