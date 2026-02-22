/**
 * @fileoverview MiriArt API 클라이언트. 인증, 분석, 채팅, 커뮤니티 API.
 * gemini.ts 대체. Authorization 헤더 + Refresh 인터셉터 포함.
 * @참조 AuthCallback, UploadFlow, chat-room Page, communityApi
 */

import { useToastStore } from '../model/toastStore';
import { AIModelType } from '../model/types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// ─── 에러 클래스 ───────────────────────────────────────────────────────────────
/** API 에러. status, message 보유. 402=크레딧 부족, 408=타임아웃 등 */
export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// ─── 토큰 관리 ─────────────────────────────────────────────────────────────────
export const tokenManager = {
  getAccessToken: () => localStorage.getItem('accessToken'),
  setAccessToken: (token: string) => localStorage.setItem('accessToken', token),
  clearAccessToken: () => localStorage.removeItem('accessToken'),
};

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
    window.location.href = '/auth/login';
    throw new ApiError(401, 'Refresh token expired');
  }
  const { accessToken } = await res.json();
  tokenManager.setAccessToken(accessToken);
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
export interface TokenExchangeResponse {
  accessToken: string;
  expiresIn: number;
  userId: string;
  needsProfile: boolean;
  provider: string;
}

export const AuthApi = {
  exchangeToken: async (code: string): Promise<TokenExchangeResponse> =>
    apiFetch<TokenExchangeResponse>('/api/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    }),

  logout: async (): Promise<void> => {
    await apiFetch('/api/auth/logout', {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    tokenManager.clearAccessToken();
  },
};

// ─── User API ──────────────────────────────────────────────────────────────────
export interface UserProfile {
  id: string;
  nickname: string;
  grade: string;
  domain: string;
  provider: string;
  role: string;
  reputationScore: number;
  reputationLevel: number;
  needsProfile: boolean;
}

export interface PlanInfo {
  plan: 'FREE' | 'BASIC' | 'PREMIUM';
  monthlyLimit: number;
  usedThisMonth: number;
  remaining: number;
}

export const UserApi = {
  getMe: async (): Promise<UserProfile> =>
    apiFetch('/api/users/me', { headers: getAuthHeaders() }),

  updateProfile: async (data: { nickname: string; grade: string; domain: string }): Promise<{ needsProfile: boolean }> =>
    apiFetch('/api/users/me/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    }),

  getPlan: async (): Promise<PlanInfo> =>
    apiFetch('/api/users/me/plan', { headers: getAuthHeaders() }),
};

// ─── Analysis API (gemini.ts ApiService.analyze 대체) ─────────────────────────
export interface AnalyzeOptions {
  type: 'basic' | 'major';
  problemText?: string;
}

export interface AnalyzeResponse {
  id: string;
  grade: string;
  totalScore: number;
  radarData: { density: number; form: number; completion: number; relevance: number; thinking: number };
  fixScope: 'StructureRebuild' | 'DetailTuning';
  comment: string;
}

export const AnalysisApi = {
  analyze: async (imageFile: File, options: AnalyzeOptions): Promise<AnalyzeResponse> => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('analysisType', options.type);
      if (options.problemText) formData.append('problemText', options.problemText);
      return await apiFetch<AnalyzeResponse>('/api/analyses', {
        method: 'POST',
        headers: getAuthHeaders(), // Content-Type은 FormData가 자동 설정
        body: formData,
      });
    } catch (error) {
      const msg =
        error instanceof ApiError && error.status === 402
          ? '크레딧이 부족합니다. 플랜을 업그레이드해주세요.'
          : error instanceof ApiError && error.status === 408
            ? '분석 시간이 초과됐습니다. 잠시 후 다시 시도해주세요.'
            : '작품 분석에 실패했습니다.';
      useToastStore.getState().show(msg, 'error');
      throw error;
    }
  },

  getList: async (params?: { page?: number; size?: number; grade?: string }) =>
    apiFetch('/api/analyses?' + new URLSearchParams(params as Record<string, string>).toString(), {
      headers: getAuthHeaders(),
    }),

  getById: async (id: string): Promise<AnalyzeResponse> =>
    apiFetch(`/api/analyses/${id}`, { headers: getAuthHeaders() }),
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

export interface ChatResponse {
  text: string;
  groundingUrls?: string[];
  quickReplies?: string[];
  sessionId: string;
}

export const ChatApi = {
  sendMessage: async (params: ChatRequest): Promise<ChatResponse> => {
    try {
      return await apiFetch<ChatResponse>('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(params),
      });
    } catch (error) {
      const msg =
        error instanceof ApiError && error.status === 402
          ? '크레딧이 부족합니다. 플랜을 업그레이드해주세요.'
          : 'AI 멘토 연결에 실패했습니다. 다시 시도해주세요.';
      useToastStore.getState().show(msg, 'error');
      throw error;
    }
  },
};

// ─── ErrorCode 처리 ────────────────────────────────────────────────────────────
/** API 계약서 §9 기반 ErrorCode → 한국어 메시지 변환 */
export function handleApiError(error: unknown): string {
  if (!(error instanceof ApiError)) return '알 수 없는 오류가 발생했습니다.';
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
