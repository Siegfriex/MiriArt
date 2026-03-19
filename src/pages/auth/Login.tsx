/**
 * @fileoverview 로그인 페이지. Google OAuth2 리다이렉트.
 * 이미 로그인된 경우 /app/home 또는 /onboarding으로 바로 보냄(로그인→온보딩 루프 방지).
 * 인앱 브라우저(KakaoTalk 등) 감지 시 외부 브라우저 유도 모달 표시.
 * @참조 AppRouter
 * @라우팅 /auth/login
 */

import React, { useEffect, useState } from 'react';
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
import { isInAppBrowser, isIOS, openInExternalBrowser } from '../../shared/lib/inAppBrowser';

const SESSION_EXPIRED_KEY = 'miriart_session_expired';

/** 로그인. Google OAuth2 리다이렉트. @참조 AppRouter */
export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, profile } = useUserStore();
  const showToast = useToastStore((s) => s.show);
  const [showInAppModal, setShowInAppModal] = useState(false);

  /** refresh 실패 등으로 리다이렉트된 경우 세션 만료 안내 (1회) */
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_EXPIRED_KEY)) {
      sessionStorage.removeItem(SESSION_EXPIRED_KEY);
      if (isInAppBrowser()) {
        showToast('인앱 브라우저에서는 로그인이 원활하지 않을 수 있습니다. 외부 브라우저로 열어주세요.', 'info');
      } else {
        showToast('세션이 만료되었습니다. 다시 로그인해 주세요.', 'info');
      }
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
    if (isInAppBrowser()) {
      setShowInAppModal(true);
      return;
    }
    window.location.href = `${API_BASE}/oauth2/authorization/google`;
  };

  const handleOpenExternal = () => {
    const opened = openInExternalBrowser(window.location.href);
    if (!opened) {
      // iOS: intent 미지원 — 모달 유지 (Safari 안내 표시)
    }
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

      {/* 인앱 브라우저 감지 모달 */}
      {showInAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="bg-surface-card rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h2 className="text-lg font-bold text-text-primary">
              카카오톡 내에서는 로그인이 원활하지 않을 수 있어요
            </h2>
            <p className="text-sm text-text-mid leading-relaxed">
              카카오톡 등 인앱 브라우저에서는 보안 설정 때문에
              Google 로그인이 정상적으로 동작하지 않을 수 있습니다.
              {isIOS()
                ? ' 우측 상단 ⋯ 메뉴에서 "Safari로 열기"를 눌러주세요.'
                : ' 아래 버튼을 눌러 외부 브라우저에서 다시 열어주세요.'}
            </p>
            <div className="space-y-3">
              {!isIOS() && (
                <Button
                  fullWidth
                  size="lg"
                  variant="primary"
                  className="rounded-2xl h-12 text-base font-bold"
                  onClick={handleOpenExternal}
                >
                  외부 브라우저로 열기
                </Button>
              )}
              <button
                onClick={() => setShowInAppModal(false)}
                className="w-full text-center text-sm text-text-mid py-2"
              >
                나중에 할게요
              </button>
            </div>
          </div>
        </div>
      )}
    </FullScreenContainer>
  );
};
