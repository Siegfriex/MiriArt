/**
 * @fileoverview 풀스크린 페이지용 공용 컨테이너. fixed inset-0 + 토큰 기반 패딩/여백/z-index.
 * @참조 Auth 페이지, ResultDetail, PostDetail, QnaDetail, WritePost
 */

import React, { ReactNode } from 'react';

export type ZLayerKey =
  | 'base'
  | 'sticky'
  | 'nav'
  | 'overlay'
  | 'sidebar'
  | 'modal'
  | 'priority'
  | 'toast'
  | 'critical';

const zLayerClass: Record<ZLayerKey, string> = {
  base: 'z-base',
  sticky: 'z-sticky',
  nav: 'z-nav',
  overlay: 'z-overlay',
  sidebar: 'z-sidebar',
  modal: 'z-modal',
  priority: 'z-priority',
  toast: 'z-toast',
  critical: 'z-critical',
};

export interface FullScreenContainerProps {
  children: ReactNode;
  className?: string;
  /** 하단 여백(BottomNav 높이) 적용 여부. 기본 false */
  hasBottomNav?: boolean;
  /** z-index 레이어. 기본 'priority' (Auth/풀스크린 모달) */
  zLayer?: ZLayerKey;
  /** 스크롤: none = overflow-hidden, y = overflow-y-auto */
  scroll?: 'none' | 'y';
}

/**
 * 풀스크린 레이아웃 컨테이너. fixed inset-0, px-page-x py-page-y, zLayer, scroll 제어.
 */
export const FullScreenContainer: React.FC<FullScreenContainerProps> = ({
  children,
  className = '',
  hasBottomNav = false,
  zLayer = 'priority',
  scroll = 'y',
}) => {
  const overflowClass = scroll === 'y' ? 'overflow-y-auto' : 'overflow-hidden';
  const zClass = zLayerClass[zLayer];

  return (
    <div
      className={`
        fixed inset-0 flex flex-col bg-dark-900
        px-page-x py-page-y
        ${hasBottomNav ? 'pb-bottom-nav' : ''}
        ${overflowClass}
        ${zClass}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
