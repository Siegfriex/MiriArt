/**
 * @fileoverview MiriArt API 클라이언트. 인증, 분석, 채팅, 커뮤니티 API.
 * gemini.ts 대체. Authorization 헤더 + Refresh 인터셉터 포함.
 * @참조 AuthCallback, UploadFlow, chat-room Page, communityApi
 */

import { useToastStore } from '../model/toastStore';
import { useUserStore } from '../model/userStore';
import { AIModelType } from '../model/types';
import { tokenManager } from './tokenManager';
import { tokenExchangeSchema, refreshResponseSchema } from './schemas/auth';
import { userProfileApiSchema, userPlanSchema } from './schemas/user';
import { analysisResponseSchema } from './schemas/analysis';
import { normalizeAnalysisResult } from '../../entities/analysis/schema';
import type { AnalysisResult } from '../model/types';
import { chatResponseSchema, ChatResponse } from './schemas/chat';
import { API_BASE } from '../config/api';

// #region agent log
const DEBUG_LOG = (message: string, data: Record<string, unknown>, hypothesisId: string) => {
  fetch('http://127.0.0.1:7620/ingest/67ee1a3b-2ca5-4344-aa14-d8c9f2ec8b28', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'a4f614' },
    body: JSON.stringify({
      sessionId: 'a4f614',
      location: 'miriartApi.ts',
      message,
      data,
      timestamp: Date.now(),
      hypothesisId,
    }),
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

export async function apiFetch<T>(path: string, init: RequestInit, retry = true): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init.headers || {}),
    },
  });

  // 401 → Refresh 시도 (1회)
  if (res.status === 401 && retry) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshToken().finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
    }
    await refreshPromise;
    return apiFetch<T>(path, {
      ...init,
      headers: { ...(init.headers || {}), ...getAuthHeaders() },
    }, false);
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
      throw new ApiError(500, 'Invalid user profile response');
    }
    return parsed.data;
  },

  updateProfile: async (data: { nickname: string; grade: string; domain: string }): Promise<{ needsProfile: boolean }> =>
    apiFetch('/api/users/me/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    }),

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
      });
      const payload = (raw as { data?: unknown }).data ?? raw;
      const parsed = analysisResponseSchema.safeParse(payload);
      if (!parsed.success) {
        throw new ApiError(500, 'Invalid analysis response');
      }
      return normalizeAnalysisResult(parsed.data);
    } catch (error) {
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

  getList: async (params?: { page?: number; size?: number; grade?: string }) =>
    apiFetch('/api/analyses?' + new URLSearchParams(params as Record<string, string>).toString(), {
      headers: getAuthHeaders(),
    }),

  getById: async (id: string): Promise<AnalysisResult> => {
    const raw = await apiFetch<unknown>(`/api/analyses/${id}`, { headers: getAuthHeaders() });
    const payload = (raw as { data?: unknown }).data ?? raw;
    const parsed = analysisResponseSchema.safeParse(payload);
    if (!parsed.success) {
      throw new ApiError(500, 'Invalid analysis response');
    }
    return normalizeAnalysisResult(parsed.data);
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
      });
      const payload = (raw as { data?: unknown }).data ?? raw;
      const parsed = chatResponseSchema.safeParse(payload);
      if (!parsed.success) {
        throw new ApiError(500, 'Invalid chat response');
      }
      return parsed.data;
    } catch (error) {
      const msg =
        error instanceof ApiError && error.status === 402
          ? '크레딧이 부족합니다. 플랜을 업그레이드해주세요.'
          : handleApiError(error);
      useToastStore.getState().show(msg, 'error');
      throw error;
    }
  },
};

// ─── ErrorCode 처리 ────────────────────────────────────────────────────────────
/** API 계약서 §9 기반 ErrorCode → 한국어 메시지 변환. 스키마 검증 실패 메시지도 친절한 문구로 매핑 */
export function handleApiError(error: unknown): string {
  if (!(error instanceof ApiError)) return '알 수 없는 오류가 발생했습니다.';

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
      CR001: '이번 달 분석 한도를 초과했습니다. 플랜을 업그레이드해주세요.',
      CR002: 'Basic 플랜 이상에서 사용 가능한 기능입니다.',
      AN001: 'AI 분석 서비스 연결에 실패했습니다.',
      AN002: '분석 시간이 초과됐습니다. 잠시 후 다시 시도해주세요.',
      AI001: 'AI 멘토 연결에 실패했습니다.',
      AI002: 'AI 응답 시간이 초과됐습니다.',
      M002: '이미 사용 중인 닉네임입니다.',
      AUTH002: '로그인 세션이 만료됐습니다. 다시 로그인해주세요.',
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
