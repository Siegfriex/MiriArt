/**
 * 이벤트 트래킹 API. native fetch 사용 — 401 인터셉터/토큰 갱신 회피.
 * fire-and-forget: 실패해도 앱 동작에 영향 없음.
 */
import { API_BASE } from '../config/api';

/**
 * PAGE_VIEW 등 이벤트 페이로드. Java BE TrackEventRequest DTO와 1:1 대응.
 * source는 현재 FE에서 보내지 않으며, BE에서 null이면 WEB 등으로 해석할 예정.
 */
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
      // fire-and-forget: 실패해도 앱 동작에 영향 없음. 로그 없음.
    }
  },
};
