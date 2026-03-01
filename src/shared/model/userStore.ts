/**
 * @fileoverview 사용자 프로필 및 Auth 상태 저장. 닉네임, 성적, 도메인, 플랜, 크레딧, 첫 로그인 여부 + isAuthenticated, userId.
 * @참조 Onboarding, Profile, FirstUploadTutorial, SubscriptionSheet, GradeInputSheet, AuthCallback 등
 * @라우팅 (직접 사용 안 함 - store만 제공)
 * @상태 zustand persist (localStorage 'miri-art-user')
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { tokenManager } from '../api/tokenManager';
import { useHydrationStore } from './hydrationStore';

/** 사용자 프로필 내부 타입 */
interface UserProfile {
  nickname: string;
  grade: string;
  domain: string;
  plan: 'free' | 'basic' | 'premium';
  credits: number;
  hasGradeInput: boolean;
}

const INITIAL_PROFILE: UserProfile = {
  nickname: '디자인 마스터',
  grade: '고등학교 3학년',
  domain: '시각디자인',
  plan: 'basic',
  credits: 12,
  hasGradeInput: false,
};

interface UserStore {
  isFirstLogin: boolean;
  profile: UserProfile;

  // Auth 상태
  isAuthenticated: boolean;
  userId: string | null;

  setFirstLoginDone: () => void;
  setHasGradeInput: (val: boolean) => void;
  setCredits: (n: number) => void;
  setAuth: (userId: string) => void;
  clearAuth: () => void;
  /** API getMe 응답으로 store profile 동기화 (AuthCallback 등에서 사용) */
  setProfileFromApi: (api: { nickname: string; grade: string; domain: string; needsProfile: boolean; role?: string }) => void;
  /** 프로필만 INITIAL로 리셋 (getMe 실패 시 등) */
  resetProfile: () => void;
}

/**
 * 사용자 스토어 훅. 프로필, 첫 로그인 여부, 크레딧, 성적 입력 여부, Auth 상태 관리.
 * @참조 Onboarding, Profile, FirstUploadTutorial, SubscriptionSheet, GradeInputSheet, AuthCallback
 * @상태 persist (localStorage)
 */
export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      isFirstLogin: true,
      profile: { ...INITIAL_PROFILE },
      isAuthenticated: false,
      userId: null,

      setFirstLoginDone: () => set({ isFirstLogin: false }),
      setHasGradeInput: (val) =>
        set((s) => ({ profile: { ...s.profile, hasGradeInput: val } })),
      setCredits: (n) =>
        set((s) => ({ profile: { ...s.profile, credits: n } })),
      setAuth: (userId) => set({ isAuthenticated: true, userId }),
      clearAuth: () => {
        tokenManager.clearAccessToken();
        set({
          isAuthenticated: false,
          userId: null,
          isFirstLogin: true,
          profile: { ...INITIAL_PROFILE },
        });
      },
      setProfileFromApi: (api) =>
        set((s) => ({
          profile: {
            ...s.profile,
            nickname: api.nickname,
            grade: api.grade,
            domain: api.domain,
            plan: api.role === 'PREMIUM' ? 'premium' : api.role === 'BASIC' ? 'basic' : 'free',
            credits: s.profile.credits,
            hasGradeInput: !api.needsProfile,
          },
        })),
      resetProfile: () => set({ profile: { ...INITIAL_PROFILE } }),
    }),
    {
      name: 'miri-art-user',
      partialize: (state) => ({
        profile: state.profile,
        isFirstLogin: state.isFirstLogin,
        isAuthenticated: state.isAuthenticated,
        userId: state.userId,
      }),
      onRehydrateStorage: () => () => {
        useHydrationStore.getState().setHasHydrated();
      },
    }
  )
);
