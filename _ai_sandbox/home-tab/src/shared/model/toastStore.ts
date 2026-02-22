/**
 * @fileoverview 전역 토스트 알림 스토어. success/error/info 메시지 표시.
 * @참조 Home Page (첫 로그인 툴팁)
 * @상태 zustand (in-memory)
 */

import { create } from 'zustand';

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

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  show: (message, type = 'info', duration = 3000) => {
    if (get().toasts.some((t) => t.message === message)) return;
    const id = `toast-${Date.now()}`;
    set((state) => ({ toasts: [...state.toasts, { id, message, type, duration }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, duration);
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
