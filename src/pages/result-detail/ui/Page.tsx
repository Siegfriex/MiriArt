/**
 * @fileoverview 결과 상세 페이지. artworkId로 분석 결과 표시. RadarChart, ComparisonAccordion, ArtifactViewer, 채팅 이동.
 * @참조 AppRouter
 * @라우팅 /result/:artworkId
 * @상태 useModalStore, useState (activeArtifact)
 */

import React, { useState } from 'react';
import { ArrowLeft, Share2, MoreHorizontal, MessageCircle, RotateCcw } from 'lucide-react';
import { H1, H2, H3, BodyText } from '../../../shared/ui/Typography';
import { Button } from '../../../shared/ui/Button';
import { AnalysisResult, Grade, ComparisonTier } from '../../../shared/model/types';
import { useParams, useNavigate } from 'react-router-dom';
import { getArtworkById } from '../../../entities/artwork/model';
import { useModalStore } from '../../../shared/model/modalStore';
import { RadarChart } from '../../../shared/ui/charts/RadarChart';
import { ComparisonAccordion } from '../../../widgets/result/ComparisonAccordion';
import { STRINGS } from '../../../shared/config/strings';
import { ROUTES } from '../../../shared/config/routes';

const MOCK_TIERS: ComparisonTier[] = [
  {
    level: 'TOP',
    label: STRINGS.RESULT_COMPARISON_TIER_TOP,
    threshold: '≥ 백분위 89%',
    items: [
      { university: '홍익대학교', major: '시각디자인', probability: 91, similarAcceptedCount: 14, description: '색채 대비와 구도 균형이 최상위권 합격작과 매우 유사합니다.' },
      { university: '이화여자대학교', major: '시각디자인', probability: 87, similarAcceptedCount: 9, description: '완성도 측면에서 상위 11% 수준의 역량을 보입니다.' },
    ],
  },
  {
    level: 'HIGH',
    label: STRINGS.RESULT_COMPARISON_TIER_HIGH,
    threshold: '≥ 백분위 80%',
    items: [
      { university: '국민대학교', major: '시각디자인', probability: 83, similarAcceptedCount: 22, description: '형태력과 사고력이 합격선 이상입니다.' },
      { university: '건국대학교', major: '커뮤니케이션디자인', probability: 81, similarAcceptedCount: 18, description: '전반적인 기초조형 이해도가 높습니다.' },
      { university: '세종대학교', major: '만화애니메이션', probability: 80, similarAcceptedCount: 30, description: '독창적인 아이디어 표현 능력이 돋보입니다.' },
    ],
  },
  {
    level: 'MID',
    label: STRINGS.RESULT_COMPARISON_TIER_MID,
    threshold: '역량 ≥ 76%',
    items: [
      { university: '동국대학교', major: '영상학과', probability: 76, similarAcceptedCount: 41, description: '기본기가 충족되었으나 차별성이 부족합니다.' },
      { university: '상명대학교', major: '시각디자인', probability: 74, similarAcceptedCount: 55, description: '구도 처리 능력은 양호하지만 밀도 부분이 아쉽습니다.' },
      { university: '경희대학교', major: '서양화', probability: 72, similarAcceptedCount: 38, description: '색채 활용이 제한적입니다.' },
    ],
  },
  {
    level: 'LOW',
    label: STRINGS.RESULT_COMPARISON_TIER_LOW,
    threshold: '역량 < 60%',
    items: [
      { university: '성균관대학교', major: '미술학과', probability: 58, similarAcceptedCount: 67, description: '정합성과 완성도에서 개선이 필요합니다.' },
      { university: '한양대학교', major: '응용미술교육', probability: 52, similarAcceptedCount: 73, description: '구조적 재설계가 권장됩니다.' },
    ],
  },
  {
    level: 'CRITICAL',
    label: STRINGS.RESULT_COMPARISON_TIER_CRITICAL,
    threshold: '역량 < 40%',
    items: [
      { university: '서울시립대학교', major: '환경조각학과', probability: 38, similarAcceptedCount: 12, description: '기초적인 조형 원리부터 재점검이 필요합니다.' },
    ],
  },
];

/** 결과 상세 페이지. @참조 AppRouter @상태 useModalStore, activeArtifact */
export const ResultDetail: React.FC = () => {
  const { artworkId } = useParams();
  const navigate = useNavigate();
  const { openModal } = useModalStore();
  const [hasGradeInput] = useState(false);

  const artwork = artworkId ? getArtworkById(artworkId) : null;

  const result: AnalysisResult = artwork
    ? {
        ...artwork,
        totalScore: 88,
        radarData: { density: 90, form: 85, completion: 80, relevance: 95, thinking: 88 },
        fixScope: 'DetailTuning',
        comment: '구조가 탄탄합니다. 하단부 밀도를 높이면 더욱 강해질 것 같아요.',
        comparisonTiers: MOCK_TIERS,
        hasAcceptedArtwork: false,
      }
    : {
        id: 'mock',
        imageUrl: 'https://picsum.photos/400/500',
        grade: Grade.A,
        totalScore: 88,
        university: '홍익대학교',
        major: '시각디자인',
        radarData: { density: 90, form: 85, completion: 80, relevance: 95, thinking: 88 },
        fixScope: 'DetailTuning',
        comment: '구조가 탄탄합니다.',
        comparisonTiers: MOCK_TIERS,
        hasAcceptedArtwork: false,
        timestamp: Date.now(),
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
      onComplete: (_file) => {
        // TODO: 실제 API 연동 후 result.id로 교체
        navigate(ROUTES.RESULT('art-0'));
      },
    });
  };

  // sessionId = artworkId (MOCK_SESSIONS.id = artworkId 형식으로 통일됨)
  const sessionId = result.id;

  return (
    <div className="fixed inset-0 z-priority bg-dark-900 overflow-y-auto no-scrollbar pb-28">
      {/* 헤더 */}
      <header className="fixed top-0 left-0 w-full z-sticky flex justify-between items-center px-4 h-14 bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-black/40 text-white backdrop-blur-md"
          aria-label={STRINGS.BACK}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-2">
          <button className="p-2 rounded-full bg-black/40 text-white backdrop-blur-md">
            <Share2 size={20} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-full bg-black/40 text-white backdrop-blur-md"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>
      </header>

      {/* Artwork Viewer */}
      <div className="relative w-full aspect-[3/4] bg-dark-800">
        <img
          src={result.imageUrl}
          alt="분석 작품"
          className="w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-dark-900 to-transparent pt-24">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-primary-lime font-bold text-sm mb-1">{result.university}</div>
              <H1 className="text-white">
                {result.totalScore}
                <span className="text-xl font-normal text-text-mid">/100</span>
              </H1>
            </div>
            <div className="bg-primary-lime text-text-inverse w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-extrabold shadow-glow">
              {result.grade}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-6 space-y-8">
        {/* fixScope 배너 */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
          <div
            className={`w-2 h-12 rounded-full ${
              result.fixScope === 'StructureRebuild' ? 'bg-semantic-error' : 'bg-primary-lime'
            }`}
          />
          <div>
            <div className="text-[10px] text-text-mid uppercase tracking-wider font-bold">fixScope 분석</div>
            <H3 className="text-white">
              {result.fixScope === 'StructureRebuild'
                ? STRINGS.RESULT_FIXSCOPE_REBUILD
                : STRINGS.RESULT_FIXSCOPE_TUNING}
            </H3>
          </div>
        </div>

        {/* 5요소 분석 — Radar Chart */}
        <section>
          <H2 className="text-white mb-5">{STRINGS.RESULT_5FACTOR}</H2>
          <div className="bg-dark-800 rounded-2xl border border-white/5 p-5 flex flex-col items-center gap-4">
            <RadarChart data={result.radarData} size={220} />
            {/* 수치 목록 */}
            <div className="w-full space-y-2">
              {(Object.entries(result.radarData) as [keyof typeof result.radarData, number][]).map(
                ([key, value]) => {
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
                      <div className="flex-1 h-1.5 bg-dark-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary-lime rounded-full transition-all duration-700"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                      <span className="w-8 text-xs text-white font-bold text-right">{value}</span>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </section>

        {/* 성적 미입력 CTA */}
        {!hasGradeInput && (
          <div className="bg-dark-800 rounded-xl p-4 border border-primary-lime/20 flex items-center justify-between gap-3">
            <BodyText className="text-sm text-text-mid flex-1">
              {STRINGS.RESULT_GRADE_INPUT_CTA}
            </BodyText>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openModal('GRADE_INPUT', {})}
            >
              {STRINGS.RESULT_GRADE_INPUT_BUTTON}
            </Button>
          </div>
        )}

        {/* 합격 비교분석 5-Tier */}
        <ComparisonAccordion
          tiers={result.comparisonTiers ?? MOCK_TIERS}
          hasAcceptedArtwork={result.hasAcceptedArtwork}
        />
      </div>

      {/* Action Bar (하단 고정) */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-black/90 to-transparent z-nav flex gap-3">
        <Button
          variant="secondary"
          className="flex-1 flex gap-2 items-center justify-center"
          onClick={handleReanalyze}
        >
          <RotateCcw size={16} />
          {STRINGS.RESULT_REANALYZE}
        </Button>
        <Button
          className="flex-[2] flex gap-2 items-center justify-center"
          onClick={() => navigate(ROUTES.CHAT_ROOM(sessionId))}
        >
          <MessageCircle size={18} />
          {STRINGS.RESULT_ASK_MENTOR}
        </Button>
      </div>
    </div>
  );
};
