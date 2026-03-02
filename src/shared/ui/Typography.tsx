/**
 * @fileoverview 타이포그래피 컴포넌트. H1, H2, H3, BodyText. display/heading/subhead/body 스타일.
 * @참조 Home, Archive, Profile, Login, Signup, Onboarding, ChatRoom, MessageBubble, UploadFlow, GradeInputSheet, SubscriptionSheet, ConfirmDialog, EmptyState 등
 * @라우팅 전역
 * @상태 (직접 사용 안 함)
 */

import React from 'react';

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
}

/** H1. display 폰트. 라이트 스킴 기본 text-text-primary. @참조 Splash, Home, SessionListPanel, Profile 등 */
export const H1: React.FC<TextProps> = ({ children, className = '', as: Component = 'h1', ...props }) => (
  <Component className={`text-display font-extrabold text-text-primary ${className}`} {...props}>
    {children}
  </Component>
);

/** H2. heading 폰트. @참조 Section, ChatRoom, SideGNB, GradeInputSheet 등 */
export const H2: React.FC<TextProps> = ({ children, className = '', as: Component = 'h2', ...props }) => (
  <Component className={`text-heading font-bold text-text-primary ${className}`} {...props}>
    {children}
  </Component>
);

/** H3. subhead 폰트. @참조 UploadFlow, EmptyState, ComparisonAccordion 등 */
export const H3: React.FC<TextProps> = ({ children, className = '', as: Component = 'h3', ...props }) => (
  <Component className={`text-subhead font-medium text-text-primary ${className}`} {...props}>
    {children}
  </Component>
);

/** BodyText. body 폰트. @참조 MessageBubble, Onboarding, Login, Signup, EmptyState 등 */
export const BodyText: React.FC<TextProps> = ({ children, className = '', as: Component = 'p', ...props }) => (
  <Component className={`text-body font-medium text-text-mid antialiased ${className}`} {...props}>
    {children}
  </Component>
);
