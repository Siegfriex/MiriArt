/**
 * 디자인 토큰 사용 예시 — Button, Card
 * 컴포넌트에서 tokens를 import 해서 스타일 값으로 사용하는 패턴.
 * (실제 프로젝트에서는 Tailwind 클래스로 매핑된 값을 쓰거나, 인라인/유틸에서 토큰 참조)
 */

import React from 'react';
import { tokens } from './tokens';
import type { RadiusKey, ShadowKey } from './tokens';

// ─── 예시 1: 토큰을 인라인 스타일로 사용 ─────────────────────────────────────

export function ButtonExample() {
  return (
    <button
      type="button"
      style={{
        backgroundColor: tokens.colors.brand.primary,
        color: tokens.colors.neutral[900],
        padding: `${tokens.spacing[3]} ${tokens.spacing[4]}`,
        borderRadius: tokens.radius.md,
        fontSize: tokens.typography.fontScale.body.fontSize,
        fontWeight: Number(tokens.typography.fontWeight.medium),
        boxShadow: tokens.shadow.sm,
      }}
    >
      토큰 기반 버튼
    </button>
  );
}

// ─── 예시 2: 토큰으로 Tailwind 클래스명을 조합 (유틸 함수) ────────────────────
// Tailwind가 themeFromDesignTokens()로 확장되어 있으면, 아래 클래스명이 유효함.

const radiusToTailwind: Record<RadiusKey, string> = {
  xs: 'rounded-xs',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

const shadowToTailwind: Record<ShadowKey, string> = {
  sm: 'shadow-token-sm',
  md: 'shadow-token-md',
  lg: 'shadow-token-lg',
};

export function CardExample() {
  return (
    <div
      className={[
        'p-4 border border-neutral-200',
        radiusToTailwind.lg,
        shadowToTailwind.md,
      ].join(' ')}
      style={{
        backgroundColor: tokens.colors.neutral[0],
      }}
    >
      <h3
        className="font-bold"
        style={{
          fontSize: tokens.typography.fontScale.heading.fontSize,
          lineHeight: tokens.typography.fontScale.heading.lineHeight,
          color: tokens.colors.neutral[900],
        }}
      >
        카드 제목
      </h3>
      <p
        style={{
          fontSize: tokens.typography.fontScale.body.fontSize,
          color: tokens.colors.neutral[500],
          marginTop: tokens.spacing[2],
        }}
      >
        토큰에서 가져온 spacing, typography 적용 예시.
      </p>
    </div>
  );
}

// ─── 예시 3: Tailwind만 사용 (theme 확장 후) ─────────────────────────────────
// tailwind.config.ts에 themeFromDesignTokens() 반영 시 아래 클래스 사용 가능.

export const ButtonWithTailwindClasses: React.FC = () => (
  <button
    type="button"
    className="bg-brand-primary text-neutral-900 px-4 py-3 rounded-md font-medium shadow-token-sm hover:bg-brand-primary-hover transition-colors"
  >
    Tailwind + 토큰 확장
  </button>
);

export const CardWithTailwindClasses: React.FC = () => (
  <div className="bg-neutral-0 border border-neutral-200 rounded-lg shadow-token-md p-4">
    <h3 className="text-heading font-bold text-neutral-900">카드 제목</h3>
    <p className="text-body text-neutral-500 mt-2">Tailwind theme 확장 예시.</p>
  </div>
);
