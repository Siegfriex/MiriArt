/**
 * @fileoverview 메인 레이아웃. Outlet으로 /app/* 자식 라우트 렌더. BottomNav는 App.tsx에서 전역 관리.
 * persist 복원 후 비로그인 시 /auth/login으로 리다이렉트.
 * @참조 AppRouter
 * @라우팅 /app/home, /app/archive, /app/chat, /app/profile
 * @상태 (직접 사용 안 함 - store만 참조)
 */

import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { ROUTES } from '../../shared/config/routes';
import { IS_DEV_SKIP_AUTH } from '../../shared/config/dev';
import { useHydrationStore } from '../../shared/model/hydrationStore';
import { useUserStore } from '../../shared/model/userStore';

/** 메인 레이아웃. @참조 AppRouter */
export const MainLayout: React.FC = () => {
  const hasHydrated = useHydrationStore((s) => s._hasHydrated);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);

  if (!hasHydrated) return null;
  if (IS_DEV_SKIP_AUTH) return <Outlet />;
  if (!isAuthenticated) return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  return <Outlet />;
};
