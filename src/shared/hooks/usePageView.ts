/**
 * 전역 PAGE_VIEW 이벤트 훅. 라우트 변경 시 자동 발행.
 * AppRouter.tsx에서 1회 호출.
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { EventsApi } from '../lib/eventsApi';
import { getSessionKey } from '../lib/sessionKey';

export function usePageView() {
  const location = useLocation();

  useEffect(() => {
    EventsApi.track({
      eventType: 'PAGE_VIEW',
      sessionKey: getSessionKey(),
      page: location.pathname,
      referrer: document.referrer || undefined,
      clientTs: Date.now(),
      userAgent: navigator.userAgent.substring(0, 200),
    });
  }, [location.pathname]);
}
