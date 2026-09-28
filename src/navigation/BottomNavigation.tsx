import type { HTMLAttributes } from 'react';
import { activateNavigationItem, type NavigationItem, type NavigationSelectionProps } from './types';

export interface BottomNavigationProps extends HTMLAttributes<HTMLElement>, NavigationSelectionProps {
  items: readonly NavigationItem[];
  label?: string;
}

export function BottomNavigation({ items, label = '底部导航', activeKey, onItemSelect, className = '', ...props }: BottomNavigationProps) {
  return <nav className={`hf-bottom-navigation ${className}`.trim()} aria-label={label} {...props}>{items.map((item) => <a key={item.key} href={item.href ?? `#${item.key}`} aria-current={activeKey === item.key ? 'page' : undefined} onClick={() => activateNavigationItem(item, onItemSelect)}>{item.icon && <span className="hf-bottom-navigation__icon" aria-hidden="true">{item.icon}</span>}<span>{item.label}</span></a>)}</nav>;
}
