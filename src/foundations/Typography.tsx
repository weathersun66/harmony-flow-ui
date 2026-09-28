import type { ElementType, HTMLAttributes } from 'react';

export type TypographyVariant = 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'body-sm' | 'caption' | 'code';
export interface TypographyProps extends HTMLAttributes<HTMLElement> { as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'code'; variant?: TypographyVariant; muted?: boolean; truncate?: boolean; }

export function Typography({ as, variant = 'body', muted, truncate, className = '', ...props }: TypographyProps) {
  const defaults: Partial<Record<TypographyVariant, ElementType>> = { display: 'h1', h1: 'h1', h2: 'h2', h3: 'h3', code: 'code' };
  const Tag: ElementType = as ?? defaults[variant] ?? 'p';
  return <Tag className={`hf-typography hf-typography--${variant}${muted ? ' is-muted' : ''}${truncate ? ' is-truncated' : ''} ${className}`} {...props} />;
}
