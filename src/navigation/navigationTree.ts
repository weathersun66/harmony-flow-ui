import type { NavigationItem } from './types';

export function flattenNavigationItems(items: readonly NavigationItem[]): NavigationItem[] {
  return items.flatMap((item) => [item, ...flattenNavigationItems(item.children ?? [])]);
}

export function getNavigationAncestorKeys(items: readonly NavigationItem[], activeKey?: string): string[] {
  if (!activeKey) return [];
  for (const item of items) {
    if (item.key === activeKey) return [];
    const childPath = getNavigationAncestorKeys(item.children ?? [], activeKey);
    if (childPath.length || item.children?.some((child) => child.key === activeKey)) return [item.key, ...childPath];
  }
  return [];
}
