/**
 * 전역 PAGE_VIEW 이벤트 훅. 라우트 변경 시 자동 발행.
 * AppRouter에서 1회 호출.
 * dev 환경 StrictMode에서는 useEffect가 두 번 실행될 수 있어, 동일 pathname에 대해 PAGE_VIEW가 2회 전송될 수 있습니다.
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { EventsApi } from '../lib/eventsApi';
import { getSessionKey } from '../lib/sessionKey';

export function usePageView() {
  const location = useLocation();

  useEffect(() => {
    const page = location.pathname;
    EventsApi.track({
      eventType: 'PAGE_VIEW',
      sessionKey: getSessionKey(),
      page,
      referrer: document.referrer || undefined,
      clientTs: Date.now(),
      userAgent: navigator.userAgent.substring(0, 200),
    });
  }, [location.pathname]);
}
