/**
 * @fileoverview OAuth2 콜백 처리 페이지.
 * BE가 /auth/callback?code={uuid} 로 리다이렉트하면 JWT 교환 후 needsProfile 분기.
 * 로그인 성공 = exchangeToken + getMe 모두 성공. getMe 실패 시 세션 폐기 후 /auth/login으로 이동.
 * @참조 AppRouter
 * @라우팅 /auth/callback
 * @상태 useUserStore (setAuth, setProfileFromApi, clearAuth)
 */

import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthApi, UserApi, tokenManager, handleApiError } from '../../shared/api/miriartApi';
import { useUserStore } from '../../shared/model/userStore';
import { useToastStore } from '../../shared/model/toastStore';

/** OAuth2 콜백. code → exchangeToken → setAuth → getMe → setProfileFromApi 또는 clearAuth + /auth/login */
export const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth, setProfileFromApi } = useUserStore();
  const { show: showToast } = useToastStore();
  const effectRunRef = useRef(0);

  useEffect(() => {
    effectRunRef.current += 1;

    const code = searchParams.get('code');
    if (!code) {
      navigate('/auth/login');
      return;
    }

    AuthApi.exchangeToken(code)
      .then(async (response) => {
        tokenManager.setAccessToken(response.accessToken);
        setAuth(response.userId);

        try {
          const me = await UserApi.getMe();
          setProfileFromApi(me);
        } catch (err) {
          if (import.meta.env.DEV) console.error('[AuthCallback] getMe failed, treating login as failed:', err);
          showToast(handleApiError(err), 'error');
          useUserStore.getState().clearAuth();
          navigate('/auth/login', { replace: true });
          return;
        }

        if (response.needsProfile) {
          navigate('/onboarding', { replace: true });
        } else {
          navigate('/app/home', { replace: true });
        }
      })
      .catch((err) => {
        showToast(handleApiError(err), 'error');
        useUserStore.getState().clearAuth();
        navigate('/auth/login');
      });
  }, [navigate, searchParams, setAuth, setProfileFromApi, showToast]);

  return (
    <div className="fixed inset-0 bg-surface flex items-center justify-center z-priority">
      <div className="text-text-primary text-sm">로그인 처리 중...</div>
    </div>
  );
};
