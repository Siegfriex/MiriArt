/**
 * 공통 버튼. 디자인 시스템 기준 레퍼런스 구현.
 *
 * 설계 의도: 디자인 시스템·토큰 기반 스타일, variant/size 일관성, 접근성 개선.
 * 기존 대비 변경점: focus-visible 링(ring-2 + primary-lime + ring-offset-dark-900),
 *   aria-busy/aria-disabled, 로딩 스피너 aria-hidden, sm 텍스트 크기 text-caption.
 *
 * 토큰 alias 사용 예 (secondary/ghost 등, 필요 시 점진 교체):
 *   before: bg-dark-800, text-text-mid  → after: bg-surface-alt, text-muted
 *   before: ring-offset-dark-900         → after: ring-offset-surface
 *
 * variant / size 매핑 (기존 사용과 호환)
 * ┌──────────┬─────────────────────────────────────────────────────────────────┐
 * │ variant  │ primary: lime 배경+inverse 텍스트+glow │ secondary: dark-800+테두리 │
 * │          │ ghost: 투명+mid 텍스트+hover 배경      │ outline: lime 테두리+텍스트 │
 * ├──────────┼─────────────────────────────────────────────────────────────────┤
 * │ size     │ sm: px-3 py-2 text-caption │ md: px-4 py-3 text-body │           │
 * │          │ lg: px-6 py-4 text-subhead                                            │
 * └──────────┴─────────────────────────────────────────────────────────────────┘
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary-lime text-text-inverse hover:brightness-110 shadow-glow',
  secondary: 'bg-dark-800 text-white border border-white/10 hover:bg-dark-700',
  ghost: 'bg-transparent text-text-mid hover:text-white hover:bg-white/5',
  outline: 'bg-transparent border border-primary-lime text-primary-lime hover:bg-primary-lime/10',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-caption',
  md: 'px-4 py-3 text-body',
  lg: 'px-6 py-4 text-subhead',
};

const focusVisibleClasses =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-lime focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900';

/** 버튼 컴포넌트. variant, size, isLoading, fullWidth. @참조 전역 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading,
  disabled,
  fullWidth = false,
  ...props
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type="button"
      className={[
        'relative inline-flex items-center justify-center rounded-medium font-medium transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
        focusVisibleClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={isDisabled}
      aria-busy={isLoading}
      aria-disabled={disabled}
      {...props}
    >
      {isLoading && (
        <Loader2 className="w-5 h-5 animate-spin mr-2 shrink-0" aria-hidden />
      )}
      {children}
    </button>
  );
};
