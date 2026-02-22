/**
 * @fileoverview 하단 네비게이션(BottomNav) 표시 여부 제어. 채팅방/결과 상세 등 풀스크린 페이지에서 숨김.
 * @참조 BottomNav, chat-room Page, result-detail Page, MainLayout
 * @라우팅 /app/* (BottomNav 표시), /chat/:id, /result/:id (숨김)
 * @상태 zustand (isBottomNavVisible)
 */

import { create } from 'zustand';

interface NavStore {
  isBottomNavVisible: boolean;
  show: () => void;
  hide: () => void;
}

/**
 * 네비게이션 스토어 훅. show(), hide()로 BottomNav 표시/숨김.
 * @참조 BottomNav, chat-room Page, result-detail Page
 * @상태 isBottomNavVisible
 */
export const useNavStore = create<NavStore>((set) => ({
  isBottomNavVisible: true,
  show: () => set({ isBottomNavVisible: true }),
  hide: () => set({ isBottomNavVisible: false }),
}));
