import type { CSSProperties, HTMLAttributes } from 'react';

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  circle?: boolean;
  animated?: boolean;
}

export function Skeleton({ width = '100%', height = 16, radius, circle, animated = true, className = '', style, ...props }: SkeletonProps) {
  const value = (input: number | string) => typeof input === 'number' ? `${input}px` : input;
  return <span aria-hidden="true" className={`hf-skeleton ${animated ? 'is-animated' : ''} ${circle ? 'is-circle' : ''} ${className}`.trim()} style={{ width: value(width), height: value(height), borderRadius: radius ? value(radius) : undefined, ...style } as CSSProperties} {...props} />;
}
