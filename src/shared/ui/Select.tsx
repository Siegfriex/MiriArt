/**
 * @fileoverview 공통 Select. Signup(폼) / ContextBar(인라인 sm) 스타일 통합.
 * focus-visible + ring-2 + primary-lime, error 시 semantic-error.
 *
 * 토큰 alias 사용 예 (기존 클래스 → 별칭, 필요 시 점진 교체):
 *   before: bg-dark-800      → after: bg-surface-alt
 *   before: border-white/5   → after: border-border-default
 *   before: ring-offset-dark-900 → after: ring-offset-surface
 */

import React from 'react';
import { clsx } from 'clsx';

const baseSelectClasses =
  'bg-surface-alt text-text-primary border border-border-default appearance-none ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-lime focus-visible:ring-offset-2 focus-visible:ring-offset-surface ' +
  'disabled:opacity-50 disabled:cursor-not-allowed ' +
  'transition-[box-shadow,border-color] duration-200';

const sizeClasses = {
  sm: 'text-caption px-2 py-1.5 rounded-lg',
  md: 'text-body px-4 py-3.5 rounded-xl',
} as const;

const errorClasses = 'border-semantic-error focus-visible:ring-semantic-error';

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      size = 'md',
      fullWidth,
      error,
      className,
      children,
      id,
      'aria-invalid': ariaInvalidProp,
      'aria-describedby': ariaDescribedByProp,
      ...props
    },
    ref
  ) {
    const ariaInvalid = error ? 'true' : ariaInvalidProp;

    return (
      <select
        ref={ref}
        id={id}
        className={clsx(
          baseSelectClasses,
          sizeClasses[size],
          fullWidth && 'w-full',
          error && errorClasses,
          className
        )}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedByProp}
        data-error={error}
        {...props}
      >
        {children}
      </select>
    );
  }
);
