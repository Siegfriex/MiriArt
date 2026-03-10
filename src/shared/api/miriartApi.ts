/**
 * @fileoverview MiriArt API 클라이언트. 인증, 분석, 채팅, 커뮤니티 API.
 * 이전 gemini.ts 대체. Authorization 헤더 + Refresh 인터셉터 포함.
 * @참조 AuthCallback, UploadFlow, chat-room Page, communityApi
 */

import { useToastStore } from '../model/toastStore';
import { useUserStore } from '../model/userStore';
import { useDebugStore } from '../model/debugStore';
import { AIModelType } from '../model/types';
import { tokenManager } from './tokenManager';
import { tokenExchangeSchema, refreshResponseSchema } from './schemas/auth';
import { userProfileApiSchema, userPlanSchema } from './schemas/user';
import { analysisResponseSchema, analysisStartResponseSchema, analysesListResponseSchema } from './schemas/analysis';
import { normalizeAnalysisResult } from '../../entities/analysis/schema';
import type { AnalysisResult } from '../model/types';
import { chatResponseSchema, ChatResponse } from './schemas/chat';
import { chatSessionPageSchema, type ChatSessionPage } from './schemas/chatSession';
import { API_BASE } from '../config/api';
import type { RequestClass } from '../config/requestPolicy';
import { REQUEST_POLICY, DEFAULT_REQUEST_CLASS } from '../config/requestPolicy';

// #region agent log
const DEBUG_LOG = (message: string, data: Record<string, unknown>, hypothesisId: string) => {
  if (!import.meta.env.DEV) return;
  const payload = { sessionId: 'a4f614', location: 'miriartApi.ts', message, data, timestamp: Date.now(), hypothesisId };
  console.log('[DEBUG]', message, data);
  fetch('http://127.0.0.1:7620/ingest/67ee1a3b-2ca5-4344-aa14-d8c9f2ec8b28', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'a4f614' },
    body: JSON.stringify(payload),
  }).catch(() => {});
};
// #endregion

// ─── 에러 클래스 ───────────────────────────────────────────────────────────────
/** API 에러. status, message 보유. 402=크레딧 부족, 408=타임아웃 등 */
export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// ─── 토큰 관리 (정의는 tokenManager.ts, 재export) ────────────────────────────────
export { tokenManager } from './tokenManager';

// ─── 인증 헤더 빌더 ────────────────────────────────────────────────────────────
export function getAuthHeaders(): Record<string, string> {
  const token = tokenManager.getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Refresh Token 인터셉터가 포함된 fetch 래퍼 ────────────────────────────────
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

async function refreshToken(): Promise<void> {
  const res = await fetch(`${API_BASE}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include', // httpOnly Cookie 자동 전송
  });
  if (!res.ok) {
    tokenManager.clearAccessToken();
    useUserStore.getState().clearAuth();
    const isDevSkipAuth = import.meta.env.DEV && import.meta.env.VITE_DEV_SKIP_AUTH !== 'false';
    if (!isDevSkipAuth) {
      sessionStorage.setItem('miriart_session_expired', '1');
      window.location.href = '/auth/login';
    }
    throw new ApiError(401, 'Refresh token expired');
  }
  const json = await res.json();
  const payload = (json as { data?: unknown }).data ?? json;
  const parsed = refreshResponseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new ApiError(500, 'Invalid refresh response');
  }
  tokenManager.setAccessToken(parsed.data.accessToken);
}

/** apiFetch 옵션. requestClass 지정 시 해당 정책(timeout/retry) 적용. signal은 넘기지 않는다. */
export type ApiFetchOptions = RequestInit & { requestClass?: RequestClass };

/**
 * 정책 기반 fetch. 401 래퍼 → 내부 policy-aware fetch.
 * - 내부: timeout + 네트워크/타임아웃 재시도만 수행.
 * - 401은 루프 바깥에서 한 번만: refresh 후 내부 fetch 한 번 더.
 */
export async function apiFetch<T>(path: string, init: ApiFetchOptions = {}, retry401 = true): Promise<T> {
  const requestClass = init.requestClass ?? DEFAULT_REQUEST_CLASS;
  const { requestClass: _rc, signal: _signal, ...fetchInit } = init;
  if (init.signal != null && import.meta.env.DEV) {
    console.warn('[apiFetch] Do not pass signal to apiFetch; policy-based timeout uses internal AbortController.');
  }
  const policy = REQUEST_POLICY[requestClass];

  async function fetchWithPolicy(innerPath: string, innerInit: RequestInit): Promise<Response> {
    let lastError: unknown;
    for (let attempt = 0; attempt <= policy.retry; attempt++) {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), policy.timeoutMs);
      try {
        const res = await fetch(`${API_BASE}${innerPath}`, {
          ...innerInit,
          credentials: 'include',
          headers: { ...(innerInit.headers || {}) },
          signal: controller.signal,
        });
        clearTimeout(id);
        return res;
      } catch (err) {
        clearTimeout(id);
        if (err instanceof Error && err.name === 'AbortError') {
          throw new ApiError(408, 'FE_TIMEOUT');
        }
        lastError = err;
        if (attempt >= policy.retry) throw err;
      }
    }
    throw lastError;
  }

  let res = await fetchWithPolicy(path, fetchInit);
  if (res.status === 401 && retry401) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshToken().finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
    }
    await refreshPromise;
    res = await fetchWithPolicy(path, { ...fetchInit, headers: { ...(fetchInit.headers as Record<string, string> || {}), ...getAuthHeaders() } });
  }

  if (!res.ok) {
    const body = await res.text().catch(() => res.statusText);
    throw new ApiError(res.status, body);
  }
  return res.json() as Promise<T>;
}

// ─── Auth API ──────────────────────────────────────────────────────────────────
export type { TokenExchangeResponse } from './schemas/auth';

export const AuthApi = {
  exchangeToken: async (code: string): Promise<import('./schemas/auth').TokenExchangeResponse> => {
    // #region agent log
    DEBUG_LOG('exchangeToken apiFetch start', { codeLength: code.length }, 'A');
    // #endregion
    const raw = await apiFetch<unknown>('/api/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    const payload = (raw as { data?: unknown }).data ?? raw;
    const parsed = tokenExchangeSchema.safeParse(payload);
    if (!parsed.success) {
      // #region agent log
      DEBUG_LOG('exchangeToken parse failed', {
        firstError: parsed.error.errors[0]?.message,
        issues: parsed.error.issues?.length,
      }, 'B');
      // #endregion
      throw new ApiError(500, 'Invalid auth response');
    }
    return parsed.data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiFetch('/api/auth/logout', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } finally {
      tokenManager.clearAccessToken();
      useUserStore.getState().clearAuth();
    }
  },
};

// ─── User API ──────────────────────────────────────────────────────────────────
export type UserProfile = import('./schemas/user').UserProfileApi;

export interface PlanInfo {
  plan: 'FREE' | 'BASIC' | 'PREMIUM';
  monthlyLimit: number;
  usedThisMonth: number;
  remaining: number;
}

export const UserApi = {
  getMe: async (): Promise<UserProfile> => {
    const raw = await apiFetch<unknown>('/api/users/me', { headers: getAuthHeaders() });
    const payload = (raw as { data?: unknown }).data ?? raw;
    const parsed = userProfileApiSchema.safeParse(payload);
    if (!parsed.success) {
      const issues = parsed.error.issues;
      if (import.meta.env.DEV) console.warn('[getMe] parse failed. payload:', payload, 'zod issues:', issues);
      // #region agent log
      DEBUG_LOG('getMe parse failed', {
        payloadKeys: typeof payload === 'object' && payload !== null ? Object.keys(payload as object) : [],
        zodIssues: issues?.map((i) => ({ path: i.path, message: i.message })),
      }, 'C');
      // #endregion
      throw new ApiError(500, 'Invalid user profile response');
    }
    return parsed.data;
  },

  updateProfile: async (data: { nickname: string; grade: string; domain: string }): Promise<{ needsProfile: boolean }> => {
    const raw = await apiFetch<unknown>('/api/users/me/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    });
    const payload = (raw as { data?: unknown }).data ?? raw;
    const needsProfile = (payload as { needsProfile?: boolean }).needsProfile ?? false;
    return { needsProfile };
  },

  getPlan: async (): Promise<PlanInfo> => {
    const raw = await apiFetch<unknown>('/api/users/me/plan', { headers: getAuthHeaders() });
    const payload = (raw as { data?: unknown }).data ?? raw;
    const parsed = userPlanSchema.safeParse(payload);
    if (!parsed.success) {
      throw new ApiError(500, 'Invalid plan response');
    }
    const p = parsed.data;
    return { plan: p.plan as PlanInfo['plan'], monthlyLimit: p.monthlyLimit, usedThisMonth: p.usedThisMonth, remaining: p.remaining };
  },
};

// ─── Analysis API (gemini.ts ApiService.analyze 대체) ─────────────────────────
// P0: POST 202 + analysisId → GET /api/analyses/{id}로 최종 결과 반환.
export interface AnalyzeOptions {
  type: 'basic' | 'major';
  problemText?: string;
}

export type AnalyzeResponse = import('./schemas/analysis').AnalysisResponseApi;

export const AnalysisApi = {
  analyze: async (imageFile: File, options: AnalyzeOptions): Promise<AnalysisResult> => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('analysisType', options.type);
      if (options.problemText) formData.append('problemText', options.problemText);
      const raw = await apiFetch<unknown>('/api/analyses', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
        requestClass: 'CRITICAL_SLOW',
      });
      const payload = (raw as { data?: unknown }).data ?? raw;
      const startParsed = analysisStartResponseSchema.safeParse(payload);
      if (!startParsed.success) {
        throw new ApiError(500, 'Invalid analysis start response');
      }
      const { analysisId } = startParsed.data;
      const detailRaw = await apiFetch<unknown>(`/api/analyses/${analysisId}`, { headers: getAuthHeaders(), requestClass: 'CRITICAL_SLOW' });
      const detailPayload = (detailRaw as { data?: unknown }).data ?? detailRaw;
      const detailParsed = analysisResponseSchema.safeParse(detailPayload);
      if (!detailParsed.success) {
        throw new ApiError(500, 'Invalid analysis response');
      }
      return normalizeAnalysisResult(detailParsed.data);
    } catch (error) {
      if (error instanceof ApiError) {
        const body = parseApiErrorBody(error.message);
        useDebugStore.getState().setLastAnalysisError({
          status: error.status,
          code: body.code,
          message: body.message ?? error.message,
          requestId: body.requestId,
          timestamp: new Date().toISOString(),
        });
      }
      const msg =
        error instanceof ApiError && error.status === 402
          ? '크레딧이 부족합니다. 플랜을 업그레이드해주세요.'
          : error instanceof ApiError && error.status === 408
            ? '분석 시간이 초과됐습니다. 잠시 후 다시 시도해주세요.'
            : handleApiError(error);
      useToastStore.getState().show(msg, 'error');
      throw error;
    }
  },

  getList: async (params?: { page?: number; size?: number; grade?: string }): Promise<AnalysisResult[]> => {
    const raw = await apiFetch<unknown>(
      '/api/analyses?' + new URLSearchParams((params ?? {}) as Record<string, string>).toString(),
      { headers: getAuthHeaders(), requestClass: 'CRITICAL_SLOW' }
    );
    const payload = (raw as { data?: unknown }).data ?? raw;
    const parsed = analysesListResponseSchema.safeParse(payload);
    if (!parsed.success) {
      throw new ApiError(500, 'Invalid analyses list response');
    }
    const list = parsed.data;
    return list.map((item) => normalizeAnalysisResult(item));
  },

  getById: async (id: string): Promise<AnalysisResult> => {
    const raw = await apiFetch<unknown>(`/api/analyses/${id}`, { headers: getAuthHeaders(), requestClass: 'CRITICAL_SLOW' });
    const payload = (raw as { data?: unknown }).data ?? raw;
    const parsed = analysisResponseSchema.safeParse(payload);
    if (!parsed.success) {
      throw new ApiError(500, 'Invalid analysis response');
    }
    return normalizeAnalysisResult(parsed.data);
  },
};

// ─── Image API (Signed URL) ─────────────────────────────────────────────────
/** GET /api/images/{analysisId}/url 응답. Signed URL 및 만료 시각. */
export interface SignedImageUrlResponse {
  url: string;
  expiresAt?: string;
}

/**
 * BE SSOT: ImageController → ApiResponse.success(ImageUrlResponse) → JSON { success, data: { url, expiresAt } }.
 * apiFetch가 최외곽 { data } 를 벗겨내므로 payload = { url, expiresAt }.
 */
export const ImageApi = {
  /** 분석 id로 표시용 Signed URL 조회. img src 또는 onError 재요청에 사용. */
  getSignedUrl: async (analysisId: string): Promise<SignedImageUrlResponse> => {
    const raw = await apiFetch<unknown>(`/api/images/${analysisId}/url`, { headers: getAuthHeaders() });
    const payload = (raw as { data?: unknown }).data ?? raw;
    const data = payload as { url?: string; expiresAt?: string };
    if (!data?.url || typeof data.url !== 'string') {
      throw new ApiError(500, 'Invalid image URL response');
    }
    return { url: data.url, expiresAt: typeof data.expiresAt === 'string' ? data.expiresAt : undefined };
  },
};

// ─── AI Chat API (gemini.ts ApiService.chat 대체) ─────────────────────────────
export interface ChatRequest {
  message: string;
  modelType: AIModelType;
  sessionId?: string;
  stickyContext?: { grade: string; score: number; fixScope: string; radarData?: Record<string, number> };
  imageBase64?: string;
  imageMimeType?: string;
  history?: { role: 'user' | 'model'; parts: { text: string }[] }[];
}

// ChatResponse 타입은 schemas/chat에서 export (Zod 검증용)
export type { ChatResponse };

export const ChatApi = {
  sendMessage: async (params: ChatRequest): Promise<ChatResponse> => {
    try {
      const raw = await apiFetch<unknown>('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(params),
        requestClass: 'CRITICAL_SLOW',
      });
      const payload = (raw as { data?: unknown }).data ?? raw;
      const parsed = chatResponseSchema.safeParse(payload);
      if (!parsed.success) {
        throw new ApiError(500, 'Invalid chat response');
      }
      return parsed.data;
    } catch (error) {
      if (error instanceof ApiError) {
        const body = parseApiErrorBody(error.message);
        useDebugStore.getState().setLastChatError({
          status: error.status,
          code: body.code,
          message: body.message ?? error.message,
          requestId: body.requestId,
          timestamp: new Date().toISOString(),
        });
      }
      const msg =
        error instanceof ApiError && error.status === 402
          ? '크레딧이 부족합니다. 플랜을 업그레이드해주세요.'
          : handleApiError(error);
      useToastStore.getState().show(msg, 'error');
      throw error;
    }
  },
};

// ─── Chat Session API (GET /api/chat/sessions) ─────────────────────────────────
/**
 * GET /api/chat/sessions?page=0&size=20&grade=A
 * BE: ChatSessionController.getSessionList → Page<ChatSessionResponse>
 */
export const ChatSessionApi = {
  getList: async (params?: {
    page?: number;
    size?: number;
    grade?: string;
  }): Promise<ChatSessionPage> => {
    const query = new URLSearchParams();
    if (params?.page != null) query.set('page', String(params.page));
    if (params?.size != null) query.set('size', String(params.size));
    if (params?.grade) query.set('grade', params.grade);
    const qs = query.toString();
    const path = `/api/chat/sessions${qs ? `?${qs}` : ''}`;
    const raw = await apiFetch<unknown>(path, { headers: getAuthHeaders() });
    const payload = (raw as { data?: unknown }).data ?? raw;
    const parsed = chatSessionPageSchema.safeParse(payload);
    if (!parsed.success) {
      if (import.meta.env.DEV) console.warn('[ChatSessionApi] Zod parse warning:', parsed.error.issues);
      return payload as ChatSessionPage;
    }
    return parsed.data;
  },
};

// ─── ErrorCode 처리 ────────────────────────────────────────────────────────────
/** BE 커뮤니티 ErrorCode(CM001~CM007) → 사용자 메시지. FE 메시지 우선. BE가 한국어 메시지를 내려주면 정책 결정 후 body.message 우선 가능. */
const COMMUNITY_MESSAGES: Record<string, string> = {
  CM001: '게시글을 찾을 수 없어요.',
  CM002: '답변이 달린 질문은 수정/삭제할 수 없어요.',
  CM003: '이미 채택된 답변이 있어요.',
  CM004: '채택은 질문 작성자만 가능해요.',
  CM005: '마감된 질문이에요.',
  CM006: '이미 좋아요를 눌렀어요.',
  CM007: '이미 신고한 컨텐츠예요.',
};

/**
 * BE ErrorResponse body 문자열 파싱. 디버그 스토어·코드 기반 UX 분기용.
 * @see handleApiError, debugStore
 */
export function parseApiErrorBody(message: string): {
  code?: string;
  message?: string;
  requestId?: string;
} {
  try {
    const body = JSON.parse(message) as { code?: string; message?: string; requestId?: string };
    return {
      code: body?.code,
      message: typeof body?.message === 'string' ? body.message : undefined,
      requestId: typeof body?.requestId === 'string' ? body.requestId : undefined,
    };
  } catch {
    return {};
  }
}

/** API 계약서 §9 기반 ErrorCode → 한국어 메시지 변환. 스키마 검증 실패 메시지도 친절한 문구로 매핑 */
export function handleApiError(error: unknown): string {
  if (!(error instanceof ApiError)) return '알 수 없는 오류가 발생했습니다.';

  // FE 타임아웃 (정책 기반 AbortController). BE 408+AN002/AI002는 아래 code 매핑으로 처리.
  if (error.status === 408 && error.message === 'FE_TIMEOUT') return '요청이 너무 오래 걸립니다.';

  // 스키마 검증 실패 등 메시지 문자열 기반 매핑 (사용자 노출용)
  const messageMap: Record<string, string> = {
    'Invalid analysis response':
      '분석 결과를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.',
    'Invalid chat response':
      'AI 답변을 불러오지 못했어요. 다시 한 번 시도해 주세요.',
  };
  if (messageMap[error.message]) return messageMap[error.message];

  try {
    const body = JSON.parse(error.message);
    const code = body?.code;
    const messages: Record<string, string> = {
      C001: '입력값을 확인해 주세요.',
      CS001: '채팅 세션을 찾을 수 없습니다.',
      CR001: '이번 달 분석 한도를 초과했습니다. 플랜을 업그레이드해주세요.',
      CR002: 'Basic 플랜 이상에서 사용 가능한 기능입니다.',
      F001: '업로드할 파일이 없습니다.',
      F002: '파일 크기가 제한을 초과했습니다. (최대 10MB)',
      F003: '파일 업로드에 실패했습니다.',
      F004: '허용되지 않는 파일 형식입니다. (png, jpeg, webp, gif만 가능)',
      F005: '이미지 URL 생성에 실패했습니다. 다시 시도해 주세요.',
      AN001: 'AI 분석 서비스 연결에 실패했습니다.',
      AN002: '분석 시간이 초과됐습니다. 잠시 후 다시 시도해주세요.',
      AN003: '분석 결과를 찾을 수 없습니다.',
      AN004: 'AI 서비스 인증에 일시 문제가 있습니다. 잠시 후 다시 시도해주세요.',
      I001: '이미지를 찾을 수 없습니다.',
      AI001: 'AI 멘토 연결에 실패했습니다.',
      AI002: 'AI 응답 시간이 초과됐습니다.',
      AI003: 'AI 서비스 인증에 실패했습니다. 잠시 후 다시 시도해 주세요.',
      M002: '이미 사용 중인 닉네임입니다.',
      AUTH002: '로그인 세션이 만료됐습니다. 다시 로그인해주세요.',
      AUTH009: 'AI 서비스 인증에 일시 문제가 있습니다. 잠시 후 다시 시도해주세요.',
      ...COMMUNITY_MESSAGES,
    };
    return messages[code] || body?.message || '오류가 발생했습니다.';
  } catch {
    return error.message || '오류가 발생했습니다.';
  }
}

// ─── 유틸 ──────────────────────────────────────────────────────────────────────
/** File → base64 string 변환 (multipart 대신 JSON body 사용 시) */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
