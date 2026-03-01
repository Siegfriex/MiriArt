/**
 * @fileoverview 프로필 페이지. 사용자 정보, CreditStatusWidget, SettingsMenu, 업그레이드 버튼.
 * @참조 AppRouter
 * @라우팅 /app/profile
 * @상태 useModalStore, useUserStore
 */

import React from 'react';
import { H1, H2, H3, BodyText } from '../../../shared/ui/Typography';
import { Button } from '../../../shared/ui/Button';
import { Settings, Pencil } from 'lucide-react';
import { SettingsMenu } from '../../../widgets/profile/SettingsMenu';
import { useModalStore } from '../../../shared/model/modalStore';
import { useUserStore } from '../../../shared/model/userStore';
import { PageContainer } from '../../../shared/ui/PageContainer';
import { STRINGS } from '../../../shared/config/strings';

/** 프로필 페이지. @참조 AppRouter @상태 useModalStore, useUserStore */
export const Profile: React.FC = () => {
  const { openModal } = useModalStore();
  const { profile } = useUserStore();

  const handleUpgrade = () => {
    openModal('SUBSCRIPTION', { currentPlan: profile.plan });
  };

  const nextBillingDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 27)
    .toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });

  return (
    <PageContainer className="space-y-8">
      {/* 헤더 */}
      <header className="flex justify-between items-center">
        <H1 className="text-white">{STRINGS.PROFILE_TITLE}</H1>
        <button className="text-text-mid hover:text-white transition-colors">
          <Settings size={20} />
        </button>
      </header>

      {/* 사용자 정보 */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-dark-800 border-2 border-primary-lime p-1">
          <div className="w-full h-full rounded-full bg-dark-700 overflow-hidden">
            <img
              src="https://picsum.photos/200/200"
              className="w-full h-full object-cover"
              alt="프로필 사진"
            />
          </div>
        </div>
        <div>
          <H2 className="text-white text-xl">{profile.nickname}</H2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-text-inverse bg-primary-lime px-2 py-0.5 rounded-full font-bold">
              {profile.plan === 'basic' ? '기본 플랜' : '프리미엄 플랜'}
            </span>
            <span className="text-xs text-text-mid">{profile.grade}</span>
          </div>
        </div>
      </div>

      {/* Subscription Card */}
      <div className="bg-dark-800 rounded-2xl p-5 border border-white/5 relative overflow-visible group">
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-lime/10 rounded-full blur-2xl group-hover:bg-primary-lime/20 transition-all duration-500" />
        </div>
        <div className="flex justify-between items-start gap-3 mb-4 relative z-10">
          <div className="min-w-0 flex-1">
            <BodyText className="text-sm text-text-mid mb-1">{STRINGS.PROFILE_CREDITS_LABEL}</BodyText>
            <div className="text-3xl font-sans font-bold text-white">{profile.credits}</div>
          </div>
          <Button className="flex-shrink-0 h-9 text-xs px-3" onClick={handleUpgrade}>
            {STRINGS.PROFILE_UPGRADE}
          </Button>
        </div>
        <div className="w-full bg-dark-900 h-2 rounded-full overflow-hidden mb-2 relative z-10">
          <div
            className="bg-primary-lime h-full rounded-full transition-all duration-500"
            style={{ width: `${(profile.credits / 20) * 100}%` }}
          />
        </div>
        <BodyText className="text-xs text-text-mid relative z-10">
          {STRINGS.PROFILE_RESET_DATE(nextBillingDate)}
        </BodyText>
      </div>

      {/* Academic Info Section */}
      <section className="bg-dark-800 rounded-2xl p-5 border border-white/5 space-y-4">
        <div className="flex justify-between items-center">
          <H3 className="text-white">{STRINGS.PROFILE_ACADEMIC_TITLE}</H3>
          <button
            onClick={() => openModal('GRADE_INPUT', {})}
            className="flex items-center gap-1.5 text-xs text-primary-lime hover:text-primary-lime/80 transition-colors"
          >
            <Pencil size={14} />
            {STRINGS.PROFILE_ACADEMIC_EDIT}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-dark-900 rounded-xl p-3">
            <BodyText className="text-[11px] text-text-mid mb-1">{STRINGS.PROFILE_ACADEMIC_GRADE}</BodyText>
            <div className="text-sm text-white font-medium">{profile.grade}</div>
          </div>
          <div className="bg-dark-900 rounded-xl p-3">
            <BodyText className="text-[11px] text-text-mid mb-1">{STRINGS.PROFILE_ACADEMIC_DOMAIN}</BodyText>
            <div className="text-sm text-white font-medium">{profile.domain}</div>
          </div>
        </div>
      </section>

      {/* Settings Menu */}
      <SettingsMenu />
    </PageContainer>
  );
};
