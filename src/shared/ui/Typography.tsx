import React from 'react';

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
}

// VID v1.4 §7.2 Type Scale & Weight Specifications
// Note: We use 'font-sans' (Rubik) as base, but enforce SUITE weights for Korean context.
// In a real browser, the font file for the rendered glyph will determine the look, 
// but we apply the CSS weight that maps to the primary intent.

export const H1: React.FC<TextProps> = ({ children, className = '', as: Component = 'h1', ...props }) => (
  // KR: SUITE 800 (Extrabold) | EN: Rubik 600 (Semibold)
  // We prioritize the Korean weight (800) as the primary display style.
  <Component className={`text-display font-extrabold text-text-primary ${className}`} {...props}>
    {children}
  </Component>
);

export const H2: React.FC<TextProps> = ({ children, className = '', as: Component = 'h2', ...props }) => (
  // KR: SUITE 700 (Bold) | EN: Rubik 500 (Medium)
  <Component className={`text-heading font-bold text-text-primary ${className}`} {...props}>
    {children}
  </Component>
);

export const H3: React.FC<TextProps> = ({ children, className = '', as: Component = 'h3', ...props }) => (
  // KR: SUITE 500 (Medium) | EN: Rubik 400 (Regular)
  <Component className={`text-subhead font-medium text-text-primary ${className}`} {...props}>
    {children}
  </Component>
);

export const BodyText: React.FC<TextProps> = ({ children, className = '', as: Component = 'p', ...props }) => (
  // KR: SUITE 500 (Medium) | EN: Rubik 300 (Light)
  // Warning: Light weight on dark background needs anti-aliasing.
  <Component className={`text-body font-medium text-text-secondary antialiased ${className}`} {...props}>
    {children}
  </Component>
);
