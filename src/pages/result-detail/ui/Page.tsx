/**
 * @fileoverview 결과 상세 페이지. artworkId로 분석 결과 표시. RadarChart, ComparisonAccordion, ArtifactViewer, 채팅 이동.
 * BE API 성공 시에만 실제 결과 표시. 실패 시 에러 + 재시도 + "샘플 분석 결과 보기" 옵션.
 * @참조 AppRouter
 * @라우팅 /result/:artworkId
 * @상태 useModalStore, useState (result, isLoading, error, showSample)
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share2, MoreHorizontal, MessageCircle, RotateCcw } from 'lucide-react';
import { H1, H2, H3, BodyText } from '../../../shared/ui/Typography';
import { Button } from '../../../shared/ui/Button';
import type { AnalysisResult } from '../../../shared/model/types';
import { useParams, useNavigate } from 'react-router-dom';
import { AnalysisApi, ChatSessionApi, handleApiError } from '../../../shared/api/miriartApi';
import { useModalStore } from '../../../shared/model/modalStore';
import { useToastStore } from '../../../shared/model/toastStore';
import { RadarChart } from '../../../shared/ui/charts/RadarChart';
import { ComparisonAccordion } from '../../../widgets/result/ComparisonAccordion';
import { STRINGS } from '../../../shared/config/strings';
import { ROUTES } from '../../../shared/config/routes';
import { buildSampleResult } from '../../../entities/analysis/sampleResult';
import { AiSkeleton, AiErrorState } from '@/shared/ui/ai';
import { SignedImage } from '../../../shared/ui/SignedImage';

const RESULT_LOAD_ERROR_FALLBACK = '분석 결과를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.';

/** 결과 상세 페이지. */
export const ResultDetail: React.FC = () => {
  const { artworkId } = useParams();
  const navigate = useNavigate();
  const { openModal } = useModalStore();
  const { show: showToast } = useToastStore();

  const [result, setResult] = useState<AnalysisResult | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSample, setShowSample] = useState(false);
  const [hasGradeInput] = useState(false);
  const [chatNavigating, setChatNavigating] = useState(false);

  useEffect(() => {
    if (!artworkId) {
      setIsLoading(false);
      setError(RESULT_LOAD_ERROR_FALLBACK);
      return;
    }
    setIsLoading(true);
    setError(null);
    setShowSample(false);
    AnalysisApi.getById(artworkId)
      .then((data) => {
        setResult(data);
        setError(null);
      })
      .catch((err) => {
        setError(handleApiError(err));
        setResult(undefined);
      })
      .finally(() => setIsLoading(false));
  }, [artworkId]);

  const handleRetry = () => {
    if (!artworkId) return;
    setError(null);
    setIsLoading(true);
    AnalysisApi.getById(artworkId)
      .then((data) => {
        setResult(data);
        setError(null);
      })
      .catch((err) => setError(handleApiError(err)))
      .finally(() => setIsLoading(false));
  };

  const handleDelete = () => {
    openModal('CONFIRM', {
      title: STRINGS.DELETE,
      message: '이 결과를 삭제하면 복구할 수 없습니다. 크레딧은 환불되지 않습니다.',
      confirmLabel: STRINGS.DELETE,
      isDestructive: true,
      onConfirm: () => navigate(ROUTES.APP.ARCHIVE),
    });
  };

  const handleReanalyze = () => {
    openModal('UPLOAD_FLOW', {
      onComplete: () => {
        // UploadFlow 성공 시 내부에서 ROUTES.RESULT(result.id)로 이동함
      },
    });
  };

  // 표시할 결과: 실제 성공 시 result, 샘플 보기 시 buildSampleResult
  const displayResult: AnalysisResult | undefined = result ?? (showSample && artworkId ? buildSampleResult(artworkId) : undefined);

  /** 분석 결과 → 채팅: GET /api/chat/sessions?analysisId={id} 후 sessionKey로 이동. */
  const handleAskMentor = async () => {
    if (!displayResult) return;
    setChatNavigating(true);
    try {
      const s = await ChatSessionApi.getOrCreateSessionByAnalysisId(displayResult.id);
      navigate(ROUTES.CHAT_ROOM(s.sessionKey));
    } catch (err) {
      showToast(handleApiError(err), 'error');
    } finally {
      setChatNavigating(false);
    }
  };

  // ─── 로딩 ─────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-dvh bg-surface overflow-y-auto no-scrollbar pb-bottom-nav">
        <header className="fixed top-0 left-0 w-full z-sticky flex justify-between items-center px-page-x h-14 bg-gradient-to-b from-black/60 to-transparent">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-black/40 text-white backdrop-blur-md" aria-label={STRINGS.BACK}>
            <ArrowLeft size={20} />
          </button>
        </header>
        <div className="w-full aspect-[3/4] bg-surface-alt" />
        <div className="px-page-x py-page-y space-y-section-gap">
          <AiSkeleton className="h-24 rounded-xl" />
          <AiSkeleton lines={8} className="rounded-2xl" />
        </div>
      </div>
    );
  }

  // ─── 에러 (샘플 미선택 시) ─────────────────────────────────────────────────
  if (error && !showSample) {
    return (
      <div className="min-h-dvh bg-surface overflow-y-auto no-scrollbar pb-bottom-nav flex flex-col">
        <header className="fixed top-0 left-0 w-full z-sticky flex items-center px-page-x h-14 bg-gradient-to-b from-black/60 to-transparent">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-black/40 text-white backdrop-blur-md" aria-label={STRINGS.BACK}>
            <ArrowLeft size={20} />
          </button>
        </header>
        <div className="flex-1 flex items-center justify-center p-page-y">
          <AiErrorState
            title={error ?? RESULT_LOAD_ERROR_FALLBACK}
            variant="fullscreen"
            onRetry={handleRetry}
            secondaryAction={{ label: '샘플 분석 결과 보기', onClick: () => setShowSample(true) }}
          />
        </div>
      </div>
    );
  }

  // ─── 결과 없음 (artworkId 없음 등) ─────────────────────────────────────────
  if (!displayResult) {
    return (
      <div className="min-h-dvh bg-surface flex items-center justify-center p-page-y">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-black/40 text-white" aria-label={STRINGS.BACK}>
          <ArrowLeft size={20} />
        </button>
        <p className="text-text-mid">결과를 불러올 수 없습니다.</p>
      </div>
    );
  }

  // ─── 실제 결과 또는 샘플 결과 렌더 ─────────────────────────────────────────
  return (
    <div className="min-h-dvh bg-surface overflow-y-auto no-scrollbar pb-bottom-nav">
      <header className="fixed top-0 left-0 w-full z-sticky flex justify-between items-center px-page-x h-14 bg-gradient-to-b from-black/60 to-transparent">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-black/40 text-white backdrop-blur-md" aria-label={STRINGS.BACK}>
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-2">
          <button className="p-2 rounded-full bg-black/40 text-white backdrop-blur-md">
            <Share2 size={20} />
          </button>
          <button onClick={handleDelete} className="p-2 rounded-full bg-black/40 text-white backdrop-blur-md">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </header>

      <div className="relative w-full aspect-[3/4] bg-surface-alt">
        <SignedImage
          analysisId={displayResult.id}
          alt="분석 작품"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-dark-900/95 to-transparent pt-24">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-primary-lime font-bold text-sm mb-1">{displayResult.university}</div>
              <H1 className="text-white">
                {displayResult.totalScore}
                <span className="text-xl font-normal text-text-mid">/100</span>
              </H1>
            </div>
            <div className="bg-primary-lime text-text-inverse w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-extrabold shadow-glow">
              {displayResult.grade}
            </div>
          </div>
        </div>
      </div>

      <div className="px-page-x py-page-y space-y-8 pb-40">
        {showSample && (
          <div className="bg-primary-lime/10 border border-primary-lime/30 rounded-xl p-3 text-center">
            <BodyText className="text-sm text-primary-lime">샘플 결과입니다.</BodyText>
            <button
              type="button"
              className="text-xs text-text-mid underline mt-1"
              onClick={() => { setShowSample(false); handleRetry(); }}
            >
              실제 결과 다시 불러오기
            </button>
          </div>
        )}

        <div className="bg-surface-alt/80 border border-border-default rounded-xl p-4 flex items-center gap-3">
          <div
            className={`w-2 h-12 rounded-full ${
              displayResult.fixScope === 'StructureRebuild' ? 'bg-semantic-error' : 'bg-primary-lime'
            }`}
          />
          <div>
            <div className="text-micro text-text-mid uppercase tracking-wider font-bold">fixScope 분석</div>
            <H3>
              {displayResult.fixScope === 'StructureRebuild' ? STRINGS.RESULT_FIXSCOPE_REBUILD : STRINGS.RESULT_FIXSCOPE_TUNING}
            </H3>
          </div>
        </div>

        <section>
          <H2 className="mb-5">{STRINGS.RESULT_5FACTOR}</H2>
          <div className="bg-surface-alt rounded-2xl border border-border-default p-5 flex flex-col items-center gap-4">
            <RadarChart data={displayResult.radarData} size={220} />
            <div className="w-full space-y-2">
              {(Object.entries(displayResult.radarData) as [keyof typeof displayResult.radarData, number][]).map(([key, value]) => {
                const labels: Record<string, string> = {
                  density: STRINGS.RESULT_RADAR_DENSITY,
                  form: STRINGS.RESULT_RADAR_FORM,
                  completion: STRINGS.RESULT_RADAR_COMPLETION,
                  relevance: STRINGS.RESULT_RADAR_RELEVANCE,
                  thinking: STRINGS.RESULT_RADAR_THINKING,
                };
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="w-16 text-xs text-text-mid">{labels[key]}</span>
                    <div className="flex-1 h-1.5 bg-surface-tertiary rounded-full overflow-hidden">
                      <div className="h-full bg-primary-lime rounded-full transition-all duration-700" style={{ width: `${value}%` }} />
                    </div>
                    <span className="w-8 text-xs text-text-primary font-bold text-right">{value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 그림 평가 — 채팅 세션 stickyContext의 분석 코멘트와 동일한 데이터(comment/summaryComment) */}
        {(displayResult.summaryComment ?? displayResult.comment)?.trim() && (
          <section>
            <H2 className="mb-3">{STRINGS.RESULT_EVALUATION_TITLE}</H2>
            <div className="bg-surface-alt rounded-2xl border border-border-default p-5">
              <BodyText className="text-text-primary whitespace-pre-wrap">
                {(displayResult.summaryComment ?? displayResult.comment)?.trim()}
              </BodyText>
            </div>
          </section>
        )}

        {!hasGradeInput && (
          <div className="bg-surface-alt rounded-xl p-4 border border-primary-lime/20 flex items-center justify-between gap-3">
            <BodyText className="text-sm text-text-mid flex-1">{STRINGS.RESULT_GRADE_INPUT_CTA}</BodyText>
            <Button variant="outline" size="sm" onClick={() => openModal('GRADE_INPUT', {})}>
              {STRINGS.RESULT_GRADE_INPUT_BUTTON}
            </Button>
          </div>
        )}

        <ComparisonAccordion
          tiers={displayResult.comparisonTiers ?? []}
          hasAcceptedArtwork={displayResult.hasAcceptedArtwork}
        />
      </div>

      <div className="fixed bottom-20 left-0 w-full p-page-x bg-gradient-to-t from-black via-black/90 to-transparent z-nav flex gap-3">
        <Button variant="secondary" className="flex-1 flex gap-2 items-center justify-center" onClick={handleReanalyze}>
          <RotateCcw size={16} />
          {STRINGS.RESULT_REANALYZE}
        </Button>
        <Button
          className="flex-[2] flex gap-2 items-center justify-center"
          onClick={handleAskMentor}
          disabled={!displayResult || chatNavigating}
        >
          <MessageCircle size={18} />
          {chatNavigating ? '이동 중...' : STRINGS.RESULT_ASK_MENTOR}
        </Button>
      </div>
    </div>
  );
};
