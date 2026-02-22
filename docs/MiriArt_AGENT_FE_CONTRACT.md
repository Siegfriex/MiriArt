# AGENT_FE_CONTRACT.md — MiriArt FE↔BE 계약 검증 + ApiService 마이그레이션 에이전트 프롬프트

> **역할**: MiriArt FE ↔ BE 계약 검증 + `gemini.ts` → `miriartApi.ts` 마이그레이션 전담 에이전트
> **버전**: 1.0 | **작성일**: 2026-02-22

---

## 참고 기준

구현 시 아래 문서 패턴에 맞춰라:

- **Vite + React + TypeScript 구조**: [Complete Guide to React + TypeScript + Vite (2026)](https://medium.com/@robinviktorsson/complete-guide-to-setting-up-react-with-typescript-and-vite-2025-468f6556aaf2)
- **FE 베스트 프랙티스**: [Best Practices for React.js with Vite and TypeScript](https://medium.com/@taedmonds/best-practices-for-react-js-with-vite-and-typescript-what-i-use-and-why-f4482558ed89)
- **FSD 폴더 구조**: [Production-Ready Vite + React Folder Structure](https://sandeshrathnayake.medium.com/mastering-modern-react-vite-folder-structure-a-production-ready-guide-for-scalable-applications-9ad8e233f8b9)
- **API 계약서**: `docs/02_21dys_API_CONTRACT.md` (SSOT)
- **JWT 토큰 전략**: Access=localStorage/메모리, Refresh=httpOnly Cookie [JWT Best Practices](https://jwt.app/blog/jwt-best-practices)

---

## 컨텍스트

```
FE 현재 위치: H:\n_0221\02_21dys\src\
주요 파일:
  - src/shared/api/gemini.ts       ← 마이그레이션 대상 (현 ApiService 3개 메서드)
  - src/shared/model/types.ts      ← 도메인 타입 (유지, 일부 확장)
  - src/shared/model/userStore.ts  ← Zustand persist (Auth 상태 추가 필요)
  - src/app/routers/AppRouter.tsx  ← /auth/callback 라우트 추가 필요
  - src/app/App.tsx                ← Auth 초기화 로직 추가 필요

FE 구조: FSD (Feature-Sliced Design)
  - app/ pages/ widgets/ features/ entities/ shared/

API 계약: docs/02_21dys_API_CONTRACT.md
대상 BE: Java Spring Boot (VITE_API_BASE_URL)
인증:
  - Access Token: localStorage.getItem('accessToken') → Authorization: Bearer 헤더
  - Refresh Token: httpOnly Cookie (자동 전송, JS 접근 불가)
  - 401 응답 시: POST /api/auth/refresh 자동 호출 → 재시도 (인터셉터)
```

---

## Task 1: `gemini.ts` → `miriartApi.ts` 마이그레이션

**작업 지시**:

`src/shared/api/gemini.ts`를 분석하고, `src/shared/api/miriartApi.ts`를 신규 작성하라.
`gemini.ts`는 마이그레이션 완료 후 deprecated 표시.

**`src/shared/api/miriartApi.ts`** 전체 구조:

```typescript
/**
 * @fileoverview MiriArt API 클라이언트. 인증, 분석, 채팅, 커뮤니티 API.
 * gemini.ts 대체. Authorization 헤더 + Refresh 인터셉터 포함.
 */

import { useToastStore } from '../model/toastStore';
import { AIModelType } from '../model/types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// ─── 에러 클래스 (기존 ApiError 그대로 유지) ──────────────────────────────
export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// ─── 토큰 관리 ────────────────────────────────────────────────────────────
export const tokenManager = {
  getAccessToken: () => localStorage.getItem('accessToken'),
  setAccessToken: (token: string) => localStorage.setItem('accessToken', token),
  clearAccessToken: () => localStorage.removeItem('accessToken'),
};

// ─── 인증 헤더 빌더 ─────────────────────────────────────────────────────
function getAuthHeaders(): Record<string, string> {
  const token = tokenManager.getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Refresh Token 인터셉터가 포함된 fetch 래퍼 ─────────────────────────
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

async function refreshToken(): Promise<void> {
  const res = await fetch(`${API_BASE}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include', // httpOnly Cookie 자동 전송
  });
  if (!res.ok) {
    tokenManager.clearAccessToken();
    window.location.href = '/auth/login'; // Refresh 만료 → 로그인 화면
    throw new ApiError(401, 'Refresh token expired');
  }
  const { accessToken } = await res.json();
  tokenManager.setAccessToken(accessToken);
}

async function apiFetch<T>(path: string, init: RequestInit, retry = true): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: 'include', // Refresh Token Cookie 자동 전송
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
    // 원래 요청 재시도 (Authorization 헤더 갱신 포함)
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

// ─── Auth API ─────────────────────────────────────────────────────────────
export interface TokenExchangeResponse {
  accessToken: string;
  expiresIn: number;
  userId: string;
  needsProfile: boolean;
  provider: string;
}

export const AuthApi = {
  exchangeToken: async (code: string): Promise<TokenExchangeResponse> => {
    return apiFetch<TokenExchangeResponse>('/api/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
  },
  logout: async (): Promise<void> => {
    await apiFetch('/api/auth/logout', {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    tokenManager.clearAccessToken();
  },
};

// ─── User API ─────────────────────────────────────────────────────────────
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

// ─── Analysis API (gemini.ts ApiService.analyze 대체) ─────────────────────
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
      const msg = error instanceof ApiError && error.status === 402
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

// ─── AI Chat API (gemini.ts ApiService.chat 대체) ─────────────────────────
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
      const msg = error instanceof ApiError && error.status === 402
        ? '크레딧이 부족합니다. 플랜을 업그레이드해주세요.'
        : 'AI 멘토 연결에 실패했습니다. 다시 시도해주세요.';
      useToastStore.getState().show(msg, 'error');
      throw error;
    }
  },
};
```

---

## Task 2: Auth 흐름 FE 구현

**작업 지시**:

**2-1. `AppRouter.tsx`에 `/auth/callback` 라우트 추가**:

```typescript
// AppRouter.tsx에 추가
import { AuthCallback } from '../../pages/auth/AuthCallback';

// Routes 안에 추가
<Route path="/auth/callback" element={<AuthCallback />} />
```

**2-2. `src/pages/auth/AuthCallback.tsx` 신규 작성**:

```typescript
/**
 * OAuth2 콜백 처리 페이지.
 * BE가 /auth/callback?code={uuid} 로 리다이렉트하면 여기서 JWT 교환.
 */
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthApi, tokenManager } from '../../shared/api/miriartApi';
import { useUserStore } from '../../shared/model/userStore';

export const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUserFromApi } = useUserStore();

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) { navigate('/auth/login'); return; }

    AuthApi.exchangeToken(code)
      .then(response => {
        tokenManager.setAccessToken(response.accessToken);
        if (response.needsProfile) {
          navigate('/onboarding');
        } else {
          navigate('/app/home');
        }
      })
      .catch(() => navigate('/auth/login'));
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-white text-sm">로그인 처리 중...</div>
    </div>
  );
};
```

**2-3. `Login.tsx` 수정** — 이메일/비밀번호 폼 제거, 소셜 로그인 버튼으로 교체:

```typescript
// 카카오 로그인 버튼
const handleKakaoLogin = () => {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/kakao/authorize`;
};

// 구글 로그인 버튼
const handleGoogleLogin = () => {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/auth/google/authorize`;
};
```

---

## Task 3: ErrorCode 처리 통일

**작업 지시**:

`src/shared/api/miriartApi.ts`에 ErrorCode 기반 에러 처리 함수 추가:

```typescript
// API 계약서 §9 기반 ErrorCode 처리
export function handleApiError(error: unknown): string {
  if (!(error instanceof ApiError)) return '알 수 없는 오류가 발생했습니다.';

  // ErrorResponse body 파싱 시도
  try {
    const body = JSON.parse(error.message);
    const code = body?.code;

    const messages: Record<string, string> = {
      'CR001': '이번 달 분석 한도를 초과했습니다. 플랜을 업그레이드해주세요.',
      'CR002': 'Basic 플랜 이상에서 사용 가능한 기능입니다.',
      'AN001': 'AI 분석 서비스 연결에 실패했습니다.',
      'AN002': '분석 시간이 초과됐습니다. 잠시 후 다시 시도해주세요.',
      'AI001': 'AI 멘토 연결에 실패했습니다.',
      'AI002': 'AI 응답 시간이 초과됐습니다.',
      'M002': '이미 사용 중인 닉네임입니다.',
      'AUTH002': '로그인 세션이 만료됐습니다. 다시 로그인해주세요.',
    };
    return messages[code] || body?.message || '오류가 발생했습니다.';
  } catch {
    return error.message || '오류가 발생했습니다.';
  }
}
```

---

## Task 4: 엔드포인트 계약 체크표 생성

**작업 지시**:

현 FE 코드(`gemini.ts`, `AppRouter.tsx`, `Login.tsx` 등)와 API_CONTRACT.md를 대조하여 아래 형식으로 체크표를 작성하라:

| API | FE 현재 호출 | 새 계약 | 일치 여부 | 조치 |
|-----|-------------|---------|---------|------|
| 작품 분석 | `POST /api/analyze` (gemini.ts) | `POST /api/analyses` | 불일치 | 경로 변경 + Authorization 헤더 추가 |
| AI 채팅 | `POST /api/chat` (gemini.ts) | `POST /api/chat` | 헤더 불일치 | Authorization 헤더 추가 |
| 이미지편집 | `POST /api/edit-image` (gemini.ts) | `POST /api/chat` (`modelType: IMAGE_EDIT`) | 불일치 | 통합, 엔드포인트 제거 |
| 로그인 | navigate만 (Mock) | `POST /api/auth/token` | 미구현 | AuthCallback 신규 작성 |
| 프로필 조회 | useUserStore Mock | `GET /api/users/me` | 미구현 | API 연동 |
| 크레딧 조회 | Zustand profile.credits | `GET /api/users/me/plan` | 미구현 | API 연동 |
| 분석 목록 | MOCK_ARTWORKS | `GET /api/analyses` | 미구현 | API 연동 |

---

## Task 5: 커뮤니티 FE API 클라이언트 스켈레톤 (Phase C 준비)

**작업 지시**:

`src/entities/community/api/communityApi.ts` 신규 작성 (뼈대만):

```typescript
/**
 * @fileoverview MiriArt 커뮤니티 API 클라이언트
 * Phase C1 구현 시 실제 로직 추가. 현재는 인터페이스 정의만.
 */
import { apiFetch, getAuthHeaders } from '../../shared/api/miriartApi';

export interface Post {
  id: string;
  type: 'free' | 'qna';
  status: 'OPEN' | 'SOLVED' | 'EXPIRED' | 'CLOSED';
  title: string;
  content: string;
  grade: string;
  tags: string[];
  imageUrls: string[];
  likeCount: number;
  answerCount: number;
  deadlineAt?: string;
  createdAt: string;
  persona: { displayName: string; colorToken: string };
  reputationLevel: number;
}

export interface CreatePostRequest {
  type: 'free' | 'qna';
  title: string;
  content: string;
  imageUrls?: string[];
  tags?: string[];
  gradeScope?: string;
  domainScope?: string;
  isAnonymous?: boolean;
  deadlineHours?: 24 | 48 | 72;
}

// Phase C1에서 구현
export const CommunityApi = {
  getPosts: async (params: { type?: string; sort?: string; grade?: string; cursor?: string }) =>
    Promise.resolve({ posts: [], nextCursor: null }),  // 스텁

  getPost: async (id: string): Promise<Post> =>
    Promise.reject(new Error('Phase C1 미구현')),      // 스텁

  createPost: async (data: CreatePostRequest): Promise<Post> =>
    Promise.reject(new Error('Phase C1 미구현')),      // 스텁

  likePost: async (targetType: string, id: string) =>
    Promise.reject(new Error('Phase C1 미구현')),      // 스텁
};
```

---

## Task 6: `useUserStore` Auth 상태 추가

**작업 지시**:

`src/shared/model/userStore.ts`에 Auth 관련 상태 추가:

```typescript
// 기존 UserStore에 추가할 필드/액션
interface UserStore {
  // 기존 필드 유지...

  // 신규 추가
  isAuthenticated: boolean;
  userId: string | null;
  setAuth: (userId: string) => void;
  clearAuth: () => void;
}

// 신규 액션 구현
setAuth: (userId) => set({ isAuthenticated: true, userId }),
clearAuth: () => {
  tokenManager.clearAccessToken();
  set({ isAuthenticated: false, userId: null });
},
```

---

## 검증 완료 기준

에이전트가 작업 완료 후 아래 항목을 체크하여 보고할 것:

- [ ] `miriartApi.ts` 작성 완료 (AuthApi, UserApi, AnalysisApi, ChatApi)
- [ ] Refresh Token 인터셉터 구현 (401 → refresh → retry)
- [ ] `/auth/callback` 라우트 추가 (AppRouter.tsx)
- [ ] `AuthCallback.tsx` 작성 완료 (code → JWT 교환 → needsProfile 분기)
- [ ] `Login.tsx` 소셜 로그인 버튼으로 교체
- [ ] `gemini.ts` deprecated 표시 + import 교체 필요 파일 목록 제시
- [ ] 엔드포인트 계약 체크표 작성 완료
- [ ] `communityApi.ts` 스켈레톤 작성 완료
- [ ] `useUserStore` Auth 상태 추가 완료
