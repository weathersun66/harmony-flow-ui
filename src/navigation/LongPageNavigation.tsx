import type { HTMLAttributes, ReactNode } from 'react';
import { BackToTop } from './BackToTop';
import { ReadingProgress } from './ReadingProgress';
import { Scrollspy } from './Scrollspy';
import { flattenNavigationItems } from './navigationTree';
import type { NavigationItem, NavigationSelectionProps } from './types';

export interface LongPageNavigationProps extends Omit<HTMLAttributes<HTMLElement>, 'title'>, NavigationSelectionProps {
  items: readonly NavigationItem[];
  target?: HTMLElement | null;
  title?: ReactNode;
  progressLabel?: string;
  rootMargin?: string;
  backToTopThreshold?: number;
  showProgress?: boolean;
}

export function LongPageNavigation({ items, target, title = '本页内容', progressLabel = '阅读进度', rootMargin, backToTopThreshold = 320, showProgress = true, activeKey, onItemSelect, className = '', ...props }: LongPageNavigationProps) {
  const flattenedItems = flattenNavigationItems(items);
  return (
    <aside className={`hf-long-page-navigation ${className}`.trim()} {...props}>
      {showProgress && <ReadingProgress target={target} label={progressLabel} />}
      <div className="hf-long-page-navigation__title">{title}</div>
      <Scrollspy items={flattenedItems} target={target} rootMargin={rootMargin} activeKey={activeKey} onItemSelect={onItemSelect} />
      <BackToTop target={target} threshold={backToTopThreshold} />
    </aside>
  );
}
