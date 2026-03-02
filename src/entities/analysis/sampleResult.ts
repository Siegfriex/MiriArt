/**
 * @fileoverview 샘플 분석 결과. "샘플 분석 결과 보기" 버튼 시에만 사용. Storybook/테스트에서도 사용 가능.
 * 런타임 기본 데이터로 쓰지 않음.
 */

import type { AnalysisResult, ComparisonTier } from '../../shared/model/types';
import { Grade } from '../../shared/model/types';
import { STRINGS } from '../../shared/config/strings';

export const SAMPLE_TIERS: ComparisonTier[] = [
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

/** 샘플 분석 결과 생성. "샘플 분석 결과 보기" 전용. */
export function buildSampleResult(forArtworkId?: string): AnalysisResult {
  return {
    id: forArtworkId ?? 'sample',
    imageUrl: 'https://picsum.photos/400/500',
    grade: Grade.A,
    totalScore: 88,
    university: '홍익대학교',
    major: '시각디자인',
    radarData: { density: 90, form: 85, completion: 80, relevance: 95, thinking: 88 },
    fixScope: 'DetailTuning',
    comment: '구조가 탄탄합니다. 하단부 밀도를 높이면 더욱 강해질 것 같아요.',
    comparisonTiers: SAMPLE_TIERS,
    hasAcceptedArtwork: false,
    timestamp: Date.now(),
  };
}
