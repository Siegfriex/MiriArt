/**
 * @fileoverview 사이드 GNB(글로벌 네비게이션) 열림 모드. closed/partial/full.
 * @참조 SideGNB, FAB, BottomNav 등
 * @라우팅 (전역 - 모든 페이지에서 접근)
 * @상태 zustand (mode)
 */

import { create } from 'zustand';

/** 사이드 GNB 모드: 닫힘, 부분 열림, 전체 열림 */
export type SideGNBMode = 'closed' | 'partial' | 'full';

interface SideGNBStore {
  mode: SideGNBMode;
  open: (mode: 'partial' | 'full') => void;
  close: () => void;
  setMode: (mode: SideGNBMode) => void;
}

/**
 * 사이드 GNB 스토어 훅. open(mode), close(), setMode(mode) 제공.
 * @참조 SideGNB, FAB
 * @상태 mode (closed | partial | full)
 */
export const useSideGNBStore = create<SideGNBStore>((set) => ({
  mode: 'closed',
  open: (mode) => set({ mode }),
  close: () => set({ mode: 'closed' }),
  setMode: (mode) => set({ mode }),
}));
