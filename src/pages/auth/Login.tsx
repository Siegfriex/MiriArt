/**
 * @fileoverview 로그인 페이지. Google OAuth2 리다이렉트.
 * 이미 로그인된 경우 /app/home 또는 /onboarding으로 바로 보냄(로그인→온보딩 루프 방지).
 * @참조 AppRouter
 * @라우팅 /auth/login
 */

import React, { useEffect } from 'react';
import { H1, BodyText } from '../../shared/ui/Typography';
import { Button } from '../../shared/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { STRINGS } from '../../shared/config/strings';
import { ROUTES } from '../../shared/config/routes';
import { API_BASE } from '../../shared/config/api';
import { useUserStore } from '../../shared/model/userStore';
import { useToastStore } from '../../shared/model/toastStore';
import { FullScreenContainer } from '../../shared/ui/FullScreenContainer';

const SESSION_EXPIRED_KEY = 'miriart_session_expired';

/** 로그인. Google OAuth2 리다이렉트. @참조 AppRouter */
export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, profile } = useUserStore();
  const showToast = useToastStore((s) => s.show);

  /** refresh 실패 등으로 리다이렉트된 경우 세션 만료 안내 (1회) */
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_EXPIRED_KEY)) {
      sessionStorage.removeItem(SESSION_EXPIRED_KEY);
      showToast('세션이 만료되었습니다. 다시 로그인해 주세요.', 'info');
    }
  }, [showToast]);

  /** 이미 로그인된 사용자는 앱 홈 또는 온보딩으로(루프 방지) */
  useEffect(() => {
    if (!isAuthenticated) return;
    if (profile.hasGradeInput) {
      navigate(ROUTES.APP.HOME, { replace: true });
    } else {
      navigate(ROUTES.ONBOARDING, { replace: true });
    }
  }, [isAuthenticated, profile.hasGradeInput, navigate]);

  if (isAuthenticated) return null;

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/oauth2/authorization/google`;
  };

  return (
    <FullScreenContainer scroll="none">
      <header className="h-14 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-text-mid hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
      </header>

      <div className="flex-1 flex flex-col justify-center space-y-8 max-w-sm mx-auto w-full">
        <div>
          <H1 className="text-text-primary mb-2">{STRINGS.LOGIN_TITLE}</H1>
          <BodyText className="text-text-mid">{STRINGS.LOGIN_SUBTITLE}</BodyText>
        </div>

        <div className="space-y-4">
          <Button
            fullWidth
            size="lg"
            variant="secondary"
            className="rounded-2xl h-14 text-base font-bold"
            onClick={handleGoogleLogin}
          >
            Google로 시작하기
          </Button>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate(ROUTES.AUTH.SIGNUP)}
            className="text-sm text-text-mid hover:text-primary-lime transition-colors p-2"
          >
            {STRINGS.LOGIN_TO_SIGNUP}{' '}
            <span className="font-bold text-text-primary">{STRINGS.LOGIN_SIGNUP_LINK}</span>
          </button>
        </div>
      </div>
    </FullScreenContainer>
  );
};
