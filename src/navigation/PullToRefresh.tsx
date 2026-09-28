import { useRef, useState, type HTMLAttributes, type PointerEvent, type ReactNode } from 'react';

export interface PullToRefreshProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onRefresh'> {
  children: ReactNode;
  onRefresh: () => void | Promise<void>;
  threshold?: number;
  disabled?: boolean;
  label?: string;
  onRefreshError?: (error: unknown) => void;
}

type Gesture = { pointerId: number; startX: number; startY: number; tracking: boolean };

export function PullToRefresh({ children, onRefresh, threshold = 72, disabled = false, label = '刷新内容', onRefreshError, className = '', onPointerDown, onPointerMove, onPointerUp, onPointerCancel, ...props }: PullToRefreshProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const gestureRef = useRef<Gesture | null>(null);
  const [distance, setDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const refreshingRef = useRef(false);

  const runRefresh = async () => {
    if (disabled || refreshingRef.current) return;
    refreshingRef.current = true;
    setRefreshing(true);
    try { await onRefresh(); } catch (error) { onRefreshError?.(error); } finally { refreshingRef.current = false; setRefreshing(false); }
  };

  const start = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || refreshingRef.current || event.isPrimary === false || rootRef.current?.scrollTop !== 0 || (event.target as Element).closest('button, a, input, select, textarea, summary, label, video, audio, [contenteditable], [role="button"], [role="slider"]')) return;
    gestureRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, tracking: false };
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const dx = event.clientX - gesture.startX;
    const dy = event.clientY - gesture.startY;
    if (!gesture.tracking && (dy <= 8 || Math.abs(dx) >= dy)) {
      if (Math.abs(dx) > 8 || dy < 0) gestureRef.current = null;
      return;
    }
    gesture.tracking = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDistance(Math.min(threshold * 1.35, dy * .55));
  };
  const finish = async (event: PointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    gestureRef.current = null;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const shouldRefresh = distance >= threshold;
    setDistance(0);
    if (!shouldRefresh) return;
    await runRefresh();
  };
  const refresh = async () => {
    await runRefresh();
  };

  return <div {...props} ref={rootRef} className={`hf-pull-to-refresh${distance > 0 ? ' hf-pull-to-refresh--dragging' : ''} ${className}`.trim()} onPointerDown={(event) => { start(event); onPointerDown?.(event); }} onPointerMove={(event) => { move(event); onPointerMove?.(event); }} onPointerUp={(event) => { void finish(event); onPointerUp?.(event); }} onPointerCancel={(event) => { gestureRef.current = null; setDistance(0); onPointerCancel?.(event); }}><div className="hf-pull-to-refresh__indicator" style={{ '--hf-pull-distance': `${distance}px` } as React.CSSProperties} aria-live="polite"><button type="button" onClick={() => void refresh()} disabled={disabled || refreshing}>{refreshing ? '正在刷新…' : distance >= threshold ? '松开刷新' : label}</button></div><div className="hf-pull-to-refresh__content" style={{ transform: `translateY(${distance}px)` }}>{children}</div></div>;
}
