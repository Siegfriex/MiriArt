/**
 * @fileoverview 메인 레이아웃. Outlet으로 /app/* 자식 라우트 렌더. BottomNav는 App.tsx에서 전역 관리.
 * @참조 AppRouter
 * @라우팅 /app/home, /app/archive, /app/chat, /app/profile
 * @상태 (직접 사용 안 함)
 */

import React from 'react';
import { Outlet } from 'react-router-dom';

/** 메인 레이아웃. @참조 AppRouter */
export const MainLayout: React.FC = () => {
  return <Outlet />;
};
