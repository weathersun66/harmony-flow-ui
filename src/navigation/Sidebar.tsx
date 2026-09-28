import { useState, type HTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../foundations/Icon';
import { activateNavigationItem, type NavigationItem, type NavigationSelectionProps } from './types';

export interface SidebarProps extends HTMLAttributes<HTMLElement>, NavigationSelectionProps {
  brand?: ReactNode;
  items: readonly NavigationItem[];
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  appearance?: 'flush' | 'floating' | 'inset';
}

export function Sidebar({ brand, items, activeKey, collapsed, defaultCollapsed = false, onCollapsedChange, onItemSelect, appearance = 'flush', className = '', ...props }: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const isCollapsed = collapsed ?? internalCollapsed;
  const toggle = () => {
    const next = !isCollapsed;
    if (collapsed === undefined) setInternalCollapsed(next);
    onCollapsedChange?.(next);
  };
  return (
    <aside className={`hf-sidebar hf-sidebar--${appearance} ${isCollapsed ? 'hf-sidebar--collapsed' : ''} ${className}`.trim()} {...props}>
      <div className="hf-sidebar__top">{brand && <div className="hf-sidebar__brand">{brand}</div>}<button className="hf-sidebar__collapse" type="button" onClick={toggle} aria-label={isCollapsed ? '展开侧边栏' : '收起侧边栏'} aria-expanded={!isCollapsed}><Icon name="arrow-right" size={17} /></button></div>
      <nav aria-label="侧边导航">
        {items.map((item) => <a key={item.key} href={item.href ?? '#'} aria-current={activeKey === item.key ? 'page' : undefined} title={isCollapsed ? item.label : undefined} onClick={() => activateNavigationItem(item, onItemSelect)}><span className="hf-sidebar__icon">{item.icon ?? item.label.slice(0, 1)}</span><span className="hf-sidebar__label">{item.label}</span></a>)}
      </nav>
    </aside>
  );
}
