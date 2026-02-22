/**
 * @fileoverview MiriArt API 서비스. AI 호출은 Cloud Run 프록시(VITE_API_BASE_URL) 경유. API 키는 프론트에 없음.
 * @참조 chat-room Page, UploadFlow, GradeInputSheet (ApiService.chat, analyze, editImage)
 * @라우팅 /chat/:sessionId, /result/:id, /tutorial
 * @상태 useToastStore (에러 시 토스트)
 *
 * @deprecated miriartApi.ts로 교체됨.
 * ApiService.chat → ChatApi.sendMessage
 * ApiService.analyze → AnalysisApi.analyze
 * ApiService.editImage → ChatApi.sendMessage (modelType: IMAGE_EDIT)
 * ApiError → miriartApi.ApiError
 * fileToBase64 → miriartApi.fileToBase64
 * @see src/shared/api/miriartApi.ts
 */

import { AIModelType } from '../model/types';
import { useToastStore } from '../model/toastStore';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// ─── 에러 클래스 ──────────────────────────────────────────────────────────────

/** API 에러. status, message 보유. 402=크레딧 부족, 408=타임아웃 등 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ─── 요청/응답 타입 ───────────────────────────────────────────────────────────

/** 채팅 컨텍스트: 성적, 점수, 수정 범위, 레이더 데이터 */
export interface StickyContext {
  grade: string;
  score: number;
  fixScope: 'StructureRebuild' | 'DetailTuning';
  radarData?: Record<string, number>;
}

/** 채팅 요청: modelType, message, sessionId, stickyContext, 이미지, 히스토리 */
export interface ChatRequest {
  modelType: AIModelType;
  message: string;
  sessionId?: string;
  stickyContext?: StickyContext;
  imageBase64?: string;
  imageMimeType?: string;
  history?: { role: 'user' | 'model'; parts: { text: string }[] }[];
}

/** 채팅 응답: text, groundingUrls, quickReplies */
export interface ChatResponse {
  text: string;
  groundingUrls?: string[];
  quickReplies?: string[];
}

/** 분석 옵션: basic | major, problemText */
export interface AnalyzeOptions {
  type: 'basic' | 'major';
  problemText?: string;
}

/** 분석 응답: id, grade, totalScore, radarData, fixScope, comment */
export interface AnalyzeResponse {
  id: string;
  grade: string;
  totalScore: number;
  radarData: {
    density: number;
    form: number;
    completion: number;
    relevance: number;
    thinking: number;
  };
  fixScope: 'StructureRebuild' | 'DetailTuning';
  comment: string;
}

/** 이미지 편집 요청: imageBase64, prompt */
export interface ImageEditRequest {
  imageBase64: string;
  prompt: string;
}

/** 이미지 편집 응답: text, imageUrl */
export interface ImageEditResponse {
  text: string;
  imageUrl?: string;
}

// ─── 내부 fetch 헬퍼 ──────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...(init.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => res.statusText);
    throw new ApiError(res.status, body);
  }
  return res.json() as Promise<T>;
}

// ─── API Service ──────────────────────────────────────────────────────────────

/**
 * API 서비스 객체. chat, analyze, editImage 메서드. 에러 시 useToastStore로 토스트 표시.
 * @참조 chat-room Page, UploadFlow, GradeInputSheet
 * @상태 useToastStore
 */
export const ApiService = {
  /**
   * 채팅 메시지 전송 (Ask / Plan / Critic / Inference / Image Edit)
   * Cloud Run /api/chat → Gemini generateContent
   */
  chat: async (params: ChatRequest): Promise<ChatResponse> => {
    try {
      return await apiFetch<ChatResponse>('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  /**
   * 작품 이미지 분석
   * Cloud Run /api/analyze → Gemini Vision + 5-Point Analysis
   */
  analyze: async (imageFile: File, options: AnalyzeOptions): Promise<AnalyzeResponse> => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('options', JSON.stringify(options));
      return await apiFetch<AnalyzeResponse>('/api/analyze', {
        method: 'POST',
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

  /**
   * 이미지 편집 (Gemini Image Edit)
   * Cloud Run /api/edit-image
   */
  editImage: async (params: ImageEditRequest): Promise<ImageEditResponse> => {
    try {
      return await apiFetch<ImageEditResponse>('/api/edit-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
    } catch (error) {
      useToastStore.getState().show('이미지 편집에 실패했습니다.', 'error');
      throw error;
    }
  },
};

// ─── 유틸 ─────────────────────────────────────────────────────────────────────

/** File → base64 string 변환 (멀티파트 대신 JSON body 사용 시) */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // data:image/png;base64, 제거
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

