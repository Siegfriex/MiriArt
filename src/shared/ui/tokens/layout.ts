/**
 * @fileoverview 레이아웃·그리드·r(rem 기준) 토큰. 단일 소스로 Tailwind theme.extend 및 CSS 변수에 연동.
 * @참조 tailwind.config, rootVars, globals.css
 */

// ─── r (root / rem 기준) ─────────────────────────────────────────────────────

/** 기준 루트 폰트 크기 (px). 1rem = 16px */
export const rootFontSizePx = 16;

/** px → rem 문자열 (예: rem(24) === "1.5rem") */
export function rem(px: number): string {
  return `${px / rootFontSizePx}rem`;
}

// ─── 그리드 ───────────────────────────────────────────────────────────────────

/** 그리드 컬럼 수 (코드베이스 사용처: grid-cols-2, grid-cols-5 등) */
export const grid = {
  columns: {
    narrow: 1,
    default: 2,
    wide: 3,
    gallery: 5,
  },
  /** 갭 (px). Tailwind spacing과 매핑 시 4px 단위 사용 가능 */
  gap: {
    xs: 6,
    sm: 12,
    md: 16,
    lg: 24,
  },
} as const;

// ─── 콘텐츠 최대 너비 (px) ───────────────────────────────────────────────────

/** max-w-xs ~ max-w-lg 대응 (Tailwind 기본값과 동일) */
export const contentMaxWidth = {
  xs: 320,
  sm: 384,
  md: 448,
  lg: 512,
} as const;

// ─── 페이지·섹션·카드 ────────────────────────────────────────────────────────

/** 페이지 패딩 (px). semantic.spacing.page와 동일 */
export const pagePadding = { x: 20, y: 24 } as const;

/** 섹션 갭 (px) */
export const sectionGap = 24;

/** 카드 내부 갭 (px) */
export const cardGap = 12;

// ─── 접근성·네비게이션 ────────────────────────────────────────────────────────

/** 터치 타겟 최소 크기 (px). WCAG 2.5.8 */
export const touchTargetMinPx = 24;

/** 하단 네비 높이 (px). FAB bottomOffset 기본값 등 */
export const bottomNavHeightPx = 96;
