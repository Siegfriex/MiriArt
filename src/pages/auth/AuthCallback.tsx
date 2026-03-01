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
import { AuthApi, UserApi, tokenManager } from '../../shared/api/miriartApi';
import { useUserStore } from '../../shared/model/userStore';

// #region agent log
const DEBUG_LOG = (message: string, data: Record<string, unknown>, hypothesisId: string) => {
  fetch('http://127.0.0.1:7620/ingest/67ee1a3b-2ca5-4344-aa14-d8c9f2ec8b28', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'a4f614' },
    body: JSON.stringify({
      sessionId: 'a4f614',
      location: 'AuthCallback.tsx',
      message,
      data,
      timestamp: Date.now(),
      hypothesisId,
    }),
  }).catch(() => {});
};
// #endregion

/** OAuth2 콜백. code → exchangeToken → setAuth → getMe → setProfileFromApi 또는 clearAuth + /auth/login */
export const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth, setProfileFromApi } = useUserStore();
  const effectRunRef = useRef(0);

  useEffect(() => {
    effectRunRef.current += 1;
    const runId = effectRunRef.current;
    // #region agent log
    DEBUG_LOG('useEffect ran', { runId }, 'A');
    // #endregion

    const code = searchParams.get('code');
    if (!code) {
      // #region agent log
      DEBUG_LOG('no code, redirecting to login', { runId }, 'A');
      // #endregion
      navigate('/auth/login');
      return;
    }

    // #region agent log
    DEBUG_LOG('calling exchangeToken', { runId, codeLength: code.length }, 'A');
    // #endregion

    AuthApi.exchangeToken(code)
      .then(async (response) => {
        // #region agent log
        DEBUG_LOG('exchangeToken success', { runId, userId: response.userId, needsProfile: response.needsProfile }, 'A');
        // #endregion
        tokenManager.setAccessToken(response.accessToken);
        setAuth(response.userId);

        try {
          // #region agent log
          DEBUG_LOG('calling getMe', { runId }, 'C');
          // #endregion
          const me = await UserApi.getMe();
          // #region agent log
          DEBUG_LOG('getMe success', { runId }, 'C');
          // #endregion
          setProfileFromApi(me);
        } catch (err) {
          // #region agent log
          DEBUG_LOG('getMe failed', {
            runId,
            errMessage: err instanceof Error ? err.message : String(err),
            errName: err instanceof Error ? err.name : undefined,
          }, 'C');
          // #endregion
          console.error('[AuthCallback] getMe failed, treating login as failed:', err);
          useUserStore.getState().clearAuth();
          navigate('/auth/login', { replace: true });
          return;
        }

        const target = response.needsProfile ? '/onboarding' : '/app/home';
        // #region agent log
        DEBUG_LOG('navigating after success', { runId, target }, 'D');
        // #endregion
        if (response.needsProfile) {
          navigate('/onboarding');
        } else {
          navigate('/app/home');
        }
      })
      .catch((err) => {
        // #region agent log
        DEBUG_LOG('exchangeToken outer catch', {
          runId,
          errMessage: err?.message ?? String(err),
          errStatus: err?.status,
        }, 'A');
        // #endregion
        navigate('/auth/login');
      });
  }, [navigate, searchParams, setAuth, setProfileFromApi]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-white text-sm">로그인 처리 중...</div>
    </div>
  );
};
