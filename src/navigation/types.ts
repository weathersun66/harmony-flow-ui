import type { ReactNode } from 'react';

export interface NavigationItem {
  key: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  description?: string;
  children?: readonly NavigationItem[];
}

export interface NavigationSelectionProps {
  activeKey?: string;
  onItemSelect?: (item: NavigationItem) => void;
}

export function activateNavigationItem(item: NavigationItem, onItemSelect?: (item: NavigationItem) => void) {
  onItemSelect?.(item);
}
