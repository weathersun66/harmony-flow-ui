import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  /** 限制可滚动方向，不改变子内容布局。 */
  orientation?: 'horizontal' | 'vertical' | 'both';
  /** 纵向滚动必须具有高度或最大高度约束。 */
  maxHeight?: CSSProperties['maxHeight'];
  /** 滚动区域的可访问名称。 */
  label: string;
}

/** 滚动 DOM 就是 ref 指向的节点，兼容 scrollTo、onScroll 和虚拟列表。 */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  { orientation = 'both', maxHeight, label, className = '', style, tabIndex = 0, children, ...props }, ref,
) {
  return <div {...props} ref={ref} role={props.role ?? 'region'} aria-label={props['aria-label'] ?? label}
    tabIndex={tabIndex} className={`hf-scroll-area hf-scroll-area--${orientation} ${className}`.trim()}
    style={{ maxHeight, ...style }}>{children}</div>;
});

export type DirectionalScrollAreaProps = Omit<ScrollAreaProps, 'orientation'>;

export const HorizontalScrollArea = forwardRef<HTMLDivElement, DirectionalScrollAreaProps>(function HorizontalScrollArea(props, ref) {
  return <ScrollArea {...props} ref={ref} orientation="horizontal" />;
});

export const VerticalScrollArea = forwardRef<HTMLDivElement, DirectionalScrollAreaProps>(function VerticalScrollArea(props, ref) {
  return <ScrollArea {...props} ref={ref} orientation="vertical" />;
});
