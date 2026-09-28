import { useEffect, useState, type HTMLAttributes, type ReactNode } from 'react';
import type { NavigationItem, NavigationSelectionProps } from './types';

export interface ShrinkNavProps extends HTMLAttributes<HTMLElement>, NavigationSelectionProps {
  brand: ReactNode;
  items: readonly NavigationItem[];
  threshold?: number;
  target?: HTMLElement | null;
  action?: ReactNode;
}

export function ShrinkNav({ brand, items, threshold = 48, target, action, activeKey, onItemSelect, className = '', ...props }: ShrinkNavProps) {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    if (target === null) { setCompact(false); return; }
    const view = target?.ownerDocument.defaultView ?? window;
    const source = target ?? view;
    let frame = 0;
    const update = () => {
      view.cancelAnimationFrame(frame);
      frame = view.requestAnimationFrame(() => setCompact((target?.scrollTop ?? view.scrollY) > threshold));
    };
    update();
    source.addEventListener('scroll', update, { passive: true });
    return () => { view.cancelAnimationFrame(frame); source.removeEventListener('scroll', update); };
  }, [target, threshold]);
  return <nav className={`hf-shrink-nav ${compact ? 'hf-shrink-nav--compact' : ''} ${target !== undefined ? 'hf-shrink-nav--contained' : ''} ${className}`.trim()} aria-label="滚动导航" {...props}><div className="hf-shrink-nav__brand">{brand}</div><div className="hf-shrink-nav__items">{items.map((item) => <a key={item.key} href={item.href ?? '#'} aria-current={activeKey === item.key ? 'page' : undefined} onClick={() => onItemSelect?.(item)}>{item.label}</a>)}</div>{action}</nav>;
}
