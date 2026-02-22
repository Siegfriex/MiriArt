/**
 * @fileoverview 전역 토스트 알림 스토어. success/error/info 메시지 표시, 자동 사라짐.
 * @참조 gemini.ts (API 에러 시), Toast.tsx (ToastContainer), SubscriptionSheet 등
 * @라우팅 (직접 사용 안 함)
 * @상태 zustand (in-memory)
 */

import { create } from 'zustand';

/** 토스트 한 건: id, 메시지, 타입, 지속 시간 */
export interface ToastPayload {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastStore {
  toasts: ToastPayload[];
  show: (message: string, type?: ToastPayload['type'], duration?: number) => void;
  dismiss: (id: string) => void;
}

/**
 * 토스트 스토어 훅. show(message, type?, duration?), dismiss(id) 제공.
 * @참조 gemini.ts, Toast.tsx, SubscriptionSheet
 * @상태 toasts 배열
 */
export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  show: (message, type = 'info', duration = 3000) => {
    // 동일 메시지 중복 방지
    if (get().toasts.some((t) => t.message === message)) return;
    const id = `toast-${Date.now()}`;
    set((state) => ({ toasts: [...state.toasts, { id, message, type, duration }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, duration);
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
