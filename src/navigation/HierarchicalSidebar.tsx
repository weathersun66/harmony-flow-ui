import { useEffect, useMemo, useState, type HTMLAttributes, type ReactNode } from 'react';
import type { NavigationItem, NavigationSelectionProps } from './types';
import { getNavigationAncestorKeys } from './navigationTree';

export interface HierarchicalSidebarProps extends Omit<HTMLAttributes<HTMLElement>, 'title'>, NavigationSelectionProps {
  items: readonly NavigationItem[];
  title?: ReactNode;
  expandedKeys?: readonly string[];
  defaultExpandedKeys?: readonly string[];
  onExpandedChange?: (keys: string[]) => void;
}

export function HierarchicalSidebar({ items, title = '内容导航', activeKey, onItemSelect, expandedKeys, defaultExpandedKeys = [], onExpandedChange, className = '', ...props }: HierarchicalSidebarProps) {
  const [internalExpanded, setInternalExpanded] = useState(() => new Set([...defaultExpandedKeys, ...getNavigationAncestorKeys(items, activeKey)]));
  const activeAncestorKeys = useMemo(() => getNavigationAncestorKeys(items, activeKey), [activeKey, items]);
  const activeAncestorSignature = activeAncestorKeys.join('\u0000');
  const expanded = new Set(expandedKeys ?? internalExpanded);

  useEffect(() => {
    if (expandedKeys !== undefined) return;
    setInternalExpanded((current) => {
      const next = new Set(current);
      activeAncestorKeys.forEach((key) => next.add(key));
      return next;
    });
  }, [activeAncestorSignature, expandedKeys]);

  const toggle = (key: string) => {
    const next = new Set(expandedKeys ?? internalExpanded);
    if (next.has(key)) next.delete(key); else next.add(key);
    if (expandedKeys === undefined) setInternalExpanded(next);
    onExpandedChange?.([...next]);
  };

  const renderItems = (nodes: readonly NavigationItem[], level = 0): ReactNode => (
    <ul className="hf-hierarchical-sidebar__list" data-level={level}>
      {nodes.map((item) => {
        const hasChildren = Boolean(item.children?.length);
        const isExpanded = expanded.has(item.key);
        return (
          <li key={item.key}>
            {hasChildren ? (
              <button type="button" className="hf-hierarchical-sidebar__group" aria-expanded={isExpanded} onClick={() => toggle(item.key)}>
                <span>{item.icon}</span><span>{item.label}</span><span aria-hidden="true" className="hf-hierarchical-sidebar__chevron">›</span>
              </button>
            ) : (
              <a href={item.href ?? `#${item.key}`} aria-current={activeKey === item.key ? 'location' : undefined} onClick={() => onItemSelect?.(item)}>
                {item.icon && <span aria-hidden="true">{item.icon}</span>}<span>{item.label}</span>
              </a>
            )}
            {hasChildren && isExpanded && renderItems(item.children ?? [], level + 1)}
          </li>
        );
      })}
    </ul>
  );

  return <aside className={`hf-hierarchical-sidebar ${className}`.trim()} {...props}><div className="hf-hierarchical-sidebar__title">{title}</div><nav aria-label="层级侧栏">{renderItems(items)}</nav></aside>;
}
