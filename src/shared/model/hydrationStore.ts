/**
 * @fileoverview zustand persist rehydration 완료 플래그. Splash 등에서 isAuthenticated 판단 전에 사용.
 * userStore의 onRehydrateStorage에서 setHasHydrated() 호출.
 */

import { create } from 'zustand';

interface HydrationStore {
  _hasHydrated: boolean;
  setHasHydrated: () => void;
}

export const useHydrationStore = create<HydrationStore>((set) => ({
  _hasHydrated: false,
  setHasHydrated: () => set({ _hasHydrated: true }),
}));
