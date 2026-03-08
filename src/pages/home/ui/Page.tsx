/**
 * @fileoverview 홈 페이지. ContextBar + Hero CTA + HomeFeed + CreditStatusWidget + WriteFAB.
 * 최근 분석은 /api/analyses 목록 API 연동.
 * @참조 AppRouter
 * @라우팅 /app/home
 * @상태 useModalStore, useUserStore, useToastStore, useFeedQuery → HomeFeed
 */

import React, { useEffect, useState } from 'react';
import { H1, H2, BodyText } from '../../../shared/ui/Typography';
import { Button } from '../../../shared/ui/Button';
import { UploadCloud, ChevronRight, Plus } from 'lucide-react';
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
import { AnalysisApi } from '../../../shared/api/miriartApi';
import type { AnalysisResult } from '../../../shared/model/types';

const HOME_RECENT_LIMIT = 3;
const LIST_LOAD_ERROR = '분석 기록을 불러오지 못했습니다. 다시 시도해 주세요.';

/** 홈 페이지. */
export const Home: React.FC = () => {
  const { tab, setTab, grade, setGrade, domain, setDomain } = useFeedQuery();
  const { openModal } = useModalStore();
  const { isFirstLogin, setFirstLoginDone, profile } = useUserStore();
  const { show: showToast } = useToastStore();
  const navigate = useNavigate();

  const [recentAnalyses, setRecentAnalyses] = useState<AnalysisResult[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [recentError, setRecentError] = useState<string | null>(null);

  useEffect(() => {
    AnalysisApi.getList({ size: HOME_RECENT_LIMIT })
      .then((list) => setRecentAnalyses(list.slice(0, HOME_RECENT_LIMIT)))
      .catch(() => setRecentError(LIST_LOAD_ERROR))
      .finally(() => setRecentLoading(false));
  }, []);

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
      onComplete: () => {
        setRecentLoading(true);
        setRecentError(null);
        AnalysisApi.getList({ size: HOME_RECENT_LIMIT })
          .then((list) => setRecentAnalyses(list.slice(0, HOME_RECENT_LIMIT)))
          .catch(() => setRecentError(LIST_LOAD_ERROR))
          .finally(() => setRecentLoading(false));
      },
    });
  };

  const handleWriteFAB = () => {
    openModal('WRITE_POST_SHEET');
  };

  const recentAsArtworks = recentAnalyses.map((a) => ({
    id: a.id,
    imageUrl: a.imageUrl,
    university: a.university,
    major: a.major,
    grade: a.grade,
    score: a.totalScore,
    timestamp: a.timestamp,
    aiSummary: a.comment,
  }));

  return (
    <PageContainer>
      <ContextBar
        grade={grade}
        domain={domain}
        onGradeChange={setGrade}
        onDomainChange={setDomain}
      />

      <header className="flex justify-between items-center mb-2 mt-2">
        <H1 className="text-text-primary">{STRINGS.APP_NAME}</H1>
        <div className="px-3 py-1 bg-primary-lime/10 rounded-full border border-primary-lime/20">
          <span className="text-xs text-primary-lime font-medium">{STRINGS.HOME_PLAN_BADGE}</span>
        </div>
      </header>

      <LiveTicker />

      <section className="relative overflow-visible rounded-large bg-surface-alt border border-border-default">
        <div className="rounded-large bg-gradient-to-br from-primary-lime/5 to-transparent p-6 min-h-[200px] flex flex-col justify-center items-center text-center group">
          <div className="w-16 h-16 rounded-full bg-surface-tertiary border border-border-subtle flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud className="text-primary-lime" size={32} />
          </div>
          <H2 className="mb-2 text-text-primary">{STRINGS.HOME_UPLOAD_CTA_TITLE}</H2>
          <BodyText className="mb-6">{STRINGS.HOME_UPLOAD_CTA_DESC}</BodyText>
          <Button className="w-full max-w-[200px]" onClick={handleUpload}>
            {STRINGS.HOME_UPLOAD_BUTTON}
          </Button>
        </div>
      </section>

      <Section
        title={STRINGS.HOME_RECENT_TITLE}
        action={
          <button
            onClick={() => navigate(ROUTES.APP.ARCHIVE)}
            className="text-xs text-text-mid flex items-center hover:text-text-primary transition-colors"
          >
            {STRINGS.HOME_RECENT_VIEW_ALL} <ChevronRight size={14} />
          </button>
        }
      >
        {recentLoading ? (
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[140px] aspect-[4/5] bg-surface-alt rounded-xl animate-pulse" />
            ))}
          </div>
        ) : recentError ? (
          <p className="text-text-mid text-sm py-4">{recentError}</p>
        ) : recentAsArtworks.length === 0 ? (
          <p className="text-text-mid text-sm py-4">아직 분석 기록이 없습니다.</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {recentAsArtworks.map((art) => (
              <div
                key={art.id}
                onClick={() => navigate(ROUTES.RESULT(art.id))}
                className="min-w-[140px] flex flex-col space-y-2 group cursor-pointer"
              >
                <div className="w-full aspect-[4/5] bg-surface-alt rounded-xl border border-border-default overflow-hidden relative group-hover:border-primary-lime/30 transition-colors">
                  <img
                    src={art.imageUrl || 'https://via.placeholder.com/140x175?text=작품'}
                    alt="작품"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-colors"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-micro text-primary-lime font-bold border border-primary-lime/30">
                    {art.grade}등급
                  </div>
                </div>
                <div>
                  <div className="text-sm text-text-primary font-medium truncate">{art.university}</div>
                  <div className="text-xs text-text-mid truncate">{art.major}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <div className="-mx-4">
        <HomeFeed tab={tab} setTab={setTab} grade={grade} setGrade={setGrade} domain={domain} setDomain={setDomain} />
      </div>

      <CreditStatusWidget
        credits={profile.credits}
        onUpgrade={() => openModal('SUBSCRIPTION', { currentPlan: profile.plan })}
      />

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
