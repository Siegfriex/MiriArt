/**
 * 이벤트 트래킹 API. 날 fetch 사용 — 401 인터셉터/토큰 갱신 회피.
 * fire-and-forget: 실패해도 앱 동작에 영향 없음.
 */
import { API_BASE } from '../config/api';

export interface TrackEventPayload {
  eventType: 'PAGE_VIEW';
  sessionKey: string;
  page: string;
  referrer?: string;
  source?: string;
  clientTs?: number;
  userAgent?: string;
}

export const EventsApi = {
  track: async (payload: TrackEventPayload): Promise<void> => {
    try {
      await fetch(`${API_BASE}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      // fire-and-forget
    }
  },
};
