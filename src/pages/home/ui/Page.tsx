/**
 * @fileoverview 홈 페이지. ContextBar + Hero CTA + HomeFeed + CreditStatusWidget + WriteFAB.
 * @참조 AppRouter
 * @라우팅 /app/home
 * @상태 useModalStore, useUserStore, useToastStore, useFeedQuery → HomeFeed
 */

import React, { useEffect } from 'react';
import { H1, H2, BodyText } from '../../../shared/ui/Typography';
import { Button } from '../../../shared/ui/Button';
import { UploadCloud, ChevronRight, Plus } from 'lucide-react';
import { MOCK_ARTWORKS } from '../../../entities/artwork/model';
import { LiveTicker } from '../../../widgets/home/LiveTicker';
import { PageContainer } from '../../../shared/ui/PageContainer';
import { Section } from '../../../shared/ui/Section';
import { CreditStatusWidget } from '../../../widgets/home/CreditStatusWidget';
import { useModalStore } from '../../../shared/model/modalStore';
import { useUserStore } from '../../../shared/model/userStore';
import { useToastStore } from '../../../shared/model/toastStore';
import { useNavigate } from 'react-router-dom';
import { STRINGS } from '../../../shared/config/strings';
import { ROUTES } from '../../../shared/config/routes';
import { ContextBar } from '../../../widgets/community/ContextBar';
import { HomeFeed } from '../../../widgets/community/HomeFeed';
import { useFeedQuery } from '../../../features/community/useFeedQuery';

/** 홈 페이지. @참조 AppRouter @상태 useModalStore, useUserStore, useToastStore */
export const Home: React.FC = () => {
  const { tab, setTab, grade, setGrade, domain, setDomain } = useFeedQuery();
  const { openModal } = useModalStore();
  const { isFirstLogin, setFirstLoginDone, profile } = useUserStore();
  const { show: showToast } = useToastStore();
  const navigate = useNavigate();

  // 첫 로그인 시 공식 ToastStore를 통해 가이드 메시지 표시
  useEffect(() => {
    if (isFirstLogin) {
      const timer = setTimeout(() => {
        showToast(STRINGS.HOME_FIRST_LOGIN_TOOLTIP, 'success', 6000);
        setFirstLoginDone();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isFirstLogin, showToast, setFirstLoginDone]);

  const handleUpload = () => {
    openModal('UPLOAD_FLOW', {
      onComplete: (_file) => {
        navigate(ROUTES.RESULT('art-0'));
      },
    });
  };

  const handleWriteFAB = () => {
    openModal('WRITE_POST_SHEET');
  };

  return (
    <PageContainer>
      {/* 컨텍스트 바 */}
      <ContextBar
        grade={grade}
        domain={domain}
        onGradeChange={setGrade}
        onDomainChange={setDomain}
      />

      {/* 헤더 */}
      <header className="flex justify-between items-center mb-2 mt-2">
        <H1 className="text-white">{STRINGS.APP_NAME}</H1>
        <div className="px-3 py-1 bg-primary-lime/10 rounded-full border border-primary-lime/20">
          <span className="text-xs text-primary-lime font-medium">{STRINGS.HOME_PLAN_BADGE}</span>
        </div>
      </header>

      {/* Live Ticker */}
      <LiveTicker />

      {/* Hero Upload CTA */}
      <section className="relative overflow-visible rounded-large bg-dark-800 border border-white/5">
        <div className="rounded-large bg-gradient-to-br from-primary-lime/5 to-transparent p-6 min-h-[200px] flex flex-col justify-center items-center text-center group">
          <div className="w-16 h-16 rounded-full bg-dark-900 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud className="text-primary-lime" size={32} />
          </div>
          <H2 className="mb-2 text-white">{STRINGS.HOME_UPLOAD_CTA_TITLE}</H2>
          <BodyText className="mb-6">{STRINGS.HOME_UPLOAD_CTA_DESC}</BodyText>
          <Button className="w-full max-w-[200px]" onClick={handleUpload}>
            {STRINGS.HOME_UPLOAD_BUTTON}
          </Button>
        </div>
      </section>

      {/* 최근 분석 */}
      <Section
        title={STRINGS.HOME_RECENT_TITLE}
        action={
          <button
            onClick={() => navigate(ROUTES.APP.ARCHIVE)}
            className="text-xs text-text-mid flex items-center hover:text-white transition-colors"
          >
            {STRINGS.HOME_RECENT_VIEW_ALL} <ChevronRight size={14} />
          </button>
        }
      >
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {MOCK_ARTWORKS.slice(0, 3).map((art) => (
            <div
              key={art.id}
              onClick={() => navigate(ROUTES.RESULT(art.id))}
              className="min-w-[140px] flex flex-col space-y-2 group cursor-pointer"
            >
              <div className="w-full aspect-[4/5] bg-dark-800 rounded-xl border border-white/5 overflow-hidden relative group-hover:border-primary-lime/30 transition-colors">
                <img
                  src={art.imageUrl}
                  alt="작품"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-primary-lime font-bold border border-primary-lime/30">
                  {art.grade}등급
                </div>
              </div>
              <div>
                <div className="text-sm text-white font-medium truncate">{art.university}</div>
                <div className="text-xs text-text-mid truncate">{art.major}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 커뮤니티 홈 피드 */}
      <div className="-mx-4">
        <HomeFeed tab={tab} setTab={setTab} grade={grade} setGrade={setGrade} domain={domain} setDomain={setDomain} />
      </div>

      {/* 크레딧 위젯 */}
      <CreditStatusWidget
        credits={profile.credits}
        onUpgrade={() => openModal('SUBSCRIPTION', { currentPlan: profile.plan })}
      />

      {/* 통합 FAB — 글쓰기/업로드 분기 */}
      <button
        onClick={handleWriteFAB}
        className="fixed bottom-24 right-4 z-nav w-14 h-14 min-w-[48px] min-h-[48px] bg-primary-lime rounded-full flex items-center justify-center shadow-lg hover:bg-primary-lime/90 active:scale-95 transition-all touch-manipulation"
        aria-label="글쓰기 또는 업로드"
      >
        <Plus size={24} className="text-dark-900" strokeWidth={2.5} />
      </button>
    </PageContainer>
  );
};
