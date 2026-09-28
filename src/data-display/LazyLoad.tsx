import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Button } from '../components/Button';

export interface LazyLoadProps {
  children: ReactNode;
  placeholder?: ReactNode;
  minHeight?: number;
  root?: HTMLElement | null;
  rootMargin?: string;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export function LazyLoad({ children, placeholder, minHeight = 160, root, rootMargin = '0px',
  disabled = false, label = '显示内容', className = '' }: LazyLoadProps) {
  const target = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const restoreFocus = useRef(false);
  useEffect(() => {
    if (mounted && restoreFocus.current) {
      target.current?.focus({ preventScroll: true });
      restoreFocus.current = false;
    }
  }, [mounted]);
  useEffect(() => {
    if (mounted) return;
    if (disabled) { setMounted(true); return; }
    if (root === null || !target.current) return;
    if (typeof IntersectionObserver === 'undefined') { setMounted(true); return; }
    let observer: IntersectionObserver;
    try {
      observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) { setMounted(true); observer.disconnect(); }
      }, { root, rootMargin });
    } catch { setMounted(true); return; }
    observer.observe(target.current);
    return () => observer.disconnect();
  }, [mounted, disabled, root, rootMargin]);
  return <div ref={target} tabIndex={-1} className={`hf-lazy-load ${className}`.trim()}
    style={{ minHeight: Number.isFinite(minHeight) ? Math.max(0, minHeight) : 160 }}>
    {mounted || disabled ? children : <>{placeholder}<Button type="button" variant="outline" onClick={() => { restoreFocus.current = true; setMounted(true); }}>{label.trim() || '显示内容'}</Button></>}
  </div>;
}
