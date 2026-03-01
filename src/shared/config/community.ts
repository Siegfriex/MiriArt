/**
 * @fileoverview 커뮤니티 공용 상수. 학년/도메인 필터, Q&A 마감 옵션, 글쓰기 제한 등.
 * ContextBar, WritePostPage, 피드 필터에서 공유.
 */

/** Q&A 마감 시간(시간 단위) */
export const QNA_DEADLINE_HOURS = [24, 48, 72] as const;
export type QnaDeadlineHour = (typeof QNA_DEADLINE_HOURS)[number];

export const QNA_DEADLINE_OPTIONS: { label: string; value: QnaDeadlineHour }[] = [
  { label: '24시간', value: 24 },
  { label: '48시간', value: 48 },
  { label: '72시간', value: 72 },
];

/** 학년 필터 옵션 (value '' = 전체) */
export const GRADE_OPTIONS = ['전체', '고1', '고2', '고3', '재수', 'N수'] as const;

/** 도메인 필터 옵션 (value '' = 전체) */
export const DOMAIN_OPTIONS = ['전체', '기초디자인', '수채화', '소묘', '사고의전환', '만화·애니'] as const;

/** 글쓰기 제한 */
export const POST_TITLE_MAX_LENGTH = 100;
export const POST_CONTENT_MAX_LENGTH = 2000;
export const POST_IMAGES_MAX_COUNT = 5;

/** 글쓰기 프리셋 태그 */
export const PRESET_TAGS = [
  '석고',
  '정물',
  '풍경',
  '인체',
  '색채',
  '구도',
  '수채화',
  '기초디자인',
] as const;

/** WritePostPage 대상 select용 학년 값 (전체 제외) */
export const GRADE_SCOPE_OPTIONS = ['고1', '고2', '고3', '재수', 'N수'] as const;

/** WritePostPage 대상 select용 도메인 값 (전체 제외) */
export const DOMAIN_SCOPE_OPTIONS = [
  '기초디자인',
  '수채화',
  '소묘',
  '사고의전환',
  '만화·애니',
] as const;
