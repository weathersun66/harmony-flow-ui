import { useEffect, useRef, useState, type ReactNode } from 'react';
import { LoadMoreControl, type LoadMoreProps } from './LoadMore';

export interface InfiniteScrollProps extends LoadMoreProps {
  children: ReactNode;
  /** undefined = viewport; null = root not mounted yet. */
  root?: HTMLElement | null;
  rootMargin?: string;
}

export function InfiniteScroll(props: InfiniteScrollProps) {
  return <InfiniteScrollSession key={props.resetKey} {...props} />;
}

function InfiniteScrollSession({ children, root, rootMargin = '0px', ...props }: InfiniteScrollProps) {
  const sentinel = useRef<HTMLDivElement>(null);
  const [trigger, setTrigger] = useState(0);
  useEffect(() => {
    if (!sentinel.current || root === null || props.disabled || !props.hasMore || typeof IntersectionObserver === 'undefined') return;
    let inside = false;
    let observer: IntersectionObserver;
    try {
      observer = new IntersectionObserver(entries => {
        const visible = entries.some(entry => entry.isIntersecting);
        if (visible && !inside) setTrigger(value => value + 1);
        inside = visible;
      }, { root, rootMargin });
    } catch { return; } // Invalid margins retain the manual loading control.
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [root, rootMargin, props.disabled, props.hasMore]);
  return <div className="hf-infinite-scroll">
    {children}
    <div ref={sentinel} className="hf-infinite-scroll__sentinel" aria-hidden="true" />
    <LoadMoreControl {...props} trigger={trigger} />
  </div>;
}
