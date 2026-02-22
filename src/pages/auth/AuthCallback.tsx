/**
 * @fileoverview OAuth2 콜백 처리 페이지.
 * BE가 /auth/callback?code={uuid} 로 리다이렉트하면 JWT 교환 후 needsProfile 분기.
 * @참조 AppRouter
 * @라우팅 /auth/callback
 * @상태 useUserStore (setAuth)
 */

import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthApi, tokenManager } from '../../shared/api/miriartApi';
import { useUserStore } from '../../shared/model/userStore';

/** OAuth2 콜백. code → exchangeToken → setAuth → needsProfile 분기. */
export const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useUserStore();

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      navigate('/auth/login');
      return;
    }

    AuthApi.exchangeToken(code)
      .then((response) => {
        tokenManager.setAccessToken(response.accessToken);
        setAuth(response.userId);
        if (response.needsProfile) {
          navigate('/onboarding');
        } else {
          navigate('/app/home');
        }
      })
      .catch(() => navigate('/auth/login'));
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-white text-sm">로그인 처리 중...</div>
    </div>
  );
};
