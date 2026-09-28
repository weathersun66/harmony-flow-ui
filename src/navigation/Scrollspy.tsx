import { useEffect, useState, type HTMLAttributes } from 'react';
import type { NavigationItem, NavigationSelectionProps } from './types';

export interface ScrollspyProps extends HTMLAttributes<HTMLElement>, NavigationSelectionProps {
  items: readonly NavigationItem[];
  rootMargin?: string;
  /** Scroll container that owns the observed sections. Omit to observe the document viewport. */
  target?: HTMLElement | null;
}

export function Scrollspy({ items, activeKey, onItemSelect, rootMargin = '-20% 0px -65%', target, className = '', ...props }: ScrollspyProps) {
  const [observedKey, setObservedKey] = useState(items[0]?.key);
  const currentKey = activeKey ?? observedKey;
  useEffect(() => {
    const view = target?.ownerDocument.defaultView ?? window;
    const Observer = view.IntersectionObserver;
    if (activeKey !== undefined || target === null || !Observer) return;
    const observer = new Observer((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible?.target.id) setObservedKey(visible.target.id);
    }, { root: target ?? null, rootMargin });
    items.forEach((item) => {
      const section = target
        ? [...target.querySelectorAll<HTMLElement>('[id]')].find((element) => element.id === item.key)
        : view.document.getElementById(item.key);
      if (section && (!target || target.contains(section))) observer.observe(section);
    });
    return () => observer.disconnect();
  }, [activeKey, items, rootMargin, target]);
  return <nav className={`hf-scrollspy ${className}`.trim()} aria-label="页内导航" {...props}>{items.map((item) => <a key={item.key} href={item.href ?? `#${item.key}`} aria-current={currentKey === item.key ? 'location' : undefined} onClick={() => onItemSelect?.(item)}>{item.label}</a>)}</nav>;
}
