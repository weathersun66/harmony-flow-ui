import type { HTMLAttributes, ReactNode } from 'react';
import { BottomNavigation } from './BottomNavigation';
import { PullToRefresh } from './PullToRefresh';
import type { NavigationItem, NavigationSelectionProps } from './types';

export interface MobileContentNavigationProps extends HTMLAttributes<HTMLDivElement>, NavigationSelectionProps {
  items: readonly NavigationItem[];
  children: ReactNode;
  onRefresh?: () => void | Promise<void>;
  refreshThreshold?: number;
  navigationLabel?: string;
}

export function MobileContentNavigation({ items, children, onRefresh, refreshThreshold, navigationLabel, activeKey, onItemSelect, className = '', ...props }: MobileContentNavigationProps) {
  const content = onRefresh ? <PullToRefresh onRefresh={onRefresh} threshold={refreshThreshold}>{children}</PullToRefresh> : children;
  return <div className={`hf-mobile-content-navigation${onRefresh ? ' hf-mobile-content-navigation--refreshable' : ''} ${className}`.trim()} {...props}><div className="hf-mobile-content-navigation__body">{content}</div><BottomNavigation items={items} label={navigationLabel} activeKey={activeKey} onItemSelect={onItemSelect} /></div>;
}
