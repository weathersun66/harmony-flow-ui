import type { HTMLAttributes, ReactNode } from 'react';
import { activateNavigationItem, type NavigationItem, type NavigationSelectionProps } from './types';

export interface FloatingNavProps extends HTMLAttributes<HTMLElement>, NavigationSelectionProps {
  brand: ReactNode;
  items: readonly NavigationItem[];
  action?: ReactNode;
}

export function FloatingNav({ brand, items, action, activeKey, onItemSelect, className = '', ...props }: FloatingNavProps) {
  return (
    <nav className={`hf-floating-nav ${className}`.trim()} aria-label="主导航" {...props}>
      <div className="hf-floating-nav__brand">{brand}</div>
      <div className="hf-floating-nav__items">
        {items.map((item) => <a key={item.key} href={item.href ?? '#'} aria-current={activeKey === item.key ? 'page' : undefined} onClick={() => activateNavigationItem(item, onItemSelect)}>{item.label}</a>)}
      </div>
      {action && <div className="hf-floating-nav__action">{action}</div>}
    </nav>
  );
}
