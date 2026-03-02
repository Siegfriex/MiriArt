/**
 * @fileoverview 앱 루트. BrowserRouter, ModalProvider, SideGNB, AppRouter, BottomNav, ToastContainer.
 * @참조 main.tsx (진입점)
 * @라우팅 전역 (BrowserRouter)
 * @상태 (직접 사용 안 함 - 하위에서 관리)
 */

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './routers/AppRouter';
import { ModalProvider } from './providers/ModalProvider';
import { BottomNav } from '../widgets/layout/BottomNav';
import { SideGNB } from '../widgets/layout/SideGNB';
import { ToastContainer } from '../shared/ui/Toast';
import { useModalStore } from '../shared/model/modalStore';

/** 앱 루트 컴포넌트. @참조 main.tsx */
const App: React.FC = () => {
  const activeModal = useModalStore((s) => s.activeModal);
  return (
    <BrowserRouter>
      <div
        className={`relative w-full h-dvh bg-surface flex flex-col font-sans ${activeModal ? 'overflow-hidden' : ''}`}
      >
        {/* 전역 모달 시스템 */}
        <ModalProvider />

        {/* 전역 SideGNB — 모든 라우트에서 접근 가능 */}
        <SideGNB />

        {/* 메인 스크롤 영역: 단일 스크롤 컨테이너로 SubTabBar sticky가 확실히 동작 */}
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
          <AppRouter />
        </main>

        {/* 전역 BottomNav — navStore로 visibility 제어 */}
        <BottomNav />

        {/* 전역 Toast 알림 */}
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
};

export default App;
