/**
 * @fileoverview 스플래시 페이지. 2초 후 인증·프로필 상태에 따라 이동.
 * - 로그인 안 됨 → /auth/login
 * - 로그인됨 + 프로필 미완료(needsProfile) → /onboarding
 * - 로그인됨 + 프로필 완료 → /app/home
 * 개발 로그인 우회(IS_DEV_SKIP_AUTH) 시 즉시 /app/home.
 * @참조 AppRouter
 * @라우팅 /
 * @상태 useEffect (타이머)
 */

import React, { useEffect } from 'react';
import { H1 } from '../../shared/ui/Typography';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../shared/config/routes';
import { STRINGS } from '../../shared/config/strings';
import { IS_DEV_SKIP_AUTH } from '../../shared/config/dev';
import { useUserStore } from '../../shared/model/userStore';

/** 스플래시. @참조 AppRouter */
export const Splash: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, profile } = useUserStore();

  useEffect(() => {
    const delay = IS_DEV_SKIP_AUTH ? 0 : 2000;
    const timer = setTimeout(() => {
      if (IS_DEV_SKIP_AUTH) {
        navigate(ROUTES.APP.HOME);
        return;
      }
      if (isAuthenticated && profile.hasGradeInput) {
        navigate(ROUTES.APP.HOME);
      } else if (isAuthenticated && !profile.hasGradeInput) {
        navigate(ROUTES.ONBOARDING);
      } else {
        navigate(ROUTES.AUTH.LOGIN);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated, profile.hasGradeInput]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-critical">
      <div className="text-center animate-fade-in flex flex-col items-center">
        <H1 className="text-primary-lime text-5xl mb-4 tracking-tighter">
          {STRINGS.APP_NAME}
        </H1>
        <div className="w-12 h-1 bg-primary-lime rounded-full animate-pulse" />
        <span className="text-text-mid text-xs mt-4 tracking-widest uppercase">
          AI Art Mentor
        </span>
      </div>
    </div>
  );
};
