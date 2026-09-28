import type { HTMLAttributes } from 'react';
import { activateNavigationItem, type NavigationItem, type NavigationSelectionProps } from './types';

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement>, NavigationSelectionProps {
  items: readonly NavigationItem[];
  separator?: string;
}

export function Breadcrumb({ items, separator = '/', onItemSelect, className = '', ...props }: BreadcrumbProps) {
  return (
    <nav className={`hf-breadcrumb ${className}`.trim()} aria-label="面包屑" {...props}>
      <ol>{items.map((item, index) => {
        const current = index === items.length - 1;
        return <li key={item.key}>{current ? <span aria-current="page">{item.label}</span> : <a href={item.href ?? '#'} onClick={() => activateNavigationItem(item, onItemSelect)}>{item.label}</a>}{!current && <i aria-hidden="true">{separator}</i>}</li>;
      })}</ol>
    </nav>
  );
}
