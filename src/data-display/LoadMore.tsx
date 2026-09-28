import { useEffect, useRef, useState } from 'react';
import { Button } from '../components/Button';

export interface LoadMoreProps {
  onLoad: (signal: AbortSignal) => Promise<void>;
  hasMore: boolean;
  disabled?: boolean;
  /** Change when replacing the query; aborts the previous session. */
  resetKey?: string | number;
  label?: string;
  errorMessage?: string;
  className?: string;
}

export function LoadMore(props: LoadMoreProps) {
  return <LoadMoreControl key={props.resetKey} {...props} />;
}

// Shared request boundary for manual and intersection-triggered loading.
export function LoadMoreControl({ onLoad, hasMore, disabled = false, label = '加载更多',
  errorMessage = '加载失败，请重试。', className = '', trigger = 0 }: LoadMoreProps & { trigger?: number }) {
  const [phase, setPhase] = useState<'idle' | 'pending' | 'error' | 'success'>('idle');
  const request = useRef<AbortController | null>(null);
  const alive = useRef(true);
  const latest = useRef({ onLoad, hasMore, disabled });
  latest.current = { onLoad, hasMore, disabled };
  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; request.current?.abort(); };
  }, []);
  async function load() {
    if (request.current || !latest.current.hasMore || latest.current.disabled) return;
    const controller = new AbortController();
    request.current = controller;
    setPhase('pending');
    try {
      await latest.current.onLoad(controller.signal);
      if (alive.current && !controller.signal.aborted) setPhase('success');
    } catch {
      if (alive.current && !controller.signal.aborted) setPhase('error');
    } finally {
      if (request.current === controller) request.current = null;
    }
  }
  const seen = useRef(0);
  useEffect(() => {
    if (trigger === seen.current) return;
    seen.current = trigger;
    // Failures require explicit retry, never an observer retry loop.
    if (phase !== 'error') void load();
  }, [trigger]); // Request reads current props through latest.
  const blocked = disabled || !hasMore || phase === 'pending';
  return <div className={`hf-content-loading ${className}`.trim()} aria-busy={phase === 'pending'}>
    <p role="status" aria-atomic="true">{phase === 'pending' ? '正在加载…' : !hasMore ? '没有更多内容了' : phase === 'success' ? '内容已加载' : ''}</p>
    {phase === 'error' && hasMore && <p role="alert" className="hf-tone--danger">{errorMessage.trim() || '加载失败，请重试。'}</p>}
    <Button type="button" variant="outline" aria-disabled={blocked} onClick={() => { if (!blocked) void load(); }}>
      {phase === 'pending' ? '正在加载' : phase === 'error' && hasMore ? '重试加载' : !hasMore ? '已全部加载' : label.trim() || '加载更多'}
    </Button>
  </div>;
}
