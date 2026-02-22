/**
 * @fileoverview 로그인 페이지. 카카오/구글 소셜 로그인 버튼. OAuth2 리다이렉트 방식.
 * @참조 AppRouter
 * @라우팅 /auth/login
 */

import React from 'react';
import { H1, BodyText } from '../../shared/ui/Typography';
import { Button } from '../../shared/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { STRINGS } from '../../shared/config/strings';
import { ROUTES } from '../../shared/config/routes';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/** 로그인. 카카오/구글 OAuth2 리다이렉트. @참조 AppRouter */
export const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleKakaoLogin = () => {
    window.location.href = `${API_BASE}/oauth2/authorization/kakao`;
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/oauth2/authorization/google`;
  };

  return (
    <div className="fixed inset-0 bg-dark-900 flex flex-col px-5 py-6 z-priority">
      <header className="h-14 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-text-mid hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
      </header>

      <div className="flex-1 flex flex-col justify-center space-y-8 max-w-sm mx-auto w-full">
        <div>
          <H1 className="text-white mb-2">{STRINGS.LOGIN_TITLE}</H1>
          <BodyText className="text-text-mid">{STRINGS.LOGIN_SUBTITLE}</BodyText>
        </div>

        <div className="space-y-4">
          <Button
            fullWidth
            size="lg"
            className="rounded-2xl h-14 text-base font-bold bg-[#FEE500] text-[#191919] hover:bg-[#F0D800]"
            onClick={handleKakaoLogin}
          >
            카카오로 시작하기
          </Button>

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
            <span className="font-bold text-white">{STRINGS.LOGIN_SIGNUP_LINK}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
