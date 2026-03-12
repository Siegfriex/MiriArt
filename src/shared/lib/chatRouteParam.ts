/**
 * @fileoverview 채팅 라우트 파라미터 해석. sessionKey vs analysisId 역할 구분을 위해 단일 진입점 유지.
 * - URL param은 항상 sessionKey(UUID 또는 'new-session')로만 사용. GET /api/analyses/{id}에는 절대 넘기지 않음.
 * - analysisId는 세션 메타(session.analysisId)를 조회한 뒤에만 사용.
 */

/**
 * 라우트 파라미터가 유효한 sessionKey인지 (로딩 대상인지). 'new-session'이거나 비어 있으면 false.
 * 엣지: 빈 문자열/공백만 있으면 false. 숫자만 있는 문자열(과거 analysisId)도 true로 통과하므로,
 * 호출처(ChatRoom)에서는 getSession(sessionKey)가 404를 반환할 수 있음 — 세션 목록/결과 화면에서만 sessionKey(UUID)로 진입하는 것이 기대 플로우.
 */
export function shouldLoadSessionByKey(param: string | undefined): boolean {
  const raw = param?.trim() ?? '';
  return raw.length > 0 && raw !== 'new-session';
}
