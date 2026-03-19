/**
 * 브라우저 세션 키 관리. 탭 세션 기간 유지 (sessionStorage).
 * 코호트 분석용 비인증 유저 추적에 사용.
 */
const SESSION_KEY = 'miriart_session_key';

export function getSessionKey(): string {
  try {
    let key = sessionStorage.getItem(SESSION_KEY);
    if (!key) {
      key = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, key);
    }
    return key;
  } catch {
    return crypto.randomUUID();
  }
}
