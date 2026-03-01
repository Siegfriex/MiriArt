/**
 * @fileoverview 스플래시 페이지. 2초 후 Onboarding으로 자동 이동.
 * 개발 로그인 우회 시 즉시 /app/home으로 이동.
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

/** 스플래시. @참조 AppRouter */
export const Splash: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const delay = IS_DEV_SKIP_AUTH ? 0 : 2000;
    const target = IS_DEV_SKIP_AUTH ? ROUTES.APP.HOME : ROUTES.ONBOARDING;
    const timer = setTimeout(() => {
      navigate(target);
    }, delay);
    return () => clearTimeout(timer);
  }, [navigate]);

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
