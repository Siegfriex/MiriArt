/**
 * @fileoverview 요청 클래스 단위 레이턴시 정책. timeout·retry 프리셋 정의.
 * @참조 miriartApi.apiFetch, communityApi.real
 */

export type RequestClass =
  | 'CRITICAL_SLOW'   // 분석, AI Chat — 느려도 됨, 중복 방지
  | 'INTERACTIVE_FAST' // 피드, 상세, 댓글 등
  | 'PROFILE_STATIC'   // /users/me 등 반정적 (2차)
  | 'BACKGROUND';     // DEBUG_LOG 등 비필수 (2차)

export interface RequestPolicyConfig {
  timeoutMs: number;
  retry: number;
}

export const REQUEST_POLICY: Record<RequestClass, RequestPolicyConfig> = {
  CRITICAL_SLOW: { timeoutMs: 60_000, retry: 0 },
  INTERACTIVE_FAST: { timeoutMs: 15_000, retry: 1 },
  PROFILE_STATIC: { timeoutMs: 20_000, retry: 1 },
  BACKGROUND: { timeoutMs: 5_000, retry: 0 },
};

export const DEFAULT_REQUEST_CLASS: RequestClass = 'INTERACTIVE_FAST';
