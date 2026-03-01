/**
 * @fileoverview :root CSS 변수 맵. primitives + semantic + layout 단일 소스에서 생성.
 * 값은 앱 진입점에서 document.documentElement에 주입. globals.css는 var(--*)만 참조.
 * @참조 tokens/index, tokens/layout, globals.css, index.tsx
 */

import { primitives, semantic } from './index';
import {
  touchTargetMinPx,
  bottomNavHeightPx,
  pagePadding,
  sectionGap,
  cardGap,
} from './layout';

/** :root에 넣을 CSS 변수명 → 값 맵. 진입점에서 setProperty로 주입 */
export function getRootVarsObject(): Record<string, string> {
  return {
    // 배경·텍스트·브랜드
    '--color-bg-primary': primitives.color.dark900,
    '--color-bg-secondary': primitives.color.dark800,
    '--color-bg-tertiary': primitives.color.dark700,
    '--color-text-high': primitives.color.white,
    '--color-text-mid': primitives.color.gray400,
    '--color-text-low': primitives.color.gray500,
    '--color-brand': primitives.color.lime400,
    '--color-brand-dim': semantic.color.brandDim,
    '--color-border-default': semantic.color.borderDefault,
    '--color-border-subtle': semantic.color.borderSubtle,
    // 별칭 (globals.css에서 var(--color-*) 참조 유지)
    '--color-surface': primitives.color.dark900,
    '--color-surface-alt': primitives.color.dark800,
    '--color-surface-tertiary': primitives.color.dark700,
    '--color-muted': primitives.color.gray400,
    '--color-muted-alt': primitives.color.gray500,
    // radius, blur
    '--radius-card': semantic.radius.card,
    '--radius-button': semantic.radius.button,
    '--blur-glass': semantic.blur.glass,
    // 레이아웃 (WCAG 터치 타겟 등)
    '--touch-target-min': `${touchTargetMinPx}px`,
    '--layout-page-x': `${pagePadding.x}px`,
    '--layout-page-y': `${pagePadding.y}px`,
    '--layout-section-gap': `${sectionGap}px`,
    '--layout-card-gap': `${cardGap}px`,
    '--layout-bottom-nav-height': `${bottomNavHeightPx}px`,
  };
}

/** root 변수 객체를 document.documentElement에 적용 */
export function injectRootVars(): void {
  const vars = getRootVarsObject();
  const root = document.documentElement;
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }
}
