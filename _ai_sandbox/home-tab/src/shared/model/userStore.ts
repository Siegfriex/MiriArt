/**
 * @fileoverview 사용자 프로필 및 온보딩 상태 저장. 홈 탭에서 profile.credits, profile.plan 등 사용.
 * @참조 Home Page
 * @상태 zustand persist (localStorage 'miri-art-user')
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
  nickname: string;
  grade: string;
  domain: string;
  plan: 'free' | 'basic' | 'premium';
  credits: number;
  hasGradeInput: boolean;
}

interface UserStore {
  isFirstLogin: boolean;
  profile: UserProfile;
  setFirstLoginDone: () => void;
  setHasGradeInput: (val: boolean) => void;
  setCredits: (n: number) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      isFirstLogin: true,
      profile: {
        nickname: '디자인 마스터',
        grade: '고등학교 3학년',
        domain: '시각디자인',
        plan: 'basic',
        credits: 12,
        hasGradeInput: false,
      },
      setFirstLoginDone: () => set({ isFirstLogin: false }),
      setHasGradeInput: (val) =>
        set((s) => ({ profile: { ...s.profile, hasGradeInput: val } })),
      setCredits: (n) =>
        set((s) => ({ profile: { ...s.profile, credits: n } })),
    }),
    {
      name: 'miri-art-user',
      partialize: (state) => ({
        profile: state.profile,
        isFirstLogin: state.isFirstLogin,
      }),
    }
  )
);
