/**
 * @fileoverview 공통 텍스트 입력. input / textarea(multiline) 통합.
 * 디자인 시스템: focus-visible + ring-2 + primary-lime, error 시 semantic-error.
 *
 * 토큰 alias 사용 예 (기존 클래스 → 별칭, 필요 시 점진 교체):
 *   before: bg-dark-800          → after: bg-surface-alt
 *   before: border-white/5        → after: border-border-default
 *   before: placeholder-text-low → after: placeholder-muted-alt
 *   before: ring-offset-dark-900 → after: ring-offset-surface
 */

import React from 'react';
import { clsx } from 'clsx';

export type TextInputSize = 'sm' | 'md' | 'lg';

const baseInputClasses =
  'w-full bg-surface-alt text-text-primary rounded-xl border border-border-default placeholder-text-low ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-lime focus-visible:ring-offset-2 focus-visible:ring-offset-surface ' +
  'disabled:opacity-50 disabled:cursor-not-allowed ' +
  'transition-[box-shadow,border-color] duration-200';

const sizeClasses: Record<TextInputSize, string> = {
  sm: 'px-3 py-2 text-caption',
  md: 'px-4 py-3 text-body',
  lg: 'px-4 py-3.5 text-body',
};

const errorClasses = 'border-semantic-error focus-visible:ring-semantic-error';

export interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: TextInputSize;
  fullWidth?: boolean;
  error?: boolean;
  /** true면 <textarea>로 렌더 (multiline) */
  multiline?: boolean;
  /** multiline일 때만 사용 */
  rows?: number;
}

export const TextInput = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  TextInputProps
>(function TextInput(
  {
    size = 'md',
    fullWidth = true,
    error,
    className,
    multiline,
    rows = 3,
    id,
    'aria-invalid': ariaInvalidProp,
    'aria-describedby': ariaDescribedByProp,
    ...props
  },
  ref
) {
  const ariaInvalid = error ? 'true' : ariaInvalidProp;
  const sizeClass = sizeClasses[size];
  const widthClass = fullWidth ? 'w-full' : '';

  if (multiline) {
    const textareaProps = props as React.TextareaHTMLAttributes<HTMLTextAreaElement>;
    return (
      <textarea
        ref={ref as React.Ref<HTMLTextAreaElement>}
        id={id}
        rows={rows}
        className={clsx(
          baseInputClasses,
          sizeClass,
          widthClass,
          'resize-none min-h-[120px]',
          error && errorClasses,
          className
        )}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedByProp}
        data-error={error}
        {...textareaProps}
      />
    );
  }

  return (
    <input
      ref={ref as React.Ref<HTMLInputElement>}
      id={id}
      type="text"
      className={clsx(
        baseInputClasses,
        sizeClass,
        widthClass,
        error && errorClasses,
        className
      )}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedByProp}
      data-error={error}
      {...props}
    />
  );
});
