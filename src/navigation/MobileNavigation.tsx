import { useId, useState, type HTMLAttributes, type ReactNode } from 'react';
import { activateNavigationItem, type NavigationItem, type NavigationSelectionProps } from './types';
import { useDismissibleLayer } from '../overlays/useOverlay';
import { Icon } from '../foundations/Icon';

export interface MobileNavigationProps extends HTMLAttributes<HTMLDivElement>, NavigationSelectionProps {
  brand: ReactNode;
  items: readonly NavigationItem[];
  mode?: 'drawer' | 'fullscreen';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MobileNavigation({ brand, items, mode = 'drawer', activeKey, open, onOpenChange, onItemSelect, className = '', ...props }: MobileNavigationProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open ?? internalOpen;
  const panelId = useId();
  const setOpen = (next: boolean) => {
    if (open === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };
  const panelRef = useDismissibleLayer<HTMLElement>(isOpen, () => setOpen(false), true);
  return (
    <div className={`hf-mobile-nav ${className}`.trim()} {...props}>
      <div className="hf-mobile-nav__bar"><div>{brand}</div><button type="button" aria-label="打开导航" aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpen(true)}><i /><i /><i /></button></div>
      {isOpen && <div className={`hf-mobile-nav__backdrop hf-mobile-nav__backdrop--${mode}`} onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}>
        <nav ref={panelRef} id={panelId} className="hf-mobile-nav__panel" aria-label="移动导航" tabIndex={-1}>
          <header><div>{brand}</div><button type="button" aria-label="关闭导航" onClick={() => setOpen(false)}><Icon name="close" size={18} /></button></header>
          <div className="hf-mobile-nav__links">{items.map((item, index) => <a key={item.key} href={item.href ?? '#'} aria-current={activeKey === item.key ? 'page' : undefined} style={{ '--hf-nav-index': index } as React.CSSProperties} onClick={() => { activateNavigationItem(item, onItemSelect); setOpen(false); }}><span>{item.label}</span>{item.description && <small>{item.description}</small>}</a>)}</div>
        </nav>
      </div>}
    </div>
  );
}
