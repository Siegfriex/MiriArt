/**
 * @fileoverview Dev/QA 전용 마지막 API 에러 저장. 디버그 패널에서 status, code, message, requestId 표시.
 * @참조 miriartApi (AnalysisApi.analyze, ChatApi.sendMessage catch), DebugPanel
 * @상태 zustand (in-memory). 프로덕션에서는 디버그 패널 미노출.
 */

import { create } from 'zustand';

export interface LastApiError {
  status: number;
  code?: string;
  message?: string;
  requestId?: string;
  timestamp: string;
}

interface DebugStore {
  lastAnalysisError: LastApiError | null;
  lastChatError: LastApiError | null;
  setLastAnalysisError: (payload: LastApiError | null) => void;
  setLastChatError: (payload: LastApiError | null) => void;
}

export const useDebugStore = create<DebugStore>((set) => ({
  lastAnalysisError: null,
  lastChatError: null,
  setLastAnalysisError: (payload) => set({ lastAnalysisError: payload }),
  setLastChatError: (payload) => set({ lastChatError: payload }),
}));
