/**
 * @fileoverview 사용자 프로필 및 온보딩 상태 저장. 닉네임, 성적, 도메인, 플랜, 크레딧, 첫 로그인 여부.
 * @참조 Onboarding, Profile, FirstUploadTutorial, SubscriptionSheet, GradeInputSheet 등
 * @라우팅 (직접 사용 안 함 - store만 제공)
 * @상태 zustand persist (localStorage 'miri-art-user')
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** 사용자 프로필 내부 타입 */
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

/**
 * 사용자 스토어 훅. 프로필, 첫 로그인 여부, 크레딧, 성적 입력 여부 관리.
 * @참조 Onboarding, Profile, FirstUploadTutorial, SubscriptionSheet, GradeInputSheet
 * @상태 persist (localStorage)
 */
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
